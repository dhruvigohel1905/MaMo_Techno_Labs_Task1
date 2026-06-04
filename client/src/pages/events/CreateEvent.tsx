import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { HiOutlineLightningBolt } from 'react-icons/hi';

const categories = ['workshop', 'seminar', 'hackathon', 'webinar', 'conference', 'meetup', 'cultural', 'sports', 'other'];

const CreateEvent = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', category: 'workshop', location: '', isOnline: false, startDate: '', endDate: '', time: '', maxParticipants: '', tags: '' });
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const val = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const handleAIDescription = async () => {
    if (!form.title || !form.category) return alert('Please enter title and category first');
    try {
      setAiLoading(true);
      const res = await api.post('/ai/generate-description', { title: form.title, category: form.category });
      setForm({ ...form, description: res.data.data.description });
    } catch (err: any) { 
      alert(err.response?.data?.message || 'AI generation failed. Check your Gemini API key.'); 
    }
    finally { setAiLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = { ...form, maxParticipants: form.maxParticipants ? parseInt(form.maxParticipants) : 0, tags: form.tags ? form.tags.split(',').map((t) => t.trim()) : [] };
      await api.post('/events', data);
      alert('Event created successfully! Request sent to Admin for approval.');
      navigate('/org/events');
    } catch (err: any) { alert(err.response?.data?.message || 'Failed to create event'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <h1 className="font-display text-2xl font-bold mb-6">Create New Event</h1>
      <form onSubmit={handleSubmit} className="card !p-8 space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1.5">Event Title *</label>
          <input type="text" name="title" value={form.title} onChange={handleChange} className="input-field" placeholder="Enter event title" required id="event-title" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Category *</label>
          <select name="category" value={form.category} onChange={handleChange} className="input-field" id="event-category">
            {categories.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
          </select>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium">Description *</label>
            <button type="button" onClick={handleAIDescription} disabled={aiLoading} className="btn-secondary !py-1 !px-3 text-xs">
              <HiOutlineLightningBolt className="w-3.5 h-3.5" /> {aiLoading ? 'Generating...' : 'AI Generate'}
            </button>
          </div>
          <textarea name="description" value={form.description} onChange={handleChange} className="input-field resize-none h-40" placeholder="Describe your event..." required id="event-desc" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1.5">Start Date *</label><input type="date" name="startDate" value={form.startDate} onChange={handleChange} className="input-field" required /></div>
          <div><label className="block text-sm font-medium mb-1.5">End Date *</label><input type="date" name="endDate" value={form.endDate} onChange={handleChange} className="input-field" required /></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1.5">Time</label><input type="text" name="time" value={form.time} onChange={handleChange} className="input-field" placeholder="10:00 AM - 5:00 PM" /></div>
          <div><label className="block text-sm font-medium mb-1.5">Max Participants</label><input type="number" name="maxParticipants" value={form.maxParticipants} onChange={handleChange} className="input-field" placeholder="0 = unlimited" /></div>
        </div>
        <div>
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="isOnline" checked={form.isOnline} onChange={handleChange} className="w-4 h-4 accent-primary-500" /><span className="text-sm">Online Event</span></label>
        </div>
        {!form.isOnline && <div><label className="block text-sm font-medium mb-1.5">Location</label><input type="text" name="location" value={form.location} onChange={handleChange} className="input-field" placeholder="Event venue address" /></div>}
        <div><label className="block text-sm font-medium mb-1.5">Tags (comma-separated)</label><input type="text" name="tags" value={form.tags} onChange={handleChange} className="input-field" placeholder="tech, coding, beginner" /></div>
        <div className="flex gap-3 pt-4">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary flex-1" id="submit-event">{loading ? 'Creating...' : 'Create Event'}</button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;
