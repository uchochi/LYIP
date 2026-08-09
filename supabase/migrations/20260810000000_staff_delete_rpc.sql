-- Migration: Staff-only deletion via SECURITY DEFINER RPCs (mirrors set_topic_pinned)
-- Apply via Supabase Dashboard → SQL Editor, or MCP apply_migration

-- RPC: delete a single post (staff-only)
CREATE OR REPLACE FUNCTION delete_forum_post(post_uuid UUID)
RETURNS void AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role FROM public.users WHERE id = auth.uid();
  IF user_role IS NULL OR user_role NOT IN ('admin', 'senior_instructor', 'instructor') THEN
    RAISE EXCEPTION 'Only staff can delete posts';
  END IF;
  DELETE FROM forum_posts WHERE id = post_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC: delete a whole topic (staff-only). Replies and reactions cascade.
CREATE OR REPLACE FUNCTION delete_forum_topic(topic_uuid UUID)
RETURNS void AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role FROM public.users WHERE id = auth.uid();
  IF user_role IS NULL OR user_role NOT IN ('admin', 'senior_instructor', 'instructor') THEN
    RAISE EXCEPTION 'Only staff can delete topics';
  END IF;
  DELETE FROM forum_topics WHERE id = topic_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Only authenticated users may call the RPCs
REVOKE EXECUTE ON FUNCTION delete_forum_post(UUID) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION delete_forum_topic(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION delete_forum_post(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION delete_forum_topic(UUID) TO authenticated;

-- Restrict direct deletes to staff only (remove author self-delete)
DROP POLICY IF EXISTS "Post author or admin can delete" ON forum_posts;
DROP POLICY IF EXISTS "Topic author or admin can delete" ON forum_topics;
