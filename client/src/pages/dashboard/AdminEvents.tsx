import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { HiOutlineCalendar, HiOutlineSearch, HiOutlineCheck, HiOutlineX, HiOutlineEye } from 'react-icons/hi';

const AdminEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/events?limit=100');
      setEvents(res.data.data.events || res.data.data || []);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleModerate = async (id: string, status: 'approved' | 'rejected') => {
    if (!window.confirm(`${status === 'approved' ? 'Approve' : 'Reject'} this event?`)) return;
    try {
      await api.put(`/admin/events/${id}/moderate`, { status });
      fetchEvents();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Failed');
    }
  };

  const filtered = events.filter((e) => {
    const q = search.toLowerCase();
    const matchesSearch = e.title?.toLowerCase().includes(q) || e.category?.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-2xl font-bold mb-6">Manage Events</h1>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events..."
              className="input-field !pl-10"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'pending', 'approved', 'rejected'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-2 rounded-xl text-xs font-medium capitalize transition-all ${statusFilter === s ? 'bg-primary-500 text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="card h-36 animate-pulse-soft" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-12">
          <HiOutlineCalendar className="w-12 h-12 mx-auto mb-3 text-[var(--text-tertiary)]" />
          <p className="text-[var(--text-secondary)]">No events found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((event) => (
            <div key={event._id} className="card hover:border-primary-500/30 transition-all">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{event.title}</h3>
                  <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
                    {event.organization?.name || 'Unknown Org'} • {event.category}
                  </p>
                </div>
                <span className={`badge text-[10px] ml-2 flex-shrink-0 ${event.status === 'approved' ? 'badge-success' : event.status === 'pending' ? 'badge-warning' : 'badge-danger'}`}>
                  {event.status}
                </span>
              </div>

              <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-3">{event.description}</p>

              <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)] mb-3">
                <span>{new Date(event.startDate).toLocaleDateString()}</span>
                <span>{event.registrationCount || 0} registrations</span>
              </div>

              <div className="flex gap-2 pt-3 border-t border-[var(--border-color)]">
                <button
                  onClick={() => navigate(`/events/${event._id}`)}
                  className="btn-secondary !py-1.5 !px-3 text-xs flex items-center gap-1 flex-1 justify-center"
                >
                  <HiOutlineEye className="w-3.5 h-3.5" /> View
                </button>
                {event.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleModerate(event._id, 'approved')}
                      className="!py-1.5 !px-3 text-xs flex items-center gap-1 flex-1 justify-center rounded-xl font-medium bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors"
                    >
                      <HiOutlineCheck className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button
                      onClick={() => handleModerate(event._id, 'rejected')}
                      className="!py-1.5 !px-3 text-xs flex items-center gap-1 flex-1 justify-center rounded-xl font-medium bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors"
                    >
                      <HiOutlineX className="w-3.5 h-3.5" /> Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminEvents;
