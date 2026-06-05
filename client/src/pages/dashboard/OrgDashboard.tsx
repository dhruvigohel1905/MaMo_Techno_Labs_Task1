import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { HiOutlineCalendar, HiOutlineUserGroup, HiOutlineChartBar, HiOutlinePlusCircle, HiOutlineQrcode, HiOutlineX, HiOutlineDownload } from 'react-icons/hi';

const OrgDashboard = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [qrModal, setQrModal] = useState<{ open: boolean; eventId: string; eventTitle: string; qrCode: string; loading: boolean }>({ open: false, eventId: '', eventTitle: '', qrCode: '', loading: false });

  useEffect(() => {
    api.get('/events/list/my').then((r) => setEvents(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleShowQR = async (e: React.MouseEvent, eventId: string, title: string) => {
    e.preventDefault(); // Prevent navigating to event details
    e.stopPropagation();
    setQrModal({ open: true, eventId, eventTitle: title, qrCode: '', loading: true });
    try {
      const res = await api.get(`/events/${eventId}/qr`);
      setQrModal((p) => ({ ...p, qrCode: res.data.data.qrCode, loading: false }));
    } catch { setQrModal((p) => ({ ...p, loading: false })); }
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

  const approved = events.filter((e) => e.status === 'approved').length;
  const pending = events.filter((e) => e.status === 'pending').length;
  const totalRegs = events.reduce((a, e) => a + (e.registrationCount || 0), 0);

  return (
    <div className="animate-fade-in relative">
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Your Events</h2>
          <Link to="/org/events" className="text-sm text-primary-500 hover:underline font-medium">View All</Link>
        </div>
        {loading ? <div className="animate-pulse-soft h-32" /> : events.length === 0 ? (
          <div className="text-center py-8"><p className="text-[var(--text-secondary)]">No events yet. <Link to="/org/events/create" className="text-primary-500 font-medium">Create your first event</Link></p></div>
        ) : (
          <div className="space-y-3">
            {events.map((e) => (
              <div key={e._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors border border-transparent hover:border-[var(--border-color)]">
                <Link to={`/events/${e._id}`} className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center flex-shrink-0"><HiOutlineCalendar className="w-5 h-5 text-primary-500" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{e.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] bg-[var(--bg-secondary)] px-1.5 py-0.5 rounded font-mono border border-[var(--border-color)]">ID: {e._id}</span>
                      <span className="text-xs text-[var(--text-tertiary)]">{new Date(e.startDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Link>
                <div className="flex items-center gap-3">
                  <span className={`badge text-xs ${e.status === 'approved' ? 'badge-success' : e.status === 'pending' ? 'badge-warning' : 'badge-danger'}`}>{e.status}</span>
                  <button onClick={(ev) => handleShowQR(ev, e._id, e.title)} className="p-2 rounded-lg bg-primary-500/10 text-primary-600 hover:bg-primary-500/20 transition-colors" title="Show QR Code">
                    <HiOutlineQrcode className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
    </div>
  );
};

export default OrgDashboard;
