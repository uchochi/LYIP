import { useState } from 'react';
import type { ReactNode } from 'react';
import { Check, Copy } from 'lucide-react';
import type { CodeSnippet } from '../../content/tutorial';

interface CodeWindowProps {
  snippet: CodeSnippet;
  /** Optional label shown instead of filename, e.g. "Raw Data". */
  label?: string;
  accent?: string;
  /** Tint variant for the raw/diff "before" block. */
  tone?: 'default' | 'raw' | 'clean';
}

const TOKEN_RE =
  /("(?:[^"\\]|\\.)*"\s*:)|("(?:[^"\\]|\\.)*")|(-?\b\d+(?:\.\d+)?\b)|(\b(?:true|false|null)\b)|([{}[\],])/g;

function renderJsonLine(line: string, lineIdx: number): ReactNode {
  const out: ReactNode[] = [];
  let n = 0;
  const key = () => `${lineIdx}-${n++}`;
  let m: RegExpExecArray | null;
  let lastIndex = 0;
  TOKEN_RE.lastIndex = 0;
  while ((m = TOKEN_RE.exec(line)) !== null) {
    if (m.index > lastIndex) out.push(line.slice(lastIndex, m.index));
    if (m[1]) {
      out.push(
        <span key={key()} style={{ color: '#60a5fa' }}>
          {m[1].replace(/:\s*$/, '')}
        </span>,
        <span key={key()} style={{ color: '#71717a' }}>
          :
        </span>,
      );
    } else if (m[2]) {
      out.push(
        <span key={key()} style={{ color: '#34d399' }}>
          {m[2]}
        </span>,
      );
    } else if (m[3]) {
      out.push(
        <span key={key()} style={{ color: '#fbbf24' }}>
          {m[3]}
        </span>,
      );
    } else if (m[4]) {
      out.push(
        <span key={key()} style={{ color: '#c084fc' }}>
          {m[4]}
        </span>,
      );
    } else if (m[5]) {
      out.push(
        <span key={key()} style={{ color: '#a1a1aa' }}>
          {m[5]}
        </span>,
      );
    }
    lastIndex = TOKEN_RE.lastIndex;
    if (n > 500) break;
  }
  if (lastIndex < line.length) out.push(line.slice(lastIndex));
  return out;
}

export default function CodeWindow({ snippet, label, accent = '#3b82f6', tone = 'default' }: CodeWindowProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  const lines = snippet.code.split('\n');

  const headerTint =
    tone === 'raw'
      ? { border: 'rgba(239,68,68,0.25)', dot: '#ef4444' }
      : tone === 'clean'
        ? { border: 'rgba(52,211,153,0.25)', dot: '#34d399' }
        : { border: 'var(--color-border)', dot: accent };

  return (
    <div className="overflow-hidden rounded-xl border bg-[#0c0c0f] shadow-lg" style={{ borderColor: headerTint.border }}>
      <div
        className="flex items-center justify-between border-b px-4 py-2.5"
        style={{ borderColor: headerTint.border, background: 'rgba(255,255,255,0.02)' }}
      >
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full" style={{ background: '#ef4444' }} />
          <span className="h-3 w-3 rounded-full" style={{ background: '#fbbf24' }} />
          <span className="h-3 w-3 rounded-full" style={{ background: headerTint.dot }} />
          <span className="ml-2 font-mono text-xs text-text-muted">{label || snippet.title}</span>
        </div>
        <button
          onClick={copy}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-text-muted transition-colors hover:bg-surface-lighter hover:text-text-main"
          type="button"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed">
        <code className="font-mono">
          {lines.map((line, i) => (
            <div key={i} className="flex">
              <span className="mr-4 inline-block w-6 shrink-0 select-none text-right text-[11px] text-zinc-700">
                {i + 1}
              </span>
              <span className="whitespace-pre text-zinc-300">
                {snippet.lang === 'json' ? renderJsonLine(line, i) : line || ' '}
              </span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}
