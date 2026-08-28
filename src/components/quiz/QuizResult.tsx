import { Link } from 'react-router-dom';

export interface QuizAnswers {
  intent?: string;
  languages?: string[];
  experience?: string;
  skills?: string[];
  availability?: string;
  motivation?: string;
  device?: string;
}

interface QuizResultProps {
  answers: QuizAnswers;
  onRetake: () => void;
}

function recommendPath(answers: QuizAnswers): { tag: string; desc: string }[] {
  const tags: { tag: string; desc: string }[] = [];

  const skills = answers.skills || [];
  const languages = answers.languages || [];

  if (languages.length > 0) {
    tags.push({
      tag: `🌐 ${languages.length} Language${languages.length > 1 ? 's' : ''}`,
      desc: languages.slice(0, 4).join(', '),
    });
  }

  if (skills.includes('Writing & editing text')) tags.push({ tag: '✍️ Text Datasets', desc: 'Formatting, writing, editing text for AI training' });
  if (skills.includes('Recording audio / voice')) tags.push({ tag: '🎙️ Audio Datasets', desc: 'Voice recordings, transcriptions, speech data' });
  if (skills.includes('Translating between languages')) tags.push({ tag: '🌐 Translation', desc: 'Bilingual translation and localization tasks' });
  if (skills.includes('Researching & collecting data')) tags.push({ tag: '🔍 Research', desc: 'Data collection and sourcing' });
  if (skills.includes('Working with code or scripts')) tags.push({ tag: '💻 Technical', desc: 'Data pipelines, formatting scripts, QA' });
  if (skills.includes('Labeling or categorizing content')) tags.push({ tag: '📊 Annotation', desc: 'Labeling, tagging, categorizing datasets' });

  if (!tags.length) tags.push({ tag: '🌱 Getting Started', desc: "We'll guide you through your first dataset!" });

  return tags;
}

export default function QuizResult({ answers, onRetake }: QuizResultProps) {
  const recs = recommendPath(answers);
  // Matches the option label from QuizPage ("I'm completely new", sublabel
  // "And that's perfectly fine!" is separate and not part of the stored value).
  const isBeginner = answers.experience === "I'm completely new";

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🎉</div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
        Here's your profile!
      </h2>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '28px', maxWidth: '380px', marginLeft: 'auto', marginRight: 'auto' }}>
        {isBeginner
          ? "You're all set to start — no experience needed! We'll walk you through everything step by step."
          : "Based on your answers, here's what we recommend for you."}
      </p>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        marginBottom: '28px',
        textAlign: 'left',
      }}>
        {recs.map((r, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            padding: '14px 16px',
            borderRadius: '12px',
            border: '1px solid var(--border)',
            background: 'var(--surface-lighter)',
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '2px' }}>
                {r.tag}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{r.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '-4px' }}>
          Next up
        </span>
        <Link to="/start" style={{ textDecoration: 'none' }}>
          <button className="btn-send" type="button" style={{ width: '100%', padding: '14px', fontSize: '0.95rem' }}>
            I want to learn how to format dataset →
          </button>
        </Link>
        {/* FORUM DISABLED (2026-08-28) — restore by uncommenting:
        <Link to="/forum" style={{ textDecoration: 'none' }}>
          <button
            type="button"
            style={{
              background: 'var(--accent-primary)', border: '1px solid var(--accent-primary)', color: 'white',
              width: '100%', padding: '14px', fontSize: '0.95rem', borderRadius: '12px', cursor: 'pointer',
              fontFamily: 'inherit', fontWeight: 600,
            }}
          >
            I already know how to format dataset, Start getting jobs →
          </button>
        </Link>
        */}
        <button
          type="button"
          onClick={onRetake}
          style={{
            background: 'none', border: 'none', color: 'var(--text-muted)',
            fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'inherit', padding: '6px',
          }}
        >
          ↻ Retake quiz
        </button>
      </div>
    </div>
  );
}
