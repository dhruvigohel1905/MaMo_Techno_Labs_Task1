import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { HiOutlineSearch, HiOutlineShieldCheck, HiOutlineBan, HiOutlineTrash } from 'react-icons/hi';

const AdminUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/users?page=${page}&limit=20`);
      const data = res.data.data;
      setUsers(data.users || data || []);
      setTotalPages(data.pages || 1);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [page]);

  const handlePromote = async (userId: string) => {
    if (!window.confirm('Promote this user to Admin?')) return;
    try {
      await api.put(`/admin/users/${userId}/promote`);
      fetchUsers();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Failed');
    }
  };

  const handleToggleStatus = async (userId: string) => {
    try {
      await api.put(`/users/${userId}/toggle-status`);
      fetchUsers();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Failed');
    }
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user? This cannot be undone.')) return;
    try {
      await api.delete(`/users/${userId}`);
      fetchUsers();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Failed');
    }
  };

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.firstName?.toLowerCase().includes(q) ||
      u.lastName?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-2xl font-bold mb-6">Manage Users</h1>

      {/* Search */}
      <div className="card mb-6">
        <div className="relative">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name, email, or role..."
            className="input-field !pl-10"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="card overflow-hidden !p-0">
        {loading ? (
          <div className="p-8 space-y-3">
            {[1,2,3,4,5].map(i => <div key={i} className="h-14 animate-pulse-soft bg-[var(--bg-tertiary)] rounded-lg" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-[var(--text-secondary)]">
            <p>No users found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border-color)] bg-[var(--bg-tertiary)]">
                  <th className="text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider px-5 py-3">User</th>
                  <th className="text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider px-5 py-3">Email</th>
                  <th className="text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider px-5 py-3">Role</th>
                  <th className="text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider px-5 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider px-5 py-3">Joined</th>
                  <th className="text-right text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {filtered.map((u) => (
                  <tr key={u._id} className="hover:bg-[var(--bg-tertiary)] transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg gradient-accent flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {u.firstName?.[0]}{u.lastName?.[0]}
                        </div>
                        <span className="text-sm font-medium">{u.firstName} {u.lastName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-[var(--text-secondary)]">{u.email}</td>
                    <td className="px-5 py-3">
                      <span className={`badge text-[10px] ${u.role === 'admin' ? 'badge-danger' : u.role === 'organizer' ? 'badge-warning' : 'badge-primary'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`badge text-[10px] ${u.isActive !== false ? 'badge-success' : 'badge-danger'}`}>
                        {u.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-[var(--text-tertiary)]">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center gap-1.5 justify-end">
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => handlePromote(u._id)}
                            title="Promote to Admin"
                            className="p-1.5 rounded-lg hover:bg-primary-500/10 text-[var(--text-secondary)] hover:text-primary-500 transition-colors"
                          >
                            <HiOutlineShieldCheck className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleToggleStatus(u._id)}
                          title={u.isActive !== false ? 'Deactivate' : 'Activate'}
                          className="p-1.5 rounded-lg hover:bg-yellow-500/10 text-[var(--text-secondary)] hover:text-yellow-500 transition-colors"
                        >
                          <HiOutlineBan className="w-4 h-4" />
                        </button>
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => handleDelete(u._id)}
                            title="Delete User"
                            className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--text-secondary)] hover:text-red-500 transition-colors"
                          >
                            <HiOutlineTrash className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${p === page ? 'bg-primary-500 text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
