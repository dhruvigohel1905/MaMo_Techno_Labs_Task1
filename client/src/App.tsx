import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { useEffect } from 'react';
import { useAppSelector } from './hooks/useRedux';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import DashboardLayout from './components/layout/DashboardLayout';

// Route Guards
import { ProtectedRoute, GuestRoute } from './routes/Guards';

// Pages
import LandingPage from './pages/landing/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import EventsPage from './pages/events/EventsPage';
import EventDetailPage from './pages/events/EventDetailPage';
import CreateEvent from './pages/events/CreateEvent';
import ScanQR from './pages/events/ScanQR';
import UserDashboard from './pages/dashboard/UserDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import AdminModeration from './pages/dashboard/AdminModeration';
import OrgDashboard from './pages/dashboard/OrgDashboard';
import MyEvents from './pages/dashboard/MyEvents';
import OrgEvents from './pages/dashboard/OrgEvents';
import OrgProfile from './pages/dashboard/OrgProfile';
import Notifications from './pages/dashboard/Notifications';
import MyCertificates from './pages/certificates/MyCertificates';
import CommunityFeed from './pages/community/CommunityFeed';
import NotFound from './pages/NotFound';

function ThemeInitializer() {
  const { isDark } = useAppSelector((s) => s.theme);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);
  return null;
}

function AppContent() {
  return (
    <BrowserRouter>
      <ThemeInitializer />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Routes>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />

            {/* Guest Only */}
            <Route element={<GuestRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* User Protected */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/dashboard/events" element={<MyEvents />} />
                <Route path="/dashboard/certificates" element={<MyCertificates />} />
                <Route path="/notifications" element={<Notifications />} />
              </Route>
              <Route path="/community" element={<CommunityFeed />} />
            </Route>

            {/* Organizer Protected */}
            <Route element={<ProtectedRoute allowedRoles={['organizer', 'admin']} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/org/dashboard" element={<OrgDashboard />} />
                <Route path="/org/profile" element={<OrgProfile />} />
                <Route path="/org/events" element={<OrgEvents />} />
                <Route path="/org/events/create" element={<CreateEvent />} />
                <Route path="/scan" element={<ScanQR />} />
              </Route>
            </Route>

            {/* Admin Protected */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminDashboard />} />
                <Route path="/admin/organizations" element={<AdminDashboard />} />
                <Route path="/admin/events" element={<AdminDashboard />} />
                <Route path="/admin/moderation" element={<AdminModeration />} />
                <Route path="/admin/analytics" element={<AdminDashboard />} />
              </Route>
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
