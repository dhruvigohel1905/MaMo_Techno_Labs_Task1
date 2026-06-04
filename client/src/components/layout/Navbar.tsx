import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/useRedux';
import { logout } from '../../store/slices/authSlice';
import { toggleTheme } from '../../store/slices/themeSlice';
import { toggleSidebar } from '../../store/slices/uiSlice';
import { useState, useRef, useEffect } from 'react';
import { HiOutlineBell, HiOutlineSun, HiOutlineMoon, HiOutlineMenu, HiOutlineLogout, HiOutlineCog, HiOutlineViewGrid } from 'react-icons/hi';
import api from '../../utils/api';

const Navbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);
  const { isDark } = useAppSelector((s) => s.theme);
  const [profileOpen, setProfileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated) {
      api.get('/notifications').then((res) => {
        setUnreadCount(res.data.data.unreadCount || 0);
      }).catch(() => {});
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setProfileOpen(false);
  };

  const getDashboardLink = () => {
    if (!user) return '/dashboard';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'organizer') return '/org/dashboard';
    return '/dashboard';
  };

  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-[var(--border-color)]" style={{ borderRadius: 0 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo + Hamburger */}
          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button onClick={() => dispatch(toggleSidebar())} className="lg:hidden p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors" id="sidebar-toggle">
                <HiOutlineMenu className="w-5 h-5" />
              </button>
            )}
            <Link to="/" className="flex items-center gap-2.5 group" id="logo-link">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:shadow-primary-500/40 transition-shadow">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="font-display font-bold text-xl hidden sm:block">
                <span className="text-gradient">Event</span>
                <span className="text-[var(--text-secondary)]">Hub</span>
              </span>
            </Link>
          </div>

          {/* Center: Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/events" className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all" id="nav-events">
              Events
            </Link>
            {isAuthenticated && (
              <Link to="/community" className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all" id="nav-community">
                Community
              </Link>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <button onClick={() => dispatch(toggleTheme())} className="p-2.5 rounded-xl hover:bg-[var(--bg-tertiary)] transition-all" id="theme-toggle" title="Toggle theme">
              {isDark ? <HiOutlineSun className="w-5 h-5 text-yellow-400" /> : <HiOutlineMoon className="w-5 h-5 text-primary-500" />}
            </button>

            {isAuthenticated ? (
              <>
                <Link to="/notifications" className="relative p-2.5 rounded-xl hover:bg-[var(--bg-tertiary)] transition-all" id="notification-bell">
                  <HiOutlineBell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse-soft">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                <div className="relative" ref={profileRef}>
                  <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[var(--bg-tertiary)] transition-all" id="profile-menu-btn">
                    <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center text-white text-sm font-bold">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                    <span className="hidden sm:block text-sm font-medium max-w-[120px] truncate">{user?.firstName}</span>
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 glass-card rounded-xl overflow-hidden animate-slide-down shadow-xl z-50" id="profile-dropdown">
                      <div className="p-3 border-b border-[var(--border-color)]">
                        <p className="font-semibold text-sm">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-[var(--text-tertiary)] truncate">{user?.email}</p>
                        <span className="badge badge-primary mt-1 text-[10px]">{user?.role}</span>
                      </div>
                      <div className="p-1.5">
                        <Link to={getDashboardLink()} onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm hover:bg-[var(--bg-tertiary)] transition-colors" id="profile-dashboard">
                          <HiOutlineViewGrid className="w-4 h-4" /> Dashboard
                        </Link>
                        <Link to="/settings" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm hover:bg-[var(--bg-tertiary)] transition-colors" id="profile-settings">
                          <HiOutlineCog className="w-4 h-4" /> Settings
                        </Link>
                        <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors" id="logout-btn">
                          <HiOutlineLogout className="w-4 h-4" /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-secondary !py-2 !px-4 text-sm" id="nav-login">Log In</Link>
                <Link to="/register" className="btn-primary !py-2 !px-4 text-sm" id="nav-register">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
