import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User as UserIcon,
  GraduationCap,
  MessageSquare,
  FileText,
  Award,
  ShieldAlert,
  ShieldOff,
  Building2,
  Database,
  ExternalLink,
  DollarSign,
  Wallet,
  TrendingUp,
  Users,
  Copy,
  Check,
  Trophy,
  BookOpen,
  UploadCloud,
  MessagesSquare,
  X,
  Landmark,
  Info,
  Zap,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, getMyTopics, getMyPosts } from '../services/userService';
import { getMySubmissions, getSignedUrl, calculatePayment } from '../services/datasetService';
import { getWalletOverview, TX_LABELS } from '../services/walletService';
import { getUserBadges, BADGE_CATALOG, type UserBadge } from '../services/badgeService';
import { createWithdrawalRequest } from '../services/payoutService';
import { categoryLabel, categoryEmoji } from '../content/datasets';
import PayoutDetailsForm from '../components/dashboard/PayoutDetailsForm';
import {
  WITHDRAWAL_MIN,
  REFERRAL_MILESTONE_TARGET,
  REFERRAL_MILESTONE_BONUS,
  REFERRAL_REWARD,
  AGIEL_BONUS,
  AGIEL_WINDOW_HOURS,
} from '../types';
import type { WalletOverview, WalletTransactionType } from '../types';
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

