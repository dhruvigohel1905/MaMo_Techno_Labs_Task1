import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { HiOutlineCalendar, HiOutlineUserGroup, HiOutlineChartBar, HiOutlinePlusCircle } from 'react-icons/hi';

const OrgDashboard = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/events/list/my').then((r) => setEvents(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const approved = events.filter((e) => e.status === 'approved').length;
  const pending = events.filter((e) => e.status === 'pending').length;
  const totalRegs = events.reduce((a, e) => a + (e.registrationCount || 0), 0);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="font-display text-2xl font-bold">Organization Dashboard</h1><p className="text-[var(--text-secondary)] text-sm">Manage your events and registrations</p></div>
        <Link to="/org/events/create" className="btn-primary" id="create-event-btn"><HiOutlinePlusCircle className="w-5 h-5" /> Create Event</Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Events', value: events.length, icon: HiOutlineCalendar, color: 'from-primary-500 to-primary-600' },
          { label: 'Approved', value: approved, icon: HiOutlineChartBar, color: 'from-green-500 to-green-600' },
          { label: 'Pending', value: pending, icon: HiOutlineCalendar, color: 'from-amber-500 to-amber-600' },
          { label: 'Total Registrations', value: totalRegs, icon: HiOutlineUserGroup, color: 'from-pink-500 to-pink-600' },
        ].map((c, i) => (
          <div key={i} className="card !p-5">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-white`}><c.icon className="w-5 h-5" /></div>
              <span className="text-2xl font-display font-bold">{c.value}</span>
            </div>
            <p className="text-sm text-[var(--text-secondary)]">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="font-semibold mb-4">Your Events</h2>
        {loading ? <div className="animate-pulse-soft h-32" /> : events.length === 0 ? (
          <div className="text-center py-8"><p className="text-[var(--text-secondary)]">No events yet. <Link to="/org/events/create" className="text-primary-500 font-medium">Create your first event</Link></p></div>
        ) : (
          <div className="space-y-3">
            {events.map((e) => (
              <Link key={e._id} to={`/events/${e._id}`} className="flex items-center gap-4 p-3 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors">
                <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center flex-shrink-0"><HiOutlineCalendar className="w-5 h-5 text-primary-500" /></div>
                <div className="flex-1 min-w-0"><p className="font-medium text-sm truncate">{e.title}</p><p className="text-xs text-[var(--text-tertiary)]">{new Date(e.startDate).toLocaleDateString()} · {e.registrationCount} registered</p></div>
                <span className={`badge text-xs ${e.status === 'approved' ? 'badge-success' : e.status === 'pending' ? 'badge-warning' : 'badge-danger'}`}>{e.status}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrgDashboard;
