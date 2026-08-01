import { Outlet } from 'react-router-dom';
import ForumNavbar from '../components/forum/ForumNavbar';
import ForumFooter from '../components/forum/ForumFooter';

/**
 * ForumLayout — dark, community-focused chrome for the forum zone (PLAN §2.1, T1.2).
 * Own navbar + own footer, distinct from the marketing site.
 */
export default function ForumLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <ForumNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <ForumFooter />
    </div>
  );
}
