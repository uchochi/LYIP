import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus, Pin, Archive, Lock, Trash2, AlertTriangle, X } from 'lucide-react';
import { getTopics, deleteTopic, updateTopic, getMemberCount } from '../services/forumService';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import MiniAvatar from '../components/forum/MiniAvatar';
import CommunityHeader from '../components/forum/CommunityHeader';
import { formatRelative } from '../lib/relativeTime';
import '../forum.css';
import type { ForumTopic } from '../types';

export default function ForumPage() {
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [memberCount, setMemberCount] = useState(142804);
  const [onlineCount, setOnlineCount] = useState(2105);
  const { user } = useAuth();

  const isAdmin = user?.role === 'admin';
  const welcome = searchParams.get('welcome') === '1';
  const [showVerifyBanner, setShowVerifyBanner] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await getTopics();
    setTopics(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
    getMemberCount().then((c) => setMemberCount(c + 1850));
    const seed = Math.floor(Date.now() / 60000);
    setOnlineCount(1850 + (seed % 320));
    const interval = setInterval(() => {
      const s = Math.floor(Date.now() / 60000);
      setOnlineCount(1850 + (s % 320));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const u = data.user;
      if (u && !u.email_confirmed_at) setShowVerifyBanner(true);
    });
  }, []);

  useEffect(() => {
    if (!welcome && showVerifyBanner) return;
    const visits = Number(sessionStorage.getItem('forum_visits') || '0') + 1;
    sessionStorage.setItem('forum_visits', String(visits));
    if (visits % 3 === 0) setShowVerifyBanner(true);
  }, [welcome, showVerifyBanner]);

  const dismissBanner = () => {
    setShowVerifyBanner(false);
    sessionStorage.removeItem('forum_visits');
    if (welcome) {
      searchParams.delete('welcome');
      setSearchParams(searchParams, { replace: true });
    }
  };

  const handlePin = async (topic: ForumTopic) => {
    await updateTopic(topic.id, { is_pinned: !topic.is_pinned });
    await load();
  };

  const handleArchive = async (topic: ForumTopic) => {
    await updateTopic(topic.id, { is_archived: !topic.is_archived });
    await load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this topic permanently?')) return;
    await deleteTopic(id);
    await load();
  };

  if (loading) {
    return (
      <div className="forum-dark">
        <div className="forum-wrapper" style={{ paddingTop: '40px', justifyContent: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  const visibleTopics = topics.filter((t) => !t.is_archived || isAdmin);

  return (
    <div className="forum-dark">
      <div className="forum-wrapper">
        {(welcome || showVerifyBanner) && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', background: 'rgba(180,120,20,0.1)', border: '1px solid rgba(180,120,20,0.3)', borderRadius: '8px', padding: '10px 12px' }}>
            <AlertTriangle size={16} style={{ color: '#d29922', flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '12px', color: '#d29922', flex: 1 }}>
              <b>Welcome to the community! 🎉</b>
              <div style={{ marginTop: '2px' }}>Post and reply right away. Verify your email whenever convenient — we'll only remind you occasionally.</div>
            </div>
            <button onClick={dismissBanner} style={{ background: 'none', border: 'none', color: '#d29922', cursor: 'pointer', padding: 0 }} title="Dismiss">
              <X size={14} />
            </button>
          </div>
        )}

        <CommunityHeader
          title="📦 Dataset Training Community"
          memberCount={memberCount}
          onlineCount={onlineCount}
          showCommunityStats={true}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 2px' }}>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Learn how to format datasets for AI. Ask questions, share tips, get help.
          </p>
          {user && (
            <Link to="/forum/new" style={{ textDecoration: 'none' }}>
              <button className="btn-send" type="button" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Plus size={14} /> New Topic
              </button>
            </Link>
          )}
        </div>

        {visibleTopics.length === 0 ? (
          <div className="comment-card" style={{ textAlign: 'center', padding: '40px 14px' }}>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>
              {user ? 'Be the first to start a discussion! 🚀' : 'Sign in to create a new topic.'}
            </p>
          </div>
        ) : (
          <div className="comment-container">
            {visibleTopics.map((topic) => {
              const u = topic.user;
              const displayName = u?.username || u?.name || 'Unknown';
              return (
                <Link key={topic.id} to={`/forum/${topic.id}`} style={{ textDecoration: 'none' }}>
                  <div className={`comment-card ${topic.is_pinned ? 'op' : ''}`} style={{ cursor: 'pointer' }}>
                    <div className="user-row">
                      <MiniAvatar name={u?.name || displayName} color={u?.avatar_color} />
                      <span className="username">{displayName}</span>
                      {topic.is_pinned && <span className="badge badge-admin"><Pin size={10} /> PINNED</span>}
                      {topic.is_locked && <span className="badge badge-mod"><Lock size={10} /> LOCKED</span>}
                      <span className="timestamp">{formatRelative(topic.created_at)}</span>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--accent-primary)', marginBottom: '4px' }}>
                      {topic.title}
                    </div>
                    <div className="comment-body" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {topic.content}
                    </div>
                    {topic.tags.length > 0 && (
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '6px' }}>
                        {topic.tags.map((tag) => (
                          <span key={tag} className="data-tag">#{tag}</span>
                        ))}
                      </div>
                    )}
                    {isAdmin && (
                      <div className="card-actions" style={{ opacity: 1 }}>
                        <button className="card-action-btn" onClick={(e) => { e.preventDefault(); handlePin(topic); }} title={topic.is_pinned ? 'Unpin' : 'Pin'} type="button">
                          <Pin size={13} />
                        </button>
                        <button className="card-action-btn" onClick={(e) => { e.preventDefault(); handleArchive(topic); }} title={topic.is_archived ? 'Unarchive' : 'Archive'} type="button">
                          <Archive size={13} />
                        </button>
                        <button className="card-action-btn" onClick={(e) => { e.preventDefault(); handleDelete(topic.id); }} title="Delete" type="button">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
