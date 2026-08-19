-- Migration: retier dataset payments — 500+ = $50 · 1,500+ = $75 · 3,000+ = $100
-- (replaces the original 1,500/5,000/10,000 thresholds; min $50 on approval kept)

CREATE OR REPLACE FUNCTION public.calculate_dataset_payment(p_entry_count integer)
RETURNS numeric AS $$
BEGIN
  IF p_entry_count IS NULL THEN RETURN 50; END IF;
  IF p_entry_count >= 3000 THEN RETURN 100; END IF;
  IF p_entry_count >= 1500 THEN RETURN 75; END IF;
  RETURN 50;
END;
$$ LANGUAGE plpgsql IMMUTABLE SET search_path = public, pg_temp;
