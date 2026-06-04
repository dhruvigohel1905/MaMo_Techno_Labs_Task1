import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { HiOutlineChartBar, HiOutlineUserGroup, HiOutlineCalendar, HiOutlineTicket, HiOutlineAcademicCap, HiOutlineChatAlt2 } from 'react-icons/hi';

const AdminAnalytics = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard').then((r) => setData(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="animate-pulse-soft space-y-6">
      <div className="h-8 bg-[var(--bg-tertiary)] rounded w-48" />
      <div className="grid grid-cols-3 gap-4">{[1,2,3].map(i => <div key={i} className="card h-32" />)}</div>
    </div>
  );

  const s = data?.stats || {};

  const metrics = [
    { label: 'Total Users', value: s.totalUsers || 0, icon: HiOutlineUserGroup, color: 'from-blue-500 to-blue-600', desc: 'Registered platform users' },
    { label: 'Organizations', value: s.totalOrganizations || 0, icon: HiOutlineCalendar, color: 'from-purple-500 to-purple-600', desc: `${s.approvedOrgs || 0} approved, ${s.pendingOrgs || 0} pending` },
    { label: 'Total Events', value: s.totalEvents || 0, icon: HiOutlineCalendar, color: 'from-emerald-500 to-emerald-600', desc: `${s.approvedEvents || 0} approved, ${s.pendingEvents || 0} pending` },
    { label: 'Registrations', value: s.totalRegistrations || 0, icon: HiOutlineTicket, color: 'from-amber-500 to-amber-600', desc: 'Active event registrations' },
    { label: 'Attendance', value: s.totalAttendance || 0, icon: HiOutlineChartBar, color: 'from-cyan-500 to-cyan-600', desc: 'Total attendance records' },
    { label: 'Certificates', value: s.totalCertificates || 0, icon: HiOutlineAcademicCap, color: 'from-pink-500 to-pink-600', desc: 'Certificates generated' },
    { label: 'Community Posts', value: s.totalPosts || 0, icon: HiOutlineChatAlt2, color: 'from-indigo-500 to-indigo-600', desc: 'Posts in community feed' },
  ];

  const attendanceRate = s.totalRegistrations > 0
    ? Math.round((s.totalAttendance / s.totalRegistrations) * 100)
    : 0;

  const approvalRate = s.totalEvents > 0
    ? Math.round((s.approvedEvents / s.totalEvents) * 100)
    : 0;

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-2xl font-bold mb-6">Platform Analytics</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        {metrics.map((m, i) => (
          <div key={i} className="card !p-5 animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center text-white`}>
                <m.icon className="w-5 h-5" />
              </div>
              <span className="text-2xl font-display font-bold">{m.value}</span>
            </div>
            <p className="text-sm font-medium">{m.label}</p>
            <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{m.desc}</p>
          </div>
        ))}
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card !p-6">
          <h2 className="font-semibold mb-4">Attendance Rate</h2>
          <div className="flex items-end gap-4 mb-4">
            <span className="text-5xl font-display font-bold text-primary-500">{attendanceRate}%</span>
            <span className="text-sm text-[var(--text-secondary)] mb-1">of registrants attended</span>
          </div>
          <div className="w-full h-3 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-1000"
              style={{ width: `${attendanceRate}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-[var(--text-tertiary)] mt-2">
            <span>{s.totalAttendance || 0} attended</span>
            <span>{s.totalRegistrations || 0} registered</span>
          </div>
        </div>

        <div className="card !p-6">
          <h2 className="font-semibold mb-4">Event Approval Rate</h2>
          <div className="flex items-end gap-4 mb-4">
            <span className="text-5xl font-display font-bold text-green-500">{approvalRate}%</span>
            <span className="text-sm text-[var(--text-secondary)] mb-1">of events approved</span>
          </div>
          <div className="w-full h-3 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-1000"
              style={{ width: `${approvalRate}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-[var(--text-tertiary)] mt-2">
            <span>{s.approvedEvents || 0} approved</span>
            <span>{s.totalEvents || 0} total</span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-semibold mb-4">Recent Users</h2>
          <div className="space-y-3">
            {(data?.recentUsers || []).map((u: any) => (
              <div key={u._id} className="flex items-center gap-3 p-2 rounded-lg">
                <div className="w-9 h-9 rounded-lg gradient-accent flex items-center justify-center text-white text-xs font-bold">{u.firstName[0]}{u.lastName[0]}</div>
                <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{u.firstName} {u.lastName}</p><p className="text-xs text-[var(--text-tertiary)]">{u.email}</p></div>
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

export default AdminAnalytics;
