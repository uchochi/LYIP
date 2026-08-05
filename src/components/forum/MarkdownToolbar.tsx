import type { RefObject } from 'react';
import { wrapSelection, prefixLines, insertBlock, type TextEdit } from '../../lib/markdownToolbar';

interface MarkdownToolbarProps {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (value: string) => void;
  /** Compact mode hides text labels (chat input); full mode shows them. */
  compact?: boolean;
}

interface Tool {
  label: string;
  title: string;
  apply: (value: string, start: number, end: number) => TextEdit;
}

const TOOLS: Tool[] = [
  { label: 'B', title: 'Bold  (**text**)', apply: (v, s, e) => wrapSelection('**', '**', v, s, e) },
  { label: 'I', title: 'Italic  (*text*)', apply: (v, s, e) => wrapSelection('*', '*', v, s, e) },
  { label: 'H', title: 'Heading  (## )', apply: (v, s, e) => prefixLines('## ', v, s, e) },
  { label: '"', title: 'Quote  (> )', apply: (v, s, e) => prefixLines('> ', v, s, e) },
  { label: '•', title: 'List  (- )', apply: (v, s, e) => prefixLines('- ', v, s, e) },
  { label: '< >', title: 'Inline code  (`text`)', apply: (v, s, e) => wrapSelection('`', '`', v, s, e) },
  {
    label: '</>',
    title: 'Code block',
    apply: (v, s, e) => insertBlock('```\n\n```', v, s, e),
  },
  { label: '🔗', title: 'Link  ([text](url))', apply: (v, s, e) => wrapSelection('[', '](https://)', v, s, e) },
];

export default function MarkdownToolbar({ textareaRef, value, onChange, compact = false }: MarkdownToolbarProps) {
  const applyEdit = (tool: Tool) => {
    const ta = textareaRef.current;
    const start = ta?.selectionStart ?? value.length;
    const end = ta?.selectionEnd ?? value.length;
    const edit = tool.apply(value, start, end);
    onChange(edit.value);
    // Restore selection + focus after React commits the new value.
    requestAnimationFrame(() => {
      const el = textareaRef.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(edit.selStart, edit.selEnd);
    });
  };

  return (
    <div
      className="md-toolbar"
      style={{
        display: 'flex',
        gap: '4px',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
      {TOOLS.map((tool) => (
        <button
          key={tool.label}
          type="button"
          title={tool.title}
          onClick={() => applyEdit(tool)}
          className="md-tool-btn"
          style={{
            minWidth: compact ? '26px' : '30px',
            height: compact ? '24px' : '28px',
            padding: '0 6px',
            background: 'var(--surface-lighter)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontFamily:
              tool.label === 'B'
                ? 'inherit'
                : "'SFMono-Regular', ui-monospace, Menlo, Consolas, monospace",
            fontWeight: tool.label === 'B' ? 700 : 500,
            fontStyle: tool.label === 'I' ? 'italic' : 'normal',
            fontSize: compact ? '12px' : '13px',
            lineHeight: 1,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s ease',
          }}
        >
          {tool.label}
        </button>
      ))}
    </div>
  );
}
