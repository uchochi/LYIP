import { Link } from 'react-router-dom';
import DocsShell, { type DocsNavGroup } from '../components/docs/DocsShell';
import Reveal from '../components/start/Reveal';
import { TOOL_DEEP_DIVES } from '../content/tutorial';

const NAV_GROUPS: DocsNavGroup[] = [
  { title: 'Tutorial', items: [{ label: 'Introduction', to: '/start' }] },
  {
    title: 'Deep Dives',
    items: TOOL_DEEP_DIVES.map((t) => ({ label: t.name, to: `/start/${t.slug}` })),
  },
  {
    title: 'Resources',
    items: [
      { label: 'Learning Hub', to: '/learn' },
      { label: 'FAQ', to: '/faq' },
    ],
  },
];

export default function LearnPage() {
  return (
    <DocsShell
      groups={NAV_GROUPS}
      breadcrumb="Resources > Learning Hub"
      title="Learning Hub"
      description="Everything you need to go from beginner to paid dataset curator — the tutorial, the tools, and the answers."
    >
      <Reveal y={10} duration={0.5}>
        <div className="docs-callout">
          <span className="docs-callout-title">Start here</span>
          <Link to="/start">Understanding AI Dataset Formatting</Link> — the friendly, step-by-step
          guide to building world-class datasets. No coding required to begin.
        </div>
      </Reveal>

      <Reveal y={10} duration={0.5}>
        <h2>Tool Deep Dives</h2>
        <p>Full breakdowns of each tool in the synthesis toolkit — setup, usage, pricing, and trade-offs.</p>
        <ul>
          {TOOL_DEEP_DIVES.map((t) => (
            <li key={t.slug}>
              <Link to={`/start/${t.slug}`}>
                {t.emoji} {t.name}
              </Link>{' '}
              — {t.role}
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal y={10} duration={0.5}>
        <h2>More</h2>
        <ul>
          <li>
            <Link to="/faq">Dataset Curation FAQ</Link> — formats, pricing, reviews, and quality.
          </li>
          <li>
            <Link to="/forum">Community Forum</Link> — find dataset jobs, pick up paid projects, ask questions and share insights.
          </li>
        </ul>
      </Reveal>
    </DocsShell>
  );
}
