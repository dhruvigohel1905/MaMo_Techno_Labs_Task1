import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { HiOutlineBell, HiOutlineCheck } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const Notifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.data.notifications || []);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all as read', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (loading) return <div className="animate-pulse-soft max-w-3xl mx-auto space-y-4"><div className="card h-24"></div><div className="card h-24"></div></div>;

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold flex items-center gap-3">
          <HiOutlineBell className="w-7 h-7 text-primary-500" /> Notifications
        </h1>
        {notifications.some(n => !n.isRead) && (
          <button onClick={markAllAsRead} className="text-sm font-medium text-primary-500 hover:text-primary-600">
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="card text-center py-16">
          <HiOutlineBell className="w-16 h-16 text-[var(--text-tertiary)] mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No notifications yet</h3>
          <p className="text-[var(--text-secondary)]">You're all caught up! We'll notify you when something happens.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div key={n._id} className={`card !p-4 transition-all flex gap-4 ${!n.isRead ? 'border-primary-500 shadow-md shadow-primary-500/10' : 'opacity-70'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${!n.isRead ? 'bg-primary-500 text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'}`}>
                <HiOutlineBell className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0 pt-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className={`text-sm font-semibold mb-1 ${!n.isRead ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>{n.title}</h3>
                    <p className="text-sm text-[var(--text-secondary)]">{n.message}</p>
                  </div>
                  <span className="text-xs text-[var(--text-tertiary)] flex-shrink-0 whitespace-nowrap">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {n.data?.eventId && (
                  <Link to={n.type === 'event_pending' ? '/admin/moderation' : `/events/${n.data.eventId}`} className="inline-block mt-3 text-xs font-semibold text-primary-500 hover:underline">
                    View Details
                  </Link>
                )}
              </div>
              {!n.isRead && (
                <button onClick={() => markAsRead(n._id)} className="flex-shrink-0 self-center p-2 rounded-full hover:bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] hover:text-primary-500 transition-colors" title="Mark as read">
                  <HiOutlineCheck className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
