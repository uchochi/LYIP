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

export async function getWalletOverview(userId: string): Promise<WalletOverview> {
  const transactions = await getTransactions(userId, { limit: 500 });

  const sum = (type: WalletTransactionType) =>
    transactions.filter((t) => t.transaction_type === type).reduce((s, t) => s + Number(t.amount), 0);

  const lifetime =
    sum('dataset_earning') + sum('referral_earning') + sum('milestone_bonus');

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const thisMonthEarnings = transactions
    .filter(
      (t) =>
        new Date(t.created_at) >= monthStart &&
        ['dataset_earning', 'referral_earning', 'milestone_bonus'].includes(t.transaction_type),
    )
    .reduce((s, t) => s + Number(t.amount), 0);

  // The authoritative balance lives on the users row; fall back to the ledger.
  const { data: profile } = await supabase
    .from('users')
    .select('wallet_balance')
    .eq('id', userId)
    .maybeSingle();

  return {
    balance: profile ? Number(profile.wallet_balance) : lifetime,
    lifetimeEarnings: lifetime,
    referralEarnings: sum('referral_earning'),
    milestoneBonus: sum('milestone_bonus'),
    thisMonthEarnings,
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
