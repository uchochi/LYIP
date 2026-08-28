-- Migration: Referral milestones become REPEATING — $50 for EVERY 10 completed
-- referrals (10, 20, 30, ...), with no cap. Replaces the one-time $100-at-10 bonus.
--
-- Design (ledger-based, no schema changes):
--   * Paid referral milestones are counted from wallet_transactions rows with
--     transaction_type = 'milestone_bonus' AND related_referral_id IS NOT NULL.
--     (The Agiel new-user bonus also uses 'milestone_bonus' but always carries
--     related_referral_id NULL, so it is excluded from the count.)
--   * On every completed referral: milestones_earned = referral_count / 10
--     (integer division). Each unpaid milestone is credited $50 in a loop, so
--     users already past 20 under the old terms self-correct here (catch-up safe).
--   * Backward compatible: the old one-time $100 payment counts as exactly one
--     paid milestone — nobody is double-paid.
--   * users.referral_milestone_paid is still maintained for coherence, but the
--     logic above no longer depends on it.
--
-- Only complete_referral() is replaced; existing grants are preserved by
-- CREATE OR REPLACE (complete_referral stays revoked from PUBLIC/anon/authenticated,
-- as set in 20260819000003_wallet_functions.sql).

CREATE OR REPLACE FUNCTION public.complete_referral(p_referred_user_id uuid)
RETURNS void AS $$
DECLARE
  v_rec public.referral_records;
  v_count integer;
  v_paid_milestones integer;
  v_earned_milestones integer;
BEGIN
  SELECT * INTO v_rec FROM public.referral_records
    WHERE referred_user_id = p_referred_user_id AND status = 'pending'
    ORDER BY referred_at DESC LIMIT 1;
  IF NOT FOUND THEN RETURN; END IF;

  -- Mark the record completed only if it is still pending. The status guard
  -- makes this idempotent: if a concurrent transaction already completed it,
  -- this call exits without crediting anything (no double $5 reward).
  UPDATE public.referral_records
  SET status = 'completed',
      first_submission_at = now()
  WHERE id = v_rec.id AND status = 'pending';
  IF NOT FOUND THEN RETURN; END IF;

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

  -- Lock the referrer's row so concurrent referral completions serialize here
  -- (the ledger count below must not race a parallel completion).
  SELECT referral_count INTO v_count
    FROM public.users WHERE id = v_rec.referrer_id FOR UPDATE;

  -- Referral milestones already paid, straight from the ledger (completed rows
  -- only, so a future reversal could never skew the count).
  SELECT count(*) INTO v_paid_milestones
    FROM public.wallet_transactions
    WHERE user_id = v_rec.referrer_id
      AND transaction_type = 'milestone_bonus'
      AND status = 'completed'
      AND related_referral_id IS NOT NULL;

  v_earned_milestones := v_count / 10;  -- integer division = floor for counts >= 0

  -- Credit every unpaid milestone ($50 each). The loop makes this catch-up safe.
  WHILE v_paid_milestones < v_earned_milestones LOOP
    v_paid_milestones := v_paid_milestones + 1;
    PERFORM public.credit_wallet(
      v_rec.referrer_id,
      'milestone_bonus',
      50,
      'Referral milestone bonus: ' || (v_paid_milestones * 10) || ' completed referrals',
      NULL,
      v_rec.id
    );
  END LOOP;

  -- Legacy one-time flag kept coherent for any older readers.
  IF v_paid_milestones > 0 THEN
    UPDATE public.users
    SET referral_milestone_paid = true, updated_at = now()
    WHERE id = v_rec.referrer_id AND referral_milestone_paid = false;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Belt-and-braces: re-assert the execution ACLs (CREATE OR REPLACE on the same
-- signature preserves them, but an explicit REVOKE documents the intent).
REVOKE EXECUTE ON FUNCTION public.complete_referral(uuid) FROM PUBLIC, anon, authenticated;
