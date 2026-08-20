import { Link } from 'react-router-dom';

/**
 * MarketingFooter — dark footer for the corporate/marketing zone (PLAN §2.1, T2.2).
 * Company / Resources / Legal columns + brand line.
 */
const columns = [
  {
    title: 'Company',
    links: [
      { to: '/about', label: 'About' },
      { to: '/platform', label: 'Platform' },
      { to: '/research', label: 'Research' },
      { to: '/community', label: 'Community' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { to: '/jobs', label: 'Open Positions' },
      { to: '/forum', label: 'Forum — Jobs & Projects' },
      { to: '/dashboard', label: 'My Dashboard' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { to: '/terms', label: 'Terms of Service' },
      { to: '/privacy', label: 'Privacy Policy' },
      { to: '/cookies', label: 'Cookie Policy' },
    ],
  },
];

export default function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Link to="/" className="no-underline">
              <img src="/Loseyourip-logo.png" alt="Loseyourip" className="h-9 w-auto" />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-text-muted">
              Building the high-quality datasets that train AI — clean, structured, and aligned with human values.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-text-main">{col.title}</h4>
              <ul className="mt-4 space-y-2">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="text-sm text-text-muted no-underline transition-colors hover:text-primary"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t border-border pt-6 text-center text-sm text-text-muted">
          &copy; {new Date().getFullYear()} Loseyourip. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
