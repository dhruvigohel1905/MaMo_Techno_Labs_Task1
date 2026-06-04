import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { HiOutlineOfficeBuilding, HiOutlineCheckCircle, HiOutlineClock } from 'react-icons/hi';

const OrgProfile = () => {
  const [org, setOrg] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    type: 'corporate',
    email: '',
    website: '',
  });

  useEffect(() => {
    api.get('/organizations/my')
      .then((res) => {
        setOrg(res.data.data);
      })
      .catch(() => {
        setOrg(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await api.post('/organizations', form);
      setOrg(res.data.data);
      alert('Organization profile submitted for approval!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create organization');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If organization exists, show its profile
  if (org) {
    return (
      <div className="max-w-3xl mx-auto animate-fade-in">
        <h1 className="font-display text-2xl font-bold mb-6">Organization Profile</h1>
        
        <div className="card !p-8 text-center space-y-4">
          <div className="w-20 h-20 bg-primary-500/10 rounded-full flex items-center justify-center mx-auto">
            <HiOutlineOfficeBuilding className="w-10 h-10 text-primary-500" />
          </div>
          
          <h2 className="text-xl font-bold">{org.name}</h2>
          <p className="text-[var(--text-secondary)] max-w-lg mx-auto">{org.description}</p>
          
          <div className="flex justify-center gap-4 text-sm text-[var(--text-tertiary)] mt-2">
            <span>{org.email}</span>
            <span>&bull;</span>
            <a href={org.website} target="_blank" rel="noreferrer" className="text-primary-500 hover:underline">{org.website}</a>
          </div>

          <div className={`flex items-center justify-center gap-2 font-medium w-max mx-auto px-4 py-2 rounded-full mt-6 ${org.status === 'approved' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-600'}`}>
            {org.status === 'approved' ? <HiOutlineCheckCircle className="w-5 h-5" /> : <HiOutlineClock className="w-5 h-5" />}
            <span>Status: {org.status.charAt(0).toUpperCase() + org.status.slice(1)}</span>
          </div>

          <p className="text-[var(--text-secondary)] mt-4">
            {org.status === 'approved' 
              ? 'Your organization profile has been approved. You can now create and manage events.' 
              : 'Your organization is waiting for administrator approval. You will be notified once reviewed.'}
          </p>
        </div>
      </div>
    );
  }

  // If no organization, show creation form
  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <h1 className="font-display text-2xl font-bold mb-6">Create Organization Profile</h1>
      
      <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 p-4 rounded-xl mb-6">
        <p className="font-medium text-sm">You must create an organization profile and get it approved before you can host events.</p>
      </div>

      <form onSubmit={handleSubmit} className="card !p-8 space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1.5">Organization Name *</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} className="input-field" placeholder="e.g. Stanford University CS Club" required />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1.5">Type *</label>
          <select name="type" value={form.type} onChange={handleChange} className="input-field">
            <option value="corporate">Corporate</option>
            <option value="education">Education / College</option>
            <option value="ngo">NGO / Non-profit</option>
            <option value="club">Student Club</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="input-field h-32 resize-none" placeholder="What does your organization do?" required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium mb-1.5">Contact Email *</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} className="input-field" placeholder="contact@org.com" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Website</label>
            <input type="url" name="website" value={form.website} onChange={handleChange} className="input-field" placeholder="https://..." />
          </div>
        </div>

        <div className="pt-4">
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Submitting...' : 'Submit for Approval'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrgProfile;
