import { Link } from 'react-router-dom';
import { HiOutlineHome } from 'react-icons/hi';

const NotFound = () => (
  <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
    <div className="text-center animate-scale-in">
      <div className="text-8xl font-display font-bold gradient-text mb-4">404</div>
      <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
      <p className="text-[var(--text-secondary)] mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn-primary"><HiOutlineHome className="w-5 h-5" /> Go Home</Link>
    </div>
  </div>
);

export default NotFound;
