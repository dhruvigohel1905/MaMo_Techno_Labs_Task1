import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { HiOutlineCheck, HiOutlineX } from 'react-icons/hi';

const AdminModeration = () => {
  const [data, setData] = useState<{ organizations: any[]; events: any[] }>({ organizations: [], events: [] });
  const [loading, setLoading] = useState(true);

  const fetchApprovals = async () => {
    try {
      const res = await api.get('/admin/approvals');
      setData(res.data.data);
    } catch (error) {
      console.error('Failed to fetch approvals', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleModerateOrg = async (id: string, status: 'approved' | 'rejected') => {
    if (!window.confirm(`Are you sure you want to ${status.slice(0, -1)} this organization?`)) return;
    try {
      await api.put(`/admin/organizations/${id}/moderate`, { status });
      fetchApprovals();
    } catch (e: any) {
      alert(e.response?.data?.message || `Failed to ${status} organization`);
    }
  };

  const handleModerateEvent = async (id: string, status: 'approved' | 'rejected') => {
    if (!window.confirm(`Are you sure you want to ${status.slice(0, -1)} this event?`)) return;
    try {
      await api.put(`/admin/events/${id}/moderate`, { status });
      fetchApprovals();
    } catch (e: any) {
      alert(e.response?.data?.message || `Failed to ${status} event`);
    }
  };

  if (loading) return <div className="animate-pulse-soft h-32 card"></div>;

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-2xl font-bold mb-6">Moderation Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Organizations */}
        <div className="card">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            Pending Organizations
            <span className="badge badge-warning">{data.organizations.length}</span>
          </h2>
          
          {data.organizations.length === 0 ? (
            <p className="text-[var(--text-secondary)] text-sm">No pending organizations.</p>
          ) : (
            <div className="space-y-4">
              {data.organizations.map((org) => (
                <div key={org._id} className="border border-[var(--border-color)] rounded-xl p-4 transition-all hover:border-primary-500/30">
                  <h3 className="font-medium text-primary-600 dark:text-primary-400">{org.name}</h3>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">{org.description}</p>
                  <p className="text-xs text-[var(--text-tertiary)] mt-2">
                    Submitted by: {org.owner?.firstName} {org.owner?.lastName} ({org.owner?.email})
                  </p>
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => handleModerateOrg(org._id, 'approved')} className="btn-primary !py-1.5 !px-3 text-sm flex-1 flex items-center justify-center gap-1 bg-green-500 hover:bg-green-600 text-white">
                      <HiOutlineCheck className="w-4 h-4" /> Approve
                    </button>
                    <button onClick={() => handleModerateOrg(org._id, 'rejected')} className="btn-secondary !py-1.5 !px-3 text-sm flex-1 flex items-center justify-center gap-1 border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10">
                      <HiOutlineX className="w-4 h-4" /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Events */}
        <div className="card">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            Pending Events
            <span className="badge badge-warning">{data.events.length}</span>
          </h2>
          
          {data.events.length === 0 ? (
            <p className="text-[var(--text-secondary)] text-sm">No pending events.</p>
          ) : (
            <div className="space-y-4">
              {data.events.map((event) => (
                <div key={event._id} className="border border-[var(--border-color)] rounded-xl p-4 transition-all hover:border-primary-500/30">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium text-primary-600 dark:text-primary-400">{event.title}</h3>
                    <span className="badge text-[10px]">{event.category}</span>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] line-clamp-2">{event.description}</p>
                  <p className="text-xs text-[var(--text-tertiary)] mt-2">
                    Organization: {event.organization?.name}
                  </p>
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => handleModerateEvent(event._id, 'approved')} className="btn-primary !py-1.5 !px-3 text-sm flex-1 flex items-center justify-center gap-1 bg-green-500 hover:bg-green-600 text-white">
                      <HiOutlineCheck className="w-4 h-4" /> Approve
                    </button>
                    <button onClick={() => handleModerateEvent(event._id, 'rejected')} className="btn-secondary !py-1.5 !px-3 text-sm flex-1 flex items-center justify-center gap-1 border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10">
                      <HiOutlineX className="w-4 h-4" /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminModeration;
