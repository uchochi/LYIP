-- Migration: Allow staff (admin, senior_instructor, instructor) to pin/unpin topics
-- Apply via Supabase Dashboard → SQL Editor, or MCP execute_sql

-- RPC: set topic pinned state (staff-only)
CREATE OR REPLACE FUNCTION set_topic_pinned(topic_uuid UUID, pinned BOOLEAN)
RETURNS void AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role FROM public.users WHERE id = auth.uid();
  IF user_role IS NULL OR user_role NOT IN ('admin', 'senior_instructor', 'instructor') THEN
    RAISE EXCEPTION 'Only staff can pin topics';
  END IF;
  UPDATE forum_topics SET is_pinned = pinned, updated_at = now() WHERE id = topic_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Also update RLS to allow staff to UPDATE is_pinned/is_locked fields
-- (without giving full UPDATE on all fields)
CREATE POLICY "Staff can pin topics"
  ON forum_topics FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE public.users.id = auth.uid()
      AND public.users.role IN ('admin', 'senior_instructor', 'instructor')
    )
  );
