import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import '../forum.css';

interface VideoPart {
  num: string;
  title: string;
  videoId?: string;
  points: string[];
}

const PARTS: VideoPart[] = [
  {
    num: '1',
    title: 'Writing & Editing Text',
    videoId: 'ERZ4pO4yPRk',
    points: [
      'Standardize casing and punctuation for consistency',
      'Remove noise: HTML tags, excessive emojis, random characters',
      'Keep text clear and concise — strip fluff words',
    ],
  },
  {
    num: '2',
    title: 'Translating Between Languages',
    videoId: 'UuobID14bSE',
    points: [
      '1:1 alignment — every source entry needs exactly one translation',
      'Always use UTF-8 encoding to preserve special characters',
      'Match tone — formal source = formal translation',
    ],
  },
  {
    num: '3',
    title: 'Researching & Collecting Data',
    videoId: '4SUGOKVVfOg',
    points: [
      'Diversity is everything — narrow data creates biased AI',
      'Source from reputable, verified origins',
      'Never mix testing data with training data',
    ],
  },
  {
    num: '4',
    title: 'Working with Code or Scripts',
    videoId: 'PfVxFV1ZPnk',
    points: [
      'Convert raw data to structured formats: JSON, CSV, Parquet',
      'Use Pandas to automate cleaning at scale — never by hand',
      'Enforce schema consistency across every entry',
    ],
  },
  {
    num: '5',
    title: 'Labeling & Categorizing Content',
    videoId: 'OqdPoWmRPBU',
    points: [
      'Define your taxonomy (label list) BEFORE you start',
      'Choose the right granularity — not too broad, not too narrow',
      'Ensure inter-annotator agreement — same rules for everyone',
    ],
  },
];

export default function LearnPage() {
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const toggleComplete = (num: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(num)) next.delete(num);
      else next.add(num);
      return next;
    });
  };

  const allDone = completed.size === PARTS.length;

  return (
    <div className="forum-dark" style={{ minHeight: '100vh' }}>
      <div className="forum-wrapper" style={{ maxWidth: '760px', paddingTop: '20px' }}>
        <Link to="/forum" className="back-link" style={{ textDecoration: 'none' }}>
          <ArrowLeft size={14} /> Back to Forum
        </Link>

        <div className="topic-header" style={{ padding: '20px', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '6px' }}>
            Understanding Dataset Formatting for AI
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
            The foundation of high-performance machine learning. No experience needed — we'll teach you everything!
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
            {completed.size} of {PARTS.length} sections complete
          </p>
        </div>

        {PARTS.map((part) => {
          const isDone = completed.has(part.num);
          return (
            <div key={part.num} className="comment-card" style={{ padding: '20px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: isDone ? 'var(--accent-success)' : 'var(--surface-lighter)',
                  color: isDone ? '#fff' : 'var(--text-muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.85rem', fontWeight: 700, flexShrink: 0,
                  border: isDone ? 'none' : '1.5px solid var(--border)',
                }}>
                  {isDone ? <CheckCircle2 size={18} /> : part.num}
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', margin: 0, flex: 1 }}>
                  {part.title}
                </h3>
                <button
                  type="button"
                  onClick={() => toggleComplete(part.num)}
                  style={{
                    background: isDone ? 'rgba(16,185,129,0.15)' : 'var(--surface-lighter)',
                    border: '1px solid',
                    borderColor: isDone ? 'var(--accent-success)' : 'var(--border)',
                    color: isDone ? 'var(--accent-success)' : 'var(--text-muted)',
                    borderRadius: '6px', padding: '4px 10px', fontSize: '0.75rem',
                    fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  {isDone ? '✓ Done' : 'Mark Done'}
                </button>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 12px 42px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {part.points.map((pt, i) => (
                  <li key={i} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', paddingLeft: '16px', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 0, color: 'var(--accent-primary)' }}>▸</span>
                    {pt}
                  </li>
                ))}
              </ul>

              {part.videoId && (
                <div style={{ marginLeft: '42px', borderRadius: '10px', overflow: 'hidden' }}>
                  <iframe
                    width="100%"
                    height="260"
                    src={`https://www.youtube.com/embed/${part.videoId}`}
                    title={`Part ${part.num}: ${part.title}`}
                    frameBorder={0}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ borderRadius: '10px', border: 'none', display: 'block' }}
                  />
                </div>
              )}
            </div>
          );
        })}

        {allDone && (
          <div className="comment-card" style={{ padding: '24px', textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🎉</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
              You completed all 5 sections!
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              You're ready to start contributing datasets. Join the community!
            </p>
            <Link to="/forum" style={{ textDecoration: 'none' }}>
              <button className="btn-send" type="button" style={{ padding: '12px 28px' }}>
                Enter the Forum →
              </button>
            </Link>
          </div>
        )}

        {!allDone && (
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <Link to="/forum" style={{ textDecoration: 'none' }}>
              <button type="button" style={{
                background: 'none', border: 'none', color: 'var(--text-muted)',
                fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'inherit',
              }}>
                Skip for now — enter forum →
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
