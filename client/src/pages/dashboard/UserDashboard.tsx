import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { useAppSelector } from '../../hooks/useRedux';
import { HiOutlineCalendar, HiOutlineTicket, HiOutlineAcademicCap, HiOutlineChatAlt2 } from 'react-icons/hi';

const UserDashboard = () => {
  const { user } = useAppSelector((s) => s.auth);
  const [stats, setStats] = useState({ events: 0, upcoming: 0, certs: 0 });
  const [recentEvents, setRecentEvents] = useState<any[]>([]);

  useEffect(() => {
    api.get('/registrations/my').then((r) => {
      const regs = r.data.data || [];
      setStats((s) => ({ ...s, events: regs.length, upcoming: regs.filter((r: any) => new Date(r.event?.startDate) > new Date()).length }));
      setRecentEvents(regs.slice(0, 5));
    }).catch(() => {});
    api.get('/certificates/my').then((r) => setStats((s) => ({ ...s, certs: (r.data.data || []).length }))).catch(() => {});
  }, []);

  const cards = [
    { label: 'Registered Events', value: stats.events, icon: HiOutlineTicket, color: 'from-primary-500 to-primary-600', link: '/dashboard/events' },
    { label: 'Upcoming Events', value: stats.upcoming, icon: HiOutlineCalendar, color: 'from-emerald-500 to-emerald-600', link: '/events' },
    { label: 'Certificates', value: stats.certs, icon: HiOutlineAcademicCap, color: 'from-amber-500 to-amber-600', link: '/dashboard/certificates' },
    { label: 'Community', value: '→', icon: HiOutlineChatAlt2, color: 'from-pink-500 to-pink-600', link: '/community' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold">Welcome back, {user?.firstName}! 👋</h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">Here's what's happening with your events</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c, i) => (
          <Link key={i} to={c.link} className="card hover-lift group !p-5" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-white shadow-lg`}>
                <c.icon className="w-5 h-5" />
              </div>
              <span className="text-2xl font-display font-bold">{c.value}</span>
            </div>
            <p className="text-sm text-[var(--text-secondary)] font-medium">{c.label}</p>
          </Link>
        ))}
      </div>

      {/* Recent Registrations */}
      <div className="card">
        <h2 className="font-semibold text-lg mb-4">Recent Registrations</h2>
        {recentEvents.length === 0 ? (
          <div className="text-center py-8 text-[var(--text-secondary)]">
            <p>No registrations yet. <Link to="/events" className="text-primary-500 font-medium">Browse events</Link></p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentEvents.map((reg: any) => (
              <Link key={reg._id} to={`/events/${reg.event?._id}`} className="flex items-center gap-4 p-3 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors">
                <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                  <HiOutlineCalendar className="w-5 h-5 text-primary-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{reg.event?.title}</p>
                  <p className="text-xs text-[var(--text-tertiary)]">{new Date(reg.event?.startDate).toLocaleDateString()}</p>
                </div>
                <span className={`badge ${reg.status === 'attended' ? 'badge-success' : 'badge-primary'} text-xs`}>{reg.status}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
