import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Link } from 'react-router-dom';
import { HiOutlineCalendar } from 'react-icons/hi';

const MyEvents = () => {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/registrations/my').then((r) => setRegistrations(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-2xl font-bold mb-6">My Registered Events</h1>
      {loading ? <div className="space-y-3">{[1,2,3].map((i) => <div key={i} className="card h-20 animate-pulse-soft" />)}</div> : registrations.length === 0 ? (
        <div className="card text-center py-12"><HiOutlineCalendar className="w-16 h-16 text-[var(--text-tertiary)] mx-auto mb-4" /><h3 className="font-semibold mb-2">No Registrations</h3><p className="text-sm text-[var(--text-secondary)]"><Link to="/events" className="text-primary-500">Browse events</Link> to get started</p></div>
      ) : (
        <div className="space-y-3">
          {registrations.map((reg) => (
            <Link key={reg._id} to={`/events/${reg.event?._id}`} className="card flex items-center gap-4 hover-lift !p-4">
              <div className="w-14 h-14 rounded-xl bg-primary-500/10 flex items-center justify-center flex-shrink-0"><HiOutlineCalendar className="w-6 h-6 text-primary-500" /></div>
              <div className="flex-1 min-w-0"><h3 className="font-medium truncate">{reg.event?.title}</h3><p className="text-xs text-[var(--text-tertiary)]">{new Date(reg.event?.startDate).toLocaleDateString()} · {reg.event?.organization?.name}</p></div>
              <span className={`badge text-xs ${reg.status === 'attended' ? 'badge-success' : 'badge-primary'}`}>{reg.status}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEvents;
