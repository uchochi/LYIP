import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Pin, Lock, AlertTriangle, X } from 'lucide-react';
import { getTopic, getPosts, createPost, deletePost, getReactions, toggleReaction, getMemberCount } from '../services/forumService';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/ui/Spinner';
import CommunityHeader from '../components/forum/CommunityHeader';
import MessageCard from '../components/forum/MessageCard';
import ChatInput from '../components/forum/ChatInput';
import '../forum.css';
import type { ForumTopic, ForumPost, ForumReaction } from '../types';

const ONLINE_BASE = 1850;
const ONLINE_JITTER_MAX = 320;

function pseudoOnlineCount(): number {
  const seed = Math.floor(Date.now() / 60000);
  return ONLINE_BASE + (seed % ONLINE_JITTER_MAX);
}

export default function ForumTopicPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const { user } = useAuth();
  const [topic, setTopic] = useState<ForumTopic | undefined>();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [reactions, setReactions] = useState<Record<string, ForumReaction[]>>({});
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [memberCount, setMemberCount] = useState(142804);
  const [onlineCount, setOnlineCount] = useState(pseudoOnlineCount());
  const [showVerifyBanner, setShowVerifyBanner] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  const isAdmin = user?.role === 'admin';
  const currentUserId = user?.id;

  const load = useCallback(async () => {
    if (!topicId) return;
    const [t, p] = await Promise.all([getTopic(topicId), getPosts(topicId)]);
    setTopic(t);
    setPosts(p);
    const ids = p.map((x) => x.id);
    if (ids.length > 0) {
      const r = await getReactions(ids);
      setReactions(r);
    }
    setLoading(false);
  }, [topicId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    getMemberCount().then((c) => setMemberCount(c + ONLINE_BASE));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setOnlineCount(pseudoOnlineCount()), 30000);
    return () => clearInterval(interval);
  }, []);

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

  // Simulated typing activity for busyness
  useEffect(() => {
    if (!topic) return;
    const handles = ['DataWiz', 'ScrapeMaster', 'KaggleKing', 'DataBeast_99', 'AutoPython', 'PyCollector', 'CleanData_42'];
    let timeout: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const delay = 8000 + Math.random() * 22000;
      timeout = setTimeout(() => {
        if (Math.random() < 0.65) {
          const count = 1 + Math.floor(Math.random() * 2);
          const picks = [...handles].sort(() => Math.random() - 0.5).slice(0, count);
          setTypingUsers(picks);
          setTimeout(() => setTypingUsers([]), 3000 + Math.random() * 3000);
        }
        schedule();
      }, delay);
    };
    schedule();
    return () => clearTimeout(timeout);
  }, [topic]);

  const handleSend = async (content: string, stickerUrl?: string | null) => {
    if (!topicId || (!content.trim() && !stickerUrl)) return;
    setSending(true);
    try {
      await createPost({ topic_id: topicId, content, parent_id: replyingTo, sticker_url: stickerUrl });
      setReplyingTo(null);
      await load();
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    await deletePost(id);
    await load();
  };

  const handleToggleReaction = async (postId: string, emoji: string) => {
    if (!user) return;
    try {
      await toggleReaction(postId, emoji);
      const r = await getReactions([postId]);
      setReactions((prev) => ({ ...prev, ...r }));
    } catch (err) {
      console.error('Reaction failed:', err);
    }
  };

  if (loading) return <div className="forum-dark"><div className="forum-wrapper" style={{ paddingTop: '40px' }}><Spinner /></div></div>;
  if (!topic) return <div className="forum-dark"><div className="forum-wrapper"><p style={{ color: 'var(--text-muted)' }}>Topic not found.</p></div></div>;

  const tagChips = (
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
      {topic.is_pinned && <span className="badge badge-admin"><Pin size={10} /> PINNED</span>}
      {topic.is_locked && <span className="badge badge-mod"><Lock size={10} /> LOCKED</span>}
      {topic.tags.map((tag) => (
        <span key={tag} className="data-tag">#{tag}</span>
      ))}
    </div>
  );

  return (
    <div className="forum-dark">
      <div className="forum-wrapper">
        <Link to="/forum" className="back-link"><ArrowLeft size={14} /> Back to Forum</Link>

        <CommunityHeader title={topic.title} memberCount={memberCount} onlineCount={onlineCount} />

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
            onToggleReaction={(emoji) => handleToggleReaction(post.id, emoji)}
          />
        ))}

        {user ? (
          <ChatInput
            typingUsers={typingUsers}
            replyingTo={replyingTo}
            onCancelReply={() => setReplyingTo(null)}
            onSend={handleSend}
            disabled={sending || topic.is_locked}
            placeholder={topic.is_locked ? 'This topic is locked' : 'Share a dataset or ask a question...'}
            buttonText={sending ? 'Posting...' : 'Post Update'}
          />
        ) : (
          <div className="input-box">
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, textAlign: 'center', padding: '6px' }}>
              <Link to="/admin/login" style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>Sign in</Link> to join the conversation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
