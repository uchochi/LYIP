import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

/**
 * MarketingNavbar — dark chrome for the corporate/marketing zone (PLAN §2.1, T2.1).
 * Marketing-focused nav: Home / Open Positions / About / Platform / Research.
 */
export default function MarketingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const links = [
    { to: '/', label: 'Home' },
    { to: '/jobs', label: 'Open Positions' },
    { to: '/about', label: 'About' },
    { to: '/platform', label: 'Platform' },
    { to: '/research', label: 'Research' },
  ];

  const legacyAdmin = typeof window !== 'undefined' && sessionStorage.getItem('loseyourip_admin');
  const isAdmin = user?.role === 'admin' || legacyAdmin;
  const showUserDashboard = isAuthenticated && !isAdmin;

  const isActive = (to: string) =>
    to === '/' ? pathname === '/' : pathname === to || pathname.startsWith(to + '/');

  const close = () => setMobileOpen(false);

  const mobileExtra = isAdmin
    ? [{ to: '/admin', label: 'Dashboard' }]
    : showUserDashboard
      ? [{ to: '/dashboard', label: 'My Dashboard' }]
      : [];

  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="no-underline">
          <img src="/Loseyourip-logo.png" alt="Loseyourip" className="h-10 w-auto" />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`rounded-lg px-3 py-2 text-sm font-medium no-underline transition-colors ${
                isActive(l.to) ? 'bg-primary/10 text-primary' : 'text-text-muted hover:bg-surface hover:text-text-main'
              }`}
            >
              {l.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              className={`rounded-lg px-3 py-2 text-sm font-medium no-underline transition-colors ${
                isActive('/admin') ? 'bg-accent/10 text-accent' : 'text-text-muted hover:bg-surface hover:text-text-main'
              }`}
            >
              Dashboard
            </Link>
          )}
          {showUserDashboard && (
            <Link
              to="/dashboard"
              className={`rounded-lg px-3 py-2 text-sm font-medium no-underline transition-colors ${
                isActive('/dashboard') ? 'bg-primary/10 text-primary' : 'text-text-muted hover:bg-surface hover:text-text-main'
              }`}
            >
              My Dashboard
            </Link>
          )}
          {isAuthenticated ? (
            <Button variant="ghost" size="sm" onClick={logout}>Logout</Button>
          ) : (
            <Link to="/login"><Button variant="ghost" size="sm">Sign In</Button></Link>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="cursor-pointer rounded-lg p-2 text-text-muted hover:bg-surface md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-bg px-6 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {links.concat(mobileExtra).map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={close}
                className={`rounded-lg px-4 py-2.5 text-sm font-medium no-underline ${
                  isActive(l.to) ? 'bg-primary/10 text-primary' : 'text-text-muted'
                }`}
              >
                {l.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <button
                onClick={() => { logout(); close(); }}
                className="cursor-pointer rounded-lg px-4 py-2.5 text-left text-sm font-medium text-red-400"
              >
                Logout
              </button>
            ) : (
              <Link to="/login" onClick={close} className="rounded-lg px-4 py-2.5 text-sm font-medium text-text-muted no-underline">
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
