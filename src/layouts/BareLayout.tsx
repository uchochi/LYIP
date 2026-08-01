import { Link, Outlet } from 'react-router-dom';

/**
 * BareLayout — minimal dark chrome for admin & auth pages (PLAN §2.1, T1.3).
 * No marketing footer; just a slim brand bar.
 */
export default function BareLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <Link to="/" className="no-underline">
            <img src="/Loseyourip-logo.png" alt="Loseyourip" className="h-8 w-auto" />
          </Link>
          <span className="text-xs uppercase tracking-wider text-text-muted">Admin Console</span>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
