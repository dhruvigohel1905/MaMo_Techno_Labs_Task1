import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { HiOutlineOfficeBuilding, HiOutlineSearch, HiOutlineCheck, HiOutlineX } from 'react-icons/hi';

const AdminOrganizations = () => {
  const [orgs, setOrgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchOrgs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/organizations');
      setOrgs(res.data.data || []);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrgs(); }, []);

  const handleModerate = async (id: string, status: 'approved' | 'rejected') => {
    if (!window.confirm(`${status === 'approved' ? 'Approve' : 'Reject'} this organization?`)) return;
    try {
      await api.put(`/admin/organizations/${id}/moderate`, { status });
      fetchOrgs();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Failed');
    }
  };

  const filtered = orgs.filter((o) => {
    const q = search.toLowerCase();
    const matchesSearch = o.name?.toLowerCase().includes(q) || o.type?.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-2xl font-bold mb-6">Manage Organizations</h1>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search organizations..."
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

      {/* Org List */}
      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="card h-28 animate-pulse-soft" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-12">
          <HiOutlineOfficeBuilding className="w-12 h-12 mx-auto mb-3 text-[var(--text-tertiary)]" />
          <p className="text-[var(--text-secondary)]">No organizations found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((org) => (
            <div key={org._id} className="card hover:border-primary-500/30 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {org.logo ? (
                    <img src={org.logo} alt={org.name} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    org.name?.[0]
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold truncate">{org.name}</h3>
                    <span className={`badge text-[10px] ${org.status === 'approved' ? 'badge-success' : org.status === 'pending' ? 'badge-warning' : 'badge-danger'}`}>
                      {org.status}
                    </span>
                    <span className="badge text-[10px]">{org.type}</span>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-2">{org.description}</p>
                  <div className="flex items-center gap-4 text-xs text-[var(--text-tertiary)]">
                    <span>Owner: {org.owner?.firstName} {org.owner?.lastName}</span>
                    <span>Created: {new Date(org.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                {org.status === 'pending' && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleModerate(org._id, 'approved')}
                      className="p-2 rounded-xl bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors"
                      title="Approve"
                    >
                      <HiOutlineCheck className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleModerate(org._id, 'rejected')}
                      className="p-2 rounded-xl bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors"
                      title="Reject"
                    >
                      <HiOutlineX className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrganizations;
