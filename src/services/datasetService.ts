import { supabase } from '../lib/supabase';
import type { CuratorSubmission, SubmissionStatus } from '../types';

const TABLE = 'curator_submissions';
const BUCKET = 'curator-datasets';

export const MAX_FILE_BYTES = 50 * 1024 * 1024; // 50 MB
export const ALLOWED_EXTS = ['json', 'csv', 'txt', 'parquet'] as const;

export function extOf(name: string): string {
  const i = name.lastIndexOf('.');
  return i === -1 ? '' : name.slice(i + 1).toLowerCase();
}

export function validateFile(file: File): string | null {
  const ext = extOf(file.name);
  if (!(ALLOWED_EXTS as readonly string[]).includes(ext)) {
    return `Unsupported format ".${ext || '?'}". Allowed: ${ALLOWED_EXTS.join(', ')}.`;
  }
  if (file.size > MAX_FILE_BYTES) {
    return `File is too large. Maximum size is ${Math.round(MAX_FILE_BYTES / 1024 / 1024)} MB.`;
  }
  if (file.size === 0) return 'File appears to be empty.';
  return null;
}

function randomFolder(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// ---------------------------------------------------------------------------
// User-facing
// ---------------------------------------------------------------------------

export interface CreateSubmissionInput {
  title: string;
  description?: string;
  category: string;
  customCategory?: string;
  format?: string;
  entryCount?: number;
  datasetUrl?: string;
  content?: string;
  file?: File | null;
}

export async function createSubmission(input: CreateSubmissionInput): Promise<CuratorSubmission> {
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) throw new Error('You must be signed in to submit a dataset.');
  const userId = authData.user.id;

  if (!input.title.trim()) throw new Error('Please give your dataset a title.');
  if (!input.category) throw new Error('Please choose a category.');
  if (input.category === 'other' && !input.customCategory?.trim()) {
    throw new Error('Please type your custom category.');
  }
  if (!input.file && !input.datasetUrl?.trim() && !input.content?.trim()) {
    throw new Error('Please upload a dataset file, paste content, or provide a link.');
  }

  let storagePath: string | null = null;
  let fileName: string | null = null;
  let fileSize: number | null = null;
  let mimeType: string | null = null;

  if (input.file) {
    const fileErr = validateFile(input.file);
    if (fileErr) throw new Error(fileErr);
    const folder = randomFolder();
    const safeName = input.file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    storagePath = `${userId}/${folder}/${safeName}`;
    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, input.file, {
        upsert: false,
        contentType: input.file.type || 'application/octet-stream',
      });
    if (upErr) {
      throw new Error('Could not upload your file: ' + upErr.message);
    }
    fileName = input.file.name;
    fileSize = input.file.size;
    mimeType = input.file.type || null;
  }

  const row: Record<string, unknown> = {
    user_id: userId,
    title: input.title.trim(),
    description: input.description?.trim() || null,
    content: input.content?.trim() || null,
    dataset_url: input.datasetUrl?.trim() || null,
    storage_path: storagePath,
    file_name: fileName,
    file_size_bytes: fileSize,
    mime_type: mimeType,
    category: input.category,
    custom_category: input.category === 'other' ? input.customCategory?.trim() || null : null,
    format: input.format || (input.file ? extOf(input.file.name) : null),
    entry_count: input.entryCount ?? null,
    status: 'pending',
  };

  const { data, error } = await supabase.from(TABLE).insert(row).select('*').single();
  if (error) {
    if (storagePath) await supabase.storage.from(BUCKET).remove([storagePath]).catch(() => {});
    throw new Error(error.message);
  }

  // Best-effort admin notification (in-app + email). Never blocks the user.
  supabase.functions
    .invoke('dataset-submission-notify', { body: { submissionId: data.id } })
    .catch(() => {});

  return data;
}

export async function getMySubmissions(userId: string): Promise<CuratorSubmission[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getSignedUrl(storagePath: string, expiresIn = 3600): Promise<string | null> {
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(storagePath, expiresIn);
  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}

// ---------------------------------------------------------------------------
// Admin-facing
// ---------------------------------------------------------------------------

export async function getAllSubmissions(
  filter?: { status?: SubmissionStatus; category?: string },
): Promise<CuratorSubmission[]> {
  let q = supabase
    .from(TABLE)
    .select('*, user:users(name, email, username)')
    .order('created_at', { ascending: false });
  if (filter?.status) q = q.eq('status', filter.status);
  if (filter?.category) q = q.eq('category', filter.category);
  const { data, error } = await q;
  if (error) throw error;
  return data || [];
}

export interface ReviewAction {
  status: SubmissionStatus;
  proposedPrice?: number | null;
  adminNotes?: string | null;
}

/**
 * Mirrors public.calculate_dataset_payment in Postgres:
 * 1500+ entries = $50 · 5000+ = $75 · 10000+ = $100 (minimum $50).
 */
export function calculatePayment(entryCount: number | null | undefined): number {
  if (entryCount == null) return 50;
  if (entryCount >= 10000) return 100;
  if (entryCount >= 5000) return 75;
  return 50;
}

/**
 * Staff review. Goes through the review_curator_submission RPC so that
 * approving a submission atomically credits the curator's wallet and writes
 * the ledger row (see supabase/migrations/*wallet_functions.sql).
 */
export async function reviewSubmission(id: string, action: ReviewAction): Promise<CuratorSubmission> {
  const { data, error } = await supabase.rpc('review_curator_submission', {
    p_submission_id: id,
    p_status: action.status,
    p_proposed_price: action.proposedPrice ?? null,
    p_admin_notes: action.adminNotes ?? null,
  });
  if (error) throw new Error(error.message);
  return data as CuratorSubmission;
}

// ---------------------------------------------------------------------------
// Stats (user dashboard monitor)
// ---------------------------------------------------------------------------

export interface SubmissionStats {
  total: number;
  pending: number;
  under_review: number;
  approved: number;
  rejected: number;
  needs_revision: number;
  totalEarned: number;
}

export function computeStats(rows: CuratorSubmission[]): SubmissionStats {
  const by = (s: SubmissionStatus) => rows.filter((r) => r.status === s).length;
  const totalEarned = rows
    .filter((r) => r.status === 'approved')
    .reduce((sum, r) => sum + (Number(r.proposed_price) || 0), 0);
  return {
    total: rows.length,
    pending: by('pending'),
    under_review: by('under_review'),
    approved: by('approved'),
    rejected: by('rejected'),
    needs_revision: by('needs_revision'),
    totalEarned,
  };
}
