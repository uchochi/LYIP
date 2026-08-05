import type { ReactNode } from 'react';
import { renderMarkdownBlocks, type InlineRenderer } from './markdown';

/**
 * Post-content renderer.
 *
 * Public entry point is `renderWithTags(text)` — it runs the Markdown block
 * parser (see markdown.tsx) and, for each inline span, applies:
 *   - `[youtube:ID]` embeds
 *   - inline code (`code`)
 *   - bold (**b** / __b__), italic (*i* / _i_)
 *   - Markdown + bare links
 *   - data-tag pills for tech terms / languages (Python, Swahili, ...)
 *
 * Everything returns real React nodes (no dangerouslySetInnerHTML) -> XSS-safe.
 */

const DATA_TAG_PATTERN =
  /(`[^`]+`|BeautifulSoup|Playwright|Selenium|Pandas|NumPy|Scikit-learn|TensorFlow|PyTorch|HuggingFace|OpenAI|GPT-?[0-9]?|Claude|BERT|LoRA|FineML|rAG|JSONL?|CSV|API|SQL|Python|JavaScript|TypeScript|React|Vite|Supabase|PostgreSQL|FastAPI|Flask|Docker|Kubernetes|GitHub|[a-zA-Z0-9_-]+-?\d{4}-?[a-zA-Z-]*|Swahili|Yoruba|Hausa|Igbo)/g;

export interface ParsedSegment {
  type: 'text' | 'tag';
  value: string;
}

export function parseDataTags(text: string): ParsedSegment[] {
  const segments: ParsedSegment[] = [];
  let lastIndex = 0;
  DATA_TAG_PATTERN.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = DATA_TAG_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', value: text.slice(lastIndex, match.index) });
    }
    let raw = match[0];
    if (raw.startsWith('`') && raw.endsWith('`')) raw = raw.slice(1, -1);
    segments.push({ type: 'tag', value: raw });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    segments.push({ type: 'text', value: text.slice(lastIndex) });
  }
  return segments.length === 0 ? [{ type: 'text', value: text }] : segments;
}

// --- inline helpers --------------------------------------------------------

const YOUTUBE_RE = /\[youtube:([a-zA-Z0-9_-]+)\]/g;
// Sentinel used to mark youtube embeds before Markdown parsing, so they survive
// block tokenisation and are re-hydrated during inline rendering. NUL bytes are
// safe because users cannot type them into a textarea.
const YT_SENTINEL_RE = /\u0000YT(\d+)\u0000/g;

const URL_RE = /https?:\/\/[^\s<>"')]+|www\.[^\s<>"')]+/;
const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const LINK_RE = new RegExp(`(${URL_RE.source})|(${EMAIL_RE.source})`, 'g');

// Bold / italic / Markdown-link source. Bold is listed before italic so `**x**`
// wins over `*x*` at the same position. Captures are non-greedy to avoid run-on.
//
// IMPORTANT: this is a *source string*, not a shared RegExp. renderStyled()
// recurses into itself (bold/italic content is re-rendered inline), so each call
// MUST get its own RegExp instance — otherwise a child call's `lastIndex = 0`
// resets the parent's in-progress iteration and causes an infinite loop.
const STYLED_RE_SRC = [
  '\\*\\*([\\s\\S]+?)\\*\\*', // 1: **bold**
  '__([\\s\\S]+?)__', // 2: __bold__
  '\\*([\\s\\S]+?)\\*', // 3: *italic*
  '_([\\s\\S]+?)_', // 4: _italic_
  '\\[([^\\]]+)\\]\\((https?://[^)\\s]+)\\)', // 5,6: [text](url)
].join('|');

/** Render data-tag pills for known tech terms; plain text passes through. */
function renderDataTags(text: string, keyRef: { k: number }): ReactNode[] {
  return parseDataTags(text).map((seg) =>
    seg.type === 'tag' ? (
      <span key={`t-${keyRef.k++}`} className="data-tag">{seg.value}</span>
    ) : (
      <span key={`t-${keyRef.k++}`}>{seg.value}</span>
    ),
  );
}

/**
 * Render a plain (non-code, non-styled) span: linkify URLs/emails first so they
 * are protected from data-tag matching, then apply data-tag pills to the rest.
 */
function renderPlainText(text: string, keyRef: { k: number }): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  LINK_RE.lastIndex = 0;
  while ((m = LINK_RE.exec(text)) !== null) {
    if (m.index > last) nodes.push(...renderDataTags(text.slice(last, m.index), keyRef));
    const tok = m[0];
    if (/^https?:\/\//.test(tok) || /^www\./.test(tok)) {
      const href = tok.startsWith('http') ? tok : `https://${tok}`;
      nodes.push(
        <a key={`u-${keyRef.k++}`} href={href} target="_blank" rel="noopener noreferrer" className="md-link">
          {tok}
        </a>,
      );
    } else {
      nodes.push(
        <a key={`m-${keyRef.k++}`} href={`mailto:${tok}`} className="md-link">
          {tok}
        </a>,
      );
    }
    last = m.index + tok.length;
  }
  if (last < text.length) nodes.push(...renderDataTags(text.slice(last), keyRef));
  return nodes;
}

