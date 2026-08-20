import { supabase } from '../lib/supabase';

/**
 * Badge service — reads badges written exclusively by SECURITY DEFINER
 * functions (Agiel 24h bonus on submission; first/10/50 approvals).
 */

export type BadgeType = 'agiel' | 'first_dataset' | 'prolific_10' | 'elite_50';

export interface UserBadge {
  id: string;
  badge_type: BadgeType;
  metadata: Record<string, unknown>;
  awarded_at: string;
}

export interface BadgeMeta {
  label: string;
  description: string;
  emoji: string;
  /** Tailwind classes for the icon chip. */
  cls: string;
}

/** Catalog consumed by the profile-card icons (with tooltips). */
export const BADGE_CATALOG: Record<BadgeType, BadgeMeta> = {
  agiel: {
    label: 'Agiel Member',
    description: 'Submitted their first dataset within 24 hours of joining — earned a $100 bonus.',
    emoji: '⚡',
    cls: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
  },
  first_dataset: {
    label: 'First Contribution',
    description: 'First dataset approved by our review team.',
    emoji: '🎉',
    cls: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
  },
  prolific_10: {
    label: 'Prolific Curator',
    description: '10 datasets approved — a proven contributor.',
    emoji: '🚀',
    cls: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
  },
  elite_50: {
    label: 'Elite Curator',
    description: '50 datasets approved — top-tier contributor.',
    emoji: '👑',
    cls: 'border-purple-500/30 bg-purple-500/10 text-purple-400',
  },
};

export async function getUserBadges(userId: string): Promise<UserBadge[]> {
  const { data, error } = await supabase
    .from('user_badges')
    .select('id, badge_type, metadata, awarded_at')
    .eq('user_id', userId)
    .order('awarded_at', { ascending: true });
  if (error) throw error;
  return (data || []) as UserBadge[];
}
