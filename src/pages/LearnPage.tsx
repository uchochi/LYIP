import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Database, GraduationCap, PlayCircle } from 'lucide-react';
import { TOOL_DEEP_DIVES } from '../content/tutorial';
import Reveal from '../components/start/Reveal';

interface Resource {
  title: string;
  blurb: string;
  href: string;
  cta: string;
  icon: React.ReactNode;
  accent: string;
  external?: boolean;
}

export default function LearnPage() {
  const resources: Resource[] = [
    {
      title: 'The Dataset Curation Tutorial',
      blurb:
        'The full 4-step pipeline — cleaning, alignment, structuring, and labelling. Start here if you are new.',
      href: '/start',
      cta: 'Open the tutorial',
      icon: <BookOpen size={22} />,
      accent: '#3b82f6',
    },
    {
      title: 'Submit your first dataset',
      blurb: 'Ready to earn? Upload a cleaned dataset and our team will review it and propose a price.',
      href: '/submit',
      cta: 'Submit a dataset',
      icon: <Database size={22} />,
      accent: '#34d399',
    },
    {
      title: 'Dataset Curation FAQ',
      blurb: 'Answers to the questions every new curator asks — formats, pricing, reviews, and more.',
      href: '/faq',
      cta: 'Read the FAQ',
      icon: <GraduationCap size={22} />,
      accent: '#a855f7',
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <Reveal>
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-text-main sm:text-5xl">
            Learning Hub
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-text-muted">
            Everything you need to go from beginner to paid dataset curator — the tutorial, the tools,
            and the community.
          </p>
        </div>
      </Reveal>

      {/* Featured tutorial */}
      <Reveal>
        <Link
          to="/start"
          className="group mb-10 flex flex-col gap-4 rounded-2xl border border-primary/30 bg-primary/[0.05] p-7 transition-colors hover:bg-primary/[0.08] sm:flex-row sm:items-center"
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <BookOpen size={26} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">Start here</p>
            <h2 className="mt-1 text-xl font-bold text-text-main">
              Understanding AI Dataset Formatting
            </h2>
            <p className="mt-1 text-sm text-text-muted">
              The friendly, step-by-step guide to building world-class datasets — no coding required to
              begin.
            </p>
          </div>
          <ArrowRight size={20} className="shrink-0 text-primary transition-transform group-hover:translate-x-1" />
        </Link>
      </Reveal>

      {/* Resource grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        {resources.map((r, i) => (
          <Reveal key={r.title} delay={i * 0.08}>
            <Link
              to={r.href}
              className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-[color:var(--ac)]"
              style={{ ['--ac' as string]: r.accent }}
            >
              <span
                className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl"
                style={{ background: `${r.accent}1a`, color: r.accent }}
              >
                {r.icon}
              </span>
              <h3 className="font-bold text-text-main">{r.title}</h3>
              <p className="mt-1 flex-1 text-sm text-text-muted">{r.blurb}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-text-main">
                {r.cta}
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>

      {/* Tool deep-dives */}
      <Reveal>
        <h2 className="mb-5 mt-14 text-2xl font-bold text-text-main">Tool deep dives</h2>
      </Reveal>
      <div className="grid gap-4 sm:grid-cols-3">
        {TOOL_DEEP_DIVES.map((tool, i) => (
          <Reveal key={tool.slug} delay={i * 0.08}>
            <Link
              to={`/start/${tool.slug}`}
              className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-[color:var(--ac)]"
              style={{ ['--ac' as string]: tool.accent }}
            >
              <span className="text-2xl">{tool.emoji}</span>
              <h3 className="mt-2 font-bold text-text-main">{tool.name}</h3>
              <p className="mt-1 text-xs" style={{ color: tool.accent }}>
                {tool.role}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-text-main">
                <PlayCircle size={14} /> Read the guide
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
