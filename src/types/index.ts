export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship'
export type JobStatus = 'open' | 'closed' | 'draft'

export interface Job {
  id: string
  title: string
  department: string
  location: string
  type: JobType
  salaryRange: string
  description: string
  requirements: string[]
  responsibilities: string[]
  howToApply: string
  applyLink: string
  status: JobStatus
  createdAt: string
  updatedAt: string
}

export interface ForumTopic {
  id: string
  title: string
  content: string
  author_id: string
  is_pinned: boolean
  is_archived: boolean
  is_locked: boolean
  tags: string[]
  view_count?: number
  has_dataset_submit?: boolean
  created_at: string
  updated_at: string
  user?: ForumUser
}

export interface ForumUser {
  name: string
  username: string | null
  avatar_url: string | null
  avatar_color: string | null
  role: string | null
}

export interface ForumPost {
  id: string
  topic_id: string
  author_id: string
  content: string
  parent_id: string | null
  sticker_url: string | null
  is_emoji_only: boolean
  created_at: string
  updated_at: string
  user?: ForumUser
}

export interface ForumReaction {
  id: string
  post_id: string
  user_id: string
  emoji: string
  created_at: string
}

export interface DatasetSubmission {
  id: string
  topic_id: string
  user_id: string
  title: string
  content: string
  url?: string
  file_url?: string
  status: 'pending' | 'approved' | 'rejected'
  admin_notes?: string
  created_at: string
  updated_at: string
}

export interface AuthState {
  isAuthenticated: boolean
  user: UserInfo | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

export interface UserInfo {
  id: string
  email: string
  name: string
  username: string
  role: string
  avatarUrl: string
  avatarColor: string
}

// --- Dataset Curation -------------------------------------------------------
export type SubmissionStatus = 'pending' | 'under_review' | 'approved' | 'rejected' | 'needs_revision'
export type DatasetFormat = 'json' | 'csv' | 'txt' | 'parquet' | 'other'

export interface CuratorSubmission {
  id: string
  user_id: string
  title: string
  description: string | null
  content: string | null
  dataset_url: string | null
  storage_path: string | null
  file_name: string | null
  file_size_bytes: number | null
  mime_type: string | null
  category: string
  custom_category: string | null
  format: string | null
  entry_count: number | null
  status: SubmissionStatus
  proposed_price: number | null
  admin_notes: string | null
  reviewed_by: string | null
  reviewed_at: string | null
  created_at: string
  updated_at: string
  user?: { name: string | null; email: string | null; username: string | null }
}

// --- Wallet & Referrals ------------------------------------------------------
export type WalletTransactionType =
  | 'dataset_earning'
  | 'referral_earning'
  | 'milestone_bonus'
  | 'withdrawal_request'
  | 'withdrawal_payout'
  | 'withdrawal_reversal'

export interface WalletTransaction {
  id: string
  user_id: string
  transaction_type: WalletTransactionType
  amount: number
  balance_after: number
  description: string | null
  related_submission_id: string | null
  related_referral_id: string | null
  status: 'pending' | 'completed' | 'rejected'
  created_at: string
}

export interface ReferralInfo {
  referral_code: string | null
  referral_link: string
  total_referred: number
  completed_referrals: number
  referral_earnings: number
  milestone_bonus: number
  milestone_paid: boolean
  progress_to_milestone: number // completed referrals / 10, capped at 1
}

export interface WalletOverview {
  balance: number
  lifetimeEarnings: number
  referralEarnings: number
  milestoneBonus: number
  thisMonthEarnings: number
  transactions: WalletTransaction[]
}

export const WITHDRAWAL_MIN = 1200
export const REFERRAL_REWARD = 5
export const REFERRAL_MILESTONE_TARGET = 10
export const REFERRAL_MILESTONE_BONUS = 100
