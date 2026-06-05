import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { HiOutlineAcademicCap, HiOutlineDownload, HiOutlineCheckCircle, HiOutlineCalendar, HiOutlineShieldCheck } from 'react-icons/hi';

const MyCertificates = () => {
  const [certs, setCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    api.get('/certificates/my')
      .then((r) => setCerts(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDownload = async (certId: string) => {
    try {
      setDownloadingId(certId);
      const res = await api.get(`/certificates/${certId}/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate-${certId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert('Download failed. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold">My Certificates</h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">
          Certificates earned from events you've attended
        </p>
      </div>

      {/* Stats Bar */}
      {!loading && certs.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="card !p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-lg">
              <HiOutlineAcademicCap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold">{certs.length}</p>
              <p className="text-xs text-[var(--text-tertiary)]">Total Earned</p>
            </div>
          </div>
          <div className="card !p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white shadow-lg">
              <HiOutlineCheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold">{certs.length}</p>
              <p className="text-xs text-[var(--text-tertiary)]">Verified</p>
            </div>
          </div>
          <div className="card !p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white shadow-lg">
              <HiOutlineCalendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">
                {certs[0] ? new Date(certs[0].issuedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
              </p>
              <p className="text-xs text-[var(--text-tertiary)]">Latest Certificate</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card h-48 animate-pulse-soft" />
          ))}
        </div>
      ) : certs.length === 0 ? (
        /* Empty State */
        <div className="card text-center py-16">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-600/10 flex items-center justify-center mx-auto mb-6">
            <HiOutlineAcademicCap className="w-10 h-10 text-amber-500" />
          </div>
          <h3 className="font-display font-bold text-xl mb-2">No Certificates Yet</h3>
          <p className="text-sm text-[var(--text-secondary)] max-w-sm mx-auto mb-6">
            Attend events to earn certificates. Your achievements will appear here once you've had your attendance verified.
          </p>
          <Link to="/events" className="btn-primary !py-2.5 !px-6 text-sm inline-block">
            Browse Events
          </Link>
        </div>
      ) : (
        /* Certificates Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {certs.map((cert, index) => (
            <div
              key={cert._id}
              className="card hover-lift group overflow-hidden"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Certificate Header with gradient */}
              <div className="h-3 bg-gradient-to-r from-amber-500 via-primary-500 to-purple-500 -mx-6 -mt-6 mb-5 rounded-t-xl" />

              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-amber-500/20">
                  <HiOutlineAcademicCap className="w-7 h-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base mb-1 truncate group-hover:text-primary-500 transition-colors">
                    {cert.event?.title || 'Event Certificate'}
                  </h3>
                  <p className="text-xs text-[var(--text-tertiary)] mb-1 flex items-center gap-1">
                    <HiOutlineCalendar className="w-3.5 h-3.5" />
                    {cert.organization?.name || 'Organization'}
                  </p>
                  <p className="text-xs text-[var(--text-tertiary)]">
                    Issued: {new Date(cert.issuedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>

              {/* Certificate ID */}
              <div className="mt-4 p-3 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider mb-0.5">Certificate ID</p>
                    <p className="text-xs font-mono font-medium">{cert.certificateId}</p>
                  </div>
                  <div className="flex items-center gap-1 text-green-500">
                    <HiOutlineShieldCheck className="w-4 h-4" />
                    <span className="text-[10px] font-semibold uppercase">Verified</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleDownload(cert._id)}
                  disabled={downloadingId === cert._id}
                  className="btn-primary flex-1 !py-2.5 text-sm flex items-center justify-center gap-2"
                  id={`download-cert-${cert._id}`}
                >
                  {downloadingId === cert._id ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <HiOutlineDownload className="w-4 h-4" />
                      Download PDF
                    </>
                  )}
                </button>
                <Link
                  to={`/certificates/verify/${cert.qrVerificationCode}`}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] border border-[var(--border-color)] transition-all flex items-center gap-1.5"
                  id={`verify-cert-${cert._id}`}
                >
                  <HiOutlineShieldCheck className="w-4 h-4" />
                  Verify
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCertificates;
