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
