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

export function renderWithTags(text: string): ReactNode[] {
  return parseDataTags(text).map((seg, i) =>
    seg.type === 'tag' ? (
      <span key={i} className="data-tag">{seg.value}</span>
    ) : (
      <span key={i}>{seg.value}</span>
    )
  );
}
