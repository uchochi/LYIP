-- Migration: automated badge rewards, Agiel 24h bonus, 15-hour structure
-- auto-rejection, and payout-detail / withdrawal RPCs.

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Badge awarding (idempotent, SECURITY DEFINER — sole write path)
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.award_badge(
  p_user_id uuid,
  p_badge_type text,
  p_metadata jsonb DEFAULT '{}'
) RETURNS void AS $$
BEGIN
  INSERT INTO public.user_badges (user_id, badge_type, metadata)
  VALUES (p_user_id, p_badge_type, COALESCE(p_metadata, '{}'))
  ON CONFLICT (user_id, badge_type) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

GRANT SELECT ON public.user_badges TO authenticated, anon;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Extended insert trigger: referral completion + first-dataset stamp +
--    Agiel bonus ($100 + badge when the FIRST dataset lands within 24h of signup)
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.on_curator_submission_created()
RETURNS trigger AS $$
DECLARE
  v_referred_by uuid;
  v_submissions integer;
  v_created timestamptz;
  v_first_dataset_at timestamptz;
  v_has_agiel boolean;
BEGIN
  SELECT referred_by, created_at, first_dataset_at
    INTO v_referred_by, v_created, v_first_dataset_at
    FROM public.users WHERE id = NEW.user_id;

  -- Referral: first submission completes the referral
  IF v_referred_by IS NOT NULL THEN
    SELECT count(*) INTO v_submissions FROM public.curator_submissions
      WHERE user_id = NEW.user_id;
    IF v_submissions = 1 THEN
      PERFORM public.complete_referral(NEW.user_id);
    END IF;
  END IF;

  -- First-dataset stamp (once per user)
  IF v_first_dataset_at IS NULL THEN
    UPDATE public.users
      SET first_dataset_at = now(), updated_at = now()
      WHERE id = NEW.user_id AND first_dataset_at IS NULL;

    -- Agiel bonus: first dataset within 24h of joining → $100 + badge
    SELECT EXISTS (
      SELECT 1 FROM public.user_badges
      WHERE user_id = NEW.user_id AND badge_type = 'agiel'
    ) INTO v_has_agiel;

    IF NOT v_has_agiel AND now() - v_created <= interval '24 hours' THEN
      PERFORM public.award_badge(
        NEW.user_id, 'agiel',
        jsonb_build_object('submission_id', NEW.id, 'bonus', 100)
      );
      PERFORM public.credit_wallet(
        NEW.user_id,
        'milestone_bonus',
        100,
        'Agiel Member bonus — first dataset submitted within 24 hours of joining',
        NEW.id,
        NULL
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Contribution badges on approval (first / 10 / 50 approved datasets)
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.maybe_award_contribution_badges(p_user_id uuid)
RETURNS void AS $$
DECLARE
  v_approved integer;
BEGIN
  SELECT count(*) INTO v_approved FROM public.curator_submissions
    WHERE user_id = p_user_id AND status = 'approved';

  IF v_approved >= 1 THEN
    PERFORM public.award_badge(p_user_id, 'first_dataset',
      jsonb_build_object('approved', v_approved));
  END IF;
  IF v_approved >= 10 THEN
    PERFORM public.award_badge(p_user_id, 'prolific_10',
      jsonb_build_object('approved', v_approved));
  END IF;
  IF v_approved >= 50 THEN
    PERFORM public.award_badge(p_user_id, 'elite_50',
      jsonb_build_object('approved', v_approved));
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

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
    PERFORM public.maybe_award_contribution_badges(v_row.user_id);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. 15-hour auto-rejection of structure-misaligned datasets
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.auto_reject_invalid_structure()
RETURNS integer AS $$
DECLARE
  v_count integer;
BEGIN
  WITH rejected AS (
    UPDATE public.curator_submissions
    SET status = 'rejected',
        rejection_reason = 'structure',
        proposed_price = NULL,
        admin_notes = 'Rejected automatically: the structure of this dataset does not align with the required unique dataset format.',
        reviewed_at = now(),
        updated_at = now()
    WHERE status IN ('pending', 'under_review')
      AND structure_valid = false
      AND created_at < now() - interval '15 hours'
    RETURNING 1
  )
  SELECT count(*) INTO v_count FROM rejected;
  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

SELECT cron.schedule(
  'auto-reject-invalid-structure',
  '*/15 * * * *',  -- every 15 minutes
  $$SELECT public.auto_reject_invalid_structure();$$
);

SELECT public.auto_reject_invalid_structure();

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. Payout details (MoneyGram / Western Union recipient requirements:
--    full name + phone number + address)
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.save_payout_details(
  p_method text,
  p_details jsonb
) RETURNS void AS $$
DECLARE
  v_name text;
  v_phone text;
  v_address text;
BEGIN
  IF p_method NOT IN ('moneygram', 'western_union') THEN
    RAISE EXCEPTION 'Payout method must be moneygram or western_union';
  END IF;

  v_name    := NULLIF(btrim(p_details->>'name'), '');
  v_phone   := NULLIF(btrim(p_details->>'phone'), '');
  v_address := NULLIF(btrim(p_details->>'address'), '');

  IF v_name IS NULL OR v_phone IS NULL OR v_address IS NULL THEN
    RAISE EXCEPTION 'Payout details require a name, phone number and address';
  END IF;

  UPDATE public.users
  SET payout_method = p_method,
      payout_details = jsonb_build_object(
        'name', v_name,
        'phone', v_phone,
        'address', v_address
      ),
      updated_at = now()
  WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

GRANT EXECUTE ON FUNCTION public.save_payout_details(text, jsonb) TO authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. Withdrawal requests (debits wallet atomically; admins settle payouts)
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.create_withdrawal_request(
  p_amount numeric,
  p_method text DEFAULT NULL,
  p_details jsonb DEFAULT NULL
) RETURNS uuid AS $$
DECLARE
  v_user uuid := auth.uid();
  v_balance numeric;
  v_method text;
  v_details jsonb;
  v_request_id uuid;
  v_min numeric := 1200;  -- keep in sync with WITHDRAWAL_MIN in src/types/index.ts
BEGIN
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'You must be signed in';
  END IF;
  IF p_amount IS NULL OR p_amount <= 0 THEN
    RAISE EXCEPTION 'Withdrawal amount must be positive';
  END IF;

  SELECT wallet_balance, payout_method, payout_details
    INTO v_balance, v_method, v_details
    FROM public.users WHERE id = v_user FOR UPDATE;

  IF v_balance IS NULL THEN
    RAISE EXCEPTION 'Wallet not found';
  END IF;
  IF p_amount > v_balance THEN
    RAISE EXCEPTION 'Insufficient balance: available %s', v_balance;
  END IF;
  IF p_amount < v_min THEN
    RAISE EXCEPTION 'Minimum withdrawal is %s', v_min;
  END IF;

  v_method  := COALESCE(p_method, v_method);
  v_details := COALESCE(p_details, v_details);

  IF v_method NOT IN ('moneygram', 'western_union')
     OR v_details IS NULL
     OR NULLIF(btrim(v_details->>'name'), '') IS NULL
     OR NULLIF(btrim(v_details->>'phone'), '') IS NULL
     OR NULLIF(btrim(v_details->>'address'), '') IS NULL THEN
    RAISE EXCEPTION 'Complete payout details (name, phone, address) are required first';
  END IF;

  INSERT INTO public.withdrawal_requests
    (user_id, amount, status, payout_method, payout_details)
  VALUES
    (v_user, p_amount, 'pending', v_method, v_details)
  RETURNING id INTO v_request_id;

  PERFORM public.credit_wallet(
    v_user,
    'withdrawal_request',
    -p_amount,
    'Withdrawal request via ' || v_method,
    NULL,
    NULL
  );

  RETURN v_request_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

GRANT EXECUTE ON FUNCTION public.create_withdrawal_request(numeric, text, jsonb) TO authenticated;
