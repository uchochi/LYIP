import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Users, Zap, Sparkles,
  Brain, Heart, Globe, BookOpen, TrendingUp, Rocket,
  Shield, Lock, BarChart3, FileText, MessageCircle,
} from 'lucide-react';
import { getOpenJobs } from '../services/jobService';
import JobCard from '../components/jobs/JobCard';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import type { Job } from '../types';

const values = [
  { icon: Brain, title: 'Intellectual Curiosity', desc: 'The best breakthroughs come from relentless questioning and exploration.' },
  { icon: Users, title: 'Radical Collaboration', desc: 'The hardest problems require diverse perspectives and genuine partnership.' },
  { icon: Heart, title: 'Safety First', desc: 'We curate data that is safe, aligned, and beneficial for everyone.' },
  { icon: Zap, title: 'Ship with Purpose', desc: 'We move fast but never lose sight of the impact we want to create.' },
  { icon: Globe, title: 'Global Impact', desc: 'Our work reaches across borders. We think globally from day one.' },
  { icon: BookOpen, title: 'Open Knowledge', desc: 'We contribute to and share with the broader research community.' },
];

const perks = [
  { icon: TrendingUp, title: 'Competitive Equity', desc: "Meaningful ownership in the company's future" },
  { icon: Globe, title: 'Remote-First', desc: 'Work from anywhere in the world' },
  { icon: Heart, title: 'Premium Healthcare', desc: 'Full medical, dental, and vision coverage' },
  { icon: BookOpen, title: 'Learning Budget', desc: '$5,000/year for conferences, courses, and books' },
  { icon: Rocket, title: 'GPU Budget', desc: 'Personal compute budget for side projects' },
  { icon: Users, title: 'Team Retreats', desc: 'Quarterly offsites in amazing locations' },
];

const platformFeatures = [
  { icon: Brain, title: 'Curation Pipeline', desc: 'The full 4-step pipeline — cleaning, language alignment, structuring, and labelling — with tools that do the heavy lifting for you.' },
  { icon: Shield, title: 'Human Quality Review', desc: 'Every dataset is reviewed by people against strict quality standards before it is approved for training.' },
  { icon: Zap, title: 'Smart Labelling Tools', desc: 'AI-assisted labelling with Label Studio and Prodigy so you can tag data 10x faster.' },
  { icon: Lock, title: 'Secure Submissions', desc: 'Your datasets are protected by row-level security — only you and the review team can see them.' },
  { icon: BarChart3, title: 'Curator Dashboard', desc: 'Track submission status, review notes, and earnings in real time.' },
  { icon: Globe, title: 'Multilingual Coverage', desc: 'Local-language and translation datasets that help AI understand the whole world.' },
];

const researchPapers = [
  { title: 'Scaling Data Curation: Lessons from Building Training Corpora', venue: 'NeurIPS 2026' },
  { title: 'Real-Time Data Quality Detection in AI Training Sets', venue: 'ICML 2026' },
  { title: 'Constitutional Data: A Practical Framework for Ethical Curation', venue: 'ICLR 2026' },
  { title: 'Efficient Dataset Structuring: Dynamic Schema Adaptation', venue: 'arXiv 2026' },
  { title: 'Measuring What Matters: New Benchmarks for Data Trustworthiness', venue: 'NeurIPS 2025' },
];

