-- Migration: Allow staff (admin, senior_instructor, instructor) to delete posts and topics
-- Apply via Supabase Dashboard → SQL Editor, or MCP apply_migration

-- Staff can delete any post (moderation of unwanted replies)
CREATE POLICY "Staff can delete posts"
  ON forum_posts FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE public.users.id = auth.uid()
      AND public.users.role IN ('admin', 'senior_instructor', 'instructor')
    )
  );

-- Staff can delete any topic (moderation of unwanted threads)
CREATE POLICY "Staff can delete topics"
  ON forum_topics FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE public.users.id = auth.uid()
      AND public.users.role IN ('admin', 'senior_instructor', 'instructor')
    )
  );
