export interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar_url: string;
  department_id: string | null;
  knowledge_score: number;
  is_paused: boolean;
  pause_until: string | null;
  is_muted: boolean;
  mute_reason: string | null;
  wallet_balance: number;
  referral_code: string | null;
  referred_by: string | null;
  referral_count: number;
  referral_milestone_paid: boolean;
  created_at: string;
  updated_at: string;
}
