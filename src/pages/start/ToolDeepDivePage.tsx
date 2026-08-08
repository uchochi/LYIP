import { Link, useParams, Navigate } from 'react-router-dom';
import DocsShell, { type DocsNavGroup } from '../../components/docs/DocsShell';
import Reveal from '../../components/start/Reveal';
import { TOOL_DEEP_DIVES, getToolBySlug, type ToolStep } from '../../content/tutorial';

function buildNav(activeSlug?: string): DocsNavGroup[] {
  return [
    { title: 'Tutorial', items: [{ label: 'Introduction', to: '/start' }] },
    {
      title: 'Deep Dives',
      items: TOOL_DEEP_DIVES.map((t) => ({
        label: t.name,
        to: `/start/${t.slug}`,
      })),
    },
    {
      title: 'Resources',
      items: [
        { label: 'Learning Hub', to: '/learn' },
        { label: 'FAQ', to: '/faq' },
      ],
    },
  ].map((g) => ({ ...g, _active: activeSlug })) as DocsNavGroup[];
}

function StepList({ steps }: { steps: ToolStep[] }) {
  return (
    <>
      {steps.map((s, i) => (
        <div className="docs-step" key={s.title}>
          <div className="docs-step-number">{i + 1}</div>
          <div className="docs-step-body">
            <h3>{s.title}</h3>
            <p>{s.body}</p>
          </div>
        </div>
      ))}
    </>
  );
}

export default function ToolDeepDivePage() {
  const { tool } = useParams();
  const data = getToolBySlug(tool);
  if (!data) return <Navigate to="/start" replace />;

  const idx = TOOL_DEEP_DIVES.findIndex((t) => t.slug === data.slug);
  const prev = TOOL_DEEP_DIVES[idx - 1];
  const next = TOOL_DEEP_DIVES[idx + 1];

  return (
    <DocsShell
      groups={buildNav(data.slug)}
      breadcrumb={`Tutorials > Deep Dives > ${data.name}`}
      title={data.name}
      description={data.tagline}
      footer={
        <>
          {prev ? (
            <Link to={`/start/${prev.slug}`}>← {prev.name}</Link>
          ) : (
            <Link to="/start">← Back to the pipeline</Link>
          )}
          {next ? (
            <Link to={`/start/${next.slug}`}>{next.name} →</Link>
          ) : (
            <Link to="/faq">Read the FAQ →</Link>
          )}
        </>
      }
    >
      <Reveal y={10} duration={0.5}>
        <p>
          <strong>{data.role}.</strong> {data.intro}
        </p>
        <div className="docs-callout">
          <span className="docs-callout-title">Best for</span>
          {data.bestFor}
        </div>
      </Reveal>

      {/* Setup */}
      <Reveal y={10} duration={0.5}>
        <h2>{data.setup.title}</h2>
        <StepList steps={data.setup.steps} />
      </Reveal>

      {/* How to use */}
      <Reveal y={10} duration={0.5}>
        <h2>{data.usage.title}</h2>
        <StepList steps={data.usage.steps} />
      </Reveal>

      {/* Pricing */}
      <Reveal y={10} duration={0.5}>
        <h2>Pricing &amp; Trial</h2>
        {data.pricing.trialNote && (
          <div className="docs-callout">
            <span className="docs-callout-title">Trial</span>
            {data.pricing.trialNote}
          </div>
        )}
        <table className="docs-table">
          <thead>
            <tr>
              <th>Option</th>
              <th>Price</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {data.pricing.cards.map((c) => (
              <tr key={c.label}>
                <td>{c.label}</td>
                <td>{c.value}</td>
                <td>{c.note ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>

      {/* Can / Can't do */}
      <Reveal y={10} duration={0.5}>
        <h2>What You Can &amp; Can&apos;t Do</h2>
        <h3>What you can do</h3>
        <ul>
          {data.canDo.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
        <h3>Limitations</h3>
        <ul>
          {data.cantDo.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </Reveal>

      {/* Summary */}
      <Reveal y={10} duration={0.5}>
        <h2>Summary</h2>
        <table className="docs-table">
          <thead>
            <tr>
              {data.summaryHeaders.map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.summary.map((row) => (
              <tr key={row.feature}>
                <td>{row.feature}</td>
                {row.cols.map((cell, j) => (
                  <td key={j}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>

      {/* Bottom line */}
      <Reveal y={10} duration={0.5}>
        <div className="docs-callout">
          <span className="docs-callout-title">The Bottom Line</span>
          {data.bottomLine}
        </div>
      </Reveal>
    </DocsShell>
  );
}
