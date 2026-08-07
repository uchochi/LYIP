import Reveal from './Reveal';

interface StageHeaderProps {
  n: number;
  tagline: string;
  title: string;
  objective: string;
  accent: string;
}

export default function StageHeader({ n, tagline, title, objective, accent }: StageHeaderProps) {
  return (
    <Reveal>
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <span
            className="font-mono text-xs font-bold uppercase tracking-[0.2em]"
            style={{ color: accent }}
          >
            Stage {String(n).padStart(2, '0')}
          </span>
          <span className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${accent}55, transparent)` }} />
          <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-text-muted">
            {tagline}
          </span>
        </div>
        <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-text-main sm:text-5xl">
          {title}
        </h2>
        <p className="mt-3 max-w-2xl text-lg text-text-muted">
          <span className="font-semibold" style={{ color: accent }}>
            Objective.
          </span>{' '}
          {objective}
        </p>
      </div>
    </Reveal>
  );
}
