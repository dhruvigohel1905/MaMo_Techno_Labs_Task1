import { Link } from 'react-router-dom';
import { HiOutlineCalendar, HiOutlineUserGroup, HiOutlineQrcode, HiOutlineAcademicCap, HiOutlineLightningBolt, HiOutlineGlobe, HiOutlineArrowRight } from 'react-icons/hi';

const features = [
  { icon: HiOutlineCalendar, title: 'Event Management', desc: 'Create, manage, and publish events with full approval workflow and rich details.' },
  { icon: HiOutlineQrcode, title: 'QR Attendance', desc: 'Generate unique QR codes for each event and scan to verify attendee presence.' },
  { icon: HiOutlineAcademicCap, title: 'Auto Certificates', desc: 'Automatically generate professional PDF certificates after attendance verification.' },
  { icon: HiOutlineUserGroup, title: 'Community Hub', desc: 'Share updates, interact with posts, and build engaged communities around events.' },
  { icon: HiOutlineLightningBolt, title: 'AI Assistance', desc: 'Generate event descriptions, schedules, and certificate content with Gemini AI.' },
  { icon: HiOutlineGlobe, title: 'Organization Profiles', desc: 'Colleges, NGOs, companies, and clubs can register and showcase their organizations.' },
];

const stats = [
  { value: '10K+', label: 'Events Created' },
  { value: '50K+', label: 'Users Registered' },
  { value: '200+', label: 'Organizations' },
  { value: '25K+', label: 'Certificates Issued' },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-28 lg:py-36">
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-500/15 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-600 dark:text-primary-400 text-sm font-medium mb-6 animate-fade-in">
            <HiOutlineLightningBolt className="w-4 h-4" />
            AI-Powered Event Platform
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-6 animate-slide-up">
            Discover, Create &<br />
            <span className="gradient-text">Manage Events</span><br />
            Effortlessly
          </h1>

          <p className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            The all-in-one platform for organizations to host events, engage communities,
            and automate attendance tracking with QR codes and certificate generation.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/register" className="btn-primary !py-3.5 !px-8 text-base shadow-xl shadow-primary-500/25" id="hero-cta">
              Get Started Free <HiOutlineArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/events" className="btn-secondary !py-3.5 !px-8 text-base" id="hero-browse">
              Browse Events
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="text-3xl sm:text-4xl font-display font-bold gradient-text mb-1">{stat.value}</div>
                <div className="text-sm text-[var(--text-secondary)]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title mb-4">Everything You Need</h2>
            <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
              Powerful features to streamline your event management workflow from start to finish.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="card hover-lift group cursor-default animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center mb-4 group-hover:bg-primary-500/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 sm:py-28 bg-[var(--bg-tertiary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title mb-4">How It Works</h2>
            <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
              Get started in minutes with our streamlined approval workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Register', desc: 'Create your account as a user or organization' },
              { step: '02', title: 'Get Approved', desc: 'Admin reviews and approves your organization' },
              { step: '03', title: 'Create Events', desc: 'Set up events with all details and submit for review' },
              { step: '04', title: 'Engage', desc: 'Users register, attend, and earn certificates' },
            ].map((item, i) => (
              <div key={i} className="text-center animate-slide-up" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-white font-display font-bold text-xl mx-auto mb-4 shadow-lg shadow-primary-500/25">
                  {item.step}
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="gradient-primary rounded-3xl p-10 sm:p-16 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9zdmc+')] opacity-50" />
            <div className="relative">
              <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto">
                Join thousands of organizations and participants on the ultimate event platform.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/register" className="bg-white text-primary-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-white/90 transition-all inline-flex items-center gap-2 shadow-xl" id="cta-register">
                  Create Free Account <HiOutlineArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/org/register" className="border-2 border-white/30 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-all inline-flex items-center gap-2" id="cta-org">
                  Register Organization
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
