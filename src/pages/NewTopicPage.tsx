import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { createTopic } from '../services/forumService';
import { useAuth } from '../context/AuthContext';
import '../forum.css';

const REGIONS = ['', 'Africa', 'Asia', 'Europe', 'Americas', 'Oceania', 'Global'];

export default function NewTopicPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [region, setRegion] = useState('');
  const [enableDatasetSubmit, setEnableDatasetSubmit] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isStaff = user?.role === 'admin' || user?.role === 'senior_instructor' || user?.role === 'instructor';

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
        has_dataset_submit: enableDatasetSubmit,
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
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              style={{ width: '100%', background: 'var(--surface-lighter)', border: '1px solid var(--border)', borderRadius: '6px', color: 'white', padding: '8px', boxSizing: 'border-box', fontFamily: 'inherit', fontSize: '14px', outline: 'none', resize: 'vertical' }}
              placeholder="Spill the details — what do you want the community to know?"
            />
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
            {isStaff && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '22px' }}>
                <input
                  type="checkbox"
                  id="enable-dataset-submit"
                  checked={enableDatasetSubmit}
                  onChange={(e) => setEnableDatasetSubmit(e.target.checked)}
                  style={{ accentColor: 'var(--accent-primary)', width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <label htmlFor="enable-dataset-submit" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', cursor: 'pointer' }}>
                  Enable dataset submissions for this topic
                </label>
              </div>
            )}
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
