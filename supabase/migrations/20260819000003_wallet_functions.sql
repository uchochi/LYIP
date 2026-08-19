-- Migration: Core wallet/referral logic as SECURITY DEFINER functions.
-- Payment tiers: 1500+ entries = $50 · 5000+ = $75 · 10000+ = $100 (min $50 on approval).
-- Referral: $5 when referred user submits first dataset · one-time $100 at 10 referrals.
-- (Includes the later scalar-variable fix for complete_referral.)

-- ── helpers ─────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.calculate_dataset_payment(p_entry_count integer)
RETURNS numeric AS $$
BEGIN
  IF p_entry_count IS NULL THEN RETURN 50; END IF;
  IF p_entry_count >= 10000 THEN RETURN 100; END IF;
  IF p_entry_count >= 5000 THEN RETURN 75; END IF;
  RETURN 50;
END;
$$ LANGUAGE plpgsql IMMUTABLE SET search_path = public, pg_temp;

-- Internal: append a ledger row and move the balance atomically.
CREATE OR REPLACE FUNCTION public.credit_wallet(
  p_user_id uuid,
  p_type text,
  p_amount numeric,
  p_description text,
  p_submission_id uuid DEFAULT NULL,
  p_referral_id uuid DEFAULT NULL
) RETURNS void AS $$
DECLARE
  v_balance numeric;
BEGIN
  SELECT wallet_balance INTO v_balance FROM public.users
    WHERE id = p_user_id FOR UPDATE;
  IF v_balance IS NULL THEN
    RAISE EXCEPTION 'User % not found for wallet credit', p_user_id;
  END IF;
  v_balance := v_balance + p_amount;

  UPDATE public.users SET wallet_balance = v_balance, updated_at = now()
    WHERE id = p_user_id;

  INSERT INTO public.wallet_transactions
    (user_id, transaction_type, amount, balance_after, description,
     related_submission_id, related_referral_id, status)
  VALUES
    (p_user_id, p_type, p_amount, v_balance, p_description,
     p_submission_id, p_referral_id, 'completed');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Internal: shared approval path (staff review + auto-approve).
-- Credits the wallet only when the submission ENTERS approved from a non-approved state.
CREATE OR REPLACE FUNCTION public.approve_and_pay(
  p_submission_id uuid,
  p_price numeric,
  p_notes text,
  p_reviewed_by uuid
) RETURNS void AS $$
DECLARE
  v_row public.curator_submissions;
  v_was_approved boolean;
