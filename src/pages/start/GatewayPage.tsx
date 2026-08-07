import { motion, useScroll, useSpring } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, Database, Sparkles, Workflow } from 'lucide-react';
import { PIPELINE_STAGES, TOOL_DEEP_DIVES, type StageResult } from '../../content/tutorial';
import Reveal from '../../components/start/Reveal';
import CodeWindow from '../../components/start/CodeWindow';
import StepCard from '../../components/start/StepCard';
import StageHeader from '../../components/start/StageHeader';
import ProgressRail from '../../components/start/ProgressRail';

function StageResultBlock({ result, accent }: { result: StageResult; accent: string }) {
  if (result.kind === 'diff') {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Reveal>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-red-400">Raw Data</p>
            <CodeWindow snippet={{ title: 'raw.txt', lang: 'text', code: result.before }} label="raw.txt" tone="raw" />
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">Synthesized Signal</p>
            <CodeWindow snippet={{ title: 'clean.txt', lang: 'text', code: result.after }} label="clean.txt" tone="clean" accent={accent} />
          </div>
        </Reveal>
      </div>
    );
  }

  if (result.kind === 'code') {
    return (
      <Reveal>
        <CodeWindow snippet={result.snippet} accent={accent} />
      </Reveal>
    );
  }

  // table
  return (
    <Reveal>
      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead>
            <tr style={{ background: `${accent}14` }}>
              {result.headers.map((h) => (
                <th key={h} className="px-5 py-3 font-bold text-text-main">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.rows.map((row, i) => (
              <tr key={i} className="border-t border-border">
                {row.map((cell, j) => (
                  <td key={j} className="px-5 py-3 font-mono text-[13px] text-text-muted">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {result.caption && (
          <p className="border-t border-border px-5 py-3 text-xs italic text-text-muted">{result.caption}</p>
        )}
      </div>
    </Reveal>
  );
}

export default function GatewayPage() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  const railSections = [
    ...PIPELINE_STAGES.map((s) => ({ id: s.id, label: s.title, accent: s.accent })),
    { id: 'toolkit', label: 'The Toolkit', accent: '#f59e0b' },
    { id: 'start', label: 'Get Started', accent: '#3b82f6' },
  ];

  return (
    <div className="relative">
      <ProgressRail sections={railSections} />

      {/* Top scroll progress bar */}
      <motion.div
        className="fixed left-0 top-0 z-50 h-0.5 w-full origin-left"
        style={{ scaleX: progress, background: 'linear-gradient(90deg,#3b82f6,#a855f7,#22d3ee,#34d399)' }}
      />

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative mx-auto flex min-h-[92vh] max-w-5xl flex-col items-center justify-center px-6 text-center">
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
          The AI Data Synthesis Pipeline
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="relative z-10 text-5xl font-extrabold leading-[1.05] tracking-tight text-text-main sm:text-6xl md:text-7xl"
        >
          Architecting
          <br />
          <span className="bg-gradient-to-r from-primary via-accent to-[#22d3ee] bg-clip-text text-transparent">
            High-Fidelity
          </span>
          <br />
          Datasets at Scale
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative z-10 mt-6 max-w-2xl text-lg leading-relaxed text-text-muted"
        >
          The bottleneck to intelligence is no longer algorithmic complexity — it is{' '}
          <span className="font-semibold text-text-main">data velocity and precision.</span> This is how raw,
          chaotic information becomes hyper-structured, machine-ready intelligence.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="relative z-10 mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            to="/submit"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-colors hover:bg-primary-dark"
          >
            <Database size={16} /> Submit a Dataset
          </Link>
          <a
            href="#stage-1"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-6 py-3 text-sm font-semibold text-text-main transition-colors hover:bg-surface-lighter"
          >
            <Workflow size={16} /> Walk the Pipeline
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
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

      {/* ── Intro ──────────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <Reveal>
          <p className="text-xl leading-relaxed text-text-muted sm:text-2xl">
            The goal is <span className="font-semibold text-text-main">blazing speed</span> without compromising the
            integrity of your data. By leveraging AI-driven automation, every dataset is characterized by perfectly
            aligned tags, precise annotations, and flawless structural schemas. These are the{' '}
            <span className="font-semibold text-primary">four critical stages</span> of the high-velocity synthesis
            pipeline.
          </p>
        </Reveal>

        {/* Pipeline overview stepper */}
        <Reveal delay={0.1}>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {PIPELINE_STAGES.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="group rounded-xl border border-border bg-surface p-4 transition-colors hover:border-[color:var(--ac)]"
                style={{ ['--ac' as string]: s.accent }}
              >
                <div className="font-mono text-xs font-bold" style={{ color: s.accent }}>
                  0{s.n}
                </div>
                <div className="mt-1 text-sm font-semibold text-text-main">{s.title}</div>
              </a>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── Stages ─────────────────────────────────────────────── */}
      {PIPELINE_STAGES.map((stage, idx) => (
        <section key={stage.id} id={stage.id} className="relative scroll-mt-20 py-20">
          {/* per-stage hue shift */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: `radial-gradient(50% 35% at 50% 0%, ${stage.accent}14, transparent 70%)` }}
          />
          <div className="relative mx-auto max-w-4xl px-6">
            <StageHeader
              n={stage.n}
              tagline={stage.tagline}
              title={stage.title}
              objective={stage.objective}
              accent={stage.accent}
            />

            <Reveal>
              <p className="mb-8 max-w-2xl leading-relaxed text-text-muted">{stage.intro}</p>
            </Reveal>

            <div className="mb-10 grid gap-4 sm:grid-cols-2">
              {stage.steps.map((step, i) => (
                <Reveal key={step.title} delay={i * 0.08}>
                  <StepCard index={i + 1} title={step.title} accent={stage.accent}>
                    {step.body}
                  </StepCard>
                </Reveal>
              ))}
            </div>

            <div className="mb-2 flex items-center gap-2">
              <span
                className="rounded-md px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider"
                style={{ background: `${stage.accent}1a`, color: stage.accent }}
              >
                The Result
              </span>
              <span className="h-px flex-1" style={{ background: `${stage.accent}33` }} />
            </div>
            <div className="mt-4">
              <StageResultBlock result={stage.result!} accent={stage.accent} />
            </div>

            {idx < PIPELINE_STAGES.length - 1 && (
              <div className="mt-16 flex justify-center">
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ color: PIPELINE_STAGES[idx + 1].accent }}
                >
                  <ChevronDown size={22} />
                </motion.div>
              </div>
            )}
          </div>
        </section>
      ))}

      {/* ── Synthesis Toolkit ──────────────────────────────────── */}
      <section id="toolkit" className="relative scroll-mt-20 border-t border-border py-20">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <div className="mb-12 text-center">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
                🛠 The Synthesis Toolkit
              </div>
              <h2 className="text-4xl font-extrabold tracking-tight text-text-main sm:text-5xl">
                The Engines of Automation
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-text-muted">
                To master this pipeline, treat these tools not just as software, but as specialized engines. Using the
                wrong engine for a stage creates friction — wasted time, manual errors, and broken schemas.
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
                  <p className="mt-4 border-t border-border pt-3 text-xs text-text-muted">{tool.primaryStages}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-text-main">
                    Deep dive
                    <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" style={{ color: tool.accent }} />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────── */}
      <section id="start" className="relative scroll-mt-20 py-24">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(50% 60% at 50% 50%, rgba(59,130,246,0.14), transparent 70%)' }}
        />
        <Reveal>
          <div className="relative mx-auto max-w-2xl px-6 text-center">
            <h2 className="text-4xl font-extrabold tracking-tight text-text-main sm:text-5xl">
              Ready to build your first dataset?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-text-muted">
              You've seen the pipeline. Now put it to work — submit a dataset and our team will review it and propose a
              price.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/submit"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-colors hover:bg-primary-dark"
              >
                <Database size={16} /> Submit a Dataset <ArrowRight size={16} />
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
