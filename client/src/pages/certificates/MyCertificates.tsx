import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { HiOutlineAcademicCap, HiOutlineDownload } from 'react-icons/hi';

const MyCertificates = () => {
  const [certs, setCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/certificates/my').then((r) => setCerts(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleDownload = async (certId: string) => {
    try {
      const res = await api.get(`/certificates/${certId}/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate-${certId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch { alert('Download failed'); }
  };

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-2xl font-bold mb-6">My Certificates</h1>
      {loading ? <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{[1,2].map((i) => <div key={i} className="card h-32 animate-pulse-soft" />)}</div> : certs.length === 0 ? (
        <div className="card text-center py-12"><HiOutlineAcademicCap className="w-16 h-16 text-[var(--text-tertiary)] mx-auto mb-4" /><h3 className="font-semibold text-lg mb-2">No Certificates Yet</h3><p className="text-sm text-[var(--text-secondary)]">Attend events to earn certificates!</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certs.map((cert) => (
            <div key={cert._id} className="card hover-lift">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white flex-shrink-0"><HiOutlineAcademicCap className="w-7 h-7" /></div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm mb-1 truncate">{cert.event?.title}</h3>
                  <p className="text-xs text-[var(--text-tertiary)] mb-1">{cert.organization?.name}</p>
                  <p className="text-xs text-[var(--text-tertiary)]">Issued: {new Date(cert.issuedAt).toLocaleDateString()}</p>
                  <p className="text-[10px] text-[var(--text-tertiary)] mt-1 font-mono">{cert.certificateId}</p>
                </div>
              </div>
              <button onClick={() => handleDownload(cert._id)} className="btn-primary w-full mt-4 !py-2 text-sm"><HiOutlineDownload className="w-4 h-4" /> Download PDF</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCertificates;
