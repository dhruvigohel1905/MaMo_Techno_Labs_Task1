import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Link } from 'react-router-dom';
import { HiOutlineCalendar, HiOutlineClock, HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi';

const OrgEvents = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/events/list/my').then((r) => setEvents(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <HiOutlineCheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected': return <HiOutlineXCircle className="w-5 h-5 text-red-500" />;
      default: return <HiOutlineClock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300';
      default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300';
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">My Created Events</h1>
        <Link to="/org/events/create" className="btn-primary !py-2 !px-4 text-sm">Create New Event</Link>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map((i) => <div key={i} className="card h-24 animate-pulse-soft" />)}</div>
      ) : events.length === 0 ? (
        <div className="card text-center py-12">
          <HiOutlineCalendar className="w-16 h-16 text-[var(--text-tertiary)] mx-auto mb-4" />
          <h3 className="font-semibold mb-2">No Events Yet</h3>
          <p className="text-sm text-[var(--text-secondary)] mb-4">You haven't created any events yet.</p>
          <Link to="/org/events/create" className="btn-primary !py-2 !px-4 text-sm inline-block">Create Event</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event._id} className="card flex flex-col sm:flex-row sm:items-center gap-4 !p-4 hover:border-primary-500/30 transition-all">
              <div className="w-16 h-16 rounded-xl bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                <HiOutlineCalendar className="w-8 h-8 text-primary-500" />
              </div>
              <div className="flex-1 min-w-0">
                <Link to={`/events/${event._id}`} className="hover:text-primary-500 transition-colors">
                  <h3 className="font-medium text-lg truncate">{event.title}</h3>
                </Link>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{new Date(event.startDate).toLocaleDateString()} • {event.category}</p>
                {event.status === 'rejected' && event.rejectionReason && (
                  <p className="text-xs text-red-500 mt-2">Reason: {event.rejectionReason}</p>
                )}
              </div>
              <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(event.status)}`}>
                  {getStatusIcon(event.status)}
                  <span className="capitalize">{event.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrgEvents;
