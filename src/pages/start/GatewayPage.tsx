import { motion, useScroll, useSpring } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, Database, Sparkles, Check, X } from 'lucide-react';
import {
  PIPELINE_STEPS,
  TOOL_DEEP_DIVES,
  type PipelineStep,
  type StepVisual,
  type LabelExample,
} from '../../content/tutorial';
import Reveal from '../../components/start/Reveal';
import CodeWindow from '../../components/start/CodeWindow';

// ---------------------------------------------------------------------------
// Step visual renderer — each kind gets its own colourful, scannable element.
// ---------------------------------------------------------------------------

function LabelChip({ ex }: { ex: LabelExample }) {
  const tone = {
    pos: { bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.3)', text: '#34d399' },
    neg: { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)', text: '#f87171' },
    neutral: { bg: 'rgba(161,161,170,0.12)', border: 'rgba(161,161,170,0.3)', text: '#a1a1aa' },
  }[ex.tone];
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3.5">
      <span className="min-w-0 flex-1 truncate font-mono text-sm text-text-main">"{ex.text}"</span>
      <span
        className="shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-bold"
        style={{ background: tone.bg, borderColor: tone.border, color: tone.text }}
      >
        {ex.label}
      </span>
    </div>
  );
}

function StepVisualBlock({ visual, accent }: { visual: StepVisual; accent: string }) {
  if (visual.kind === 'contrast') {
    const { pair } = visual;
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <Reveal>
          <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-400">
            <X size={13} /> {pair.beforeLabel}
          </p>
          <CodeWindow
            snippet={{ title: 'raw.txt', lang: 'text', code: pair.before }}
            label="raw.txt"
            tone="raw"
          />
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <Check size={13} /> {pair.afterLabel}
          </p>
          <CodeWindow
            snippet={{ title: 'clean.txt', lang: 'text', code: pair.after }}
            label="clean.txt"
            tone="clean"
            accent={accent}
          />
        </Reveal>
      </div>
    );
  }

  if (visual.kind === 'code') {
    return (
      <Reveal>
        <CodeWindow snippet={visual.snippet} accent={accent} />
      </Reveal>
    );
  }

  if (visual.kind === 'align') {
    return (
      <Reveal>
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <div className="grid grid-cols-2" style={{ background: `${accent}14` }}>
            {visual.headers.map((h) => (
              <div key={h} className="px-5 py-3 text-sm font-bold text-text-main">
                {h}
              </div>
            ))}
          </div>
          {visual.rows.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-2 border-t border-border text-sm"
              style={row.ok ? {} : { background: 'rgba(239,68,68,0.05)' }}
            >
              <div className="border-r border-border px-5 py-3 font-mono text-[13px] text-text-muted">
                {row.a}
              </div>
              <div className="flex items-center gap-2 px-5 py-3 font-mono text-[13px] text-text-muted">
                {row.b}
                {row.ok ? (
                  <Check size={14} className="shrink-0 text-emerald-400" />
                ) : (
                  <X size={14} className="shrink-0 text-red-400" />
                )}
              </div>
            </div>
          ))}
          <p className="border-t border-border px-5 py-3 text-xs italic text-text-muted">
            Red rows are bad matches — the AI would learn to translate incorrectly.
          </p>
        </div>
      </Reveal>
    );
  }

  // labels
  return (
    <div className="grid gap-3">
      {visual.examples.map((ex, i) => (
        <Reveal key={ex.text} delay={i * 0.08}>
          <LabelChip ex={ex} />
        </Reveal>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// One pipeline step section
// ---------------------------------------------------------------------------

function StepSection({ step, isLast }: { step: PipelineStep; isLast: boolean }) {
  return (
    <section id={step.id} className="relative scroll-mt-20 py-16">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: `radial-gradient(50% 35% at 50% 0%, ${step.accent}14, transparent 70%)` }}
      />
      <div className="relative mx-auto max-w-3xl px-6">
        {/* Header */}
        <Reveal>
          <div className="mb-7 flex items-center gap-4">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl"
              style={{ background: `${step.accent}1a`, border: `1px solid ${step.accent}33` }}
            >
              {step.emoji}
            </div>
            <div>
              <span
                className="font-mono text-xs font-bold uppercase tracking-[0.2em]"
                style={{ color: step.accent }}
              >
                Step {step.n}
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-text-main sm:text-4xl">
                {step.title}
              </h2>
            </div>
          </div>
        </Reveal>

        {/* Goal highlight */}
        <Reveal>
          <div
            className="mb-6 rounded-xl border-l-2 bg-surface py-3 pl-4 pr-5"
            style={{ borderColor: step.accent }}
          >
            <p className="text-sm">
              <span className="font-bold" style={{ color: step.accent }}>
                🎯 The Goal.{' '}
              </span>
              <span className="text-text-main">{step.goal}</span>
            </p>
          </div>
        </Reveal>

        {/* Intro */}
        <Reveal>
          <p className="mb-8 leading-relaxed text-text-muted">{step.intro}</p>
        </Reveal>

        {/* Visual */}
        <StepVisualBlock visual={step.visual} accent={step.accent} />

        {/* Insight closer */}
        {step.insight && (
          <Reveal>
            <p className="mt-6 text-sm italic text-text-muted">
              <Sparkles size={13} className="mr-1 inline" style={{ color: step.accent }} />
              {step.insight}
            </p>
          </Reveal>
        )}

        {/* Connector */}
        {!isLast && (
          <div className="mt-12 flex justify-center">
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              style={{ color: PIPELINE_STEPS[step.n]?.accent ?? step.accent }}
            >
              <ChevronDown size={22} />
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function GatewayPage() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  return (
    <div className="relative">
      {/* Slim top scroll-progress bar — a subtle "keep going" signal. */}
      <motion.div
        className="fixed left-0 top-0 z-50 h-0.5 w-full origin-left"
        style={{
          scaleX: progress,
          background: 'linear-gradient(90deg,#3b82f6,#a855f7,#22d3ee,#34d399)',
        }}
      />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative mx-auto flex min-h-[88vh] max-w-4xl flex-col items-center justify-center px-6 text-center">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(60% 50% at 50% 30%, rgba(59,130,246,0.16), transparent 70%), radial-gradient(40% 40% at 70% 70%, rgba(168,85,247,0.12), transparent 70%)',
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-4 py-1.5 text-xs font-medium text-text-muted backdrop-blur"
        >
          <Sparkles size={13} className="text-primary" />
          The Dataset Curation Tutorial
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="relative z-10 text-4xl font-extrabold leading-[1.08] tracking-tight text-text-main sm:text-5xl md:text-6xl"
        >
          Understanding AI
          <br />
          <span className="bg-gradient-to-r from-primary via-accent to-[#22d3ee] bg-clip-text text-transparent">
            Dataset Formatting
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative z-10 mt-6 max-w-2xl text-lg leading-relaxed text-text-muted"
        >
          Mastering how to create high-fidelity datasets at scale. No math genius or master
          programmer required — you just need to be the <span className="font-semibold text-text-main">Curator</span> who
          directs the tools.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="relative z-10 mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="#step-1"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-colors hover:bg-primary-dark"
          >
            Start the tutorial →
          </a>
          <Link
            to="/submit"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-6 py-3 text-sm font-semibold text-text-main transition-colors hover:bg-surface-lighter"
          >
            <Database size={16} /> Submit a dataset
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-1 text-text-muted"
          >
            <span className="text-[11px] uppercase tracking-[0.2em]">Scroll</span>
            <ChevronDown size={18} />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Intro ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-6 py-12">
        <Reveal>
          <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
            <p className="text-lg leading-relaxed text-text-muted sm:text-xl">
              Have you ever wondered how an AI recognises a cat in a photo? It isn't magic — it's{' '}
              <span className="font-semibold text-text-main">data.</span> AI models are like newborn
              babies: smart, but they know nothing. To make them smart we feed them massive amounts of
              information. But you can't just throw a pile of random internet text at them — it has to
              be <span className="font-semibold text-primary">clean, organised, and labelled.</span>
            </p>
            <p className="mt-4 text-lg leading-relaxed text-text-muted sm:text-xl">
              Here is the <span className="font-semibold text-text-main">4-step process</span>{' '}
              professionals use to build world-class datasets.
            </p>
          </div>
        </Reveal>

        {/* Quick-jump step chips */}
        <Reveal delay={0.1}>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {PIPELINE_STEPS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="group rounded-xl border border-border bg-surface p-3 transition-colors hover:border-[color:var(--ac)]"
                style={{ ['--ac' as string]: s.accent }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{s.emoji}</span>
                  <span className="font-mono text-xs font-bold" style={{ color: s.accent }}>
                    0{s.n}
                  </span>
                </div>
                <div className="mt-1 text-xs font-semibold text-text-main">{s.title}</div>
              </a>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── Steps ────────────────────────────────────────────── */}
      {PIPELINE_STEPS.map((step, i) => (
        <StepSection key={step.id} step={step} isLast={i === PIPELINE_STEPS.length - 1} />
      ))}

      {/* ── Toolkit ──────────────────────────────────────────── */}
      <section id="toolkit" className="relative scroll-mt-20 border-t border-border py-20">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <div className="mb-12 text-center">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
                🛠️ The Super-Power Toolkit
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-text-main sm:text-4xl">
                The Engines of Automation
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-text-muted">
                To run this pipeline at professional scale you need the right tools. Treat them not
                just as software, but as specialised engines — using the wrong one creates friction.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-5 lg:grid-cols-3">
            {TOOL_DEEP_DIVES.map((tool, i) => (
              <Reveal key={tool.slug} delay={i * 0.1}>
                <Link
                  to={`/start/${tool.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-6 transition-all hover:-translate-y-1 hover:border-[color:var(--ac)]"
                  style={{ ['--ac' as string]: tool.accent }}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-3xl">{tool.emoji}</span>
                    <span
                      className="rounded-full px-2.5 py-1 text-[11px] font-bold"
                      style={{ background: `${tool.accent}1a`, color: tool.accent }}
                    >
                      0{i + 1}
                    </span>
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: tool.accent }}>
                    {tool.role}
                  </p>
                  <h3 className="mt-1 text-xl font-bold text-text-main">{tool.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-text-muted">{tool.gatewayBlurb}</p>
                  <p className="mt-4 border-t border-border pt-3 text-xs font-medium text-text-muted">
                    {tool.bestFor}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-text-main">
                    Open the deep dive
                    <ArrowRight
                      size={15}
                      className="transition-transform group-hover:translate-x-1"
                      style={{ color: tool.accent }}
                    />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>

          {/* Prominent deep-dive CTA */}
          <Reveal>
            <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-primary/30 bg-primary/[0.04] p-7 text-center sm:flex-row sm:justify-between sm:text-left">
              <div>
                <h3 className="text-lg font-bold text-text-main">Want the full breakdown of each tool?</h3>
                <p className="mt-1 text-sm text-text-muted">
                  Setup, how-to, pricing, pros & cons — one page per tool.
                </p>
              </div>
              <Link
                to="/start/vscode-copilot"
                className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-colors hover:bg-primary-dark"
              >
                Continue to the deep dive <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section id="start" className="relative scroll-mt-20 py-24">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(50% 60% at 50% 50%, rgba(59,130,246,0.14), transparent 70%)' }}
        />
        <Reveal>
          <div className="relative mx-auto max-w-2xl px-6 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-text-main sm:text-4xl">
              Ready to build your first dataset?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-text-muted">
              You've seen the pipeline. Now put it to work — submit a dataset and our team will review
              it and propose a price.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/submit"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-colors hover:bg-primary-dark"
              >
                <Database size={16} /> Submit a dataset <ArrowRight size={16} />
              </Link>
              <Link
                to="/faq"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-7 py-3.5 text-sm font-semibold text-text-main transition-colors hover:bg-surface-lighter"
              >
                Read the FAQ
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
