import { useEffect, useState } from 'react';

export interface RailSection {
  id: string;
  label: string;
  accent: string;
}

interface ProgressRailProps {
  sections: RailSection[];
}

/**
 * Fixed left-side dot navigation that tracks the active section via
 * IntersectionObserver — gives the reader a sense of progress/momentum.
 * Hidden on small screens.
 */
export default function ProgressRail({ sections }: ProgressRailProps) {
  const [active, setActive] = useState(sections[0]?.id ?? '');

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const handler = (id: string) => () => setActive(id);

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) handler(s.id)();
          });
        },
        { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [sections]);

  const activeIndex = sections.findIndex((s) => s.id === active);

  return (
    <nav className="fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 xl:flex">
      {sections.map((s, i) => {
        const isActive = i === activeIndex;
        const isDone = i < activeIndex;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="group flex items-center gap-3"
            aria-label={s.label}
          >
            <span
              className="block h-2.5 w-2.5 rounded-full transition-all duration-300"
              style={{
                background: isActive ? s.accent : isDone ? `${s.accent}88` : 'rgba(255,255,255,0.15)',
                boxShadow: isActive ? `0 0 12px ${s.accent}` : 'none',
                transform: isActive ? 'scale(1.35)' : 'scale(1)',
              }}
            />
            <span
              className="whitespace-nowrap text-xs font-medium opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              style={{ color: isActive ? s.accent : 'var(--color-text-muted)' }}
            >
              {s.label}
            </span>
          </a>
        );
      })}
    </nav>
  );
}
