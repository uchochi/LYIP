import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import QuizOption from '../components/quiz/QuizOption';
import QuizProgress from '../components/quiz/QuizProgress';
import QuizResult, { type QuizAnswers } from '../components/quiz/QuizResult';
import { saveQuizResponse } from '../services/forumService';
import '../forum.css';

interface Option {
  emoji: string;
  label: string;
  sublabel?: string;
}

interface Question {
  key: keyof QuizAnswers;
  title: string;
  subtitle: string;
  multi?: boolean;
  options: Option[];
}

const QUESTIONS: Question[] = [
  {
    key: 'intent',
    title: 'What brings you here today?',
    subtitle: 'No wrong answers — just helps us point you in the right direction!',
    options: [
      { emoji: '📝', label: 'I want to contribute datasets' },
      { emoji: '💰', label: 'I want to earn money contributing' },
      { emoji: '🎓', label: 'I want to learn new skills' },
      { emoji: '🌍', label: 'I want to help make AI more inclusive' },
      { emoji: '🤝', label: 'I want to join the community' },
    ],
  },
  {
    key: 'languages',
    title: 'Which languages can you read and write comfortably?',
    subtitle: 'Pick all that apply — your languages are your superpower!',
    multi: true,
    options: [
      { emoji: '🇬🇧', label: 'English' },
      { emoji: '🇳🇬', label: 'Hausa' },
      { emoji: '🇳🇬', label: 'Yoruba' },
      { emoji: '🇳🇬', label: 'Igbo' },
      { emoji: '🇰🇪', label: 'Swahili' },
      { emoji: '🇿🇦', label: 'Zulu' },
      { emoji: '🇪🇹', label: 'Amharic' },
      { emoji: '🇮🇳', label: 'Hindi' },
      { emoji: '🇨🇳', label: 'Mandarin' },
      { emoji: '🇸🇦', label: 'Arabic' },
      { emoji: '🇧🇷', label: 'Portuguese' },
      { emoji: '🇯🇵', label: 'Japanese' },
      { emoji: '🇰🇷', label: 'Korean' },
      { emoji: '🇫🇷', label: 'French' },
      { emoji: '🇪🇸', label: 'Spanish' },
      { emoji: '🇩🇪', label: 'German' },
      { emoji: '🇷🇺', label: 'Russian' },
      { emoji: '🇹🇷', label: 'Turkish' },
      { emoji: '🇻🇳', label: 'Vietnamese' },
      { emoji: '🇧🇩', label: 'Bengali' },
      { emoji: '🇵🇰', label: 'Urdu' },
      { emoji: '🌍', label: 'Other / Multiple' },
    ],
  },
  {
    key: 'experience',
    title: 'How familiar are you with data or datasets?',
    subtitle: "There's no wrong answer — we meet you where you are!",
    options: [
      { emoji: '🌱', label: "I'm completely new", sublabel: "And that's perfectly fine!" },
      { emoji: '🌿', label: "I've worked with data a little bit" },
      { emoji: '🌳', label: "I'm fairly comfortable with datasets" },
      { emoji: '🎯', label: "I'm a data pro" },
    ],
  },
  {
    key: 'skills',
    title: "What sounds like something you'd enjoy?",
    subtitle: 'Pick all that sound fun — you can always change this later.',
    multi: true,
    options: [
      { emoji: '✍️', label: 'Writing & editing text' },
      { emoji: '🎙️', label: 'Recording audio / voice' },
      { emoji: '🌐', label: 'Translating between languages' },
      { emoji: '🔍', label: 'Researching & collecting data' },
      { emoji: '💻', label: 'Working with code or scripts' },
      { emoji: '📊', label: 'Labeling or categorizing content' },
    ],
  },
  {
    key: 'availability',
    title: 'How much time could you dedicate weekly?',
    subtitle: 'Be honest — we work with any schedule!',
    options: [
      { emoji: '⏰', label: 'A few hours here and there' },
      { emoji: '📅', label: 'Part-time', sublabel: '10–20 hrs/week' },
      { emoji: '🚀', label: 'Full-time commitment' },
      { emoji: '🤷', label: 'Not sure yet', sublabel: "Just exploring for now" },
    ],
  },
  {
    key: 'motivation',
    title: 'What would make this most worthwhile for you?',
    subtitle: 'Your "why" helps us recommend the right opportunities.',
    options: [
      { emoji: '💵', label: 'Earning consistent income' },
      { emoji: '📈', label: 'Building skills for my career' },
      { emoji: '🏆', label: 'Contributing to cutting-edge AI datasets' },
      { emoji: '🌐', label: 'Helping underrepresented languages thrive' },
      { emoji: '🎯', label: 'All of the above!' },
    ],
  },
  {
    key: 'device',
    title: 'What will you mainly use to work?',
    subtitle: 'This helps us suggest the right type of datasets for your setup.',
    options: [
      { emoji: '📱', label: 'Phone / mobile' },
      { emoji: '💻', label: 'Laptop' },
      { emoji: '🖥️', label: 'Desktop' },
      { emoji: '📲', label: 'Both phone and computer' },
    ],
  },
];

