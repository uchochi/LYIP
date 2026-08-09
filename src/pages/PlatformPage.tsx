import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap, Brain, Lock, BarChart3, Globe, Sparkles, FileText } from 'lucide-react';
import Button from '../components/ui/Button';

const features = [
  { icon: Brain, title: 'Curation Pipeline', desc: 'The professional 4-step workflow — cleaning, language alignment, structuring, and labelling — powered by tools that handle the heavy lifting at scale.' },
  { icon: Shield, title: 'Human Quality Review', desc: 'Every dataset is reviewed by trained curators against strict quality standards before it is approved for AI training.' },
  { icon: Zap, title: 'Smart Labelling Tools', desc: 'AI-assisted labelling with Label Studio and Prodigy — active learning that lets you annotate text, audio, images, and video up to 10x faster.' },
  { icon: Lock, title: 'Secure Submissions', desc: 'Row-level security keeps your datasets private — only you and the review team can see them. Uploads are stored encrypted.' },
  { icon: BarChart3, title: 'Curator Dashboard', desc: 'Track submission status, review notes, proposed pricing, and total earnings in real time.' },
  { icon: Globe, title: 'Multilingual Coverage', desc: 'Local-language and translation datasets with perfect 1:1 alignment, so AI can serve the whole world.' },
];

const pipeline = [
  { name: 'The Cleaning', desc: 'Scrub raw data of noise — HTML, emojis, duplicates — until only the signal remains.' },
  { name: 'Language Alignment', desc: 'Match every source row to a perfect translated partner, encoded correctly (UTF-8).' },
  { name: 'Structuring', desc: 'Convert messy text into neat, machine-readable formats — JSON, CSV, Parquet.' },
  { name: 'Labelling', desc: 'Ground-truth the data so the AI knows exactly what it is looking at.' },
];

export default function PlatformPage() {
  return (
    <div>
      <section className="border-b border-border bg-surface/40">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-text-main">Dataset Platform</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-text-muted leading-relaxed">
            A complete platform for building the high-quality datasets that train modern AI. From raw data to ready-to-train in minutes — no experience required.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                <f.icon size={20} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-text-main">{f.title}</h3>
              <p className="mt-2 text-sm text-text-muted leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-2xl font-bold text-text-main mb-8">The Dataset Pipeline</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {pipeline.map((p, i) => (
              <div key={p.name} className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                  {i + 1}
                </span>
                <h3 className="mt-3 text-base font-semibold text-primary">{p.name}</h3>
                <p className="mt-2 text-sm text-text-muted">{p.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-3 py-1 text-xs text-text-muted">
              <FileText size={12} /> .json · .csv · .txt · .parquet
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-3 py-1 text-xs text-text-muted">
              <Sparkles size={12} /> $50–$100 per dataset
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-3xl border border-border bg-surface p-10 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-text-main">Ready to start curating?</h2>
          <p className="mx-auto mt-3 max-w-md text-text-muted">Take the tutorial, join the forum, and submit your first dataset.</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link to="/start" className="no-underline">
              <Button size="lg">
                Start the Tutorial <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/submit" className="no-underline">
              <Button size="lg" variant="secondary">Submit a Dataset</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
