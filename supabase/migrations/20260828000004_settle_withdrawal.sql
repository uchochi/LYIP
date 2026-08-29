-- Migration: staff settlement of withdrawal requests.
--
-- Wallet audit 2026-08-28 (M1): create_withdrawal_request debits the wallet
-- immediately, but nothing could ever settle, reject, or reverse a request —
-- rejected payouts would strand the member's money forever.
--
-- settle_withdrawal(p_request_id, p_action, p_notes):
--   p_action = 'completed' → mark paid  (informational 0-amount
--                withdrawal_payout ledger row so the member sees the payout
--                event in their transaction history — the debit already
--                exists from the request)
--   p_action = 'rejected'  → mark rejected + credit_wallet refund
--                (withdrawal_reversal, +amount)
-- Staff-only (same role set as review_curator_submission). Idempotent via
-- FOR UPDATE + status re-check — a request can only be settled once.

CREATE OR REPLACE FUNCTION public.settle_withdrawal(
  p_request_id uuid,
  p_action text,
  p_notes text DEFAULT NULL
) RETURNS void AS $$
DECLARE
  v_role text;
  v_req public.withdrawal_requests;
BEGIN
  SELECT role INTO v_role FROM public.users WHERE id = auth.uid();
  IF v_role IS NULL OR v_role NOT IN ('admin', 'senior_instructor', 'instructor') THEN
    RAISE EXCEPTION 'Only staff can settle withdrawals';
  END IF;

  IF p_action NOT IN ('completed', 'rejected') THEN
    RAISE EXCEPTION 'Action must be ''completed'' or ''rejected'' (got %)', p_action;
  END IF;

  SELECT * INTO v_req FROM public.withdrawal_requests
    WHERE id = p_request_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Withdrawal request % not found', p_request_id;
  END IF;
  IF v_req.status NOT IN ('pending', 'processing') THEN
    RAISE EXCEPTION 'Request % is already settled (status: %)', p_request_id, v_req.status;
  END IF;

  UPDATE public.withdrawal_requests
  SET status = p_action,
      admin_notes = COALESCE(p_notes, admin_notes),
      processed_at = now()
  WHERE id = p_request_id;

  IF p_action = 'rejected' THEN
    -- Return the money to the member's wallet.
    PERFORM public.credit_wallet(
      v_req.user_id,
      'withdrawal_reversal',
      v_req.amount,
      'Withdrawal request rejected' || CASE WHEN COALESCE(p_notes, '') <> ''
        THEN ': ' || p_notes ELSE '' END || ' — amount returned to your wallet',
      NULL,
      NULL
    );
  ELSE
    -- Informational marker: the cash left the wallet at request time; this
    -- row makes the payout visible in the member's transaction history.
    PERFORM public.credit_wallet(
      v_req.user_id,
      'withdrawal_payout',
      0,
      'Withdrawal paid via ' || v_req.payout_method,
      NULL,
      NULL
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

REVOKE EXECUTE ON FUNCTION public.settle_withdrawal(uuid, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.settle_withdrawal(uuid, text, text) TO authenticated;
