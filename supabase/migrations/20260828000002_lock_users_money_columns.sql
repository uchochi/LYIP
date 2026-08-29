-- Migration: LOCK DOWN public.users money / moderation columns.
--
-- Wallet audit 2026-08-28: the "Users update own" / "Users insert own" RLS
-- policies on public.users had NO column restrictions and NO WITH CHECK, so any
-- authenticated user could PATCH their own wallet_balance / role /
-- referral_count (and self-insert an elevated role at signup). The withdrawal
-- RPC and staff checks trust those columns — real-money exploit.
--
-- Defense in depth, three layers:
--   1. Column-level privileges: clients can only touch profile columns.
--   2. BEFORE INSERT trigger: normalizes protected columns to safe defaults
--      (keeps signup working regardless of what the client sends).
--   3. BEFORE UPDATE trigger: rejects changes to protected columns outright.
--
-- Trusted roles (SECURITY DEFINER functions run as their owner — postgres):
--   postgres, supabase_admin, service_role, supabase_auth_admin.
-- All money movement continues to flow exclusively through SECURITY DEFINER
-- RPCs (credit_wallet, apply_referral_code, save_payout_details, …), which are
-- unaffected because they execute as postgres.

-- ── 1. Column privileges ────────────────────────────────────────────
-- UPDATE: clients may only edit their profile presentation + presence.
REVOKE UPDATE ON public.users FROM anon, authenticated;
GRANT UPDATE (name, username, avatar_url, avatar_color, last_seen_at, updated_at)
  ON public.users TO authenticated;

-- INSERT: signup needs the identity columns only. Money/moderation columns
-- are NOT insertable by clients (role defaults to 'apprentice' in the schema,
-- wallet_balance to 0, …) and the guard trigger normalizes them anyway.
REVOKE INSERT ON public.users FROM anon, authenticated;
GRANT INSERT (id, email, name, username, avatar_url, avatar_color,
              referral_code, created_at, updated_at, last_seen_at)
  ON public.users TO authenticated;

-- ── 2. Guard: BEFORE INSERT ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.guard_users_insert()
RETURNS trigger AS $$
BEGIN
  IF current_user NOT IN ('postgres', 'supabase_admin', 'service_role', 'supabase_auth_admin') THEN
    -- Normalize protected columns to their safe defaults, whatever was sent.
    NEW.role                  := 'apprentice';
    NEW.wallet_balance        := 0;
    NEW.referral_count        := 0;
    NEW.referral_milestone_paid := false;
    NEW.referred_by           := NULL;
    NEW.first_dataset_at      := NULL;
    NEW.knowledge_score       := 0;
    NEW.is_muted              := false;
    NEW.mute_reason           := NULL;
    NEW.is_paused             := false;
    NEW.pause_until           := NULL;
    NEW.payout_method         := NULL;
    NEW.payout_details        := '{}'::jsonb;  -- column is NOT NULL (default '{}')
    NEW.department_id         := NULL;
  END IF;

  -- Every member gets a referral code from day one (backfill covered existing
  -- users; this covers new signups). Collision chance ~1 in 16.7M per insert.
  IF NEW.referral_code IS NULL OR NEW.referral_code = '' THEN
    NEW.referral_code :=
      'LYIP-' || upper(substr(md5(random()::text || NEW.id::text || clock_timestamp()::text), 1, 6));
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public, pg_temp;

-- ── 3. Guard: BEFORE UPDATE ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.guard_users_update()
RETURNS trigger AS $$
BEGIN
  IF current_user NOT IN ('postgres', 'supabase_admin', 'service_role', 'supabase_auth_admin') THEN
    IF NEW.id IS DISTINCT FROM OLD.id
       OR NEW.email IS DISTINCT FROM OLD.email
       OR NEW.created_at IS DISTINCT FROM OLD.created_at
       OR NEW.role IS DISTINCT FROM OLD.role
       OR NEW.department_id IS DISTINCT FROM OLD.department_id
       OR NEW.wallet_balance IS DISTINCT FROM OLD.wallet_balance
       OR NEW.referral_code IS DISTINCT FROM OLD.referral_code
       OR NEW.referred_by IS DISTINCT FROM OLD.referred_by
       OR NEW.referral_count IS DISTINCT FROM OLD.referral_count
       OR NEW.referral_milestone_paid IS DISTINCT FROM OLD.referral_milestone_paid
       OR NEW.first_dataset_at IS DISTINCT FROM OLD.first_dataset_at
       OR NEW.knowledge_score IS DISTINCT FROM OLD.knowledge_score
       OR NEW.is_muted IS DISTINCT FROM OLD.is_muted
       OR NEW.mute_reason IS DISTINCT FROM OLD.mute_reason
       OR NEW.is_paused IS DISTINCT FROM OLD.is_paused
       OR NEW.pause_until IS DISTINCT FROM OLD.pause_until
       OR NEW.payout_method IS DISTINCT FROM OLD.payout_method
       OR NEW.payout_details IS DISTINCT FROM OLD.payout_details
    THEN
      RAISE EXCEPTION
        'Protected users columns (role, wallet, referral, moderation, payout) are managed by the system and cannot be written directly';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS guard_users_insert ON public.users;
CREATE TRIGGER guard_users_insert
  BEFORE INSERT ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.guard_users_insert();

DROP TRIGGER IF EXISTS guard_users_update ON public.users;
CREATE TRIGGER guard_users_update
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.guard_users_update();
