import { Link } from 'react-router-dom';
import {
  Users,
  Gift,
  DollarSign,
  Infinity as InfinityIcon,
  Share2,
  UserPlus,
  FileUp,
  Wallet,
  Trophy,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import Reveal from '../components/start/Reveal';
import { REFERRAL_REWARD, REFERRAL_MILESTONE_TARGET, REFERRAL_MILESTONE_BONUS, WITHDRAWAL_MIN } from '../types';

const money = (n: number) => `$${Number(n).toLocaleString()}`;

/** How the numbers add up at a given number of completed referrals. */
const EXAMPLES = [
  { referrals: 10, milestones: 1 },
  { referrals: 20, milestones: 2 },
  { referrals: 30, milestones: 3 },
  { referrals: 50, milestones: 5 },
  { referrals: 100, milestones: 10 },
];

const STEPS = [
  {
    icon: Share2,
    title: '1. Share your link',
    desc: 'Grab your unique referral code and invite link from the Referral section of your dashboard.',
  },
  {
    icon: UserPlus,
    title: '2. Your friend joins',
    desc: 'They sign up through your link (or apply your code during sign-up) — attribution is automatic.',
  },
  {
    icon: FileUp,
    title: '3. They submit a dataset',
    desc: `Your reward lands as soon as they submit their first dataset. That referral is now "completed".`,
  },
  {
    icon: Wallet,
    title: '4. You get paid',
    desc: `${money(REFERRAL_REWARD)} per completed referral, credited to your wallet instantly — plus milestone bonuses.`,
  },
];

export default function ReferralPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <Reveal>
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Users size={26} />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-text-main sm:text-5xl">
            Referral Program
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-text-muted">
            Invite friends to curate datasets and earn{' '}
            <span className="font-semibold text-text-main">{money(REFERRAL_REWARD)} per referral</span> plus a{' '}
            <span className="font-semibold text-primary">{money(REFERRAL_MILESTONE_BONUS)} bonus for every {REFERRAL_MILESTONE_TARGET}</span>{' '}
            completed referrals — with no limit.
          </p>
        </div>
      </Reveal>

      {/* ── Headline stats ───────────────────────────────────────── */}
      <Reveal y={10}>
        <div className="mb-12 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-surface p-6 text-center">
            <DollarSign size={22} className="mx-auto text-primary" />
            <p className="mt-2 text-3xl font-extrabold text-text-main">{money(REFERRAL_REWARD)}</p>
            <p className="mt-1 text-xs text-text-muted">per completed referral</p>
          </div>
          <div className="rounded-2xl border border-primary/30 bg-primary/10 p-6 text-center">
            <Gift size={22} className="mx-auto text-primary" />
            <p className="mt-2 text-3xl font-extrabold text-primary">{money(REFERRAL_MILESTONE_BONUS)}</p>
            <p className="mt-1 text-xs text-text-muted">bonus every {REFERRAL_MILESTONE_TARGET} referrals</p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-6 text-center">
            <InfinityIcon size={22} className="mx-auto text-primary" />
            <p className="mt-2 text-3xl font-extrabold text-text-main">Unlimited</p>
            <p className="mt-1 text-xs text-text-muted">no cap on referrals or milestones</p>
          </div>
        </div>
      </Reveal>

      {/* ── How it works ─────────────────────────────────────────── */}
      <Reveal y={10}>
        <h2 className="mb-6 text-2xl font-bold text-text-main">How it works</h2>
        <div className="mb-12 grid gap-4 sm:grid-cols-2">
          {STEPS.map((s) => (
            <div key={s.title} className="flex items-start gap-4 rounded-2xl border border-border bg-surface p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <s.icon size={18} />
              </span>
              <div>
                <h3 className="font-semibold text-text-main">{s.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-text-muted">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* ── Milestone rewards ────────────────────────────────────── */}
      <Reveal y={10}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-2xl font-bold text-text-main">Milestone rewards</h2>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
            <Trophy size={13} /> repeats forever
          </span>
        </div>
        <p className="mb-6 text-sm leading-relaxed text-text-muted">
          Every time your <strong className="text-text-main">completed</strong> referrals cross a multiple of{' '}
          {REFERRAL_MILESTONE_TARGET} ({REFERRAL_MILESTONE_TARGET}, {REFERRAL_MILESTONE_TARGET * 2}, {REFERRAL_MILESTONE_TARGET * 3} …), a{' '}
          {money(REFERRAL_MILESTONE_BONUS)} milestone bonus is credited straight to your wallet — automatically, with no limit
          on how many times you can earn it.
        </p>
        <div className="mb-12 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface text-left text-xs uppercase tracking-wider text-text-muted">
                <th scope="col" className="px-5 py-3 font-semibold">Completed referrals</th>
                <th scope="col" className="px-5 py-3 font-semibold">Referral rewards</th>
                <th scope="col" className="px-5 py-3 font-semibold">Milestone bonuses</th>
                <th scope="col" className="px-5 py-3 text-right font-semibold">Total referral earnings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-bg">
              {EXAMPLES.map((e) => {
                const rewards = e.referrals * REFERRAL_REWARD;
                const bonuses = e.milestones * REFERRAL_MILESTONE_BONUS;
                return (
                  <tr key={e.referrals} className={e.referrals === 100 ? 'font-semibold' : ''}>
                    <td className="px-5 py-3 text-text-main">{e.referrals}</td>
                    <td className="px-5 py-3 text-text-muted">{money(rewards)}</td>
                    <td className="px-5 py-3 text-text-muted">
                      {e.milestones} × {money(REFERRAL_MILESTONE_BONUS)} = {money(bonuses)}
                    </td>
                    <td className="px-5 py-3 text-right font-bold text-emerald-400">{money(rewards + bonuses)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Reveal>

      {/* ── Rules ────────────────────────────────────────────────── */}
      <Reveal y={10}>
        <h2 className="mb-6 text-2xl font-bold text-text-main">Rules & eligibility</h2>
        <div className="mb-12 space-y-3 rounded-2xl border border-border bg-surface p-6">
          {[
            `A referral counts as "completed" when the person you invited submits their first dataset — the ${money(REFERRAL_REWARD)} reward is credited automatically at that moment.`,
            `Milestone bonuses are calculated on completed referrals only, and are paid for every multiple of ${REFERRAL_MILESTONE_TARGET} — 10, 20, 30 and beyond.`,
            'Each person can only be referred once, and you cannot refer yourself.',
            'Your referral code never expires — share it with as many people as you like.',
            `All rewards land in your dashboard wallet. Withdrawals unlock at ${money(WITHDRAWAL_MIN)} and are paid via MoneyGram or Western Union within 3–5 business days.`,
          ].map((rule, i) => (
            <p key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-text-muted">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              {rule}
            </p>
          ))}
        </div>
      </Reveal>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <Reveal>
        <div className="rounded-2xl border border-border bg-surface p-6 text-center">
          <p className="text-text-muted">Ready to start earning?</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              Get your referral link <ArrowRight size={15} />
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-lighter px-5 py-2.5 text-sm font-semibold text-text-main transition-colors hover:bg-surface"
            >
              Create an account
            </Link>
            <Link
              to="/faq"
              className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
            >
              <HelpCircle size={15} /> More FAQs
            </Link>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
