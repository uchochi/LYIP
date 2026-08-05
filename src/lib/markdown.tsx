import type { ReactNode } from 'react';

/**
 * Lightweight, dependency-free Markdown -> React renderer (BLOCK level only).
 *
 * Inline styling (bold, italic, inline code, links, data-tag pills) is delegated
 * to an `InlineRenderer` supplied by the caller (see parseDataTags.tsx), so this
 * module stays purely structural and avoids any circular dependency.
 *
 * Supported blocks:
 *   - Fenced code:    ``` ``` ``` or ~~~
 *   - Headings:       # ## ### #### ##### ######
 *   - Blockquotes:    >
 *   - Unordered list: - * +
 *   - Ordered list:   1. 2. 3.
 *   - Horizontal rule: --- *** ___
 *   - Paragraphs:     separated by blank lines
 *   - Line breaks:    single newline inside a paragraph -> <br/>
 *
 * Everything renders to real React nodes (no dangerouslySetInnerHTML) so it is
 * XSS-safe by construction.
 */

export type InlineRenderer = (text: string, keyRef: { k: number }) => ReactNode[];

interface Ctx {
  lines: string[];
  i: number;
  keyRef: { k: number };
  renderInline: InlineRenderer;
}

const FENCE_OPEN_RE = /^(`{3,}|~{3,})/;
const HEADING_RE = /^(#{1,6})\s+(.+?)\s*#*\s*$/;
const QUOTE_RE = /^>\s?/;
const UL_RE = /^\s*[-*+]\s+/;
const OL_RE = /^\s*\d+\.\s+/;
const HR_RE = /^\s*([-*_])\1{2,}\s*$/;

function isBlank(line: string): boolean {
  return line.trim() === '';
}

/** Does this line begin a non-paragraph block? (used to stop paragraph collection) */
function startsBlock(line: string): boolean {
  return (
    FENCE_OPEN_RE.test(line) ||
    HEADING_RE.test(line) ||
    QUOTE_RE.test(line) ||
    UL_RE.test(line) ||
    OL_RE.test(line) ||
    HR_RE.test(line)
  );
}

/** Render inline text, turning single newlines into <br/> (soft line breaks). */
function renderInlineMultiline(ctx: Ctx, text: string): ReactNode {
  const parts = text.split('\n');
  const out: ReactNode[] = [];
  parts.forEach((part, idx) => {
    if (idx > 0) out.push(<br key={`br-${ctx.keyRef.k++}`} />);
    if (part.length > 0) out.push(...ctx.renderInline(part, ctx.keyRef));
  });
  return out;
}

function parseFencedCode(ctx: Ctx): ReactNode {
  const openMatch = ctx.lines[ctx.i].match(FENCE_OPEN_RE)!;
  const marker = openMatch[1][0]; // ` or ~
  const minLen = openMatch[1].length;
  ctx.i++; // consume opening fence

  const codeLines: string[] = [];
  while (ctx.i < ctx.lines.length) {
    const line = ctx.lines[ctx.i];
    // Closing fence: a line made only of `marker` repeated >= minLen times.
    const trimmed = line.trim();
    if (trimmed.length >= minLen && [...trimmed].every((ch) => ch === marker)) {
      ctx.i++; // consume closing fence
      break;
    }
    codeLines.push(line);
    ctx.i++;
  }

  return (
    <pre key={`pre-${ctx.keyRef.k++}`} className="md-pre">
      <code>{codeLines.join('\n')}</code>
    </pre>
  );
}

function parseHeading(ctx: Ctx): ReactNode {
  const match = ctx.lines[ctx.i].match(HEADING_RE)!;
  const level = match[1].length;
  const content = match[2];
  ctx.i++;
  // Map #..###### onto h3..h6 so headings stay readable inside a message card
  // (h1/h2 would be far too large). # -> h3 (title), ## -> h4 (subtitle),
  // ### -> h5, ####+ -> h6.
  const Tag = `h${Math.min(level + 2, 6)}` as 'h3' | 'h4' | 'h5' | 'h6';
  return (
    <Tag key={`h-${ctx.keyRef.k++}`} className="md-heading">
      {renderInlineMultiline(ctx, content)}
    </Tag>
  );
}

