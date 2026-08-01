import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/**
 * ForumFooter — dark, compact, community-focused (PLAN §2.1, T3.2).
 * Community / Help / Account / Back-to-main-site columns.
 */
const columns = [
  {
    title: 'Community',
    links: [
      { to: '/forum', label: 'Feed' },
      { to: '/forum/new', label: 'Start a Topic' },
      { to: '/dashboard', label: 'My Profile' },
    ],
  },
  {
    title: 'Help',
    links: [
      { to: '/community', label: 'Code of Conduct' },
      { to: '/support', label: 'Report a Bug' },
    ],
  },
];

export default function ForumFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="text-sm font-semibold text-text-main">Dataset Training Community</p>
            <p className="mt-2 max-w-xs text-xs leading-relaxed text-text-muted">
              Learn how to format datasets for AI. Ask questions, share tips, and get help from
              fellow curators.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">{col.title}</h4>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-sm text-text-muted no-underline transition-colors hover:text-primary">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-border pt-5 sm:flex-row">
          <p className="text-xs text-text-muted">&copy; {new Date().getFullYear()} Loseyourip Community</p>
          <Link to="/" className="inline-flex items-center gap-1 text-xs text-text-muted no-underline transition-colors hover:text-text-main">
            <ArrowLeft size={12} /> Back to LoseYourIP.com
          </Link>
        </div>
      </div>
    </footer>
  );
}
