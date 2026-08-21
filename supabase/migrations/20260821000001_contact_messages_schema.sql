-- Contact Messages Table
-- Stores user-submitted contact form messages for admin review and response
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'responded', 'resolved', 'closed')),
  admin_response text,
  admin_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
  responded_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_contact_messages_user_id ON public.contact_messages(user_id);
CREATE INDEX idx_contact_messages_admin_id ON public.contact_messages(admin_id);
CREATE INDEX idx_contact_messages_status ON public.contact_messages(status);
CREATE INDEX idx_contact_messages_created_at ON public.contact_messages(created_at DESC);

-- Updated at trigger
CREATE TRIGGER set_contact_messages_updated_at
  BEFORE UPDATE ON public.contact_messages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Row-Level Security
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Users can view their own messages
CREATE POLICY "Users can view their own contact messages"
  ON public.contact_messages
  FOR SELECT
  USING (auth.uid() = user_id);

-- Authenticated users can create contact messages
CREATE POLICY "Authenticated users can create contact messages"
  ON public.contact_messages
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR auth.uid() IS NOT NULL); -- Allow both logged-in and guest (user_id may be null for guests)

-- Admins can view all messages
CREATE POLICY "Admins can view all contact messages"
  ON public.contact_messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.app_metadata->>'role' = 'admin'
    )
  );

-- Admins can update messages (respond, change status)
CREATE POLICY "Admins can update contact messages"
  ON public.contact_messages
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.app_metadata->>'role' = 'admin'
    )
  );

-- RPC: Create contact message (works for both authenticated and guest users)
CREATE OR REPLACE FUNCTION public.create_contact_message(
  p_user_id uuid DEFAULT NULL,
  p_name text,
  p_email text,
  p_subject text,
  p_message text
) RETURNS uuid AS $$
DECLARE
  v_message_id uuid;
BEGIN
  IF p_name IS NULL OR p_email IS NULL OR p_subject IS NULL OR p_message IS NULL THEN
    RAISE EXCEPTION 'Name, email, subject, and message are required';
  END IF;

  IF p_email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;

  INSERT INTO public.contact_messages (user_id, name, email, subject, message)
  VALUES (p_user_id, p_name, p_email, p_subject, p_message)
  RETURNING id INTO v_message_id;

  RETURN v_message_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

GRANT EXECUTE ON FUNCTION public.create_contact_message(uuid, text, text, text, text) TO authenticated, anon;

-- RPC: Admin response to contact message
CREATE OR REPLACE FUNCTION public.respond_to_contact_message(
  p_message_id uuid,
  p_response text,
  p_status text DEFAULT 'responded'
) RETURNS void AS $$
DECLARE
  v_admin uuid := auth.uid();
BEGIN
  IF v_admin IS NULL THEN
    RAISE EXCEPTION 'You must be signed in';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = v_admin AND users.app_metadata->>'role' = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only admins can respond to contact messages';
  END IF;

  IF p_response IS NULL OR p_response = '' THEN
    RAISE EXCEPTION 'Response cannot be empty';
  END IF;

  IF p_status NOT IN ('responded', 'resolved', 'closed') THEN
    RAISE EXCEPTION 'Invalid status. Must be responded, resolved, or closed';
  END IF;

  UPDATE public.contact_messages
  SET admin_response = p_response,
      admin_id = v_admin,
      status = p_status,
      responded_at = now(),
      updated_at = now()
  WHERE id = p_message_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

GRANT EXECUTE ON FUNCTION public.respond_to_contact_message(uuid, text, text) TO authenticated;

-- RPC: Update contact message status
CREATE OR REPLACE FUNCTION public.update_contact_message_status(
  p_message_id uuid,
  p_status text
) RETURNS void AS $$
DECLARE
  v_admin uuid := auth.uid();
BEGIN
  IF v_admin IS NULL THEN
    RAISE EXCEPTION 'You must be signed in';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = v_admin AND users.app_metadata->>'role' = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only admins can update contact message status';
  END IF;

  IF p_status NOT IN ('pending', 'responded', 'resolved', 'closed') THEN
    RAISE EXCEPTION 'Invalid status';
  END IF;

  UPDATE public.contact_messages
  SET status = p_status,
      updated_at = now()
  WHERE id = p_message_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

GRANT EXECUTE ON FUNCTION public.update_contact_message_status(uuid, text) TO authenticated;