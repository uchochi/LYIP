import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowLeft, Plus, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import MiniAvatar from './MiniAvatar';
import Button from '../ui/Button';

/**
 * ForumNavbar — dark, community-focused chrome (PLAN §2.1, T3.1).
 * Identity = "Dataset Training Community". Nav is purpose-built for the community,
 * NOT the marketing links. Shows the user's handle, knowledge-score chip and role.
 */
export default function ForumNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  // Knowledge score lives on the `users` table row, not in the auth profile.
  const [knowledgeScore, setKnowledgeScore] = useState<number | null>(null);

  useEffect(() => {
    if (!user) { setKnowledgeScore(null); return; }
    let active = true;
    supabase
      .from('users')
      .select('knowledge_score')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => { if (active) setKnowledgeScore(data?.knowledge_score ?? 0); });
    return () => { active = false; };
  }, [user]);

  const links = [
    { to: '/forum', label: 'Feed', icon: null },
    { to: '/forum/new', label: 'New Topic', icon: Plus },
  ];

  const isActive = (to: string) => pathname === to;
  const handle = user?.username || user?.name || 'Member';
  const role = user?.role && user.role !== 'user' ? user.role : null;

  const close = () => setMobileOpen(false);

  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur-lg">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        {/* Identity + back-to-site */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="hidden items-center gap-1 rounded-lg px-2 py-1 text-xs text-text-muted no-underline transition-colors hover:text-text-main sm:flex"
            title="Back to LoseYourIP"
          >
            <ArrowLeft size={13} /> Back to site
          </Link>
          <Link to="/forum" className="flex items-center gap-2 no-underline">
            <img src="/Loseyourip-logo.png" alt="Loseyourip" className="h-8 w-auto" />
            <span className="rounded bg-surface-lighter px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              Community
            </span>
          </Link>
        </div>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const Icon = l.icon;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium no-underline transition-colors ${
                  isActive(l.to) ? 'bg-primary/10 text-primary' : 'text-text-muted hover:bg-surface hover:text-text-main'
                }`}
              >
                {Icon && <Icon size={14} />}
                {l.label}
              </Link>
            );
          })}

          {isAuthenticated && user ? (
            <div className="ml-2 flex items-center gap-2 border-l border-border pl-3">
              <Link to="/dashboard" className="flex items-center gap-2 no-underline">
                <MiniAvatar name={user.name || handle} color={user.avatarColor} />
                <span className="flex flex-col leading-none">
                  <span className="text-sm font-medium text-text-main">{handle}</span>
                  <span className="flex items-center gap-1.5">
                    {role && (
                      <span className="rounded bg-accent/10 px-1.5 text-[9px] font-bold uppercase text-accent">
                        {role}
                      </span>
                    )}
                    {knowledgeScore !== null && (
                      <span className="text-[10px] text-text-muted">⚡ {knowledgeScore}</span>
                    )}
                  </span>
                </span>
              </Link>
              <button
                onClick={logout}
                className="cursor-pointer rounded-lg p-2 text-text-muted transition-colors hover:bg-surface hover:text-red-400"
                title="Sign out"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="ml-2">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="cursor-pointer rounded-lg p-2 text-text-muted hover:bg-surface md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-bg px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => {
              const Icon = l.icon;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={close}
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium no-underline ${
                    isActive(l.to) ? 'bg-primary/10 text-primary' : 'text-text-muted'
                  }`}
                >
                  {Icon && <Icon size={15} />} {l.label}
                </Link>
              );
            })}
            {isAuthenticated && user ? (
              <>
                <Link to="/dashboard" onClick={close} className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm text-text-muted no-underline">
                  <MiniAvatar name={user.name || handle} color={user.avatarColor} /> {handle}
                </Link>
                <button
                  onClick={() => { logout(); close(); }}
                  className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-left text-sm font-medium text-red-400"
                >
                  <LogOut size={15} /> Sign Out
                </button>
              </>
            ) : (
              <Link to="/login" onClick={close} className="rounded-lg px-4 py-2.5 text-sm text-text-muted no-underline">
                Sign In
              </Link>
            )}
            <Link to="/" onClick={close} className="mt-1 inline-flex items-center gap-2 border-t border-border px-4 pt-3 text-xs text-text-muted no-underline">
              <ArrowLeft size={13} /> Back to LoseYourIP
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
