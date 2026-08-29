import { supabase } from '../lib/supabase';

/**
 * Payout service — withdrawal setup + requests via MoneyGram / Western Union.
 * Both RPCs are SECURITY DEFINER; the client never writes wallet tables directly.
 */

export type PayoutMethod = 'moneygram' | 'western_union';

export interface PayoutDetails {
  name: string;
  phone: string;
  address: string;
}

export const PAYOUT_METHOD_LABELS: Record<PayoutMethod, string> = {
  moneygram: 'MoneyGram',
  western_union: 'Western Union',
};

export function validatePayoutDetails(d: Partial<PayoutDetails>): string | null {
  if (!d.name?.trim()) return 'Please enter the recipient’s full name.';
  if (!d.phone?.trim()) return 'Please enter a phone number.';
  if (!/^[+\d][\d\s()-]{6,19}$/.test(d.phone.trim())) return 'That phone number doesn’t look valid.';
  if (!d.address?.trim()) return 'Please enter the recipient’s full address.';
  if (d.address.trim().length < 10) return 'Please enter a complete address (street, city, country).';
  return null;
}

export async function savePayoutDetails(method: PayoutMethod, details: PayoutDetails): Promise<void> {
  const { error } = await supabase.rpc('save_payout_details', {
    p_method: method,
    p_details: { name: details.name, phone: details.phone, address: details.address },
  });
  if (error) throw new Error(error.message);
}

/** Creates a withdrawal request and debits the wallet atomically (RPC). */
export async function createWithdrawalRequest(
  amount: number,
  method?: PayoutMethod,
  details?: PayoutDetails,
): Promise<string> {
  const { data, error } = await supabase.rpc('create_withdrawal_request', {
    p_amount: amount,
    p_method: method ?? null,
    p_details: details ?? null,
  });
  if (error) throw new Error(error.message);
  return data as string;
}

export interface PayoutProfile {
  payout_method: PayoutMethod | null;
  payout_details: PayoutDetails | Partial<PayoutDetails> | null;
}

export async function getPayoutProfile(): Promise<PayoutProfile | null> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;
  const { data } = await supabase
    .from('users')
    .select('payout_method, payout_details')
    .eq('id', auth.user.id)
    .maybeSingle();
  return (data as PayoutProfile) || null;
}

// ── Staff: withdrawal settlement ─────────────────────────────────────

export interface AdminWithdrawalRequest {
  id: string;
  user_id: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  payout_method: PayoutMethod;
  payout_details: Partial<PayoutDetails>;
  admin_notes: string | null;
  submitted_at: string;
  processed_at: string | null;
  users?: { name: string | null; email: string | null; username: string | null } | null;
}

/** Staff-only: list all withdrawal requests, newest first. */
export async function listWithdrawalRequests(): Promise<AdminWithdrawalRequest[]> {
  const { data, error } = await supabase
    .from('withdrawal_requests')
    .select('*, users(name, email, username)')
    .order('submitted_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data || []) as unknown as AdminWithdrawalRequest[];
}

/**
 * Staff-only: settle a withdrawal. 'completed' marks it paid; 'rejected'
 * returns the amount to the member's wallet (server-side, atomic).
 */
export async function settleWithdrawal(
  requestId: string,
  action: 'completed' | 'rejected',
  notes?: string,
): Promise<void> {
  const { error } = await supabase.rpc('settle_withdrawal', {
    p_request_id: requestId,
    p_action: action,
    p_notes: notes ?? null,
  });
  if (error) throw new Error(error.message);
}