BEGIN
  SELECT * INTO v_row FROM public.curator_submissions
    WHERE id = p_submission_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Submission % not found', p_submission_id;
  END IF;
  v_was_approved := (v_row.status = 'approved');

  UPDATE public.curator_submissions
  SET status = 'approved',
      proposed_price = p_price,
      admin_notes = COALESCE(p_notes, admin_notes),
      reviewed_by = p_reviewed_by,
      reviewed_at = now(),
      updated_at = now()
  WHERE id = p_submission_id;

  IF NOT v_was_approved THEN
    PERFORM public.credit_wallet(
      v_row.user_id,
      'dataset_earning',
      p_price,
      'Dataset approved: ' || v_row.title,
      p_submission_id,
      NULL
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Internal: complete a pending referral for a referred user (first submission),
-- pay $5 to the referrer, and award the one-time $100 milestone at 10 completed referrals.
CREATE OR REPLACE FUNCTION public.complete_referral(p_referred_user_id uuid)
RETURNS void AS $$
DECLARE
  v_rec public.referral_records;
  v_count integer;
  v_paid boolean;
BEGIN
  SELECT * INTO v_rec FROM public.referral_records
    WHERE referred_user_id = p_referred_user_id AND status = 'pending'
    ORDER BY referred_at DESC LIMIT 1;
  IF NOT FOUND THEN RETURN; END IF;

  UPDATE public.referral_records
  SET status = 'completed',
      first_submission_at = now()
  WHERE id = v_rec.id;

  PERFORM public.credit_wallet(
    v_rec.referrer_id,
    'referral_earning',
    5,
    'Referral reward: your invite submitted their first dataset',
    NULL,
    v_rec.id
  );

  UPDATE public.users u
  SET referral_count = (
        SELECT count(*) FROM public.referral_records r
        WHERE r.referrer_id = u.id AND r.status = 'completed'
      ),
      updated_at = now()
  WHERE u.id = v_rec.referrer_id;

  SELECT referral_count, referral_milestone_paid INTO v_count, v_paid
    FROM public.users WHERE id = v_rec.referrer_id FOR UPDATE;

  IF v_count >= 10 AND NOT v_paid THEN
    PERFORM public.credit_wallet(
      v_rec.referrer_id,
      'milestone_bonus',
      100,
      'Referral milestone bonus: 10 completed referrals',
      NULL,
      v_rec.id
    );
    UPDATE public.users
    SET referral_milestone_paid = true, updated_at = now()
    WHERE id = v_rec.referrer_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- ── trigger: first dataset submission completes the referral ────────

CREATE OR REPLACE FUNCTION public.on_curator_submission_created()
RETURNS trigger AS $$
DECLARE
  v_submissions integer;
  v_referred_by uuid;
BEGIN
  SELECT referred_by INTO v_referred_by FROM public.users WHERE id = NEW.user_id;
  IF v_referred_by IS NULL THEN RETURN NEW; END IF;

  SELECT count(*) INTO v_submissions FROM public.curator_submissions
    WHERE user_id = NEW.user_id;

  IF v_submissions = 1 THEN
    PERFORM public.complete_referral(NEW.user_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS on_curator_submission_created ON public.curator_submissions;
CREATE TRIGGER on_curator_submission_created
  AFTER INSERT ON public.curator_submissions
  FOR EACH ROW EXECUTE FUNCTION public.on_curator_submission_created();

-- ── RPC: staff review (replaces direct client update) ───────────────

CREATE OR REPLACE FUNCTION public.review_curator_submission(
  p_submission_id uuid,
  p_status text,
  p_proposed_price numeric DEFAULT NULL,
  p_admin_notes text DEFAULT NULL
) RETURNS public.curator_submissions AS $$
DECLARE
  v_role text;
  v_row public.curator_submissions;
BEGIN
  SELECT role INTO v_role FROM public.users WHERE id = auth.uid();
  IF v_role IS NULL OR v_role NOT IN ('admin', 'senior_instructor', 'instructor') THEN
    RAISE EXCEPTION 'Only staff can review submissions';
  END IF;

  IF p_status = 'approved' THEN
    PERFORM public.approve_and_pay(
      p_submission_id,
      COALESCE(NULLIF(p_proposed_price, 0),
               public.calculate_dataset_payment((SELECT entry_count FROM public.curator_submissions WHERE id = p_submission_id))),
      p_admin_notes,
      auth.uid()
    );
  ELSE
    UPDATE public.curator_submissions
    SET status = p_status,
        proposed_price = CASE WHEN p_status = 'rejected' THEN NULL ELSE proposed_price END,
        admin_notes = COALESCE(p_admin_notes, admin_notes),
        reviewed_by = auth.uid(),
        reviewed_at = now(),
        updated_at = now()
    WHERE id = p_submission_id;
  END IF;

  SELECT * INTO v_row FROM public.curator_submissions WHERE id = p_submission_id;
  RETURN v_row;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- ── RPC: apply a referral code (authenticated, once per user) ───────

CREATE OR REPLACE FUNCTION public.apply_referral_code(p_code text)
RETURNS text AS $$
DECLARE
  v_user uuid := auth.uid();
  v_referrer public.users;
  v_submissions integer;
BEGIN
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'You must be signed in to apply a referral code';
  END IF;

  SELECT * INTO v_referrer FROM public.users
    WHERE upper(referral_code) = upper(trim(p_code));
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid referral code';
  END IF;
  IF v_referrer.id = v_user THEN
    RAISE EXCEPTION 'You cannot use your own referral code';
  END IF;

  IF EXISTS (SELECT 1 FROM public.users WHERE id = v_user AND referred_by IS NOT NULL) THEN
    RETURN (SELECT u.name FROM public.users u JOIN public.users me ON me.referred_by = u.id WHERE me.id = v_user);
  END IF;

  UPDATE public.users SET referred_by = v_referrer.id, updated_at = now()
    WHERE id = v_user;

  INSERT INTO public.referral_records
    (referrer_id, referred_user_id, referral_code_used, status)
  VALUES
    (v_referrer.id, v_user, upper(trim(p_code)), 'pending');

  -- If the user already submitted a dataset, complete the referral right away.
  SELECT count(*) INTO v_submissions FROM public.curator_submissions WHERE user_id = v_user;
  IF v_submissions >= 1 THEN
    PERFORM public.complete_referral(v_user);
  END IF;

  RETURN v_referrer.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- ── RPC: auto-approve stale submissions (8-day rule, cron-only) ─────

CREATE OR REPLACE FUNCTION public.auto_approve_stale_submissions()
RETURNS integer AS $$
DECLARE
  v_count integer := 0;
  v_row record;
BEGIN
  FOR v_row IN
    SELECT id, entry_count FROM public.curator_submissions
    WHERE status IN ('pending', 'under_review')
      AND created_at < now() - interval '8 days'
    FOR UPDATE SKIP LOCKED
  LOOP
    PERFORM public.approve_and_pay(
      v_row.id,
      public.calculate_dataset_payment(v_row.entry_count),
      'Auto-approved: submission was in review for more than 8 days.',
      NULL
    );
    v_count := v_count + 1;
  END LOOP;
  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- ── execution grants ─────────────────────────────────────────────────
REVOKE EXECUTE ON FUNCTION public.credit_wallet(uuid, text, numeric, text, uuid, uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.approve_and_pay(uuid, numeric, text, uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.complete_referral(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.on_curator_submission_created() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.auto_approve_stale_submissions() FROM PUBLIC, anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.review_curator_submission(uuid, text, numeric, text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.apply_referral_code(text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.calculate_dataset_payment(integer) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.review_curator_submission(uuid, text, numeric, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.apply_referral_code(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.calculate_dataset_payment(integer) TO authenticated;
