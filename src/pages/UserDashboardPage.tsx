import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User as UserIcon, GraduationCap, MessageSquare, FileText, Award, ShieldAlert, ShieldOff, Building2, Database, ExternalLink, DollarSign } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, getMyTopics, getMyPosts } from '../services/userService';
import { getMySubmissions, computeStats, getSignedUrl } from '../services/datasetService';
import { categoryLabel, categoryEmoji } from '../content/datasets';
import type { UserRow } from '../types/supabase';
import type { CuratorSubmission, SubmissionStatus } from '../types';
import Button from '../components/ui/Button';

function roleLabel(role?: string): string {
  const map: Record<string, string> = {
    apprentice: 'Apprentice',
    instructor: 'Instructor',
    junior_staff: 'Junior Staff',
    senior_instructor: 'Senior Instructor',
    admin: 'Admin',
    user: 'Member',
  };
  return map[role || ''] || (role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Member');
}

export default function UserDashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserRow | null>(null);
  const [topics, setTopics] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<CuratorSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.id) return;
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const [p, t, ps, ds] = await Promise.all([
          getUserProfile(user.id),
          getMyTopics(user.id),
          getMyPosts(user.id),
          getMySubmissions(user.id),
        ]);
        if (!active) return;
        setProfile(p);
        setTopics(t);
        setPosts(ps);
        setSubmissions(ds);
      } catch (e: any) {
        setError(e.message || 'Failed to load dashboard');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [user?.id]);

  if (loading) {
    return <div className="mx-auto max-w-5xl px-6 py-20 text-center text-text-muted">Loading your dashboard…</div>;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-20 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Link to="/forum"><Button variant="secondary">Back to Forum</Button></Link>
      </div>
    );
  }

  const dept = (profile as any)?.department;
  const isMuted = profile?.is_muted;
  const isPaused = profile?.is_paused;

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      {/* Profile header */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm mb-8">
        <div className="flex items-start gap-5">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt={profile.name} className="h-16 w-16 rounded-full object-cover" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UserIcon size={28} />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-text-main">{profile?.name || user?.name || 'Member'}</h1>
            <p className="text-sm text-text-muted">{profile?.email || user?.email}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <GraduationCap size={14} /> {roleLabel(profile?.role || user?.role)}
              </span>
              {dept?.name && (
                <span className="inline-flex items-center gap-1 rounded-full bg-surface-lighter px-3 py-1 text-xs font-medium text-text-muted">
                  <Building2 size={14} /> {dept.name}
                </span>
              )}
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400">
                <Award size={14} /> Knowledge Score: {profile?.knowledge_score ?? 0}
              </span>
            </div>
          </div>
          <Link to="/forum/new" className="no-underline hidden sm:block">
            <Button size="sm">New Topic</Button>
          </Link>
        </div>

        {(isMuted || isPaused) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {isMuted && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400">
                <ShieldOff size={14} /> Muted{profile?.mute_reason ? `: ${profile.mute_reason}` : ''}
              </span>
            )}
            {isPaused && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-400">
                <ShieldAlert size={14} /> Paused{profile?.pause_until ? ` until ${new Date(profile.pause_until).toLocaleDateString()}` : ''}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <FileText size={20} className="text-primary" />
            <div>
              <p className="text-2xl font-bold text-text-main">{topics.length}</p>
              <p className="text-xs text-text-muted">Topics Started</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <MessageSquare size={20} className="text-green-400" />
            <div>
              <p className="text-2xl font-bold text-text-main">{posts.length}</p>
              <p className="text-xs text-text-muted">Replies Posted</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dataset Monitor */}
      <DatasetMonitor submissions={submissions} />

      <div className="grid gap-8 md:grid-cols-2">
        {/* My Topics */}
        <div>
          <h2 className="mb-3 text-lg font-semibold text-text-main">My Topics</h2>
          {topics.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-text-muted">
              You haven’t started any topics yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {topics.map((t) => (
                <li key={t.id}>
                  <Link to={`/forum/${t.id}`} className="block rounded-xl border border-border bg-surface p-4 no-underline transition-colors hover:border-primary/40">
                    <p className="font-medium text-text-main line-clamp-1">{t.title}</p>
                    <p className="mt-1 text-xs text-text-muted">
                      {new Date(t.created_at).toLocaleDateString()} · {(t.forum_posts?.[0]?.count ?? 0)} replies
                      {t.is_pinned && ' · Pinned'} {t.is_archived && ' · Archived'}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* My Replies */}
        <div>
          <h2 className="mb-3 text-lg font-semibold text-text-main">My Replies</h2>
          {posts.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-text-muted">
              You haven’t replied to any topics yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {posts.map((p) => (
                <li key={p.id}>
                  <Link to={`/forum/${p.forum_topics?.id}`} className="block rounded-xl border border-border bg-surface p-4 no-underline transition-colors hover:border-primary/40">
                    <p className="text-sm text-text-muted line-clamp-2">{p.content}</p>
                    <p className="mt-1 text-xs text-text-muted">
                      {new Date(p.created_at).toLocaleDateString()}
                      {p.forum_topics?.title && ` · in “${p.forum_topics.title}”`}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Dataset Monitor — shows a curator's submissions, statuses, and earnings.
// ---------------------------------------------------------------------------

const STATUS_META: Record<SubmissionStatus, { label: string; cls: string }> = {
  pending: { label: 'Pending', cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  under_review: { label: 'Under Review', cls: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  approved: { label: 'Approved', cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  rejected: { label: 'Rejected', cls: 'bg-red-500/10 text-red-400 border-red-500/20' },
  needs_revision: { label: 'Needs Revision', cls: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
};

function MiniStat({ label, value, tone }: { label: string; value: string | number; tone: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className={`text-2xl font-bold ${tone}`}>{value}</p>
      <p className="text-xs text-text-muted">{label}</p>
    </div>
  );
}

function DatasetMonitor({ submissions }: { submissions: CuratorSubmission[] }) {
  const stats = computeStats(submissions);

  const openFile = async (path: string) => {
    const url = await getSignedUrl(path);
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-text-main">
          <Database size={18} className="text-primary" /> Dataset Submissions
        </h2>
        <Link to="/submit" className="no-underline">
          <Button size="sm">+ New submission</Button>
        </Link>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MiniStat label="Total submitted" value={stats.total} tone="text-text-main" />
        <MiniStat label="Pending" value={stats.pending} tone="text-amber-400" />
        <MiniStat label="Approved" value={stats.approved} tone="text-emerald-400" />
        <MiniStat label="Total earned" value={`$${stats.totalEarned.toLocaleString()}`} tone="text-emerald-400" />
      </div>

      {submissions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-surface/50 p-8 text-center">
          <Database size={26} className="mx-auto mb-2 text-text-muted opacity-50" />
          <p className="text-sm text-text-muted">You haven't submitted any datasets yet.</p>
          <Link to="/submit" className="no-underline">
            <Button size="sm" className="mt-3">Submit your first dataset →</Button>
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <div className="divide-y divide-border">
            {submissions.map((s) => {
              const meta = STATUS_META[s.status];
              return (
                <div key={s.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3.5">
                  <span className="text-xl">{categoryEmoji(s.category)}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-text-main">{s.title}</p>
                    <p className="truncate text-xs text-text-muted">
                      {categoryLabel(s.category, s.custom_category)}
                      {s.format ? ` · ${s.format.toUpperCase()}` : ''}
                      {s.entry_count ? ` · ${s.entry_count.toLocaleString()} entries` : ''}
                      {' · '}{new Date(s.created_at).toLocaleDateString()}
                    </p>
                    {s.admin_notes && s.status !== 'pending' && (
                      <p className="mt-1 line-clamp-2 text-xs italic text-text-muted">“{s.admin_notes}”</p>
                    )}
                  </div>

                  {s.status === 'approved' && s.proposed_price != null && (
                    <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 px-2.5 py-1 text-sm font-bold text-emerald-400">
                      <DollarSign size={13} /> {Number(s.proposed_price).toLocaleString()}
                    </span>
                  )}

                  {s.storage_path && (
                    <button
                      onClick={() => openFile(s.storage_path!)}
                      className="text-text-muted transition-colors hover:text-text-main"
                      title="View your file"
                    >
                      <ExternalLink size={15} />
                    </button>
                  )}

                  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${meta.cls}`}>
                    {meta.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
