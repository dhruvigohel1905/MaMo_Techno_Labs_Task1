import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import { HiOutlineShieldCheck, HiOutlineXCircle, HiOutlineCalendar, HiOutlineOfficeBuilding, HiOutlineUser, HiOutlineAcademicCap, HiOutlineArrowLeft } from 'react-icons/hi';

interface VerifyResult {
  valid: boolean;
  certificateId: string;
  participant: { firstName: string; lastName: string };
  event: { title: string; startDate: string };
  organization: { name: string };
  issuedAt: string;
}

const CertificateVerify = () => {
  const { code } = useParams();
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code) {
      setError('No verification code provided');
      setLoading(false);
      return;
    }

    api.get(`/certificates/verify/${code}`)
      .then((r) => {
        setResult(r.data.data);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Certificate not found or invalid');
      })
      .finally(() => setLoading(false));
  }, [code]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <HiOutlineShieldCheck className="w-8 h-8 text-primary-500" />
          </div>
          <p className="text-[var(--text-secondary)] font-medium">Verifying certificate...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12 animate-fade-in">
      <Link to="/" className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-primary-500 mb-8 transition-colors">
        <HiOutlineArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      {error ? (
        /* Error State */
        <div className="card text-center py-12">
          <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
            <HiOutlineXCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="font-display text-2xl font-bold mb-3">Verification Failed</h2>
          <p className="text-[var(--text-secondary)] text-sm max-w-sm mx-auto">
            {error}
          </p>
          <p className="text-xs text-[var(--text-tertiary)] mt-4">
            If you believe this is an error, please contact the issuing organization.
          </p>
        </div>
      ) : result ? (
        /* Verified State */
        <div className="card overflow-hidden">
          {/* Success Banner */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 -mx-6 -mt-6 p-8 text-center text-white mb-6">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <HiOutlineShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="font-display text-2xl font-bold mb-1">Certificate Verified</h2>
            <p className="text-sm text-white/80">This certificate is authentic and valid</p>
          </div>

          {/* Certificate Details */}
          <div className="space-y-5">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-[var(--bg-tertiary)]">
              <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                <HiOutlineUser className="w-5 h-5 text-primary-500" />
              </div>
              <div>
                <p className="text-xs text-[var(--text-tertiary)] mb-0.5">Participant</p>
                <p className="font-semibold">{result.participant.firstName} {result.participant.lastName}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-[var(--bg-tertiary)]">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                <HiOutlineAcademicCap className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-xs text-[var(--text-tertiary)] mb-0.5">Event</p>
                <p className="font-semibold">{result.event.title}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-[var(--bg-tertiary)]">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                <HiOutlineOfficeBuilding className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-[var(--text-tertiary)] mb-0.5">Organization</p>
                <p className="font-semibold">{result.organization.name}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[var(--bg-tertiary)]">
                <div className="flex items-center gap-2 mb-1">
                  <HiOutlineCalendar className="w-4 h-4 text-[var(--text-tertiary)]" />
                  <p className="text-xs text-[var(--text-tertiary)]">Event Date</p>
                </div>
                <p className="font-medium text-sm">
                  {new Date(result.event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[var(--bg-tertiary)]">
                <div className="flex items-center gap-2 mb-1">
                  <HiOutlineAcademicCap className="w-4 h-4 text-[var(--text-tertiary)]" />
                  <p className="text-xs text-[var(--text-tertiary)]">Issued</p>
                </div>
                <p className="font-medium text-sm">
                  {new Date(result.issuedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Certificate ID */}
            <div className="p-4 rounded-xl border-2 border-dashed border-[var(--border-color)]">
              <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider mb-1">Certificate ID</p>
              <p className="font-mono font-medium text-sm">{result.certificateId}</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CertificateVerify;
