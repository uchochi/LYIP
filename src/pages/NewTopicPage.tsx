import { useState, useRef, type FormEvent, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronRight } from 'lucide-react';
import { createTopic } from '../services/forumService';
import { renderWithTags } from '../lib/parseDataTags';
import MarkdownToolbar from '../components/forum/MarkdownToolbar';
import '../forum.css';

const REGIONS = ['', 'Africa', 'Asia', 'Europe', 'Americas', 'Oceania', 'Global'];

const cheat: CSSProperties = {
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid var(--border)',
  borderRadius: '4px',
  padding: '1px 5px',
  fontFamily: "'SFMono-Regular', ui-monospace, Menlo, Consolas, monospace",
  fontSize: '0.72rem',
  color: '#f4bf75',
};

export default function NewTopicPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [region, setRegion] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!title.trim()) { setError('Title is required'); return; }
    if (!content.trim()) { setError('Content is required'); return; }
    setSubmitting(true);
    try {
      const tagList = tags.split(',').map((t) => t.trim()).filter(Boolean);
      if (region) tagList.push(`region:${region.toLowerCase()}`);
      const topic = await createTopic({
        title: title.trim(),
        content: content.trim(),
        tags: tagList,
      });
      navigate(`/forum/${topic.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="forum-dark">
      <div className="forum-wrapper">
        <button onClick={() => navigate('/forum')} className="back-link" style={{ background: 'none', border: 'none', fontFamily: 'inherit' }} type="button">
          <ArrowLeft size={14} /> Back to Forum
        </button>
        <div className="topic-header" style={{ padding: '16px 20px' }}>
          <h2>✍️ Start a Discussion</h2>
        </div>
        <form onSubmit={handleSubmit} className="comment-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', background: 'var(--surface-lighter)', border: '1px solid var(--border)', borderRadius: '6px', color: 'white', padding: '8px', boxSizing: 'border-box', fontFamily: 'inherit', fontSize: '14px', outline: 'none' }}
              placeholder="What burning question or dataset insight do you have?"
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>Content</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowHelp((s) => !s)}
                  style={{
                    background: 'none', border: 'none', color: preview ? 'var(--text-muted)' : 'var(--accent-primary)',
                    fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                    display: 'inline-flex', alignItems: 'center', gap: '3px',
                  }}
                >
                  {showHelp ? <ChevronDown size={12} /> : <ChevronRight size={12} />} Markdown help
                </button>
                <div style={{ display: 'flex', background: 'var(--surface-lighter)', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
                  <button
                    type="button"
                    onClick={() => setPreview(false)}
                    style={{
                      padding: '4px 12px', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                      background: !preview ? 'var(--accent-primary)' : 'transparent',
                      color: !preview ? '#fff' : 'var(--text-muted)', border: 'none',
                    }}
                  >Write</button>
                  <button
                    type="button"
                    onClick={() => setPreview(true)}
                    style={{
                      padding: '4px 12px', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                      background: preview ? 'var(--accent-primary)' : 'transparent',
                      color: preview ? '#fff' : 'var(--text-muted)', border: 'none',
                    }}
                  >Preview</button>
                </div>
              </div>
            </div>

            {showHelp && (
              <div style={{
                background: 'var(--surface-lighter)', border: '1px solid var(--border)', borderRadius: '8px',
                padding: '10px 12px', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.7,
              }}>
                <div style={{ color: 'var(--text-main)', fontWeight: 600, marginBottom: '4px' }}>Markdown shortcuts</div>
                <div><code style={cheat}># Title</code> / <code style={cheat}>## Subtitle</code> — headings</div>
                <div><code style={cheat}>**bold**</code> · <code style={cheat}>*italic*</code> · <code style={cheat}>`code`</code></div>
                <div><code style={cheat}>{'>'} quote</code> — blockquote · <code style={cheat}>- item</code> — list</div>
                <div><code style={cheat}>```</code> — code block · blank line — new paragraph</div>
                <div><code style={cheat}>[text](https://url)</code> — link · <code style={cheat}>[youtube:ID]</code> — embed</div>
              </div>
            )}

            {preview ? (
              <div className="comment-card" style={{ minHeight: '210px', padding: '14px' }}>
                <div className="comment-body">
                  {content.trim()
                    ? renderWithTags(content)
                    : <span style={{ color: 'var(--text-muted)' }}>Nothing to preview yet — start typing in the Write tab.</span>}
                </div>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: '6px' }}>
                  <MarkdownToolbar textareaRef={contentRef} value={content} onChange={setContent} />
                </div>
                <textarea
                  ref={contentRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={9}
                  style={{
                    width: '100%', background: 'var(--surface-lighter)', border: '1px solid var(--border)', borderRadius: '6px',
                    color: 'white', padding: '10px', boxSizing: 'border-box',
                    fontFamily: "'SFMono-Regular', ui-monospace, Menlo, Consolas, 'Liberation Mono', monospace",
                    fontSize: '13.5px', lineHeight: 1.6, outline: 'none', resize: 'vertical',
                  }}
                  placeholder={'Spill the details — what do you want the community to know?\n\nTip: use Markdown for clean formatting:\n# Title\nA paragraph with **bold** and `code`.\n\n- a point\n- another point'}
                />
              </>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>Tags (comma separated, optional)</label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              style={{ width: '100%', background: 'var(--surface-lighter)', border: '1px solid var(--border)', borderRadius: '6px', color: 'white', padding: '8px', boxSizing: 'border-box', fontFamily: 'inherit', fontSize: '14px', outline: 'none' }}
              placeholder="e.g. transcription, formatting, audio"
            />
          </div>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>Region (optional)</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                style={{ background: 'var(--surface-lighter)', border: '1px solid var(--border)', borderRadius: '6px', color: 'white', padding: '8px 12px', fontFamily: 'inherit', fontSize: '14px', outline: 'none', cursor: 'pointer' }}
              >
                {REGIONS.map((r) => (
                  <option key={r} value={r}>{r || 'None'}</option>
                ))}
              </select>
            </div>
          </div>
          {error && <p style={{ fontSize: '12px', color: 'var(--live-red)', margin: '0 0 8px' }}>{error}</p>}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-send" type="submit" disabled={submitting}>
              {submitting ? 'Launching...' : 'Create Topic'}
            </button>
            <button type="button" onClick={() => navigate('/forum')} disabled={submitting} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '6px 16px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px' }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
