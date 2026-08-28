import { supabase } from '../lib/supabase';
import { REFERRAL_MILESTONE_TARGET } from '../types';
import type { ReferralInfo } from '../types';

/**
 * Referral service — $5 per referral when the invitee submits their first
 * dataset, plus a repeating $50 milestone bonus for every 10 completed
 * referrals (10, 20, 30 …) with no cap. All crediting happens server-side
 * (see wallet_functions + repeating_referral_milestones migrations); this
 * module reads.
 */

export async function getReferralInfo(userId: string): Promise<ReferralInfo> {
  const { data: profile, error } = await supabase
    .from('users')
    .select('referral_code, referral_count')
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
    milestones_earned: Math.floor(completed / REFERRAL_MILESTONE_TARGET),
    progress_to_milestone: (completed % REFERRAL_MILESTONE_TARGET) / REFERRAL_MILESTONE_TARGET,
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
