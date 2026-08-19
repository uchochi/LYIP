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
      { label: 'How You Get Paid', anchor: 'pricing' },
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

      {/* How datasets are measured & paid */}
      <section id="pricing">
        <Reveal y={10} duration={0.5}>
          <h2>How Datasets Are Measured &amp; Paid</h2>
          <p>
            Dataset size — and therefore your pay — is measured in <strong>entries</strong>. One entry
            is one unit of data in your file:
          </p>
          <table className="docs-table">
            <thead>
              <tr>
                <th>Dataset type</th>
                <th>What counts as 1 entry</th>
                <th>Example</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>CSV / spreadsheet</td>
                <td>1 row (header not counted)</td>
                <td>500 proverbs → 500 entries</td>
              </tr>
              <tr>
                <td>JSON / JSONL</td>
                <td>1 object</td>
                <td>1,500 objects → 1,500 entries</td>
              </tr>
              <tr>
                <td>Q&amp;A set</td>
                <td>1 question + answer pair</td>
                <td>1,500 pairs → 1,500 entries</td>
              </tr>
              <tr>
                <td>Audio transcription</td>
                <td>1 timestamped segment</td>
                <td>3,000 segments → 3,000 entries</td>
              </tr>
              <tr>
                <td>Parallel text</td>
                <td>1 language pair line</td>
                <td>3,000 pairs → 3,000 entries</td>
              </tr>
            </tbody>
          </table>
          <div className="docs-callout">
            <span className="docs-callout-title">Payment tiers (per approved dataset)</span>
            <strong>500+ entries = $50</strong> (e.g. a spreadsheet of 500 proverbs) ·{' '}
            <strong>1,500+ = $75</strong> (e.g. 1,500 question–answer pairs) ·{' '}
            <strong>3,000+ = $100</strong> (e.g. 3,000 timestamped speech segments).
            Every approved dataset is credited straight to your dashboard wallet — and submissions in
            review for more than 8 days are approved automatically.
          </div>
        </Reveal>
      </section>

      {PIPELINE_STEPS.map((step) => (
        <StepSection key={step.id} step={step} />
      ))}

      {/* Toolkit */}
      <section id="toolkit">
        <Reveal y={10} duration={0.5}>
          <h2>The Super-Power Toolkit You Need</h2>
          <p>
            <em>The Engines of Automation</em>
          </p>
          <p>
            Below is the tactical breakdown of the <strong>tools</strong> you need, mapped to the four
            stages of the pipeline. To execute the above 4 stages at professional scale, using the
            right tools and technological strategy are required. You must treat these tools not just as
            software, but as <strong>specialized engines</strong>. Using the wrong engine for a specific
            stage will result in &ldquo;friction&rdquo;—wasted time, manual errors, and broken schemas.
          </p>
        </Reveal>

        {TOOL_DEEP_DIVES.map((tool, i) => {
          const tk = tool.toolkit;
          return (
            <Reveal key={tool.slug} y={10} duration={0.5}>
              <div className="docs-tool">
                <img src={tool.image} alt={`${tool.name} screenshot`} className="docs-tool-img" />
                <div className="docs-tool-head">
                  <span className="docs-tool-num">0{i + 1}</span>
                  <h3>{tool.name}</h3>
                </div>
                <div className="docs-tool-role">{tk.subtitle}</div>
                <p>{tk.intro}</p>

                <h4>What stages can it handle?</h4>
                <ul>
                  {tk.stages.map((s) => (
                    <li key={s.lead}>
                      <strong>{s.lead}:</strong> {s.detail}
                    </li>
                  ))}
                </ul>

                <div className="docs-callout">
                  <span className="docs-callout-title">When &amp; How to Use It</span>
                  {tk.whenToUse}
                </div>

                <h4>The Advantage (Pros)</h4>
                <ul>
                  {tk.pros.map((p) => (
                    <li key={p.lead}>
                      <strong>{p.lead}:</strong> {p.detail}
                    </li>
                  ))}
                </ul>

                <h4>The Friction (Cons)</h4>
                <ul>
                  {tk.cons.map((c) => (
                    <li key={c.lead}>
                      <strong>{c.lead}:</strong> {c.detail}
                    </li>
                  ))}
                </ul>

                <h4>Investment (Cost / Budget)</h4>
                <ul>
                  {tk.investment.map((inv) => (
                    <li key={inv.lead}>
                      <strong>{inv.lead}:</strong> {inv.detail}
                    </li>
                  ))}
                </ul>

                <p style={{ marginTop: '1rem', marginBottom: 0 }}>
                  <Link to={`/start/${tool.slug}`}>Learn the full guide on how to use it →</Link>
                </p>
              </div>
            </Reveal>
          );
        })}
      </section>
    </DocsShell>
  );
}
