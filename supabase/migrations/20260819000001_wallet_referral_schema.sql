-- Migration: Wallet + Referral program schema
-- Extends users with wallet fields and adds ledger/referral/withdrawal tables.

-- ── users extensions ────────────────────────────────────────────────
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS wallet_balance numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS referral_code text UNIQUE,
  ADD COLUMN IF NOT EXISTS referred_by uuid REFERENCES public.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS referral_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS referral_milestone_paid boolean NOT NULL DEFAULT false;

-- ── wallet_transactions (append-only ledger) ────────────────────────
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  transaction_type text NOT NULL CHECK (transaction_type IN
    ('dataset_earning', 'referral_earning', 'milestone_bonus',
     'withdrawal_request', 'withdrawal_payout', 'withdrawal_reversal')),
  amount numeric NOT NULL,              -- positive = credit, negative = debit
  balance_after numeric NOT NULL,
  description text,
  related_submission_id uuid REFERENCES public.curator_submissions(id) ON DELETE SET NULL,
  related_referral_id uuid,
  status text NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_wallet_tx_user
  ON public.wallet_transactions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wallet_tx_submission
  ON public.wallet_transactions(related_submission_id)
  WHERE related_submission_id IS NOT NULL;

-- ── referral_records (one row per referral) ─────────────────────────
CREATE TABLE IF NOT EXISTS public.referral_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  referred_user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  referral_code_used text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  referred_at timestamptz NOT NULL DEFAULT now(),
  first_submission_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (referrer_id, referred_user_id)
);

CREATE INDEX IF NOT EXISTS idx_referral_referrer
  ON public.referral_records(referrer_id, status);

-- ── withdrawal_requests (phase 2 — schema ready, payouts tracked later) ──
CREATE TABLE IF NOT EXISTS public.withdrawal_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount numeric NOT NULL CHECK (amount > 0),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'rejected')),
  payout_method text NOT NULL CHECK (payout_method IN ('moneygram', 'western_union')),
  payout_details jsonb NOT NULL DEFAULT '{}',
  admin_notes text,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_withdrawal_user
  ON public.withdrawal_requests(user_id, submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_withdrawal_status
  ON public.withdrawal_requests(status, submitted_at);
