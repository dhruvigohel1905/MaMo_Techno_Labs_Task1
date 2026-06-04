import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { HiOutlineUserGroup, HiOutlineOfficeBuilding, HiOutlineCalendar, HiOutlineTicket, HiOutlineCheck, HiOutlineClock, HiOutlineChartBar } from 'react-icons/hi';

const AdminDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard').then((r) => setData(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse-soft space-y-6"><div className="grid grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="card h-24" />)}</div></div>;

  const s = data?.stats || {};
  const statCards = [
    { label: 'Total Users', value: s.totalUsers, icon: HiOutlineUserGroup, color: 'from-blue-500 to-blue-600' },
    { label: 'Organizations', value: s.totalOrganizations, icon: HiOutlineOfficeBuilding, color: 'from-purple-500 to-purple-600' },
    { label: 'Total Events', value: s.totalEvents, icon: HiOutlineCalendar, color: 'from-emerald-500 to-emerald-600' },
    { label: 'Registrations', value: s.totalRegistrations, icon: HiOutlineTicket, color: 'from-amber-500 to-amber-600' },
    { label: 'Approved Events', value: s.approvedEvents, icon: HiOutlineCheck, color: 'from-green-500 to-green-600' },
    { label: 'Pending Events', value: s.pendingEvents, icon: HiOutlineClock, color: 'from-orange-500 to-orange-600' },
    { label: 'Pending Orgs', value: s.pendingOrgs, icon: HiOutlineOfficeBuilding, color: 'from-red-500 to-red-600' },
    { label: 'Certificates', value: s.totalCertificates, icon: HiOutlineChartBar, color: 'from-pink-500 to-pink-600' },
  ];

  const handlePromote = async (userId: string) => {
    if (!window.confirm('Are you sure you want to promote this user to Admin?')) return;
    try {
      await api.put(`/admin/users/${userId}/promote`);
      const r = await api.get('/admin/dashboard');
      setData(r.data.data);
    } catch (e: any) {
      alert(e.response?.data?.message || 'Failed to promote user');
    }
  };

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((c, i) => (
          <div key={i} className="card !p-5 animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="flex items-center justify-between mb-2">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-white`}>
                <c.icon className="w-5 h-5" />
              </div>
              <span className="text-2xl font-display font-bold">{c.value || 0}</span>
            </div>
            <p className="text-sm text-[var(--text-secondary)]">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-semibold mb-4">Recent Users</h2>
          <div className="space-y-3">
            {(data?.recentUsers || []).map((u: any) => (
              <div key={u._id} className="flex items-center gap-3 p-2 rounded-lg">
                <div className="w-9 h-9 rounded-lg gradient-accent flex items-center justify-center text-white text-xs font-bold">{u.firstName[0]}{u.lastName[0]}</div>
                <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{u.firstName} {u.lastName}</p><p className="text-xs text-[var(--text-tertiary)]">{u.email}</p></div>
                {u.role !== 'admin' && (
                  <button onClick={() => handlePromote(u._id)} className="btn-secondary !py-1 !px-2 text-[10px] mr-2">Make Admin</button>
                )}
                <span className="badge badge-primary text-[10px]">{u.role}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h2 className="font-semibold mb-4">Recent Events</h2>
          <div className="space-y-3">
            {(data?.recentEvents || []).map((e: any) => (
              <div key={e._id} className="flex items-center gap-3 p-2 rounded-lg">
                <div className="w-9 h-9 rounded-lg bg-primary-500/10 flex items-center justify-center"><HiOutlineCalendar className="w-4 h-4 text-primary-500" /></div>
                <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{e.title}</p><p className="text-xs text-[var(--text-tertiary)]">{e.organization?.name}</p></div>
                <span className={`badge text-[10px] ${e.status === 'approved' ? 'badge-success' : e.status === 'pending' ? 'badge-warning' : 'badge-danger'}`}>{e.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
