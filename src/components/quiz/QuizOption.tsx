interface QuizOptionProps {
  emoji: string;
  label: string;
  sublabel?: string;
  selected: boolean;
  multi?: boolean;
  onClick: () => void;
}

export default function QuizOption({ emoji, label, sublabel, selected, multi, onClick }: QuizOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        width: '100%',
        padding: '16px 20px',
        borderRadius: '14px',
        border: selected ? '2px solid var(--accent-primary)' : '1.5px solid var(--border)',
        background: selected ? 'var(--accent-primary-10, rgba(99,102,241,0.08))' : 'var(--surface-lighter)',
        cursor: 'pointer',
        fontFamily: 'inherit',
        textAlign: 'left',
        transition: 'all 0.15s ease',
        opacity: 1,
      }}
      onMouseEnter={(e) => {
        if (!selected) e.currentTarget.style.borderColor = 'var(--text-muted)';
      }}
      onMouseLeave={(e) => {
        if (!selected) e.currentTarget.style.borderColor = 'var(--border)';
      }}
    >
      <span style={{ fontSize: '1.5rem', flexShrink: 0, lineHeight: 1 }}>{emoji}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>{label}</div>
        {sublabel && (
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{sublabel}</div>
        )}
      </div>
      <span style={{
        flexShrink: 0,
        width: '24px',
        height: '24px',
        borderRadius: multi ? '6px' : '50%',
        border: selected ? 'none' : '2px solid var(--border)',
        background: selected ? 'var(--accent-primary)' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '13px',
        color: '#fff',
        transition: 'all 0.15s ease',
      }}>
        {selected && '✓'}
      </span>
    </button>
  );
}
