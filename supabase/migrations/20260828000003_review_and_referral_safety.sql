-- Migration: money-movement safety fixes from the 2026-08-28 wallet audit.
--
-- 1. approve_and_pay: never pay the same submission twice (un-approve →
--    re-approve used to double-credit) + sanity-bound the staff-set price.
-- 2. review_curator_submission: whitelist non-approve statuses and fail
--    loudly on unknown submission ids.
-- 3. referral_records: a person can only ever be referred once (partial
--    unique index closes the concurrent double-referral race).

-- ── 1. approve_and_pay with ledger guard + price bounds ─────────────
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
  IF p_price IS NULL OR p_price <= 0 THEN
    RAISE EXCEPTION 'Approved price must be positive (got %)', p_price;
  END IF;
  -- Max payment tier is $100 (calculate_dataset_payment). Keep in sync if
  -- tiers ever change — this is the fat-finger / compromised-account backstop.
  IF p_price > 100 THEN
    RAISE EXCEPTION 'Approved price % exceeds the maximum tier ($100)', p_price;
  END IF;

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

  -- Pay only when entering approved from a non-approved state AND this
  -- submission has never been paid before (ledger is the source of truth —
  -- un-approve → re-approve must not double-credit).
  IF NOT v_was_approved AND NOT EXISTS (
    SELECT 1 FROM public.wallet_transactions
    WHERE related_submission_id = p_submission_id
      AND transaction_type = 'dataset_earning'
  ) THEN
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

-- ── 2. review_curator_submission: validate transitions ──────────────
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
    -- Whitelist the review states; block garbage strings and 'approved'
    -- sneak-throughs on this branch (approval only via approve_and_pay).
    IF p_status NOT IN ('pending', 'under_review', 'needs_revision', 'rejected') THEN
      RAISE EXCEPTION 'Invalid review status: %', p_status;
    END IF;

    UPDATE public.curator_submissions
    SET status = p_status,
        proposed_price = CASE WHEN p_status = 'rejected' THEN NULL ELSE proposed_price END,
        admin_notes = COALESCE(p_admin_notes, admin_notes),
        reviewed_by = auth.uid(),
        reviewed_at = now(),
        updated_at = now()
    WHERE id = p_submission_id;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Submission % not found', p_submission_id;
    END IF;
  END IF;

  SELECT * INTO v_row FROM public.curator_submissions WHERE id = p_submission_id;
  RETURN v_row;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- ── 3. One referral per person, ever ────────────────────────────────
-- (Verified 0 duplicates live before creating the index.)
CREATE UNIQUE INDEX IF NOT EXISTS idx_referral_records_referred_user
  ON public.referral_records(referred_user_id)
  WHERE status <> 'failed';
