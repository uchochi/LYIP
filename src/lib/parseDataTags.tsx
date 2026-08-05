import type { ReactNode } from 'react';

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

const YOUTUBE_PATTERN = /\[youtube:([a-zA-Z0-9_-]+)\]/g;

function renderTextSegment(text: string, keyRef: { k: number }): ReactNode[] {
  return parseDataTags(text).map((seg) =>
    seg.type === 'tag' ? (
      <span key={keyRef.k++} className="data-tag">{seg.value}</span>
    ) : (
      <span key={keyRef.k++}>{seg.value}</span>
    )
  );
}

export function renderWithTags(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const keyRef = { k: 0 };
  let lastIndex = 0;

  YOUTUBE_PATTERN.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = YOUTUBE_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(...renderTextSegment(text.slice(lastIndex, match.index), keyRef));
    }
    const videoId = match[1];
    nodes.push(
      <div key={keyRef.k++} style={{ margin: '12px 0', borderRadius: '10px', overflow: 'hidden', position: 'relative' }}>
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
      </div>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(...renderTextSegment(text.slice(lastIndex), keyRef));
  }

  return nodes.length === 0 ? [<span key={0}>{text}</span>] : nodes;
}
