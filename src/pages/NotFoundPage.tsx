import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
      <p className="text-6xl font-extrabold text-surface-lighter">404</p>
      <h1 className="mt-4 text-xl font-bold text-text-main">Page not found</h1>
      <p className="mt-2 text-sm text-text-muted">The page you're looking for doesn't exist.</p>
      <Link to="/" className="mt-6 text-sm font-medium text-primary hover:text-primary-dark no-underline">
        &larr; Back to home
      </Link>
    </div>
  );
}
