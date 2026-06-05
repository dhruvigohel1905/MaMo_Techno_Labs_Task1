import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Link } from 'react-router-dom';
import {
  HiOutlineCalendar, HiOutlineClock, HiOutlineCheckCircle, HiOutlineXCircle,
  HiOutlineQrcode, HiOutlineX, HiOutlineUserGroup, HiOutlineDownload
} from 'react-icons/hi';

import type { Event as EventType } from '../../types';

interface Attendee {
  _id: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  markedAt: string;
  verificationMethod: string;
}

const OrgEvents = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [qrModal, setQrModal] = useState<{ open: boolean; eventId: string; eventTitle: string; qrCode: string; loading: boolean }>({ open: false, eventId: '', eventTitle: '', qrCode: '', loading: false });
  const [attModal, setAttModal] = useState<{ open: boolean; eventTitle: string; attendees: Attendee[]; loading: boolean }>({ open: false, eventTitle: '', attendees: [], loading: false });

  useEffect(() => {
    api.get('/events/list/my').then((r) => setEvents(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleShowQR = async (eventId: string, title: string) => {
    setQrModal({ open: true, eventId, eventTitle: title, qrCode: '', loading: true });
    try {
      const res = await api.get(`/events/${eventId}/qr`);
      setQrModal((p) => ({ ...p, qrCode: res.data.data.qrCode, loading: false }));
    } catch { setQrModal((p) => ({ ...p, loading: false })); }
  };

  const handleViewAttendance = async (eventId: string, title: string) => {
    setAttModal({ open: true, eventTitle: title, attendees: [], loading: true });
    try {
      const res = await api.get(`/attendance/event/${eventId}`);
      setAttModal((p) => ({ ...p, attendees: res.data.data || [], loading: false }));
    } catch { setAttModal((p) => ({ ...p, loading: false })); }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300';
      default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300';
    }
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <HiOutlineCheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected': return <HiOutlineXCircle className="w-5 h-5 text-red-500" />;
      default: return <HiOutlineClock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const downloadQR = () => {
    if (!qrModal.qrCode) return;
    const link = document.createElement('a');
    link.href = qrModal.qrCode;
    link.download = `qr-${qrModal.eventTitle.replace(/\s+/g, '-')}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
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
            <div key={event._id} className="card flex flex-col gap-4 !p-5 hover:border-primary-500/30 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                  <HiOutlineCalendar className="w-8 h-8 text-primary-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <Link to={`/events/${event._id}`} className="hover:text-primary-500 transition-colors">
                    <h3 className="font-medium text-lg truncate">{event.title}</h3>
                  </Link>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">{new Date(event.startDate).toLocaleDateString()} • {event.category}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs text-[var(--text-tertiary)]">Event ID:</span>
                    <code className="text-xs bg-[var(--bg-tertiary)] px-2 py-1 rounded font-mono select-all">{event._id}</code>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-[var(--text-tertiary)] flex items-center gap-1"><HiOutlineUserGroup className="w-3.5 h-3.5" /> {event.registrationCount || 0} Registered</span>
                    <span className="text-xs text-[var(--text-tertiary)] flex items-center gap-1"><HiOutlineCheckCircle className="w-3.5 h-3.5" /> {event.attendanceCount || 0} Attended</span>
                  </div>
                  {event.status === 'rejected' && event.rejectionReason && <p className="text-xs text-red-500 mt-2">Reason: {event.rejectionReason}</p>}
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold self-start ${getStatusBadge(event.status)}`}>
                  {getStatusIcon(event.status)}<span className="capitalize">{event.status}</span>
                </div>
              </div>
              <div className="flex gap-2 pt-3 border-t border-[var(--border-color)] mt-2">
                <button onClick={() => handleShowQR(event._id, event.title)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-primary-500/10 text-primary-600 dark:text-primary-400 hover:bg-primary-500/20 transition-all" id={`show-qr-${event._id}`}>
                  <HiOutlineQrcode className="w-4 h-4" /> Show QR Code
                </button>
                <button onClick={() => handleViewAttendance(event._id, event.title)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] border border-[var(--border-color)] transition-all" id={`view-att-${event._id}`}>
                  <HiOutlineUserGroup className="w-4 h-4" /> View Attendance
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QR Code Modal */}
      {qrModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setQrModal((p) => ({ ...p, open: false }))}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-[var(--bg-primary)] rounded-2xl shadow-2xl max-w-md w-full p-8 animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setQrModal((p) => ({ ...p, open: false }))} className="absolute top-4 right-4 p-2 rounded-xl hover:bg-[var(--bg-tertiary)]"><HiOutlineX className="w-5 h-5" /></button>
            <div className="text-center">
              <h2 className="font-display text-xl font-bold mb-1">{qrModal.eventTitle}</h2>
              <p className="text-sm text-[var(--text-secondary)] mb-6">Show this QR code to attendees for scanning</p>
              {qrModal.loading ? (
                <div className="w-64 h-64 rounded-2xl bg-[var(--bg-tertiary)] animate-pulse-soft mx-auto" />
              ) : qrModal.qrCode ? (
                <div className="bg-white p-6 rounded-2xl inline-block shadow-inner mx-auto"><img src={qrModal.qrCode} alt="Event QR Code" className="w-56 h-56" /></div>
              ) : (
                <div className="w-64 h-64 rounded-2xl bg-[var(--bg-tertiary)] flex items-center justify-center mx-auto"><p className="text-sm text-[var(--text-tertiary)]">Failed to load QR</p></div>
              )}
              <p className="text-xs text-[var(--text-tertiary)] mt-4 mb-4">Attendees scan this with the QR Attendance Scanner</p>
              {qrModal.qrCode && <button onClick={downloadQR} className="btn-primary !py-2.5 text-sm w-full flex items-center justify-center gap-2"><HiOutlineDownload className="w-4 h-4" /> Download QR Image</button>}
            </div>
          </div>
        </div>
      )}

      {/* Attendance Modal */}
      {attModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setAttModal((p) => ({ ...p, open: false }))}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-[var(--bg-primary)] rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] flex flex-col animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-[var(--border-color)] flex items-center justify-between">
              <div>
                <h2 className="font-display text-lg font-bold">{attModal.eventTitle}</h2>
                <p className="text-sm text-[var(--text-secondary)]">{attModal.loading ? 'Loading...' : `${attModal.attendees.length} attendee${attModal.attendees.length !== 1 ? 's' : ''}`}</p>
              </div>
              <button onClick={() => setAttModal((p) => ({ ...p, open: false }))} className="p-2 rounded-xl hover:bg-[var(--bg-tertiary)]"><HiOutlineX className="w-5 h-5" /></button>
            </div>
            <div className="overflow-y-auto flex-1 p-6">
              {attModal.loading ? (
                <div className="space-y-3">{[1,2,3].map((i) => <div key={i} className="h-16 rounded-xl bg-[var(--bg-tertiary)] animate-pulse-soft" />)}</div>
              ) : attModal.attendees.length === 0 ? (
                <div className="text-center py-12">
                  <HiOutlineUserGroup className="w-12 h-12 text-[var(--text-tertiary)] mx-auto mb-3" />
                  <p className="text-[var(--text-secondary)] text-sm">No attendees yet</p>
                  <p className="text-xs text-[var(--text-tertiary)] mt-1">Share the QR code with registered participants</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {attModal.attendees.map((a: Attendee, i: number) => (
                    <div key={a._id} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-tertiary)]" style={{ animationDelay: `${i * 0.05}s` }}>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">{a.user?.firstName?.[0]}{a.user?.lastName?.[0]}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{a.user?.firstName} {a.user?.lastName}</p>
                        <p className="text-xs text-[var(--text-tertiary)]">{a.user?.email}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase ${a.verificationMethod === 'qr' ? 'bg-primary-500/10 text-primary-500' : 'bg-amber-500/10 text-amber-500'}`}>{a.verificationMethod}</span>
                        <p className="text-[10px] text-[var(--text-tertiary)] mt-0.5">{new Date(a.markedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrgEvents;
