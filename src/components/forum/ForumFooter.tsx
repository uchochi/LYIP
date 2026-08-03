import { Link } from 'react-router-dom';

export default function ForumFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-center gap-2 text-xs text-text-muted">
        <span>&copy; {new Date().getFullYear()} LoseYourIP</span>
        <span>&middot;</span>
        <Link to="/privacy" className="text-text-muted no-underline hover:text-primary">Privacy</Link>
        <span>&middot;</span>
        <Link to="/terms" className="text-text-muted no-underline hover:text-primary">Terms</Link>
        <span>&middot;</span>
        <Link to="/cookies" className="text-text-muted no-underline hover:text-primary">Cookies</Link>
      </div>
    </footer>
  );
}
