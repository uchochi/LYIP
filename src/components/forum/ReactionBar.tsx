import type { ForumReaction } from '../../types';

interface ReactionBarProps {
  reactions: ForumReaction[];
  currentUserId?: string;
  onToggle: (emoji: string) => void;
}

const QUICK_EMOJIS = ['🙏', '👀', '✅', '🚀', '🔥', '💎', '🤔', '😂', '❤️'];

export default function ReactionBar({ reactions, currentUserId, onToggle }: ReactionBarProps) {
  const counts: Record<string, { count: number; active: boolean }> = {};
  for (const r of reactions) {
    if (!counts[r.emoji]) counts[r.emoji] = { count: 0, active: false };
    counts[r.emoji].count += 1;
    if (r.user_id === currentUserId) counts[r.emoji].active = true;
  }

  const existing = Object.entries(counts);
  const available = QUICK_EMOJIS.filter((e) => !counts[e]);

  return (
    <div className="reactions">
      {existing.map(([emoji, info]) => (
        <button
          key={emoji}
          className={`react ${info.active ? 'active' : ''}`}
          onClick={() => onToggle(emoji)}
          type="button"
        >
          <span>{emoji}</span>
          <span>{info.count}</span>
        </button>
      ))}
      {available.length > 0 && (
        <button
          className="react-add"
          onClick={() => onToggle(available[0])}
          title="React"
          type="button"
        >
          😊+
        </button>
      )}
    </div>
  );
}
