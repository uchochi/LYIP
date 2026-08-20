-- Migration: recreate the on_curator_submission_created trigger, which was
-- missing in production (referral completion + Agiel 24h bonus + first-dataset
-- stamping never fired). Companion to 20260820000002_reward_functions.sql.

DROP TRIGGER IF EXISTS on_curator_submission_created ON public.curator_submissions;
CREATE TRIGGER on_curator_submission_created
  AFTER INSERT ON public.curator_submissions
  FOR EACH ROW EXECUTE FUNCTION public.on_curator_submission_created();
