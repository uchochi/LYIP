-- Migration: server-side wallet overview aggregation.
--
-- Wallet audit 2026-08-28 (M3/m1): the client fetched only the latest 500
-- wallet_transactions and summed them — past 500 rows every lifetime/monthly/
-- referral figure silently undercounted, and the sums ignored status.
--
-- get_wallet_overview() aggregates the FULL ledger server-side (completed
-- rows only) for the calling user, including the referral-milestone vs Agiel
-- split (referral milestones carry related_referral_id; the Agiel bonus does
-- not — same partitioning rule the writers use). Balance is the authoritative
-- users.wallet_balance.

CREATE OR REPLACE FUNCTION public.get_wallet_overview()
RETURNS TABLE (
  balance numeric,
  lifetime_earnings numeric,
  referral_earnings numeric,
  milestone_bonus numeric,
  referral_milestone_bonus numeric,
  agiel_bonus numeric,
  this_month_earnings numeric
) AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_balance numeric;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'You must be signed in';
  END IF;

  SELECT u.wallet_balance INTO v_balance FROM public.users u
    WHERE u.id = v_uid;
  IF v_balance IS NULL THEN
    RAISE EXCEPTION 'Wallet not found for user %', v_uid;
  END IF;

  RETURN QUERY
  SELECT
    v_balance,
    COALESCE(SUM(t.amount) FILTER (
      WHERE t.transaction_type IN ('dataset_earning', 'referral_earning', 'milestone_bonus')
        AND t.status = 'completed'), 0),
    COALESCE(SUM(t.amount) FILTER (
      WHERE t.transaction_type = 'referral_earning'
        AND t.status = 'completed'), 0),
    COALESCE(SUM(t.amount) FILTER (
      WHERE t.transaction_type = 'milestone_bonus'
        AND t.status = 'completed'), 0),
    COALESCE(SUM(t.amount) FILTER (
      WHERE t.transaction_type = 'milestone_bonus'
        AND t.status = 'completed'
        AND t.related_referral_id IS NOT NULL), 0),
    COALESCE(SUM(t.amount) FILTER (
      WHERE t.transaction_type = 'milestone_bonus'
        AND t.status = 'completed'
        AND t.related_referral_id IS NULL), 0),
    COALESCE(SUM(t.amount) FILTER (
      WHERE t.transaction_type IN ('dataset_earning', 'referral_earning', 'milestone_bonus')
        AND t.status = 'completed'
        AND t.created_at >= date_trunc('month', now())), 0)
  FROM public.wallet_transactions t
  WHERE t.user_id = v_uid;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public, pg_temp;

REVOKE EXECUTE ON FUNCTION public.get_wallet_overview() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_wallet_overview() TO authenticated;
