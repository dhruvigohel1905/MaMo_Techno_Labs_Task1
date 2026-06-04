import { NavLink } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/useRedux';
import { setSidebarOpen } from '../../store/slices/uiSlice';
import {
  HiOutlineViewGrid, HiOutlineCalendar, HiOutlineTicket, HiOutlineAcademicCap,
  HiOutlineUserGroup, HiOutlineShieldCheck, HiOutlineOfficeBuilding, HiOutlineChatAlt2,
  HiOutlineQrcode, HiOutlineX, HiOutlineChartBar
} from 'react-icons/hi';

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const { sidebarOpen } = useAppSelector((s) => s.ui);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
      isActive
        ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 font-semibold'
        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
    }`;

  const userLinks = [
    { to: '/dashboard', icon: HiOutlineViewGrid, label: 'Dashboard' },
    { to: '/events', icon: HiOutlineCalendar, label: 'Browse Events' },
    { to: '/dashboard/events', icon: HiOutlineTicket, label: 'My Events' },
    { to: '/dashboard/certificates', icon: HiOutlineAcademicCap, label: 'Certificates' },
    { to: '/community', icon: HiOutlineChatAlt2, label: 'Community' },
    { to: '/scan', icon: HiOutlineQrcode, label: 'Scan QR' },
  ];

  const orgLinks = [
    { to: '/org/dashboard', icon: HiOutlineViewGrid, label: 'Dashboard' },
    { to: '/org/events', icon: HiOutlineCalendar, label: 'My Events' },
    { to: '/org/events/create', icon: HiOutlineTicket, label: 'Create Event' },
    { to: '/org/profile', icon: HiOutlineOfficeBuilding, label: 'Organization' },
    { to: '/community', icon: HiOutlineChatAlt2, label: 'Community' },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', icon: HiOutlineViewGrid, label: 'Dashboard' },
    { to: '/admin/users', icon: HiOutlineUserGroup, label: 'Users' },
    { to: '/admin/organizations', icon: HiOutlineOfficeBuilding, label: 'Organizations' },
    { to: '/admin/events', icon: HiOutlineCalendar, label: 'Events' },
    { to: '/admin/moderation', icon: HiOutlineShieldCheck, label: 'Moderation' },
    { to: '/admin/analytics', icon: HiOutlineChartBar, label: 'Analytics' },
  ];

  const links = user?.role === 'admin' ? adminLinks : user?.role === 'organizer' ? orgLinks : userLinks;

  return (
    <>
      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => dispatch(setSidebarOpen(false))} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-16 left-0 bottom-0 w-64 glass-card border-r border-[var(--border-color)] z-40 transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`} style={{ borderRadius: 0 }} id="sidebar">
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <span className="font-semibold text-sm text-[var(--text-secondary)]">Navigation</span>
            <button onClick={() => dispatch(setSidebarOpen(false))} className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)]">
              <HiOutlineX className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 space-y-1">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} end className={linkClass} onClick={() => dispatch(setSidebarOpen(false))}>
                <link.icon className="w-5 h-5 flex-shrink-0" />
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto pt-4 border-t border-[var(--border-color)]">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center text-white font-bold text-sm">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-[var(--text-tertiary)] capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