const money = (n: number) =>
  `$${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function UserDashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserRow | null>(null);
  const [topics, setTopics] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<CuratorSubmission[]>([]);
  const [wallet, setWallet] = useState<WalletOverview | null>(null);
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTxModal, setShowTxModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const [p, t, ps, ds, w, b] = await Promise.all([
          getUserProfile(user.id),
          getMyTopics(user.id),
          getMyPosts(user.id),
          getMySubmissions(user.id),
          getWalletOverview(user.id),
          getUserBadges(user.id).catch(() => [] as UserBadge[]),
        ]);
        if (!active) return;
        setProfile(p);
        setTopics(t);
        setPosts(ps);
        setSubmissions(ds);
        setWallet(w);
        setBadges(b);
      } catch (e: any) {
        setError(e.message || 'Failed to load dashboard');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [user?.id]);

  if (loading) {
    return <div className="mx-auto max-w-5xl px-6 py-20 text-center text-text-muted">Loading your dashboard…</div>;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-20 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Link to="/forum">
          <Button variant="secondary">Back to Forum</Button>
        </Link>
      </div>
    );
  }

  const dept = (profile as any)?.department;
  const isMuted = profile?.is_muted;
  const isPaused = profile?.is_paused;
  const balance = wallet?.balance ?? 0;
  const structureRejected = submissions.filter(
    (s) => s.status === 'rejected' && s.rejection_reason === 'structure',
  );

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      {/* ── 24h first-dataset countdown (new members only) ─────────── */}
      <AgielCountdownBanner profile={profile} badges={badges} />

      {/* ── Structure rejection notices ─────────────────────────────── */}
      {structureRejected.length > 0 && (
        <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="mt-0.5 shrink-0 text-red-400" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-red-400">
                {structureRejected.length === 1
                  ? '1 dataset was rejected — the structure doesn’t align'
                  : `${structureRejected.length} datasets were rejected — the structure doesn’t align`}
              </p>
              <p className="mt-1 text-sm text-text-muted">
                {structureRejected.map((s) => `“${s.title}”`).join(', ')} didn’t follow the required unique dataset
                structure. Re-format your export and submit again —{' '}
                <Link to="/forum" className="font-medium text-primary">
                  ask in the forum
                </Link>{' '}
                if you need help.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Profile header ─────────────────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm mb-6">
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
              {badges.map((b) => {
                const meta = BADGE_CATALOG[b.badge_type];
                if (!meta) return null;
                return (
                  <span
                    key={b.id}
                    title={`${meta.label} — ${meta.description}`}
                    className={`group relative inline-flex cursor-help items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${meta.cls}`}
                  >
                    <span>{meta.emoji}</span> {meta.label}
                    <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-52 -translate-x-1/2 rounded-lg border border-border bg-bg p-2.5 text-left text-xs font-normal leading-snug text-text-muted opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
                      {meta.description}
                    </span>
                  </span>
                );
              })}
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

      {/* ── Wallet hero ────────────────────────────────────────────── */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/15 via-surface to-surface p-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
              <Wallet size={14} /> Wallet Balance
            </p>
            <p className="mt-2 text-4xl font-extrabold text-text-main sm:text-5xl">{money(balance)}</p>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
              <span className="text-text-muted">
                This month <span className="font-semibold text-emerald-400">{money(wallet?.thisMonthEarnings ?? 0)}</span>
              </span>
              <span className="text-text-muted">
                Lifetime <span className="font-semibold text-text-main">{money(wallet?.lifetimeEarnings ?? 0)}</span>
              </span>
              <span className="text-text-muted">
                Referrals <span className="font-semibold text-primary">{money((wallet?.referralEarnings ?? 0) + (wallet?.milestoneBonus ?? 0))}</span>
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowTxModal(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-text-main transition-colors hover:border-primary/50"
            >
              <TrendingUp size={16} className="text-primary" /> Transactions
            </button>
            <button
              onClick={() => setShowWithdrawModal(true)}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                balance >= WITHDRAWAL_MIN
                  ? 'bg-primary text-white hover:bg-primary-dark'
                  : 'cursor-not-allowed border border-border bg-surface/60 text-text-muted'
              }`}
            >
              <Landmark size={16} /> Withdraw
            </button>
          </div>
        </div>
        {balance < WITHDRAWAL_MIN && (
          <p className="mt-4 text-xs text-text-muted">
            Withdrawals unlock at <span className="font-semibold text-text-main">{money(WITHDRAWAL_MIN)}</span> — {money(WITHDRAWAL_MIN - balance)} to go. Payouts via MoneyGram or Western Union.
          </p>
        )}
      </div>

      {/* ── Quick actions ──────────────────────────────────────────── */}
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <QuickAction to="/start" icon={<BookOpen size={20} />} title="Tutorial" desc="Learn dataset curation" />
        <QuickAction to="/submit" icon={<UploadCloud size={20} />} title="Submit Dataset" desc="Earn $50–$100 per dataset" accent />
        <QuickAction to="/forum" icon={<MessagesSquare size={20} />} title="Forum" desc="Find jobs, pick projects & connect" />
      </div>

      {/* ── Referral program ───────────────────────────────────────── */}
      <ReferralCard profile={profile} wallet={wallet} />

      {/* ── Dataset monitor ────────────────────────────────────────── */}
      <DatasetMonitor submissions={submissions} />

      {/* ── Forum activity ─────────────────────────────────────────── */}
      <div className="mb-6 grid grid-cols-2 gap-4">
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

      {/* ── Modals ─────────────────────────────────────────────────── */}
      {showTxModal && wallet && (
        <TransactionsModal wallet={wallet} onClose={() => setShowTxModal(false)} />
      )}
      {showWithdrawModal && (
        <WithdrawModal balance={balance} profile={profile} onClose={() => setShowWithdrawModal(false)} />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Agiel 24h countdown banner (new members who haven't submitted yet)
// ---------------------------------------------------------------------------

function AgielCountdownBanner({ profile, badges }: { profile: UserRow | null; badges: UserBadge[] }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!profile) return null;
  // Only for new members who haven't submitted their first dataset yet
  // and haven't already earned the badge.
  if (profile.first_dataset_at != null) return null;
  if (badges.some((b) => b.badge_type === 'agiel')) return null;

  const deadline = new Date(profile.created_at).getTime() + AGIEL_WINDOW_HOURS * 3600 * 1000;
  const remaining = deadline - now;
  if (remaining <= 0) return null;

  const h = Math.floor(remaining / 3600000);
  const m = Math.floor((remaining % 3600000) / 60000);
  const s = Math.floor((remaining % 60000) / 1000);
  const pad = (n: number) => String(n).padStart(2, '0');
  const urgent = remaining < 4 * 3600 * 1000;

  return (
    <div
      className={`mb-6 overflow-hidden rounded-2xl border p-6 ${
        urgent
          ? 'border-red-500/40 bg-gradient-to-r from-red-500/15 via-red-500/5 to-transparent'
          : 'border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
            <Zap size={14} /> New member bonus — ends soon
          </p>
          <p className="mt-2 text-lg font-bold leading-snug text-text-main sm:text-xl">
            Submit your first dataset within{' '}
            <span className={urgent ? 'text-red-400' : 'text-amber-400'}>
              {pad(h)}:{pad(m)}:{pad(s)}
            </span>{' '}
            and earn an extra <span className="text-emerald-400">${AGIEL_BONUS}</span>
          </p>
          <p className="mt-1.5 text-sm text-text-muted">
            Plus the exclusive <span className="font-semibold text-amber-400">⚡ Agiel Member badge</span> on your
            profile. One dataset is all it takes — this offer is only for your first{' '}
            {AGIEL_WINDOW_HOURS} hours.
          </p>
        </div>
        <Link to="/submit" className="no-underline shrink-0">
          <Button>
            <UploadCloud size={15} className="mr-1.5" /> Submit & claim $100
          </Button>
        </Link>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Quick actions
// ---------------------------------------------------------------------------

function QuickAction({
  to,
  icon,
  title,
  desc,
  accent,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  accent?: boolean;
}) {
  return (
    <Link
      to={to}
      className={`group flex items-center gap-4 rounded-xl border p-4 no-underline transition-all hover:-translate-y-0.5 ${
        accent
          ? 'border-primary/40 bg-primary/10 hover:border-primary/70'
          : 'border-border bg-surface hover:border-primary/40'
      }`}
    >
      <span className={`flex h-11 w-11 items-center justify-center rounded-lg ${accent ? 'bg-primary text-white' : 'bg-primary/10 text-primary'}`}>
        {icon}
      </span>
      <span>
        <span className="block font-semibold text-text-main">{title}</span>
        <span className="block text-xs text-text-muted">{desc}</span>
      </span>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Referral card
// ---------------------------------------------------------------------------

function ReferralCard({ profile, wallet }: { profile: UserRow | null; wallet: WalletOverview | null }) {
  const [copied, setCopied] = useState<'code' | 'link' | null>(null);

  const code = profile?.referral_code ?? '';
  const link = code ? `${window.location.origin}/signup?ref=${code}` : '';
  const completed = profile?.referral_count ?? 0;
  const milestonePaid = profile?.referral_milestone_paid ?? false;
  const referralMoney = (wallet?.referralEarnings ?? 0) + (wallet?.milestoneBonus ?? 0);

  const copy = async (what: 'code' | 'link') => {
    try {
      await navigator.clipboard.writeText(what === 'code' ? code : link);
      setCopied(what);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="mb-6 rounded-2xl border border-border bg-surface p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-text-main">
          <Users size={18} className="text-primary" /> Referral Program
        </h2>
        {milestonePaid ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
            <Trophy size={13} /> {money(REFERRAL_MILESTONE_BONUS)} milestone bonus earned
          </span>
        ) : (
          <span className="text-xs text-text-muted">
            {completed}/{REFERRAL_MILESTONE_TARGET} completed → one-time {money(REFERRAL_MILESTONE_BONUS)} bonus
          </span>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Left: code + link */}
        <div className="space-y-3">
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-text-muted">Your referral code</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded-lg border border-border bg-bg px-4 py-2.5 font-mono text-lg font-bold tracking-widest text-primary">
                {code || '—'}
              </code>
              <button
                onClick={() => copy('code')}
                className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-surface text-text-muted transition-colors hover:border-primary/50 hover:text-primary"
                title="Copy code"
              >
                {copied === 'code' ? <Check size={17} className="text-emerald-400" /> : <Copy size={17} />}
              </button>
            </div>
          </div>
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-text-muted">Your invite link</p>
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={link}
                onFocus={(e) => e.target.select()}
                className="min-w-0 flex-1 truncate rounded-lg border border-border bg-bg px-4 py-2.5 text-sm text-text-muted outline-none"
              />
              <button
                onClick={() => copy('link')}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-text-muted transition-colors hover:border-primary/50 hover:text-primary"
                title="Copy link"
              >
                {copied === 'link' ? <Check size={17} className="text-emerald-400" /> : <Copy size={17} />}
              </button>
            </div>
          </div>
        </div>

        {/* Right: progress + earnings */}
        <div className="rounded-xl border border-border bg-bg p-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-semibold text-text-main">
              {completed} completed referral{completed === 1 ? '' : 's'}
            </span>
            <span className="font-bold text-emerald-400">{money(referralMoney)} earned</span>
          </div>
          {/* Milestone segments: 10 blocks */}
          <div className="mb-3 flex gap-1.5">
            {Array.from({ length: REFERRAL_MILESTONE_TARGET }).map((_, i) => (
              <span
                key={i}
                className={`h-2.5 flex-1 rounded-full ${
                  i < completed ? 'bg-primary' : 'bg-border'
                }`}
              />
            ))}
          </div>
          <p className="flex items-start gap-1.5 text-xs leading-relaxed text-text-muted">
            <Info size={13} className="mt-0.5 shrink-0 text-primary" />
            Earn {money(REFERRAL_REWARD)} each time someone you invite submits their first dataset.
            At {REFERRAL_MILESTONE_TARGET} referrals you unlock a one-time {money(REFERRAL_MILESTONE_BONUS)} bonus — credited straight to your wallet.
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Dataset monitor
// ---------------------------------------------------------------------------

const STATUS_META: Record<SubmissionStatus, { label: string; cls: string }> = {
  pending: { label: 'Pending', cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  under_review: { label: 'Under Review', cls: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  approved: { label: 'Approved', cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  rejected: { label: 'Rejected', cls: 'bg-red-500/10 text-red-400 border-red-500/20' },
  needs_revision: { label: 'Needs Revision', cls: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
};

function DatasetMonitor({ submissions }: { submissions: CuratorSubmission[] }) {
  const stats = {
    total: submissions.length,
    pending: submissions.filter((s) => s.status === 'pending' || s.status === 'under_review').length,
    approved: submissions.filter((s) => s.status === 'approved').length,
    earned: submissions
      .filter((s) => s.status === 'approved')
      .reduce((sum, s) => sum + (Number(s.proposed_price) || 0), 0),
    pipeline: submissions
      .filter((s) => s.status === 'pending' || s.status === 'under_review')
      .reduce((sum, s) => sum + calculatePayment(s.entry_count), 0),
  };

  const openFile = async (path: string) => {
    const url = await getSignedUrl(path);
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="mb-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-text-main">
          <Database size={18} className="text-primary" /> Dataset Earnings
        </h2>
        <Link to="/submit" className="no-underline">
          <Button size="sm">+ New submission</Button>
        </Link>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MiniStat label="Total submitted" value={stats.total} tone="text-text-main" />
        <MiniStat label="In review" value={stats.pending} tone="text-amber-400" />
        <MiniStat label="Approved" value={stats.approved} tone="text-emerald-400" />
        <MiniStat label="Pipeline value" value={money(stats.pipeline)} tone="text-primary" />
      </div>

      {submissions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-surface/50 p-8 text-center">
          <Database size={26} className="mx-auto mb-2 text-text-muted opacity-50" />
          <p className="text-sm text-text-muted">You haven't submitted any datasets yet.</p>
          <p className="mt-1 text-xs text-text-muted">Approved datasets earn $50–$100 based on entry count.</p>
          <Link to="/submit" className="no-underline">
            <Button size="sm" className="mt-3">
              Submit your first dataset →
            </Button>
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <div className="divide-y divide-border">
            {submissions.map((s) => {
              const meta = STATUS_META[s.status];
              const inReview = s.status === 'pending' || s.status === 'under_review';
              const daysInReview = inReview
                ? Math.floor((Date.now() - new Date(s.created_at).getTime()) / 86400000)
                : 0;
              return (
                <div key={s.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3.5">
                  <span className="text-xl">{categoryEmoji(s.category)}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-text-main">{s.title}</p>
                    <p className="truncate text-xs text-text-muted">
                      {categoryLabel(s.category, s.custom_category)}
                      {s.format ? ` · ${s.format.toUpperCase()}` : ''}
                      {s.entry_count ? ` · ${s.entry_count.toLocaleString()} entries` : ''}
                      {' · '}
                      {new Date(s.created_at).toLocaleDateString()}
                    </p>
                    {s.admin_notes && s.status !== 'pending' && (
                      <p className="mt-1 line-clamp-2 text-xs italic text-text-muted">“{s.admin_notes}”</p>
                    )}
                    {s.status === 'rejected' && s.rejection_reason === 'structure' && (
                      <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-red-400">
                        <AlertTriangle size={12} /> The structure doesn’t align — re-format using the unique dataset
                        structure, then submit again.
                      </p>
                    )}
                    {inReview && daysInReview >= 5 && (
                      <p className="mt-1 text-xs text-blue-400">
                        Auto-approves after 8 days in review{daysInReview >= 5 ? ` (${daysInReview}/8)` : ''}
                      </p>
                    )}
                  </div>

                  {s.status === 'approved' && s.proposed_price != null && (
                    <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 px-2.5 py-1 text-sm font-bold text-emerald-400">
                      <DollarSign size={13} /> {Number(s.proposed_price).toLocaleString()}
                    </span>
                  )}
                  {inReview && (
                    <span
                      className="text-xs font-medium text-text-muted"
                      title="Estimated payout at approval"
                    >
                      est. {money(calculatePayment(s.entry_count))}
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

function MiniStat({ label, value, tone }: { label: string; value: string | number; tone: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className={`text-2xl font-bold ${tone}`}>{value}</p>
      <p className="text-xs text-text-muted">{label}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Transactions modal
// ---------------------------------------------------------------------------

const TX_FILTERS: { key: WalletTransactionType | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'dataset_earning', label: 'Datasets' },
  { key: 'referral_earning', label: 'Referrals' },
  { key: 'milestone_bonus', label: 'Milestones' },
];

function TransactionsModal({ wallet, onClose }: { wallet: WalletOverview; onClose: () => void }) {
  const [filter, setFilter] = useState<WalletTransactionType | 'all'>('all');
  const rows = filter === 'all' ? wallet.transactions : wallet.transactions.filter((t) => t.transaction_type === filter);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[88vh] w-full max-w-2xl overflow-hidden rounded-t-2xl border border-border bg-surface sm:rounded-2xl"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h3 className="font-bold text-text-main">Wallet Transactions</h3>
            <p className="text-xs text-text-muted">Balance {money(wallet.balance)} · Lifetime {money(wallet.lifetimeEarnings)}</p>
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-text-muted hover:bg-surface-lighter hover:text-text-main">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-border px-5 py-3">
          {TX_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === f.key
                  ? 'border-primary/60 bg-primary/10 text-primary'
                  : 'border-border text-text-muted hover:text-text-main'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="max-h-[55vh] overflow-y-auto">
          {rows.length === 0 ? (
            <p className="px-5 py-12 text-center text-sm text-text-muted">No transactions yet — submit a dataset to start earning.</p>
          ) : (
            <div className="divide-y divide-border">
              {rows.map((t) => {
                const positive = Number(t.amount) >= 0;
                return (
                  <div key={t.id} className="flex items-center gap-4 px-5 py-3.5">
                    <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${positive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                      <DollarSign size={16} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-text-main">{TX_LABELS[t.transaction_type]}</p>
                      <p className="truncate text-xs text-text-muted">
                        {t.description || '—'} · {new Date(t.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${positive ? 'text-emerald-400' : 'text-red-400'}`}>
                        {positive ? '+' : ''}
                        {money(Number(t.amount))}
                      </p>
                      <p className="text-xs text-text-muted">bal {money(Number(t.balance_after))}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Withdraw modal (real payout request — MoneyGram / Western Union)
// ---------------------------------------------------------------------------

function WithdrawModal({ balance, profile, onClose }: { balance: number; profile: UserRow | null; onClose: () => void }) {
  const eligible = balance >= WITHDRAWAL_MIN;
  const savedDetails = profile?.payout_details;
  const savedMethod = profile?.payout_method ?? null;
  const hasSavedDetails =
    !!(savedDetails?.name && savedDetails?.phone && savedDetails?.address) && !!savedMethod;

  const [amount, setAmount] = useState(balance >= WITHDRAWAL_MIN ? String(balance) : '');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [detailsRefresh, setDetailsRefresh] = useState(0);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError('');
    const n = Number(amount);
    if (!n || n <= 0) return setError('Enter an amount to withdraw.');
    if (n > balance) return setError(`You can withdraw at most ${money(balance)}.`);
    if (n < WITHDRAWAL_MIN) return setError(`Minimum withdrawal is ${money(WITHDRAWAL_MIN)}.`);
    // Re-read saved details (may have just been saved in this modal)
    const fresh = await import('../services/payoutService').then((m) => m.getPayoutProfile());
    if (!fresh?.payout_method || !fresh.payout_details?.name) {
      return setError('Fill in your payout details below first.');
    }

    setSubmitting(true);
    try {
      const id = await createWithdrawalRequest(n);
      setRequestId(id);
    } catch (err: any) {
      setError(err?.message || 'Could not create your withdrawal request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-2xl border border-border bg-surface sm:rounded-2xl"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h3 className="font-bold text-text-main">Withdraw Earnings</h3>
          <button onClick={onClose} className="rounded-md p-1 text-text-muted hover:bg-surface-lighter hover:text-text-main">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 p-5">
          {requestId ? (
            <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-5 text-center">
              <Check size={28} className="mx-auto text-emerald-400" />
              <p className="mt-2 font-semibold text-emerald-400">Withdrawal request submitted</p>
              <p className="mt-1.5 text-sm text-text-muted">
                {money(Number(amount))} is on its way to your {savedMethod === 'moneygram' ? 'MoneyGram' : 'Western Union'}{' '}
                pickup point. Processing takes 3–5 business days — the status updates in your transactions.
              </p>
              <button
                onClick={onClose}
                className="mt-4 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              <div className="rounded-xl border border-border bg-bg p-4 text-center">
                <p className="text-xs uppercase tracking-wider text-text-muted">Available balance</p>
                <p className="mt-1 text-3xl font-extrabold text-text-main">{money(balance)}</p>
                {eligible ? (
                  <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                    <Check size={12} /> Eligible for withdrawal
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-text-muted">
                    {money(WITHDRAWAL_MIN - balance)} more to reach the {money(WITHDRAWAL_MIN)} minimum
                  </p>
                )}
              </div>

              {eligible && (
                <form onSubmit={submit} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-text-main">Amount (USD)</label>
                    <input
                      type="number"
                      min={WITHDRAWAL_MIN}
                      max={balance}
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text-main outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                    />
                    <p className="mt-1 text-xs text-text-muted">
                      Minimum {money(WITHDRAWAL_MIN)} · up to {money(balance)} available
                    </p>
                  </div>

                  {error && <p className="text-sm text-red-400">{error}</p>}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={15} className="animate-spin" /> Submitting…
                      </>
                    ) : (
                      'Request payout'
                    )}
                  </button>
                </form>
              )}

              {/* Payout details — always visible/editable while requesting */}
              {eligible && (
                <details className="rounded-xl border border-border bg-bg p-4" open={!hasSavedDetails} key={detailsRefresh}>
                  <summary className="cursor-pointer text-sm font-semibold text-text-main">
                    {hasSavedDetails ? 'Payout details (saved — tap to edit)' : 'Payout details — required before withdrawing'}
                  </summary>
                  <div className="mt-4">
                    <PayoutDetailsForm
                      compact
                      initialMethod={savedMethod}
                      initialDetails={savedDetails}
                      submitLabel="Update payout details"
                      onSaved={() => setDetailsRefresh((k) => k + 1)}
                    />
                  </div>
                </details>
              )}

              <div className="space-y-1.5 rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs text-text-muted">
                <p>• Payouts are sent via MoneyGram or Western Union to the recipient details above.</p>
                <p>• Processing time: 3–5 business days after your request.</p>
                <p>• The requested amount leaves your wallet immediately and appears in your transactions.</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