function parseBlockquote(ctx: Ctx): ReactNode {
  const inner: string[] = [];
  while (ctx.i < ctx.lines.length && QUOTE_RE.test(ctx.lines[ctx.i])) {
    inner.push(ctx.lines[ctx.i].replace(QUOTE_RE, ''));
    ctx.i++;
  }
  // Recurse so quotes can contain headings/lists/code.
  const innerNode = renderMarkdownBlocks(inner.join('\n'), ctx.renderInline, ctx.keyRef);
  return (
    <blockquote key={`quote-${ctx.keyRef.k++}`} className="md-quote">
      {innerNode}
    </blockquote>
  );
}

function parseUnorderedList(ctx: Ctx): ReactNode {
  const items: ReactNode[] = [];
  while (ctx.i < ctx.lines.length && UL_RE.test(ctx.lines[ctx.i])) {
    const itemText = ctx.lines[ctx.i].replace(UL_RE, '');
    ctx.i++;
    items.push(<li key={`uli-${ctx.keyRef.k++}`}>{renderInlineMultiline(ctx, itemText)}</li>);
  }
  return (
    <ul key={`ul-${ctx.keyRef.k++}`} className="md-ul">
      {items}
    </ul>
  );
}

function parseOrderedList(ctx: Ctx): ReactNode {
  const items: ReactNode[] = [];
  while (ctx.i < ctx.lines.length && OL_RE.test(ctx.lines[ctx.i])) {
    const itemText = ctx.lines[ctx.i].replace(OL_RE, '');
    ctx.i++;
    items.push(<li key={`oli-${ctx.keyRef.k++}`}>{renderInlineMultiline(ctx, itemText)}</li>);
  }
  return (
    <ol key={`ol-${ctx.keyRef.k++}`} className="md-ol">
      {items}
    </ol>
  );
}

function parseParagraph(ctx: Ctx): ReactNode {
  const buf: string[] = [];
  while (ctx.i < ctx.lines.length && !isBlank(ctx.lines[ctx.i]) && !startsBlock(ctx.lines[ctx.i])) {
    buf.push(ctx.lines[ctx.i]);
    ctx.i++;
  }
  return (
    <p key={`p-${ctx.keyRef.k++}`} className="md-p">
      {renderInlineMultiline(ctx, buf.join('\n'))}
    </p>
  );
}

/**
 * Render Markdown source into React nodes.
 *
 * @param text          Raw Markdown source.
 * @param renderInline  Inline renderer (data-tags, bold, italic, code, links).
 * @param keyRef        Optional shared key counter (used for recursive calls so
 *                      keys stay unique across the whole tree).
 */
export function renderMarkdownBlocks(
  text: string,
  renderInline: InlineRenderer,
  keyRef?: { k: number },
): ReactNode {
  const src = text.replace(/\r\n?/g, '\n');
  const ctx: Ctx = {
    lines: src.split('\n'),
    i: 0,
    keyRef: keyRef ?? { k: 0 },
    renderInline,
  };

  const blocks: ReactNode[] = [];
  while (ctx.i < ctx.lines.length) {
    const line = ctx.lines[ctx.i];

    if (isBlank(line)) {
      ctx.i++;
      continue;
    }

    if (FENCE_OPEN_RE.test(line)) {
      blocks.push(parseFencedCode(ctx));
    } else if (HEADING_RE.test(line)) {
      blocks.push(parseHeading(ctx));
    } else if (HR_RE.test(line)) {
      ctx.i++;
      blocks.push(<hr key={`hr-${ctx.keyRef.k++}`} className="md-hr" />);
    } else if (QUOTE_RE.test(line)) {
      blocks.push(parseBlockquote(ctx));
    } else if (UL_RE.test(line)) {
      blocks.push(parseUnorderedList(ctx));
    } else if (OL_RE.test(line)) {
      blocks.push(parseOrderedList(ctx));
    } else {
      blocks.push(parseParagraph(ctx));
    }
  }

  return <>{blocks}</>;
}

/**
 * Reduce Markdown source to a single-line plain-text string, for use in list
 * previews / snippets where formatting is not desired.
 */
export function stripMarkdownForPreview(text: string): string {
  return text
    .replace(/\r\n?/g, '\n')
    // Drop fenced code blocks entirely.
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/~~~[\s\S]*?~~~/g, ' ')
    // Drop block markers.
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/^\s{0,3}>\s?/gm, '')
    .replace(/^\s{0,3}[-*+]\s+/gm, '')
    .replace(/^\s{0,3}\d+\.\s+/gm, '')
    .replace(/^\s{0,3}([-*_])\1{2,}\s*$/gm, ' ')
    // Strip inline markers.
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    // Collapse whitespace.
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
