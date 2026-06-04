import { HiOutlineHeart } from 'react-icons/hi';

const Footer = () => {
  return (
    <footer className="border-t border-[var(--border-color)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="font-display font-bold text-xl">
                <span className="text-gradient">Event</span>
                <span className="text-[var(--text-secondary)]">Hub</span>
              </span>
            </div>
            <p className="text-sm text-[var(--text-secondary)] max-w-sm">
              The ultimate platform for discovering, creating, and managing events.
              Connect with communities and organizations worldwide.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li><a href="/events" className="hover:text-primary-500 transition-colors">Browse Events</a></li>
              <li><a href="/org/register" className="hover:text-primary-500 transition-colors">For Organizations</a></li>
              <li><a href="/community" className="hover:text-primary-500 transition-colors">Community</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li><a href="#" className="hover:text-primary-500 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-primary-500 transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-primary-500 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[var(--text-tertiary)]">
            © {new Date().getFullYear()} EventHub. All rights reserved.
          </p>
          <p className="text-xs text-[var(--text-tertiary)] flex items-center gap-1">
            Made with <HiOutlineHeart className="w-3.5 h-3.5 text-red-500" /> by EventHub Team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
