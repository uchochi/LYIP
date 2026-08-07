import type { ReactNode } from 'react';

interface StepCardProps {
  index?: number;
  title: string;
  accent?: string;
  children: ReactNode;
}

export default function StepCard({ index, title, accent = '#3b82f6', children }: StepCardProps) {
  return (
    <div className="group relative rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-[color:var(--ac)] sm:p-6" style={{ ['--ac' as string]: accent }}>
      <div className="flex items-start gap-4">
        {typeof index === 'number' && (
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold"
            style={{ background: `${accent}1a`, color: accent, border: `1px solid ${accent}33` }}
          >
            {String(index).padStart(2, '0')}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h4 className="text-base font-bold text-text-main">{title}</h4>
          <p className="mt-1 text-sm leading-relaxed text-text-muted">{children}</p>
        </div>
      </div>
    </div>
  );
}
