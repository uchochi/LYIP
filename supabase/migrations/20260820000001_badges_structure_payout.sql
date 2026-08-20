-- Migration: badge reward system, first-dataset tracking, structure-validation
-- columns and stored payout details (MoneyGram / Western Union).

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Badges
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  badge_type text NOT NULL CHECK (badge_type IN
    ('agiel',        -- first dataset submitted within 24h of joining ($100 bonus)
     'first_dataset', -- first dataset approved
     'prolific_10',   -- 10 datasets approved
     'elite_50')),    -- 50 datasets approved
  metadata jsonb NOT NULL DEFAULT '{}',
  awarded_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, badge_type)
);

CREATE INDEX IF NOT EXISTS idx_user_badges_user ON public.user_badges(user_id);

ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own badges" ON public.user_badges;
CREATE POLICY "Users view own badges"
  ON public.user_badges FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Staff view all badges" ON public.user_badges;
CREATE POLICY "Staff view all badges"
  ON public.user_badges FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role IN ('admin', 'senior_instructor')
    )
  );
-- Writes happen exclusively through SECURITY DEFINER functions.

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Users: first-dataset tracking + payout details
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS first_dataset_at timestamptz,
  ADD COLUMN IF NOT EXISTS payout_method text
    CHECK (payout_method IS NULL OR payout_method IN ('moneygram', 'western_union')),
  ADD COLUMN IF NOT EXISTS payout_details jsonb NOT NULL DEFAULT '{}';

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Submissions: structure validation + rejection reason
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.curator_submissions
  ADD COLUMN IF NOT EXISTS structure_valid boolean,   -- null = not machine-checkable (links, parquet)
  ADD COLUMN IF NOT EXISTS rejection_reason text;     -- 'structure' when auto-rejected for misalignment

-- Backfill neutral values for existing rows.
UPDATE public.curator_submissions
  SET structure_valid = NULL
  WHERE structure_valid IS NOT NULL AND structure_valid;
