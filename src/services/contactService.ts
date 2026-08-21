import { supabase } from '../lib/supabase';

export interface ContactMessage {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'pending' | 'responded' | 'resolved' | 'closed';
  admin_response: string | null;
  admin_id: string | null;
  responded_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateContactParams {
  user_id?: string | null;
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Create a contact message (works for both authenticated and guest users)
 */
export async function createContactMessage(params: CreateContactParams): Promise<string> {
  const { data, error } = await supabase.rpc('create_contact_message', {
    p_user_id: params.user_id ?? null,
    p_name: params.name,
    p_email: params.email,
    p_subject: params.subject,
    p_message: params.message,
  });

  if (error) throw new Error(error.message);
  return data as string;
}

/**
 * Fetch all contact messages (admin only)
 */
export async function fetchContactMessages(): Promise<ContactMessage[]> {
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

/**
 * Fetch contact messages for a specific user
 */
export async function fetchUserContactMessages(userId: string): Promise<ContactMessage[]> {
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

/**
 * Admin: Respond to a contact message
 */
export async function respondToContactMessage(
  messageId: string,
  response: string,
  status: 'responded' | 'resolved' | 'closed' = 'responded'
): Promise<void> {
  const { error } = await supabase.rpc('respond_to_contact_message', {
    p_message_id: messageId,
    p_response: response,
    p_status: status,
  });

  if (error) throw new Error(error.message);
}

/**
 * Admin: Update contact message status
 */
export async function updateContactMessageStatus(
  messageId: string,
  status: 'pending' | 'responded' | 'resolved' | 'closed'
): Promise<void> {
  const { error } = await supabase.rpc('update_contact_message_status', {
    p_message_id: messageId,
    p_status: status,
  });

  if (error) throw new Error(error.message);
}