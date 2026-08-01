import { Outlet } from 'react-router-dom';
import MarketingNavbar from '../components/marketing/MarketingNavbar';
import MarketingFooter from '../components/marketing/MarketingFooter';

/**
 * MarketingLayout — dark chrome for the corporate/marketing zone (PLAN §2.1, T1.1).
 */
export default function MarketingLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <MarketingNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <MarketingFooter />
    </div>
  );
}
