import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { createTopic } from '../services/forumService';
import '../forum.css';

export default function NewTopicPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!title.trim()) { setError('Title is required'); return; }
    if (!content.trim()) { setError('Content is required'); return; }
    setSubmitting(true);
    try {
      const topic = await createTopic({
        title: title.trim(),
        content: content.trim(),
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
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
        <div className="stats-header">
          <div className="topic-info">
            <h2>✍️ Start a Discussion</h2>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="comment-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', background: '#0d1117', border: '1px solid var(--border)', borderRadius: '6px', color: 'white', padding: '8px', boxSizing: 'border-box', fontFamily: 'inherit', fontSize: '14px', outline: 'none' }}
              placeholder="e.g. How to structure audio transcription datasets"
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              style={{ width: '100%', background: '#0d1117', border: '1px solid var(--border)', borderRadius: '6px', color: 'white', padding: '8px', boxSizing: 'border-box', fontFamily: 'inherit', fontSize: '14px', outline: 'none', resize: 'vertical' }}
              placeholder="Write your message..."
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>Tags (comma separated, optional)</label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              style={{ width: '100%', background: '#0d1117', border: '1px solid var(--border)', borderRadius: '6px', color: 'white', padding: '8px', boxSizing: 'border-box', fontFamily: 'inherit', fontSize: '14px', outline: 'none' }}
              placeholder="e.g. transcription, formatting, audio"
            />
          </div>
          {error && <p style={{ fontSize: '12px', color: 'var(--live-red)', margin: '0 0 8px' }}>{error}</p>}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-send" type="submit" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Topic'}
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