export default function HomePage() {
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOpenJobs().then((j) => { setFeaturedJobs(j.slice(0, 3)); setLoading(false); });
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <Sparkles size={14} />
            We're hiring
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-text-main leading-tight">
            Build the datasets behind
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Artificial Intelligence</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-text-muted leading-relaxed">
            Loseyourip is the platform for building high-quality datasets that train modern AI. Clean, structured, and labelled with care — no experience needed, we teach you everything.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link to="/start">
              <Button size="lg">
                Start the Tutorial
                <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/jobs" className="no-underline">
              <Button size="lg" variant="secondary">View Open Positions</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats — DO NOT CHANGE */}
      <section className="border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Users, value: '50+', label: 'Team Members' },
            { icon: Globe, value: '12', label: 'Languages Covered' },
            { icon: Sparkles, value: '3', label: 'Global Offices' },
            { icon: Sparkles, value: '$45M', label: 'Series A Funded' },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center text-center gap-2">
              <s.icon size={20} className="text-primary" />
              <p className="text-2xl font-bold text-text-main">{s.value}</p>
              <p className="text-sm text-text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission / Values */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text-main">What we believe</h2>
          <p className="mx-auto mt-3 max-w-2xl text-text-muted">
            We build the datasets that make AI genuinely helpful, transparent, and aligned with human interests — trustworthy training data as the standard, not the exception.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((v) => (
            <div key={v.title} className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                <v.icon size={20} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-text-main">{v.title}</h3>
              <p className="mt-2 text-sm text-text-muted leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Perks */}
      <section className="border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-main">Why join us</h2>
            <p className="mx-auto mt-3 max-w-2xl text-text-muted">
              Thoughtful benefits designed for people who want to do the best work of their careers.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {perks.map((p) => (
              <div key={p.title} className="flex gap-4 rounded-2xl border border-border bg-surface p-6 shadow-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                  <p.icon size={18} className="text-accent" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-main">{p.title}</h3>
                  <p className="mt-1 text-sm text-text-muted">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform teaser */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-bold text-text-main">The Loseyourip Dataset Platform</h2>
            <p className="mt-3 max-w-xl text-text-muted">
              A complete platform for building the clean, structured datasets that train modern AI. From raw data to ready-to-train in minutes.
            </p>
          </div>
          <Link to="/platform" className="no-underline text-sm font-medium text-primary hover:text-primary-dark">
            Explore the platform &rarr;
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {platformFeatures.map((f) => (
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

      {/* Research teaser */}
      <section className="border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl font-bold text-text-main">Research</h2>
              <p className="mt-3 max-w-xl text-text-muted">
                Published and presented work in AI alignment, safety, and capabilities.
              </p>
            </div>
            <Link to="/research" className="no-underline text-sm font-medium text-primary hover:text-primary-dark">
              View all research &rarr;
            </Link>
          </div>
          <div className="space-y-4">
            {researchPapers.map((p) => (
              <div key={p.title} className="flex items-start gap-4 rounded-2xl border border-border bg-surface p-5 shadow-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                  <FileText size={18} className="text-accent" />
                </div>
                <div>
                  <span className="text-xs font-medium text-primary">{p.venue}</span>
                  <h3 className="text-base font-semibold text-text-main">{p.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-text-main">Open Positions</h2>
            <p className="mt-1 text-sm text-text-muted">Find your next role at Loseyourip</p>
          </div>
          <Link to="/jobs" className="text-sm font-medium text-primary hover:text-primary-dark no-underline hidden sm:block">
            View all &rarr;
          </Link>
        </div>
        {loading ? <Spinner /> : (
          <>
            {featuredJobs.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {featuredJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </>
        )}
        <div className="mt-8 text-center sm:hidden">
          <Link to="/jobs">
            <Button variant="secondary">View all positions</Button>
          </Link>
        </div>
      </section>

      {/* Community CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-3xl border border-border bg-surface p-10 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
            <MessageCircle size={22} className="text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-text-main">Join the community</h2>
          <p className="mx-auto mt-3 max-w-md text-text-muted">
            Connect with 12,000+ curators, developers, and AI enthusiasts building datasets with Loseyourip.
          </p>
          <Link to="/community" className="no-underline">
            <Button size="lg" variant="secondary" className="mt-6">Explore Community</Button>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-3xl bg-gradient-to-br from-primary to-accent p-10 md:p-14 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold">Don't see your role?</h2>
          <p className="mt-3 text-white/80 max-w-md mx-auto">
            We're always looking for exceptional people. Send us your resume and tell us how you'd contribute.
          </p>
          <a href="mailto:careers@loseyourip.com" className="no-underline">
            <Button variant="secondary" size="lg" className="mt-6 bg-white text-primary hover:bg-white/90">
              Get in Touch
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
}
