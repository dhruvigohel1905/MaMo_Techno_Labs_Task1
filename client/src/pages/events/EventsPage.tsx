import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import type { Event as EventType } from '../../types';
import { HiOutlineSearch, HiOutlineLocationMarker, HiOutlineCalendar, HiOutlineUserGroup } from 'react-icons/hi';

const categories = ['all', 'workshop', 'seminar', 'hackathon', 'webinar', 'conference', 'meetup', 'cultural', 'sports', 'other'];

const EventsPage = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchEvents();
  }, [page, category]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params: any = { page, limit: 12 };
      if (category !== 'all') params.category = category;
      if (search) params.search = search;
      const res = await api.get('/events', { params });
      setEvents(res.data.data.events);
      setTotalPages(res.data.data.pages);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setPage(1); fetchEvents(); };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="section-title mb-2">Discover Events</h1>
        <p className="text-[var(--text-secondary)]">Find and register for exciting events happening around you</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="input-field !pl-12 !pr-24" placeholder="Search events..." id="event-search" />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary !py-1.5 !px-4 text-xs">Search</button>
        </form>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
        {categories.map((cat) => (
          <button key={cat} onClick={() => { setCategory(cat); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${category === cat ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:border-primary-300'}`}>
            {cat === 'all' ? 'All Events' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card animate-pulse-soft">
              <div className="h-48 bg-[var(--bg-tertiary)] rounded-xl mb-4" />
              <div className="h-5 bg-[var(--bg-tertiary)] rounded w-3/4 mb-2" />
              <div className="h-4 bg-[var(--bg-tertiary)] rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20">
          <HiOutlineCalendar className="w-16 h-16 text-[var(--text-tertiary)] mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Events Found</h3>
          <p className="text-[var(--text-secondary)]">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const org = event.organization as any;
            return (
              <Link key={event._id} to={`/events/${event._id}`} className="card hover-lift group overflow-hidden !p-0" id={`event-${event._id}`}>
                <div className="h-48 bg-gradient-to-br from-primary-500/20 to-accent-500/20 relative overflow-hidden">
                  {event.banner ? (
                    <img src={event.banner} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <HiOutlineCalendar className="w-16 h-16 text-primary-300" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="badge badge-primary !bg-primary-500 !text-white text-xs">{event.category}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary-500 transition-colors">{event.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-3">{event.description}</p>
                  <div className="space-y-1.5 text-xs text-[var(--text-secondary)]">
                    <div className="flex items-center gap-2">
                      <HiOutlineCalendar className="w-4 h-4 text-primary-500" />
                      {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-2">
                      <HiOutlineLocationMarker className="w-4 h-4 text-primary-500" />
                      {event.isOnline ? 'Online Event' : event.location || 'TBA'}
                    </div>
                    <div className="flex items-center gap-2">
                      <HiOutlineUserGroup className="w-4 h-4 text-primary-500" />
                      {event.registrationCount} / {event.maxParticipants || '∞'} registered
                    </div>
                  </div>
                  {org?.name && (
                    <div className="mt-3 pt-3 border-t border-[var(--border-color)] flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full gradient-accent flex items-center justify-center text-white text-[10px] font-bold">{org.name[0]}</div>
                      <span className="text-xs font-medium text-[var(--text-secondary)]">{org.name}</span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)}
              className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${p === page ? 'bg-primary-500 text-white' : 'bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-primary-300'}`}>
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsPage;
