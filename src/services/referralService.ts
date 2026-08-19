import { supabase } from '../lib/supabase';
import { REFERRAL_MILESTONE_TARGET } from '../types';
import type { ReferralInfo } from '../types';

/**
 * Referral service — $5 per referral when the invitee submits their first
 * dataset, plus a one-time $100 bonus at 10 completed referrals. All crediting
 * happens server-side (see wallet_functions migration); this module reads.
 */

export async function getReferralInfo(userId: string): Promise<ReferralInfo> {
  const { data: profile, error } = await supabase
    .from('users')
    .select('referral_code, referral_count, referral_milestone_paid')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw error;

  const completed = profile?.referral_count ?? 0;

  const link = profile?.referral_code
    ? `${window.location.origin}/signup?ref=${profile.referral_code}`
    : '';

  return {
    referral_code: profile?.referral_code ?? null,
    referral_link: link,
    total_referred: completed,
    completed_referrals: completed,
    // Earnings come from the ledger for accuracy.
    referral_earnings: 0,
    milestone_bonus: 0,
    milestone_paid: profile?.referral_milestone_paid ?? false,
    progress_to_milestone: Math.min(completed / REFERRAL_MILESTONE_TARGET, 1),
  };
}

/**
 * Apply a referral code for the signed-in user (once). Returns the referrer's
 * name so the UI can confirm attribution.
 */
export async function applyReferralCode(code: string): Promise<string> {
  const { data, error } = await supabase.rpc('apply_referral_code', { p_code: code.trim() });
  if (error) throw new Error(error.message);
  return data as string;
}
