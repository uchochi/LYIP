import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Inbox,
  CheckCircle2,
  XCircle,
  Eye,
  DollarSign,
  Loader2,
  ExternalLink,
  Clock,
  RotateCcw,
  X,
} from 'lucide-react';
import {
  getAllSubmissions,
  reviewSubmission,
  getSignedUrl,
  type ReviewAction,
} from '../../services/datasetService';
import { categoryLabel, categoryEmoji } from '../../content/datasets';
import type { CuratorSubmission, SubmissionStatus } from '../../types';

const STATUS_TABS: { key: SubmissionStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'under_review', label: 'Under Review' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'needs_revision', label: 'Needs Revision' },
];

function StatusBadge({ status }: { status: SubmissionStatus }) {
  const map: Record<SubmissionStatus, { label: string; cls: string }> = {
    pending: { label: 'Pending', cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    under_review: { label: 'Under Review', cls: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    approved: { label: 'Approved', cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    rejected: { label: 'Rejected', cls: 'bg-red-500/10 text-red-400 border-red-500/20' },
    needs_revision: { label: 'Needs Revision', cls: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  };
  const s = map[status];
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${s.cls}`}>
      {s.label}
    </span>
  );
}

export default function ReviewsPage() {
  const [rows, setRows] = useState<CuratorSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<SubmissionStatus | 'all'>('all');
  const [selected, setSelected] = useState<CuratorSubmission | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getAllSubmissions();
      setRows(data);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = tab === 'all' ? rows : rows.filter((r) => r.status === tab);

  const counts = {
    all: rows.length,
    pending: rows.filter((r) => r.status === 'pending').length,
    under_review: rows.filter((r) => r.status === 'under_review').length,
    approved: rows.filter((r) => r.status === 'approved').length,
    rejected: rows.filter((r) => r.status === 'rejected').length,
    needs_revision: rows.filter((r) => r.status === 'needs_revision').length,
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-text-main">Dataset Reviews</h1>
          <p className="text-sm text-text-muted">Review submissions, propose prices, and send feedback.</p>
        </div>
        <Link to="/admin" className="text-sm font-medium text-text-muted transition-colors hover:text-text-main">
          ← Jobs dashboard
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile icon={<Inbox size={16} />} label="Pending" value={counts.pending} tone="amber" />
        <StatTile icon={<Clock size={16} />} label="In review" value={counts.under_review} tone="blue" />
        <StatTile icon={<CheckCircle2 size={16} />} label="Approved" value={counts.approved} tone="emerald" />
        <StatTile
          icon={<DollarSign size={16} />}
          label="Committed $"
          value={rows
            .filter((r) => r.status === 'approved')
            .reduce((s, r) => s + (Number(r.proposed_price) || 0), 0)
            .toLocaleString()}
          tone="emerald"
        />
      </div>

      {/* Tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        {STATUS_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
              tab === t.key
                ? 'border-primary/60 bg-primary/10 text-primary'
                : 'border-border bg-surface text-text-muted hover:text-text-main'
            }`}
          >
            {t.label}{' '}
            <span className="opacity-60">{counts[t.key]}</span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-text-muted">
            <Loader2 size={20} className="mr-2 animate-spin" /> Loading submissions…
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-text-muted">
            <Inbox size={28} className="mb-2 opacity-50" />
            No submissions here.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelected(r)}
                className="flex w-full items-center gap-4 px-4 py-3.5 text-left transition-colors hover:bg-surface-lighter"
              >
                <span className="text-xl">{categoryEmoji(r.category)}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-text-main">{r.title}</p>
                  <p className="truncate text-xs text-text-muted">
                    {r.user?.name || r.user?.email || 'Unknown'} · {categoryLabel(r.category, r.custom_category)}
                    {r.entry_count ? ` · ${r.entry_count.toLocaleString()} entries` : ''}
                    {r.format ? ` · ${r.format.toUpperCase()}` : ''}
                  </p>
                </div>
                {r.status === 'approved' && r.proposed_price != null && (
                  <span className="hidden font-bold text-emerald-400 sm:block">${Number(r.proposed_price).toLocaleString()}</span>
                )}
                <StatusBadge status={r.status} />
                <span className="hidden text-xs text-text-muted md:block">
                  {new Date(r.created_at).toLocaleDateString()}
                </span>
                <Eye size={16} className="text-text-muted" />
              </button>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <ReviewModal
          submission={selected}
          onClose={() => setSelected(null)}
          onSaved={(updated) => {
            setRows((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
            setSelected(null);
          }}
        />
      )}
    </div>
  );
}

function StatTile({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  tone: 'amber' | 'blue' | 'emerald';
}) {
  const toneCls = {
    amber: 'text-amber-400',
    blue: 'text-blue-400',
    emerald: 'text-emerald-400',
  }[tone];
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className={`mb-1 flex items-center gap-1.5 ${toneCls}`}>
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold text-text-main">{value}</p>
    </div>
  );
}