const TOTAL_STEPS = QUESTIONS.length;

export default function QuizPage() {
  const [step, setStep] = useState(-1);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [saved, setSaved] = useState(false);

  const isWelcome = step === -1;
  const isResult = step >= TOTAL_STEPS;
  const currentQ = !isWelcome && !isResult ? QUESTIONS[step] : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  useEffect(() => {
    if (isResult && !saved) {
      setSaved(true);
      saveQuizResponse(answers).catch(() => {});
      localStorage.setItem('quiz_completed', JSON.stringify(answers));
    }
  }, [isResult, saved, answers]);

  const goNext = () => {
    setStep((s) => s + 1);
  };

  const goBack = () => {
    setStep((s) => Math.max(-1, s - 1));
  };

  const selectSingle = (key: keyof QuizAnswers, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setTimeout(goNext, 200);
  };

  const selectMulti = (key: keyof QuizAnswers, value: string) => {
    setAnswers((prev) => {
      const arr = (prev[key] as string[]) || [];
      const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
      return { ...prev, [key]: next };
    });
  };

  const multiDone = (() => {
    if (!currentQ?.multi) return false;
    const val = answers[currentQ.key] as string[] | undefined;
    return val && val.length > 0;
  })();

  if (isResult) {
    return (
      <div className="forum-dark" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div className="comment-card" style={{ maxWidth: '480px', width: '100%', padding: '32px 24px' }}>
          <QuizResult answers={answers} onRetake={() => { setStep(-1); setAnswers({}); setSaved(false); }} />
        </div>
      </div>
    );
  }

  if (isWelcome) {
    return (
      <div className="forum-dark" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div className="comment-card" style={{ maxWidth: '480px', width: '100%', padding: '40px 28px', textAlign: 'center' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>🎯</div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '12px', lineHeight: 1.3 }}>
            Let's find your<br />perfect starting point!
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px', lineHeight: 1.5 }}>
            Answer a few quick questions and we'll guide you to the right datasets.
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 600, marginBottom: '28px' }}>
            ✨ No experience needed — we'll teach you everything!
          </p>
          <button className="btn-send" type="button" onClick={goNext} style={{ width: '100%', padding: '16px', fontSize: '1rem' }}>
            Get Started →
          </button>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '16px' }}>
            ⏱️ Takes about 60 seconds
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="forum-dark" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="comment-card" style={{ maxWidth: '520px', width: '100%', padding: '28px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <button
            type="button"
            onClick={goBack}
            style={{
              background: 'none', border: 'none', color: 'var(--text-muted)',
              cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center',
              fontFamily: 'inherit',
            }}
          >
            <ArrowLeft size={18} />
          </button>
        </div>

        <QuizProgress current={step + 1} total={TOTAL_STEPS} />

        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
          {currentQ!.title}
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
          {currentQ!.subtitle}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '50vh', overflowY: 'auto', paddingRight: '4px' }}>
          {currentQ!.options.map((opt) => {
            const val = answers[currentQ!.key];
            const isSelected = currentQ!.multi
              ? ((val as string[]) || []).includes(opt.label)
              : val === opt.label;
            return (
              <QuizOption
                key={opt.label}
                emoji={opt.emoji}
                label={opt.label}
                sublabel={opt.sublabel}
                selected={isSelected}
                multi={currentQ!.multi}
                onClick={() =>
                  currentQ!.multi
                    ? selectMulti(currentQ!.key, opt.label)
                    : selectSingle(currentQ!.key, opt.label)
                }
              />
            );
          })}
        </div>

        {currentQ!.multi && (
          <button
            className="btn-send"
            type="button"
            onClick={goNext}
            disabled={!multiDone}
            style={{
              width: '100%',
              marginTop: '16px',
              padding: '14px',
              fontSize: '0.95rem',
              opacity: multiDone ? 1 : 0.4,
              cursor: multiDone ? 'pointer' : 'not-allowed',
            }}
          >
            Continue →
          </button>
        )}

        <div style={{ textAlign: 'center', marginTop: '12px' }}>
          <button
            type="button"
            onClick={goNext}
            style={{
              background: 'none', border: 'none', color: 'var(--text-muted)',
              fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Skip this question →
          </button>
        </div>
      </div>
    </div>
  );
}
