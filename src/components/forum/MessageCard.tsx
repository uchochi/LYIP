import { Reply, Trash2 } from 'lucide-react';
import MiniAvatar from './MiniAvatar';
import ReactionBar from './ReactionBar';
import { renderWithTags } from '../../lib/parseDataTags';
import { formatRelative } from '../../lib/relativeTime';
import type { ForumPost, ForumReaction, ForumUser } from '../../types';

interface MessageCardProps {
  post: ForumPost | (Omit<ForumPost, 'user'> & { user?: ForumUser });
  isReply?: boolean;
  isOP?: boolean;
  reactions: ForumReaction[];
  currentUserId?: string;
  isAdmin?: boolean;
  showActions?: boolean;
  onReply?: () => void;
  onDelete?: () => void;
  onToggleReaction: (emoji: string) => void;
}

function badgeFor(role: string | null | undefined): { label: string; cls: string } | null {
  if (role === 'admin') return { label: 'ADMIN', cls: 'admin' };
  if (role === 'senior_instructor' || role === 'instructor') return { label: 'MOD', cls: 'mod' };
  return null;
}

export default function MessageCard({
  post,
  isReply = false,
  isOP = false,
  reactions,
  currentUserId,
  isAdmin = false,
  showActions = true,
  onReply,
  onDelete,
  onToggleReaction,
}: MessageCardProps) {
  const user = post.user;
  const displayName = user?.username || user?.name || 'Unknown';
  const badge = badgeFor(user?.role);
  const canDelete = isAdmin || post.author_id === currentUserId;

  return (
    <div className={`comment-card ${isReply ? 'reply' : ''} ${isOP ? 'op' : ''}`}>
      <div className="user-row">
        <MiniAvatar name={user?.name || displayName} color={user?.avatar_color} />
        <span className="username">{displayName}</span>
        {badge && <span className={`badge ${badge.cls}`}>{badge.label}</span>}
        {isOP && <span className="badge admin">OP</span>}
        <span className="timestamp">{formatRelative(post.created_at)}</span>
      </div>
      <div className="comment-body">
        {renderWithTags(post.content)}
        {post.sticker_url && (
          <img src={post.sticker_url} className="sticker-img" alt="Sticker" loading="lazy" />
        )}
      </div>
      <ReactionBar reactions={reactions} currentUserId={currentUserId} onToggle={onToggleReaction} />
      {showActions && (onReply || (canDelete && onDelete)) && (
        <div className="card-actions">
          {onReply && (
            <button className="card-action-btn" onClick={onReply} title="Reply" type="button">
              <Reply size={13} />
            </button>
          )}
          {canDelete && onDelete && (
            <button className="card-action-btn" onClick={onDelete} title="Delete" type="button">
              <Trash2 size={13} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
