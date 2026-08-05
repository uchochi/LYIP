interface QuizProgressProps {
  current: number;
  total: number;
}

export default function QuizProgress({ current, total }: QuizProgressProps) {
  const pct = Math.round((current / total) * 100);
  return (
    <div style={{ width: '100%', marginBottom: '24px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px',
      }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
          Step {current} of {total}
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{pct}%</span>
      </div>
      <div style={{
        width: '100%',
        height: '4px',
        borderRadius: '4px',
        background: 'var(--surface-lighter)',
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${pct}%`,
          height: '100%',
          borderRadius: '4px',
          background: 'var(--accent-primary)',
          transition: 'width 0.3s ease',
        }} />
      </div>
    </div>
  );
}
