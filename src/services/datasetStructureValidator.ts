/**
 * datasetStructureValidator — client-side check that a submitted dataset
 * carries the unique LYIP export structure (see UNIQUE_DATASET_STRUCTURE.md).
 *
 * Machine-checkable formats: .jsonl, .json, .csv (and .txt, treated as JSONL).
 * Binary/remote formats (.parquet, external links) return null — they are
 * never auto-rejected by the 15-hour rule; staff review is the final gate.
 *
 * The verdict is intentionally boolean: user-facing notices say only that
 * "the structure doesn't align" — specifics are handled in the forum.
 */

/** Dataset IDs look like DS-62WG-GF (DS- + 4 chars + dash + 2–3 chars). */
const SIG_RE = /^DS-[A-Z0-9]{4}-[A-Z0-9]{2,3}$/;

function firstKey(obj: Record<string, unknown>): string | undefined {
  const k = Object.keys(obj)[0];
  return k === '' ? undefined : k;
}

// ---------------------------------------------------------------------------
// JSONL (and .txt)
// ---------------------------------------------------------------------------

function validateJSONL(text: string): boolean {
  const lines = text.split(/\r?\n/).filter((l) => l.trim() !== '');
  if (lines.length === 0) return false;

  // 1. Header block: the leading run of #-comments must announce the format + ID
  const headerComments: string[] = [];
  for (const raw of lines) {
    const line = raw.trim();
    if (line.startsWith('#')) headerComments.push(line);
    else break; // first data line ends the header block
  }
  const headerId = headerComments.join('\n').match(/ID:\s*(DS-[A-Z0-9-]+)/)?.[1];
  if (!headerId || !SIG_RE.test(headerId)) return false;

  // 2. Data lines: JSON objects whose FIRST key is _dataset_sig, consistent throughout
  let sawEntry = false;
  let prevSig: string | null = null;
  let sawFooter = false;
  for (const raw of lines.slice(1)) {
    const line = raw.trim();
    if (line.startsWith('#')) {
      if (/DATASET\s*FOOTER/i.test(line)) sawFooter = true;
      continue; // separator rules / footer metadata
    }
    let obj: Record<string, unknown>;
    try {
      obj = JSON.parse(line);
    } catch {
      return false; // not strict JSONL
    }
    if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) return false;
    const sig = firstKey(obj);
    if (sig !== '_dataset_sig') return false;
    const sigVal = String(obj._dataset_sig ?? '');
    if (!SIG_RE.test(sigVal) || sigVal !== headerId) return false;
    if (prevSig !== null && sigVal !== prevSig) return false;
    prevSig = sigVal;
    sawEntry = true;
  }

  return sawEntry && sawFooter;
}

// ---------------------------------------------------------------------------
// JSON
// ---------------------------------------------------------------------------

function validateJSON(text: string): boolean {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return false;
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return false;
  const root = parsed as Record<string, unknown>;

  // 1. _dataset_meta must be the first top-level key
  if (firstKey(root) !== '_dataset_meta') return false;

  const meta = root._dataset_meta as Record<string, unknown> | undefined;
  const data = root.data;
  if (!meta || !Array.isArray(data) || data.length === 0) return false;

  // 2. Metadata carries a valid ID + fingerprint
  const id = String(meta.id ?? '');
  const fp = String(meta.fingerprint ?? '');
  if (!SIG_RE.test(id) || !/^[0-9a-f]{32}$/.test(fp)) return false;

  // 3. Every entry: _dataset_sig is the first key and matches the meta ID
  return data.every((e) => {
    if (typeof e !== 'object' || e === null || Array.isArray(e)) return false;
    const entry = e as Record<string, unknown>;
    return firstKey(entry) === '_dataset_sig' && String(entry._dataset_sig) === id;
  });
}

// ---------------------------------------------------------------------------
// CSV
// ---------------------------------------------------------------------------

/** Minimal CSV field splitter (respects double-quoted fields). */
function splitCSVLine(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else inQuotes = false;
      } else cur += ch;
    } else if (ch === '"') inQuotes = true;
    else if (ch === ',') {
      out.push(cur);
      cur = '';
    } else cur += ch;
  }
  out.push(cur);
  return out;
}

function validateCSV(text: string): boolean {
  const lines = text.split(/\r?\n/).filter((l) => l.trim() !== '');
  if (lines.length < 3) return false;

  // 1. First line: #-comment header with pipe-delimited metadata incl. ID:DS-…
  const header = lines[0].trim();
  if (!header.startsWith('#')) return false;
  const headerId = header.match(/ID:\s*(DS-[A-Z0-9-]+)/)?.[1];
  if (!headerId || !SIG_RE.test(headerId)) return false;

  // 2. Column header: _dataset_sig is the FIRST column
  const cols = splitCSVLine(lines[1]).map((c) => c.trim());
  if (cols[0] !== '_dataset_sig') return false;

  // 3. Data rows: first field carries the same ID on every row
  let sawRow = false;
  for (const raw of lines.slice(2)) {
    const line = raw.trim();
    if (line.startsWith('#')) continue; // footer comment
    const fields = splitCSVLine(line);
    if (fields[0]?.trim() !== headerId) return false;
    sawRow = true;
  }

  // 4. Footer comment repeats the ID + fingerprint
  const footer = lines[lines.length - 1].trim();
  const hasFooter = footer.startsWith('#') && /DATASET_FOOTER/i.test(footer) && footer.includes(headerId);

  return sawRow && hasFooter;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export type StructureVerdict = boolean | null;

export function validateDatasetStructure(content: string, format: string | null | undefined): StructureVerdict {
  const f = (format || '').toLowerCase();
  if (f === 'json') return validateJSON(content);
  if (f === 'csv') return validateCSV(content);
  if (f === 'jsonl' || f === 'txt' || f === 'ndjson') return validateJSONL(content);
  return null; // parquet, links, unknown → not machine-checkable
}

/** Read a File's text (first 5 MB is plenty for signature checks). */
export async function readFileHead(file: File, maxBytes = 5 * 1024 * 1024): Promise<string> {
  const slice = file.slice(0, maxBytes);
  return slice.text();
}
