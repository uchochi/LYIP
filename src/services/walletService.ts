import { supabase } from '../lib/supabase';
import type { WalletOverview, WalletTransaction, WalletTransactionType } from '../types';

/**
 * Wallet service — reads the dollar ledger that is written exclusively by
 * SECURITY DEFINER RPCs (approval payouts, referral rewards, milestone bonus).
 */

export async function getTransactions(
  userId: string,
  opts: { type?: WalletTransactionType; limit?: number } = {},
): Promise<WalletTransaction[]> {
  let q = supabase
    .from('wallet_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(opts.limit ?? 100);
  if (opts.type) q = q.eq('transaction_type', opts.type);
  const { data, error } = await q;
  if (error) throw error;
  return (data || []) as WalletTransaction[];
}

/**
 * Wallet overview aggregates are computed server-side by the
 * get_wallet_overview RPC (full ledger, completed rows only) so totals can
 * never be truncated by a client-side row limit.
 */
/** Raw shape returned by the get_wallet_overview RPC (numerics may arrive as strings). */
interface WalletOverviewSums {
  balance: number | string;
  lifetime_earnings: number | string;
  referral_earnings: number | string;
  milestone_bonus: number | string;
  referral_milestone_bonus: number | string;
  agiel_bonus: number | string;
  this_month_earnings: number | string;
}

export async function getWalletOverview(userId: string): Promise<WalletOverview> {
  const { data, error } = await supabase.rpc('get_wallet_overview').single();
  if (error) throw new Error(error.message);
  const sums = data as unknown as WalletOverviewSums;

  // Recent rows for the transactions modal (display only — the totals above
  // are authoritative and cover the user's entire history).
  const transactions = await getTransactions(userId, { limit: 500 });

  const n = (v: unknown) => Number(v ?? 0);
  return {
    balance: n(sums.balance),
    lifetimeEarnings: n(sums.lifetime_earnings),
    referralEarnings: n(sums.referral_earnings),
    milestoneBonus: n(sums.milestone_bonus),
    referralMilestoneBonus: n(sums.referral_milestone_bonus),
    agielBonus: n(sums.agiel_bonus),
    thisMonthEarnings: n(sums.this_month_earnings),
    transactions,
  };
}

export const TX_LABELS: Record<WalletTransactionType, string> = {
  dataset_earning: 'Dataset payment',
  referral_earning: 'Referral reward',
  milestone_bonus: 'Milestone bonus',
  withdrawal_request: 'Withdrawal request',
  withdrawal_payout: 'Withdrawal paid',
  withdrawal_reversal: 'Withdrawal reversed',
};
