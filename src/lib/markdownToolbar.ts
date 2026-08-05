/**
 * Helpers for Markdown formatting toolbars.
 *
 * Each helper is pure: given the current value + selection, it returns the new
 * value and the selection to restore afterwards. Callers wire this to a
 * <textarea> ref and restore the selection/focus after setState.
 */

export interface TextEdit {
  value: string;
  selStart: number;
  selEnd: number;
}

/** Wrap the current selection with `before` + `after` (e.g. **…** or `…`). */
export function wrapSelection(before: string, after: string, value: string, start: number, end: number): TextEdit {
  const selected = value.slice(start, end);
  const placeholder = selected.length === 0 ? 'text' : selected;
  const newValue = value.slice(0, start) + before + placeholder + after + value.slice(end);
  const caretStart = start + before.length;
  const caretEnd = caretStart + placeholder.length;
  return { value: newValue, selStart: caretStart, selEnd: caretEnd };
}

/** Prefix every selected line with `prefix` (e.g. "> ", "- ", "1. "). */
export function prefixLines(prefix: string, value: string, start: number, end: number): TextEdit {
  const lineStart = value.lastIndexOf('\n', start - 1) + 1;
  // Normalise end of selection to the end of a line if it spans multiple lines.
  const newValue = value.slice(0, lineStart) + prefix + value.slice(lineStart);
  return {
    value: newValue,
    selStart: start + prefix.length,
    selEnd: end + prefix.length,
  };
}

/** Insert a block (e.g. a fenced code block) on its own line at the cursor. */
export function insertBlock(block: string, value: string, start: number, end: number): TextEdit {
  const before = value.slice(0, start);
  const after = value.slice(end);
  const needsLeadingNl = before.length > 0 && !before.endsWith('\n');
  const needsTrailingNl = after.length > 0 && !after.startsWith('\n');
  const inserted = `${needsLeadingNl ? '\n' : ''}${block}${needsTrailingNl ? '\n' : ''}`;
  const newValue = before + inserted + after;
  const cursor = (start + inserted.length);
  return { value: newValue, selStart: cursor, selEnd: cursor };
}
