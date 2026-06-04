import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useAppSelector } from '../../hooks/useRedux';
import type { Event as EventType } from '../../types';
import { HiOutlineCalendar, HiOutlineLocationMarker, HiOutlineUserGroup, HiOutlineClock, HiOutlineArrowLeft } from 'react-icons/hi';

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const [event, setEvent] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(true);
  const [registered, setRegistered] = useState(false);
  const [regLoading, setRegLoading] = useState(false);

  useEffect(() => { fetchEvent(); }, [id]);

  const fetchEvent = async () => {
    try {
      const res = await api.get(`/events/${id}`);
      setEvent(res.data.data);
      if (isAuthenticated) {
        try {
          const regRes = await api.get('/registrations/my');
          const regs = regRes.data.data;
          setRegistered(regs.some((r: any) => (r.event?._id || r.event) === id));
        } catch {}
      }
    } catch { navigate('/events'); }
    finally { setLoading(false); }
  };

  const handleRegister = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    try {
      setRegLoading(true);
      await api.post(`/registrations/${id}`);
      setRegistered(true);
    } catch (err: any) { alert(err.response?.data?.message || 'Failed'); }
    finally { setRegLoading(false); }
  };

  const handleCancel = async () => {
    try {
      setRegLoading(true);
      await api.delete(`/registrations/${id}`);
      setRegistered(false);
    } catch (err: any) { alert(err.response?.data?.message || 'Failed'); }
    finally { setRegLoading(false); }
  };

  if (loading) return <div className="max-w-4xl mx-auto p-8"><div className="card animate-pulse-soft"><div className="h-64 bg-[var(--bg-tertiary)] rounded-xl mb-6" /><div className="h-8 bg-[var(--bg-tertiary)] rounded w-2/3 mb-4" /><div className="h-4 bg-[var(--bg-tertiary)] rounded w-full mb-2" /><div className="h-4 bg-[var(--bg-tertiary)] rounded w-3/4" /></div></div>;
  if (!event) return null;

  const org = event.organization as any;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-primary-500 mb-6 transition-colors">
        <HiOutlineArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Banner */}
      <div className="h-64 sm:h-80 rounded-2xl overflow-hidden mb-8 bg-gradient-to-br from-primary-500/20 to-accent-500/20">
        {event.banner ? <img src={event.banner} alt={event.title} className="w-full h-full object-cover" /> : (
          <div className="w-full h-full flex items-center justify-center"><HiOutlineCalendar className="w-24 h-24 text-primary-300" /></div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <span className="badge badge-primary mb-3">{event.category}</span>
          <h1 className="font-display text-3xl font-bold mb-4">{event.title}</h1>
          <div className="prose prose-sm max-w-none text-[var(--text-secondary)] mb-8 whitespace-pre-wrap">{event.description}</div>

          {event.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {event.tags.map((tag, i) => <span key={i} className="px-3 py-1 rounded-lg bg-[var(--bg-tertiary)] text-xs font-medium">#{tag}</span>)}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card">
            <div className="space-y-4">
              <div className="flex items-center gap-3"><HiOutlineCalendar className="w-5 h-5 text-primary-500 flex-shrink-0" /><div><p className="text-xs text-[var(--text-tertiary)]">Date</p><p className="text-sm font-medium">{new Date(event.startDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p></div></div>
              {event.time && <div className="flex items-center gap-3"><HiOutlineClock className="w-5 h-5 text-primary-500 flex-shrink-0" /><div><p className="text-xs text-[var(--text-tertiary)]">Time</p><p className="text-sm font-medium">{event.time}</p></div></div>}
              <div className="flex items-center gap-3"><HiOutlineLocationMarker className="w-5 h-5 text-primary-500 flex-shrink-0" /><div><p className="text-xs text-[var(--text-tertiary)]">Location</p><p className="text-sm font-medium">{event.isOnline ? 'Online Event' : event.location || 'TBA'}</p></div></div>
              <div className="flex items-center gap-3"><HiOutlineUserGroup className="w-5 h-5 text-primary-500 flex-shrink-0" /><div><p className="text-xs text-[var(--text-tertiary)]">Registrations</p><p className="text-sm font-medium">{event.registrationCount} / {event.maxParticipants || '∞'}</p></div></div>
            </div>

            <div className="mt-6 pt-4 border-t border-[var(--border-color)]">
              {registered ? (
                <div>
                  <div className="badge badge-success w-full justify-center mb-3 !py-2">✓ Registered</div>
                  <button onClick={handleCancel} disabled={regLoading} className="btn-danger w-full !py-2.5 text-sm">
                    {regLoading ? 'Cancelling...' : 'Cancel Registration'}
                  </button>
                </div>
              ) : (
                <button onClick={handleRegister} disabled={regLoading} className="btn-primary w-full !py-3" id="register-event-btn">
                  {regLoading ? 'Registering...' : 'Register for Event'}
                </button>
              )}
            </div>
          </div>

          {/* Organizer Card */}
          {org && (
            <div className="card">
              <p className="text-xs text-[var(--text-tertiary)] mb-3">Organized by</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center text-white font-bold">{org.name?.[0]}</div>
                <div><p className="font-semibold text-sm">{org.name}</p><p className="text-xs text-[var(--text-tertiary)] capitalize">{org.type}</p></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
