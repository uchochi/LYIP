-- Migration: daily auto-approval of submissions stuck in review for more than 8 days.

CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.schedule(
  'auto-approve-stale-datasets',
  '30 0 * * *',  -- 00:30 UTC daily
  $$SELECT public.auto_approve_stale_submissions();$$
);

-- Run once now to catch up on any currently-stale submissions.
SELECT public.auto_approve_stale_submissions();