/** Apply bold/italic/link styling; recurse into styled content for nesting. */
function renderStyled(text: string, keyRef: { k: number }, embeds: string[]): ReactNode[] {
  const nodes: ReactNode[] = [];
  const re = new RegExp(STYLED_RE_SRC, 'g'); // fresh instance per call -> recursion-safe
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(...renderPlainText(text.slice(last, m.index), keyRef));
    const [full, bold1, bold2, italic1, italic2, linkText, linkUrl] = m;
    if (typeof bold1 === 'string') {
      nodes.push(<strong key={`b-${keyRef.k++}`}>{renderInlineCore(bold1, keyRef, embeds)}</strong>);
    } else if (typeof bold2 === 'string') {
      nodes.push(<strong key={`b-${keyRef.k++}`}>{renderInlineCore(bold2, keyRef, embeds)}</strong>);
    } else if (typeof italic1 === 'string') {
      nodes.push(<em key={`i-${keyRef.k++}`}>{renderInlineCore(italic1, keyRef, embeds)}</em>);
    } else if (typeof italic2 === 'string') {
      nodes.push(<em key={`i-${keyRef.k++}`}>{renderInlineCore(italic2, keyRef, embeds)}</em>);
    } else if (linkText !== undefined && linkUrl !== undefined) {
      nodes.push(
        <a key={`l-${keyRef.k++}`} href={linkUrl} target="_blank" rel="noopener noreferrer" className="md-link">
          {linkText}
        </a>,
      );
    }
    last = m.index + full.length;
    if (full.length === 0) re.lastIndex++; // guard against zero-length matches
  }
  if (last < text.length) nodes.push(...renderPlainText(text.slice(last), keyRef));
  return nodes;
}

function YoutubeEmbed({ videoId }: { videoId: string }) {
  return (
    <span className="md-youtube" style={{ display: 'block', margin: '12px 0' }}>
      <iframe
        width="100%"
        height="280"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video"
        frameBorder={0}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ borderRadius: '10px', border: 'none', display: 'block' }}
      />
    </span>
  );
}

/**
 * Core inline renderer (no sentinel handling): inline code first, then styling,
 * then plain text. `embeds` is threaded for completeness in case a sentinel
 * ends up inside styled content.
 */
function renderInlineCore(text: string, keyRef: { k: number }, embeds: string[]): ReactNode[] {
  if (!text) return [];
  const nodes: ReactNode[] = [];
  // Inline code: split on backtick runs first so their content is protected.
  const codeSplit = text.split(/(`[^`]+`)/g);
  for (const chunk of codeSplit) {
    if (!chunk) continue;
    if (chunk.length >= 2 && chunk.startsWith('`') && chunk.endsWith('`')) {
      nodes.push(<code key={`c-${keyRef.k++}`} className="md-code">{chunk.slice(1, -1)}</code>);
      continue;
    }
    nodes.push(...renderStyled(chunk, keyRef, embeds));
  }
  return nodes;
}

/**
 * Full inline renderer (used as the `InlineRenderer` for the Markdown block
 * parser). Handles `[youtube:ID]` sentinels, then delegates to renderInlineCore.
 */
function renderInlineRich(text: string, keyRef: { k: number }, embeds: string[]): ReactNode[] {
  if (!text) return [];
  const nodes: ReactNode[] = [];
  YT_SENTINEL_RE.lastIndex = 0;
  let last = 0;
  let m: RegExpExecArray | null;
  let hadSentinel = false;
  while ((m = YT_SENTINEL_RE.exec(text)) !== null) {
    hadSentinel = true;
    if (m.index > last) nodes.push(...renderInlineCore(text.slice(last, m.index), keyRef, embeds));
    const id = embeds[Number(m[1])];
    if (id) nodes.push(<YoutubeEmbed key={`yt-${keyRef.k++}`} videoId={id} />);
    last = m.index + m[0].length;
  }
  const tail = hadSentinel ? text.slice(last) : text;
  if (tail) nodes.push(...renderInlineCore(tail, keyRef, embeds));
  return nodes;
}

// --- public entry point ----------------------------------------------------

export function renderWithTags(text: string): ReactNode[] {
  if (!text) return [];

  // 1. Extract [youtube:ID] embeds into a side list and replace with sentinels
  //    so they pass cleanly through block tokenisation.
  const embeds: string[] = [];
  YOUTUBE_RE.lastIndex = 0;
  const sentinelled = text.replace(YOUTUBE_RE, (_full, id: string) => {
    embeds.push(id);
    return `\u0000YT${embeds.length - 1}\u0000`;
  });

  // 2. Inline renderer bound to this render's embeds.
  const renderInline: InlineRenderer = (t, keyRef) => renderInlineRich(t, keyRef, embeds);

  // 3. Run the Markdown block parser.
  return [
    <span key="root" className="md-root">
      {renderMarkdownBlocks(sentinelled, renderInline)}
    </span>,
  ];
}
