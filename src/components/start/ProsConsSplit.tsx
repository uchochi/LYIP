import { Check, X } from 'lucide-react';
import Reveal from './Reveal';

interface ProsConsSplitProps {
  pros: string[];
  cons: string[];
}

export default function ProsConsSplit({ pros, cons }: ProsConsSplitProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Reveal>
        <div className="h-full rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-6">
          <h4 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-emerald-400">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15">
              <Check size={14} />
            </span>
            The Edge
          </h4>
          <ul className="space-y-3">
            {pros.map((p, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-text-main">
                <Check size={16} className="mt-0.5 shrink-0 text-emerald-400" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
      <Reveal delay={0.1}>
        <div className="h-full rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-6">
          <h4 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-red-400">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/15">
              <X size={14} />
            </span>
            The Friction
          </h4>
          <ul className="space-y-3">
            {cons.map((c, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-text-main">
                <X size={16} className="mt-0.5 shrink-0 text-red-400" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </div>
  );
}
