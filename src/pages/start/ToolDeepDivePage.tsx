import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';
import { TOOL_DEEP_DIVES, getToolBySlug } from '../../content/tutorial';
import Reveal from '../../components/start/Reveal';
import StepCard from '../../components/start/StepCard';
import ProsConsSplit from '../../components/start/ProsConsSplit';

export default function ToolDeepDivePage() {
  const { tool } = useParams();
  const data = getToolBySlug(tool);
  if (!data) return <Navigate to="/start" replace />;

  const accent = data.accent;
  const idx = TOOL_DEEP_DIVES.findIndex((t) => t.slug === data.slug);
  const prev = TOOL_DEEP_DIVES[idx - 1];
  const next = TOOL_DEEP_DIVES[idx + 1];

  return (
    <div className="relative">
      {/* glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px]"
        style={{ background: `radial-gradient(50% 60% at 50% 0%, ${accent}1a, transparent 70%)` }}
      />

      {/* ── Hero ── */}
      <header className="relative mx-auto max-w-3xl px-6 pt-20 pb-10 text-center">
        <Reveal>
          <Link
            to="/start"
            className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-text-muted transition-colors hover:text-text-main"
          >
            <ArrowLeft size={15} /> Back to Pipeline
          </Link>
          <div className="mb-5 text-6xl">{data.emoji}</div>
          <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>
            {data.role}
          </p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-text-main sm:text-5xl">{data.name}</h1>
          <p className="mt-3 text-lg italic text-text-muted">{data.tagline}</p>
          <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-text-muted">{data.intro}</p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-text-muted">
            Primary stages: <span style={{ color: accent }}>{data.primaryStages}</span>
          </div>
        </Reveal>
      </header>

      {/* ── Setup ── */}
      <section className="mx-auto max-w-3xl px-6 py-12">
        <Reveal>
          <h2 className="mb-6 text-2xl font-bold text-text-main">
            {data.setup.title || 'Setup'}
          </h2>
        </Reveal>
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
      <section className="mx-auto max-w-3xl px-6 py-12">
        <Reveal>
          <h2 className="mb-6 text-2xl font-bold text-text-main">
            {data.usage.title || 'How to use it'}
          </h2>
        </Reveal>
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
      <section className="mx-auto max-w-3xl px-6 py-12">
        <Reveal>
          <h2 className="mb-2 text-2xl font-bold text-text-main">{data.pricing.title || 'Pricing'}</h2>
          {data.pricing.trial && (
            <p className="mb-6 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text-muted">
              <span className="font-semibold" style={{ color: accent }}>
                Trial:
              </span>{' '}
              {data.pricing.trial}
            </p>
          )}
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2">
          {data.pricing.cards.map((c, i) => (
            <Reveal key={c.label} delay={i * 0.08}>
              <div
                className="h-full rounded-2xl border bg-surface p-6"
                style={{ borderColor: c.highlight ? `${accent}55` : 'var(--color-border)' }}
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">{c.label}</p>
                <p className="mt-2 text-3xl font-extrabold" style={{ color: c.highlight ? accent : 'var(--color-text-main)' }}>
                  {c.value}
                </p>
                {c.note && <p className="mt-1 text-sm text-text-muted">{c.note}</p>}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Pros / Cons ── */}
      <section className="mx-auto max-w-3xl px-6 py-12">
        <Reveal>
          <h2 className="mb-6 text-2xl font-bold text-text-main">The trade-offs</h2>
        </Reveal>
        <ProsConsSplit pros={data.pros} cons={data.cons} />
      </section>

      {/* ── Summary table ── */}
      <section className="mx-auto max-w-3xl px-6 py-12">
        <Reveal>
          <h2 className="mb-6 text-2xl font-bold text-text-main">Summary</h2>
        </Reveal>
        <Reveal delay={0.05}>
          <div className="overflow-hidden rounded-xl border border-border bg-surface">
            <table className="w-full text-left text-sm">
              <thead>
                <tr style={{ background: `${accent}12` }}>
                  <th className="px-5 py-3 font-bold text-text-main">{data.summaryHeaders[0]}</th>
                  {data.summaryHeaders.slice(1).map((h) => (
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
      <section className="mx-auto max-w-3xl px-6 py-12">
        <Reveal>
          <div className="rounded-2xl border p-8" style={{ borderColor: `${accent}33`, background: `${accent}0a` }}>
            <Quote size={28} style={{ color: accent }} />
            <p className="mt-3 text-lg font-medium leading-relaxed text-text-main">
              <span className="font-bold" style={{ color: accent }}>
                The Bottom Line.{' '}
              </span>
              {data.bottomLine}
            </p>
          </div>
        </Reveal>
      </section>

      {/* ── Prev / Next ── */}
      <nav className="mx-auto max-w-3xl px-6 pb-20">
        <div className="grid gap-4 sm:grid-cols-2">
          {prev ? (
            <Link
              to={`/start/${prev.slug}`}
              className="group flex items-center gap-3 rounded-xl border border-border bg-surface p-4 transition-colors hover:bg-surface-lighter"
            >
              <ArrowLeft size={18} className="text-text-muted transition-transform group-hover:-translate-x-1" />
              <span>
                <span className="block text-xs text-text-muted">Previous</span>
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
              <ArrowRight size={18} style={{ color: next.accent }} className="transition-transform group-hover:translate-x-1" />
            </Link>
          ) : (
            <Link
              to="/submit"
              className="group flex items-center justify-end gap-3 rounded-xl border border-primary/40 bg-primary/10 p-4 text-right transition-colors hover:bg-primary/15"
            >
              <span>
                <span className="block text-xs text-text-muted">You're ready</span>
                <span className="font-semibold text-primary">Submit a dataset →</span>
              </span>
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
