import { useState, useRef } from 'react';
import { Reply, Trash2, Pencil } from 'lucide-react';
import MiniAvatar from './MiniAvatar';
import ReactionBar from './ReactionBar';
import MarkdownToolbar from './MarkdownToolbar';
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
  isStaff?: boolean;
  showActions?: boolean;
  onReply?: () => void;
  onDelete?: () => void;
  onEdit?: (content: string) => Promise<void>;
  onToggleReaction: (emoji: string) => void;
}

function badgeFor(role: string | null | undefined): { label: string; cls: string } | null {
  if (role === 'admin') return { label: 'ADMIN', cls: 'badge-admin' };
  if (role === 'senior_instructor' || role === 'instructor') return { label: 'MOD', cls: 'badge-mod' };
  return null;
}

/** A post counts as "edited" if updated_at is meaningfully later than created_at. */
function isEdited(post: { created_at: string; updated_at: string }): boolean {
  const created = new Date(post.created_at).getTime();
  const updated = new Date(post.updated_at).getTime();
  return Number.isFinite(updated) && updated > created + 1000;
}

export default function MessageCard({
  post,
  isReply = false,
  isOP = false,
  reactions,
  currentUserId,
  isAdmin = false,
  isStaff = false,
  showActions = true,
  onReply,
  onDelete,
  onEdit,
  onToggleReaction,
}: MessageCardProps) {
  const user = post.user;
  const displayName = user?.username || user?.name || 'Unknown';
  const badge = badgeFor(user?.role);
  // Moderators can delete any post; editing stays author-or-admin only.
  const canEdit = isAdmin || post.author_id === currentUserId;
  const canDelete = isAdmin || isStaff || post.author_id === currentUserId;

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(post.content);
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState('');
  const draftRef = useRef<HTMLTextAreaElement>(null);

  const startEdit = () => {
    setDraft(post.content);
    setEditError('');
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditError('');
  };

  const saveEdit = async () => {
    if (!onEdit) return;
    const trimmed = draft.trim();
    if (!trimmed) {
      setEditError('Content cannot be empty.');
      return;
    }
    setSaving(true);
    setEditError('');
    try {
      await onEdit(trimmed);
      setEditing(false);
    } catch (e) {
      setEditError(e instanceof Error ? e.message : 'Could not save edit.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`comment-card ${isReply ? 'reply' : ''} ${isOP ? 'op' : ''}`}>
      <div className="user-row">
        <MiniAvatar name={user?.name || displayName} color={user?.avatar_color} />
        <span className="username">{displayName}</span>
        {badge && <span className={`badge ${badge.cls}`}>{badge.label}</span>}
        {isOP && <span className="badge badge-admin">OP</span>}
        <span className="timestamp">
          {formatRelative(post.created_at)}
          {isEdited(post) && (
            <span className="edited-mark" title={`edited ${formatRelative(post.updated_at)}`}>(edited)</span>
          )}
        </span>
      </div>

      {editing ? (
        <div className="edit-box" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <MarkdownToolbar textareaRef={draftRef} value={draft} onChange={setDraft} compact />
          <textarea
            ref={draftRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={4}
            style={{
              width: '100%', background: 'var(--surface-lighter)', border: '1px solid var(--border)',
              borderRadius: '8px', color: 'white', padding: '10px', boxSizing: 'border-box',
              fontFamily: "'SFMono-Regular', ui-monospace, Menlo, Consolas, monospace",
              fontSize: '13px', lineHeight: 1.6, outline: 'none', resize: 'vertical',
            }}
          />
          {editError && <span style={{ fontSize: '12px', color: 'var(--live-red)' }}>{editError}</span>}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button type="button" className="btn-send" disabled={saving} onClick={saveEdit} style={{ fontSize: '12px', padding: '5px 14px' }}>
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              disabled={saving}
              style={{
                background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)',
                padding: '5px 14px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', fontSize: '12px',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="comment-body">
          {renderWithTags(post.content)}
          {post.sticker_url && (
            <img src={post.sticker_url} className="sticker-img" alt="Sticker" loading="lazy" />
          )}
        </div>
      )}

      <ReactionBar reactions={reactions} currentUserId={currentUserId} onToggle={onToggleReaction} />

      {showActions && !editing && (onReply || (canDelete && onDelete) || (canEdit && onEdit)) && (
        <div className="card-actions">
          {onReply && (
            <button className="card-action-btn" onClick={onReply} title="Reply" type="button">
              <Reply size={13} />
            </button>
          )}
          {canEdit && onEdit && (
            <button className="card-action-btn" onClick={startEdit} title="Edit" type="button">
              <Pencil size={13} />
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
