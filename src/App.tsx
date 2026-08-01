import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MarketingLayout from './layouts/MarketingLayout';
import ForumLayout from './layouts/ForumLayout';
import BareLayout from './layouts/BareLayout';
import HomePage from './pages/HomePage';
import JobsPage from './pages/JobsPage';
import JobDetailPage from './pages/JobDetailPage';
import ForumPage from './pages/ForumPage';
import ForumTopicPage from './pages/ForumTopicPage';
import NewTopicPage from './pages/NewTopicPage';
import AboutPage from './pages/AboutPage';
import PlatformPage from './pages/PlatformPage';
import ResearchPage from './pages/ResearchPage';
import CommunityPage from './pages/CommunityPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import CookiesPage from './pages/CookiesPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/admin/LoginPage';
import SignupPage from './pages/admin/SignupPage';
import DashboardPage from './pages/admin/DashboardPage';
import CreateJobPage from './pages/admin/CreateJobPage';
import EditJobPage from './pages/admin/EditJobPage';
import UserDashboardPage from './pages/UserDashboardPage';
import ProtectedAdminRoute from './components/admin/ProtectedAdminRoute';
import ProtectedUserRoute from './components/ProtectedUserRoute';
import ScrollToTop from './components/ScrollToTop';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          {/* Marketing zone — dark marketing navbar + footer */}
          <Route element={<MarketingLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/jobs/:id" element={<JobDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/platform" element={<PlatformPage />} />
            <Route path="/research" element={<ResearchPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/cookies" element={<CookiesPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Forum zone — dark community navbar + footer (own chrome) */}
          <Route element={<ForumLayout />}>
            <Route path="/forum" element={<ForumPage />} />
            <Route path="/forum/new" element={<NewTopicPage />} />
            <Route path="/forum/:topicId" element={<ForumTopicPage />} />
            <Route
              path="/dashboard"
              element={<ProtectedUserRoute><UserDashboardPage /></ProtectedUserRoute>}
            />
          </Route>

          {/* Auth zone — bare dark chrome, no marketing footer */}
          <Route element={<BareLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/admin"
              element={<ProtectedAdminRoute><DashboardPage /></ProtectedAdminRoute>}
            />
            <Route
              path="/admin/jobs/new"
              element={<ProtectedAdminRoute><CreateJobPage /></ProtectedAdminRoute>}
            />
            <Route
              path="/admin/jobs/:id/edit"
              element={<ProtectedAdminRoute><EditJobPage /></ProtectedAdminRoute>}
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