function ReviewModal({
  submission,
  onClose,
  onSaved,
}: {
  submission: CuratorSubmission;
  onClose: () => void;
  onSaved: (s: CuratorSubmission) => void;
}) {
  const [status, setStatus] = useState<SubmissionStatus>(submission.status);
  const [price, setPrice] = useState<string>(
    submission.proposed_price != null ? String(submission.proposed_price) : '',
  );
  const [notes, setNotes] = useState<string>(submission.admin_notes || '');
  const [saving, setSaving] = useState(false);
  const [link, setLink] = useState<string | null>(null);
  const [loadingLink, setLoadingLink] = useState(false);
  const [err, setErr] = useState('');

  const fetchLink = async () => {
    if (!submission.storage_path) return;
    setLoadingLink(true);
    const url = await getSignedUrl(submission.storage_path);
    setLink(url);
    setLoadingLink(false);
  };

  const save = async () => {
    setErr('');
    if (status === 'approved' && (!price || Number(price) <= 0)) {
      setErr('Please enter a proposed price for approved datasets.');
      return;
    }
    setSaving(true);
    try {
      const action: ReviewAction = {
        status,
        proposedPrice: status === 'approved' ? Number(price) : status === 'rejected' ? null : Number(price) || null,
        adminNotes: notes.trim() || null,
      };
      const updated = await reviewSubmission(submission.id, action);
      onSaved(updated);
    } catch (e: any) {
      setErr(e?.message || 'Failed to save review.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-border bg-surface sm:rounded-2xl"
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-surface px-5 py-4">
          <h3 className="font-bold text-text-main">Review submission</h3>
          <button onClick={onClose} className="rounded-md p-1 text-text-muted hover:bg-surface-lighter hover:text-text-main">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-5 p-5">
          <div>
            <p className="text-lg font-bold text-text-main">{submission.title}</p>
            <p className="mt-1 text-sm text-text-muted">
              {categoryEmoji(submission.category)} {categoryLabel(submission.category, submission.custom_category)}
              {submission.format && ` · ${submission.format.toUpperCase()}`}
              {submission.entry_count ? ` · ${submission.entry_count.toLocaleString()} entries` : ''}
            </p>
            <p className="mt-1 text-xs text-text-muted">
              By {submission.user?.name || submission.user?.email || 'Unknown'} ·{' '}
              {new Date(submission.created_at).toLocaleString()}
            </p>
          </div>

          {submission.description && (
            <p className="rounded-lg border border-border bg-bg p-3 text-sm text-text-muted">{submission.description}</p>
          )}

          {/* file / link */}
          <div className="flex flex-wrap gap-2">
            {submission.storage_path && (
              <button
                onClick={fetchLink}
                disabled={loadingLink}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-lighter px-3 py-1.5 text-sm text-text-main transition-colors hover:border-primary/40"
              >
                {loadingLink ? <Loader2 size={14} className="animate-spin" /> : <ExternalLink size={14} />}
                {link ? 'Open file again' : 'View file'}
              </button>
            )}
            {link && (
              <a
                href={link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-primary/40 bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary"
              >
                <ExternalLink size={14} /> Download
              </a>
            )}
            {submission.dataset_url && (
              <a
                href={submission.dataset_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-lighter px-3 py-1.5 text-sm text-text-main hover:border-primary/40"
              >
                <ExternalLink size={14} /> External link
              </a>
            )}
          </div>

          {/* status */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-text-main">Set status</label>
            <div className="grid grid-cols-2 gap-2">
              {([
                { k: 'under_review', label: 'Under Review', icon: <Eye size={14} /> },
                { k: 'approved', label: 'Approve', icon: <CheckCircle2 size={14} /> },
                { k: 'needs_revision', label: 'Needs Revision', icon: <RotateCcw size={14} /> },
                { k: 'rejected', label: 'Reject', icon: <XCircle size={14} /> },
              ] as const).map((o) => (
                <button
                  key={o.k}
                  type="button"
                  onClick={() => setStatus(o.k)}
                  className={`inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    status === o.k
                      ? 'border-primary/60 bg-primary/10 text-primary'
                      : 'border-border bg-surface text-text-muted hover:text-text-main'
                  }`}
                >
                  {o.icon} {o.label}
                </button>
              ))}
            </div>
          </div>

          {/* price */}
          {status === 'approved' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
              <label className="mb-1.5 block text-sm font-semibold text-text-main">
                Proposed price (USD) <span className="font-normal text-primary">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">$</span>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="75"
                  className="w-full rounded-lg border border-border bg-surface py-3 pl-7 pr-4 text-text-main outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </motion.div>
          )}

          {/* notes */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-text-main">
              Feedback / notes <span className="font-normal text-text-muted">(sent to curator)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="e.g. Great quality. Approved at $80. — or — Please expand to 1500+ rows and resubmit."
              className="w-full resize-y rounded-lg border border-border bg-surface px-4 py-3 text-text-main outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {err && <p className="text-sm text-red-400">{err}</p>}
        </div>

        <div className="sticky bottom-0 flex justify-end gap-2 border-t border-border bg-surface px-5 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text-muted transition-colors hover:bg-surface-lighter"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
            Save review
          </button>
        </div>
      </motion.div>
    </div>
  );
}
