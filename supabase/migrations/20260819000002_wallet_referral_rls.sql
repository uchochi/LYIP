-- Migration: RLS for wallet / referral / withdrawal tables.
-- Writes happen exclusively through SECURITY DEFINER RPCs — no client
-- INSERT/UPDATE policies are granted on these tables.

ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;

-- Users read their own transactions
DROP POLICY IF EXISTS "Users view own wallet transactions" ON public.wallet_transactions;
CREATE POLICY "Users view own wallet transactions"
  ON public.wallet_transactions FOR SELECT
  USING (auth.uid() = user_id);

-- Staff (admin/instructor/senior_instructor) read all transactions
DROP POLICY IF EXISTS "Staff view all wallet transactions" ON public.wallet_transactions;
CREATE POLICY "Staff view all wallet transactions"
  ON public.wallet_transactions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role IN ('admin', 'senior_instructor', 'instructor')
  ));

-- Referrer reads own referral rows
DROP POLICY IF EXISTS "Users view own referrals as referrer" ON public.referral_records;
CREATE POLICY "Users view own referrals as referrer"
  ON public.referral_records FOR SELECT
  USING (auth.uid() = referrer_id);

-- Staff read all referrals
DROP POLICY IF EXISTS "Staff view all referrals" ON public.referral_records;
CREATE POLICY "Staff view all referrals"
  ON public.referral_records FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role IN ('admin', 'senior_instructor', 'instructor')
  ));

-- Users read own withdrawal requests
DROP POLICY IF EXISTS "Users view own withdrawals" ON public.withdrawal_requests;
CREATE POLICY "Users view own withdrawals"
  ON public.withdrawal_requests FOR SELECT
  USING (auth.uid() = user_id);

-- Staff read all withdrawal requests
DROP POLICY IF EXISTS "Staff view all withdrawals" ON public.withdrawal_requests;
CREATE POLICY "Staff view all withdrawals"
  ON public.withdrawal_requests FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role IN ('admin', 'senior_instructor', 'instructor')
  ));
