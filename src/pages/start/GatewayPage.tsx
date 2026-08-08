import { Link } from 'react-router-dom';
import DocsShell, { type DocsNavGroup } from '../../components/docs/DocsShell';
import Reveal from '../../components/start/Reveal';
import {
  PIPELINE_STEPS,
  TOOL_DEEP_DIVES,
  type PipelineStep,
  type StepVisual,
} from '../../content/tutorial';

const NAV_GROUPS: DocsNavGroup[] = [
  {
    title: 'Tutorial',
    items: [
      { label: 'Introduction', to: '/start' },
      { label: '1. The Cleaning', anchor: 'step-1' },
      { label: '2. Language Alignment', anchor: 'step-2' },
      { label: '3. Structuring', anchor: 'step-3' },
      { label: '4. Labelling', anchor: 'step-4' },
      { label: 'The Toolkit', anchor: 'toolkit' },
    ],
  },
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

function Code({ children }: { children: string }) {
  return <pre className="docs-pre"><code>{children}</code></pre>;
}

function Visual({ visual }: { visual: StepVisual }) {
  if (visual.kind === 'contrast') {
    const { pair } = visual;
    return (
      <div className="docs-code-grid">
        <div>
          <div className="docs-code-label bad">{pair.beforeLabel}</div>
          <Code>{pair.before}</Code>
        </div>
        <div>
          <div className="docs-code-label good">{pair.afterLabel}</div>
          <Code>{pair.after}</Code>
        </div>
      </div>
    );
  }

  if (visual.kind === 'code') {
    return <Code>{visual.snippet.code}</Code>;
  }

  if (visual.kind === 'align') {
    return (
      <table className="docs-table">
        <thead>
          <tr>
            {visual.headers.map((h) => (
              <th key={h}>{h}</th>
            ))}
            <th>Match</th>
          </tr>
        </thead>
        <tbody>
          {visual.rows.map((row, i) => (
            <tr key={i} className={row.ok ? '' : 'row-bad'}>
              <td>{row.a}</td>
              <td>{row.b}</td>
              <td className={row.ok ? 'status-ok' : 'status-bad'}>
                {row.ok ? '✓ correct' : '✗ wrong'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  // labels
  return (
    <table className="docs-table">
      <thead>
        <tr>
          <th>Text</th>
          <th>Label</th>
        </tr>
      </thead>
      <tbody>
        {visual.examples.map((ex) => (
          <tr key={ex.text}>
            <td>{ex.text}</td>
            <td className={ex.tone === 'pos' ? 'status-ok' : ex.tone === 'neg' ? 'status-bad' : ''}>
              [{ex.label}]
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function StepSection({ step }: { step: PipelineStep }) {
  return (
    <section id={step.id}>
      <Reveal y={10} duration={0.5}>
        <h2>
          Step {step.n}: {step.title}
        </h2>
        <div className="docs-callout">
          <span className="docs-callout-title">The Goal</span>
          {step.goal}
        </div>
        <p>{step.intro}</p>
        <Visual visual={step.visual} />
        {step.insight && (
          <div className="docs-callout">
            <span className="docs-callout-title">Key Insight</span>
            {step.insight}
          </div>
        )}
      </Reveal>
    </section>
  );
}

export default function GatewayPage() {
  return (
    <DocsShell
      groups={NAV_GROUPS}
      breadcrumb="Tutorials > Dataset Curation"
      title="Understanding AI Dataset Formatting"
      description="Mastering how to create high-fidelity datasets at scale. No math genius or master programmer required — you just need to be the Curator who directs the tools."
      footer={
        <>
          <span>4-step pipeline · the Curator's playbook</span>
          <Link to="/start/vscode-copilot">
            Next: VS Code & Copilot deep dive →
          </Link>
        </>
      }
    >
      <Reveal y={10} duration={0.5}>
        <p>
          Have you ever wondered how an AI recognises a cat in a photo? It isn&apos;t magic — it&apos;s{' '}
          <strong>data.</strong> AI models are like newborn babies: smart, but they know nothing. To
          make them smart we feed them massive amounts of information. But you can&apos;t just throw a
          pile of random internet text at them — it has to be <strong>clean, organised, and labelled.</strong>
        </p>
        <p>
          The good news: you don&apos;t need to be a math genius or a master programmer. You don&apos;t have
          to build everything from scratch either — today we use <em>super-tools</em> and AI to do the
          heavy lifting. Your job is to be the <strong>Curator</strong>.
        </p>
        <div className="docs-callout">
          <span className="docs-callout-title">In this tutorial</span>
          The 4-step process professionals use to build world-class datasets for AI.
        </div>
      </Reveal>

      {PIPELINE_STEPS.map((step) => (
        <StepSection key={step.id} step={step} />
      ))}

      {/* Toolkit */}
      <section id="toolkit">
        <Reveal y={10} duration={0.5}>
          <h2>The Super-Power Toolkit</h2>
          <p>
            To run this pipeline at professional scale you need the right tools. Treat them not just as
            software, but as <strong>specialised engines</strong> — using the wrong one for a stage
            creates friction: wasted time, manual errors, and broken schemas.
          </p>
          <p>Each tool below has a full deep dive (setup, usage, pricing, and trade-offs).</p>
        </Reveal>

        {TOOL_DEEP_DIVES.map((tool, i) => (
          <Reveal key={tool.slug} y={10} duration={0.5}>
            <div className="docs-tool">
              <div className="docs-tool-head">
                <span className="docs-tool-num">0{i + 1}</span>
                <h3>
                  {tool.emoji} {tool.name}
                </h3>
              </div>
              <div className="docs-tool-role">{tool.role}</div>
              <p style={{ marginTop: '0.6rem', marginBottom: '0.5rem' }}>{tool.gatewayBlurb}</p>
              <p style={{ marginBottom: 0 }}>
                <strong>Best for:</strong> {tool.bestFor} ·{' '}
                <Link to={`/start/${tool.slug}`}>Read the deep dive →</Link>
              </p>
            </div>
          </Reveal>
        ))}
      </section>
    </DocsShell>
  );
}
