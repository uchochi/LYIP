-- Migration: backfill referral codes for all existing users (LYIP-XXXXXX)
-- and migrate already-approved submissions into the wallet ledger.

DO $$
DECLARE
  v_remaining integer;
  v_attempt integer := 0;
BEGIN
  LOOP
    v_attempt := v_attempt + 1;
    UPDATE public.users
    SET referral_code = 'LYIP-' || upper(substring(md5(random()::text || id::text || clock_timestamp()::text), 1, 6))
    WHERE referral_code IS NULL;
    SELECT count(*) INTO v_remaining FROM public.users WHERE referral_code IS NULL;
    EXIT WHEN v_remaining = 0 OR v_attempt > 10;
  END LOOP;
END $$;

-- Retroactive migration: credit wallets for submissions already approved
-- before the wallet existed (idempotent — skips already-credited rows).
DO $$
DECLARE
  v_row record;
BEGIN
  FOR v_row IN
    SELECT s.id, s.user_id, s.title, s.proposed_price
    FROM public.curator_submissions s
    WHERE s.status = 'approved'
      AND s.proposed_price IS NOT NULL
      AND NOT EXISTS (
        SELECT 1 FROM public.wallet_transactions t
        WHERE t.related_submission_id = s.id AND t.transaction_type = 'dataset_earning'
      )
  LOOP
    PERFORM public.credit_wallet(
      v_row.user_id,
      'dataset_earning',
      v_row.proposed_price,
      'Dataset approved: ' || v_row.title,
      v_row.id,
      NULL
    );
  END LOOP;
END $$;
