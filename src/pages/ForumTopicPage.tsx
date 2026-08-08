import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Pin, Lock, AlertTriangle, X } from 'lucide-react';
import { getTopic, getPosts, createPost, deletePost, updatePost, getReactions, toggleReaction, incrementTopicView, updateTopic } from '../services/forumService';
import { supabase } from '../lib/supabase';
import { useTyping } from '../lib/useTyping';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/ui/Spinner';
import CommunityHeader from '../components/forum/CommunityHeader';
import MessageCard from '../components/forum/MessageCard';
import ChatInput from '../components/forum/ChatInput';
import '../forum.css';
import type { ForumTopic, ForumPost, ForumReaction } from '../types';

export default function ForumTopicPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const { user } = useAuth();
  const [topic, setTopic] = useState<ForumTopic | undefined>();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [reactions, setReactions] = useState<Record<string, ForumReaction[]>>({});
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [showVerifyBanner, setShowVerifyBanner] = useState(false);
  const [error, setError] = useState('');
  const [viewCount, setViewCount] = useState(0);

  const isAdmin = user?.role === 'admin';
  const isStaff = ['admin', 'senior_instructor', 'instructor'].includes(user?.role || '');
  const currentUserId = user?.id;

  const load = useCallback(async () => {
    if (!topicId) return;
    const [t, p] = await Promise.all([getTopic(topicId), getPosts(topicId)]);
    setTopic(t);
    setPosts(p);
    setViewCount(t?.view_count || 0);
    const ids = p.map((x) => x.id);
    if (ids.length > 0) {
      const r = await getReactions(ids);
      setReactions(r);
    }
    setLoading(false);
  }, [topicId]);

  useEffect(() => {
    load();
    if (topicId) incrementTopicView(topicId);
  }, [load, topicId]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const u = data.user;
      if (u && !u.email_confirmed_at) setShowVerifyBanner(true);
    });
  }, [topicId]);

  // Realtime: new posts + reactions
  useEffect(() => {
    if (!topicId) return;
    const postChannel = supabase
      .channel(`forum_posts:${topicId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'forum_posts', filter: `topic_id=eq.${topicId}` }, (payload) => {
        const newPost = payload.new as ForumPost;
        setPosts((prev) => (prev.some((p) => p.id === newPost.id) ? prev : [...prev, newPost]));
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'forum_posts', filter: `topic_id=eq.${topicId}` }, (payload) => {
        const updated = payload.new as ForumPost;
        setPosts((prev) => prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p)));
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'forum_posts', filter: `topic_id=eq.${topicId}` }, (payload) => {
        const oldId = payload.old?.id as string;
        setPosts((prev) => prev.filter((p) => p.id !== oldId));
      })
      .subscribe();

    const reactionChannel = supabase
      .channel(`forum_reactions:${topicId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'forum_post_reactions' }, async () => {
        const ids = posts.map((p) => p.id);
        if (ids.length > 0) {
          const r = await getReactions(ids);
          setReactions(r);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(postChannel);
      supabase.removeChannel(reactionChannel);
    };
  }, [topicId, posts]);

  // Real typing indicator (topic-scoped Supabase Realtime broadcast).
  const { typingNames, notifyTyping, notifyStopped } = useTyping(
    topicId,
    user ? { id: user.id, name: user.username || user.name } : null,
  );

  const handleSend = async (content: string, stickerUrl?: string | null) => {
    if (!topicId || (!content.trim() && !stickerUrl)) return;
    setSending(true);
    setError('');
    try {
      await createPost({ topic_id: topicId, content, parent_id: replyingTo, sticker_url: stickerUrl });
      setReplyingTo(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to post. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    setError('');
    try {
      await deletePost(id);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete message.');
    }
  };

  const handleEdit = async (postId: string, content: string) => {
    setError('');
    try {
      const updated = await updatePost(postId, content);
      setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, ...updated } : p)));
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to edit message.';
      setError(msg);
      throw new Error(msg); // rethrow so MessageCard can surface the error inline
    }
  };

  const handleToggleReaction = async (postId: string, emoji: string) => {
    if (!user) return;
    setError('');
    const uid = user.id;
    // Optimistic local update for instant feedback.
    setReactions((prev) => {
      const cur = prev[postId] || [];
      const exists = cur.find((r) => r.user_id === uid && r.emoji === emoji);
      const next = exists
        ? cur.filter((r) => !(r.user_id === uid && r.emoji === emoji))
        : [...cur, { id: `opt-${postId}-${uid}-${emoji}`, post_id: postId, user_id: uid, emoji, created_at: new Date().toISOString() }];
      return { ...prev, [postId]: next };
    });
    try {
      await toggleReaction(postId, emoji);
      const r = await getReactions([postId]);
      setReactions((prev) => ({ ...prev, ...r }));
    } catch (e) {
      setError('Could not update reaction. Please reload the page.');
      const r = await getReactions([postId]); // revert to server truth
      setReactions((prev) => ({ ...prev, ...r }));
    }
  };

  if (loading) return <div className="forum-dark"><div className="forum-wrapper" style={{ paddingTop: '40px' }}><Spinner /></div></div>;
  if (!topic) return <div className="forum-dark"><div className="forum-wrapper"><p style={{ color: 'var(--text-muted)' }}>Topic not found.</p></div></div>;

  const totalEngagement = Object.values(reactions).flat().length + (posts.length - 1);
  const isHot = totalEngagement > 5;

  const tagChips = (
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px', alignItems: 'center' }}>
      {isHot && <span className="badge badge-mod">🔥 Hot</span>}
      {topic.is_pinned && <span className="badge badge-admin"><Pin size={10} /> PINNED</span>}
      {topic.is_locked && <span className="badge badge-mod"><Lock size={10} /> LOCKED</span>}
      {topic.tags.map((tag) => (
        <span key={tag} className="data-tag">#{tag}</span>
      ))}
      {isStaff && (
        <button
          type="button"
          onClick={() => updateTopic(topic.id, { is_pinned: !topic.is_pinned }).then(() => setTopic({ ...topic, is_pinned: !topic.is_pinned }))}
          style={{
            marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: '3px',
            background: topic.is_pinned ? 'rgba(245,158,11,0.15)' : 'var(--surface-lighter)',
            border: '1px solid', borderColor: topic.is_pinned ? 'rgba(245,158,11,0.4)' : 'var(--border)',
            color: topic.is_pinned ? '#f59e0b' : 'var(--text-muted)',
            borderRadius: '6px', padding: '3px 8px', fontSize: '11px', fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          <Pin size={11} /> {topic.is_pinned ? 'Unpin' : 'Pin'}
        </button>
      )}
    </div>
  );

  return (
    <div className="forum-dark">
      <div className="forum-wrapper">
        <Link to="/forum" className="back-link"><ArrowLeft size={14} /> Back to Forum</Link>

        {error && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '8px 12px' }}>
            <AlertTriangle size={16} style={{ color: '#ef4444', flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '12px', color: '#ef4444', flex: 1 }}>{error}</div>
            <button onClick={() => setError('')} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0 }} title="Dismiss">
              <X size={14} />
            </button>
          </div>
        )}

        <CommunityHeader
          title={topic.title}
          showCommunityStats={false}
          topicStats={{
            views: Math.max(viewCount, totalEngagement * 3 + 5),
            reactions: Object.values(reactions).flat().length,
            replies: posts.length - 1
          }}
        />

        {showVerifyBanner && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', background: 'rgba(180,120,20,0.1)', border: '1px solid rgba(180,120,20,0.3)', borderRadius: '8px', padding: '8px 12px' }}>
            <AlertTriangle size={16} style={{ color: '#d29922', flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '12px', color: '#d29922', flex: 1 }}>
              <b>Heads-up:</b> verify your email when you get a chance. You can keep posting meanwhile.
            </div>
            <button onClick={() => setShowVerifyBanner(false)} style={{ background: 'none', border: 'none', color: '#d29922', cursor: 'pointer', padding: 0 }} title="Dismiss">
              <X size={14} />
            </button>
          </div>
        )}

        {tagChips}

        {/* Original post as first message card */}
        <MessageCard
          post={{
            id: topic.id,
            topic_id: topic.id,
            author_id: topic.author_id,
            content: topic.content,
            parent_id: null,
            sticker_url: null,
            is_emoji_only: false,
            created_at: topic.created_at,
            updated_at: topic.updated_at,
            user: topic.user,
          }}
          isOP
          reactions={reactions[topic.id] || []}
          currentUserId={currentUserId}
          isAdmin={isAdmin}
          showActions={false}
          onToggleReaction={(emoji) => handleToggleReaction(topic.id, emoji)}
        />

        {/* Replies */}
        {posts.map((post) => (
          <MessageCard
            key={post.id}
            post={post}
            isReply={!!post.parent_id}
            reactions={reactions[post.id] || []}
            currentUserId={currentUserId}
            isAdmin={isAdmin}
            onReply={user ? () => setReplyingTo(post.id) : undefined}
            onDelete={() => handleDelete(post.id)}
            onEdit={user ? (content) => handleEdit(post.id, content) : undefined}
            onToggleReaction={(emoji) => handleToggleReaction(post.id, emoji)}
          />
        ))}

        {user ? (
          <ChatInput
            typingUsers={typingNames}
            onTyping={notifyTyping}
            onStoppedTyping={notifyStopped}
            replyingTo={replyingTo}
            onCancelReply={() => setReplyingTo(null)}
            onSend={handleSend}
            disabled={sending || topic.is_locked}
            placeholder={topic.is_locked ? 'This topic is locked' : 'Drop your hot take or wisdom...'}
            buttonText={sending ? 'Launching...' : 'Drop It 🚀'}
          />
        ) : (
          <div className="input-box">
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, textAlign: 'center', padding: '6px' }}>
              <Link to="/login" style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>Sign in</Link> to join the conversation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
