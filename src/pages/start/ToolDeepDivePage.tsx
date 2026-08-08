import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Database, Quote, Check, X } from 'lucide-react';
import { TOOL_DEEP_DIVES, getToolBySlug } from '../../content/tutorial';
import Reveal from '../../components/start/Reveal';
import StepCard from '../../components/start/StepCard';

function SectionTitle({ children, accent }: { children: React.ReactNode; accent: string }) {
  return (
    <Reveal>
      <div className="mb-6 flex items-center gap-3">
        <span className="h-5 w-1 rounded-full" style={{ background: accent }} />
        <h2 className="text-2xl font-bold text-text-main">{children}</h2>
      </div>
    </Reveal>
  );
}

export default function ToolDeepDivePage() {
  const { tool } = useParams();
  const data = getToolBySlug(tool);
  if (!data) return <Navigate to="/start" replace />;

  const accent = data.accent;
  const idx = TOOL_DEEP_DIVES.findIndex((t) => t.slug === data.slug);
  const prev = TOOL_DEEP_DIVES[idx - 1];
  const next = TOOL_DEEP_DIVES[idx + 1];
  const stepNum = idx + 1;

  return (
    <div className="relative">
      {/* glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px]"
        style={{ background: `radial-gradient(50% 60% at 50% 0%, ${accent}1a, transparent 70%)` }}
      />

      {/* ── Hero ── */}
      <header className="relative mx-auto max-w-3xl px-6 pt-20 pb-8 text-center">
        <Reveal>
          <Link
            to="/start"
            className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-text-muted transition-colors hover:text-text-main"
          >
            <ArrowLeft size={15} /> Back to the pipeline
          </Link>
          <div className="mb-5 text-6xl">{data.emoji}</div>
          <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>
            {data.role}
          </p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-text-main sm:text-5xl">
            {data.name}
          </h1>
          <p className="mt-3 text-lg italic text-text-muted">{data.tagline}</p>
          <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-text-muted">{data.intro}</p>
          <div
            className="mt-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium text-text-muted"
            style={{ borderColor: `${accent}44`, background: `${accent}0a` }}
          >
            Best for: <span style={{ color: accent }}>{data.bestFor}</span>
          </div>
        </Reveal>
      </header>

      {/* ── Setup ── */}
      <section className="mx-auto max-w-3xl px-6 py-10">
        <SectionTitle accent={accent}>{data.setup.title}</SectionTitle>
        <div className="space-y-4">
          {data.setup.steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.06}>
              <StepCard index={i + 1} title={s.title} accent={accent}>
                {s.body}
              </StepCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── How to use ── */}
      <section className="mx-auto max-w-3xl px-6 py-10">
        <SectionTitle accent={accent}>{data.usage.title}</SectionTitle>
        <div className="space-y-4">
          {data.usage.steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.06}>
              <StepCard index={i + 1} title={s.title} accent={accent}>
                {s.body}
              </StepCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="mx-auto max-w-3xl px-6 py-10">
        <SectionTitle accent={accent}>Pricing & trial</SectionTitle>
        {data.pricing.trialNote && (
          <Reveal>
            <p className="mb-6 rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text-muted">
              <span className="font-semibold" style={{ color: accent }}>
                Trial.{' '}
              </span>
              {data.pricing.trialNote}
            </p>
          </Reveal>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          {data.pricing.cards.map((c, i) => (
            <Reveal key={c.label} delay={i * 0.08}>
              <div
                className="h-full rounded-2xl border bg-surface p-6"
                style={{ borderColor: `${accent}33` }}
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  {c.label}
                </p>
                <p className="mt-2 text-3xl font-extrabold text-text-main">{c.value}</p>
                {c.note && <p className="mt-1 text-sm text-text-muted">{c.note}</p>}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Can do / Can't do ── */}
      <section className="mx-auto max-w-3xl px-6 py-10">
        <SectionTitle accent={accent}>What you can & can't do</SectionTitle>
        <div className="grid gap-4 md:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-6">
              <h4 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-emerald-400">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15">
                  <Check size={14} />
                </span>
                What you can do
              </h4>
              <ul className="space-y-3">
                {data.canDo.map((c, i) => (
                  <li key={i} className="flex gap-2.5 text-sm text-text-main">
                    <Check size={16} className="mt-0.5 shrink-0 text-emerald-400" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="h-full rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-6">
              <h4 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-red-400">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/15">
                  <X size={14} />
                </span>
                Limitations
              </h4>
              <ul className="space-y-3">
                {data.cantDo.map((c, i) => (
                  <li key={i} className="flex gap-2.5 text-sm text-text-main">
                    <X size={16} className="mt-0.5 shrink-0 text-red-400" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Summary table ── */}
      <section className="mx-auto max-w-3xl px-6 py-10">
        <SectionTitle accent={accent}>Summary</SectionTitle>
        <Reveal>
          <div className="overflow-hidden rounded-xl border border-border bg-surface">
            <table className="w-full text-left text-sm">
              <thead>
                <tr style={{ background: `${accent}12` }}>
                  {data.summaryHeaders.map((h) => (
                    <th key={h} className="px-5 py-3 font-bold text-text-main">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.summary.map((row) => (
                  <tr key={row.feature} className="border-t border-border">
                    <td className="px-5 py-3 font-semibold text-text-main">{row.feature}</td>
                    {row.cols.map((cell, j) => (
                      <td key={j} className="px-5 py-3 text-text-muted">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </section>

      {/* ── Bottom line ── */}
      <section className="mx-auto max-w-3xl px-6 py-10">
        <Reveal>
          <div
            className="rounded-2xl border p-8"
            style={{ borderColor: `${accent}33`, background: `${accent}0a` }}
          >
            <Quote size={28} style={{ color: accent }} />
            <p className="mt-3 text-lg font-medium leading-relaxed text-text-main">
              <span className="font-bold" style={{ color: accent }}>
                The bottom line.{' '}
              </span>
              {data.bottomLine}
            </p>
          </div>
        </Reveal>
      </section>

      {/* ── Prev / Next ── */}
      <nav className="mx-auto max-w-3xl px-6 pb-20">
        <div className="mb-4 text-center text-xs font-medium uppercase tracking-wider text-text-muted">
          Deep dive {stepNum} of {TOOL_DEEP_DIVES.length}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {prev ? (
            <Link
              to={`/start/${prev.slug}`}
              className="group flex items-center gap-3 rounded-xl border border-border bg-surface p-4 transition-colors hover:bg-surface-lighter"
            >
              <ArrowLeft size={18} className="shrink-0 text-text-muted transition-transform group-hover:-translate-x-1" />
              <span>
                <span className="block text-xs text-text-muted">Previous tool</span>
                <span className="font-semibold text-text-main">
                  {prev.emoji} {prev.name}
                </span>
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              to={`/start/${next.slug}`}
              className="group flex items-center justify-end gap-3 rounded-xl border p-4 text-right transition-colors"
              style={{ borderColor: `${next.accent}44`, background: `${next.accent}0a` }}
            >
              <span>
                <span className="block text-xs text-text-muted">Next tool</span>
                <span className="font-semibold text-text-main">
                  {next.emoji} {next.name}
                </span>
              </span>
              <ArrowRight
                size={18}
                style={{ color: next.accent }}
                className="shrink-0 transition-transform group-hover:translate-x-1"
              />
            </Link>
          ) : (
            <Link
              to="/submit"
              className="group flex items-center justify-end gap-3 rounded-xl border border-primary/40 bg-primary/10 p-4 text-right transition-colors hover:bg-primary/15"
            >
              <span>
                <span className="block text-xs text-text-muted">You're ready</span>
                <span className="inline-flex items-center gap-1 font-semibold text-primary">
                  <Database size={15} /> Submit a dataset
                </span>
              </span>
              <ArrowRight size={18} className="shrink-0 text-primary transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
