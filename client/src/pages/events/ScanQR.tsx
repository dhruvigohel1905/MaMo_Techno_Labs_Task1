import { useEffect, useState, useRef, useCallback } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import api from '../../utils/api';
import { HiOutlineQrcode, HiOutlineCheckCircle, HiOutlineXCircle, HiOutlinePencilAlt, HiOutlineClock } from 'react-icons/hi';

interface ScanRecord {
  id: string;
  success: boolean;
  message: string;
  eventId?: string;
  timestamp: Date;
}

const ScanQR = () => {
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [manualEventId, setManualEventId] = useState('');
  const [scanHistory, setScanHistory] = useState<ScanRecord[]>([]);
  const [scannerError, setScannerError] = useState<string | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const processingRef = useRef(false);
  const mountedRef = useRef(true);

  const processAttendance = useCallback(async (eventId: string, userId?: string): Promise<{ success: boolean; message: string }> => {
    try {
      setLoading(true);
      setScanResult(null);
      const payload: Record<string, string> = { eventId, method: 'qr' };
      if (userId) payload.userId = userId;
      await api.post('/attendance/mark', payload);
      const result = { success: true, message: 'Attendance marked successfully! Certificate has been generated.' };
      if (mountedRef.current) {
        setScanResult(result);
        setScanHistory((prev) => [{ id: Date.now().toString(), ...result, eventId, timestamp: new Date() }, ...prev].slice(0, 20));
      }
      return result;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to mark attendance. Please try again.';
      const result = { success: false, message: msg };
      if (mountedRef.current) {
        setScanResult(result);
        setScanHistory((prev) => [{ id: Date.now().toString(), ...result, eventId, timestamp: new Date() }, ...prev].slice(0, 20));
      }
      return result;
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  // Initialize scanner only once on mount, clean up on unmount
  useEffect(() => {
    mountedRef.current = true;

    const initScanner = () => {
      try {
        const el = document.getElementById('qr-reader');
        if (!el) return;

        scannerRef.current = new Html5QrcodeScanner(
          'qr-reader',
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            rememberLastUsedCamera: true,
          },
          false
        );

        scannerRef.current.render(
          async (decodedText: string) => {
            if (processingRef.current) return;
            processingRef.current = true;
            if (scannerRef.current) {
              try { scannerRef.current.pause(true); } catch {}
            }

            try {
              const data = JSON.parse(decodedText);
              if (!data.eventId) throw new Error('Missing eventId');
              await processAttendance(data.eventId, data.userId);
            } catch {
              if (mountedRef.current) {
                setScanResult({ success: false, message: 'Invalid QR Code format.' });
              }
            }

            setTimeout(() => {
              processingRef.current = false;
              if (mountedRef.current) setScanResult(null);
              if (scannerRef.current) {
                try { scannerRef.current.resume(); } catch {}
              }
            }, 4000);
          },
          () => {} // Ignore scan failures (normal when no QR visible)
        );
      } catch (err: any) {
        if (mountedRef.current) {
          setScannerError(err.message || 'Failed to initialize camera.');
        }
      }
    };

    // Delay to ensure DOM is ready
    const timer = setTimeout(initScanner, 200);

    return () => {
      mountedRef.current = false;
      clearTimeout(timer);
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
        scannerRef.current = null;
      }
    };
  }, [processAttendance]);

  const handleManualSubmit = async () => {
    if (!manualEventId.trim()) return;
    await processAttendance(manualEventId.trim());
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in px-4 py-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <HiOutlineQrcode className="w-8 h-8 text-primary-500" />
        </div>
        <h1 className="font-display text-2xl font-bold">QR Attendance Scanner</h1>
        <p className="text-[var(--text-secondary)] mt-2 text-sm">Scan an event QR code or enter the Event ID manually to mark your attendance.</p>
      </div>

      {/* Camera Scanner */}
      <div className="card !p-8 mb-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><HiOutlineQrcode className="w-5 h-5 text-primary-500" /> Camera Scan</h3>
        <div id="qr-reader" className="overflow-hidden rounded-xl border-2 border-[var(--border-color)]" />
        {scannerError && (
          <div className="mt-4 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-sm">
            <p className="font-medium mb-1">Camera not available</p>
            <p>{scannerError}</p>
          </div>
        )}

        {/* Loading for camera mode */}
        {loading && (
          <div className="mt-6 text-center animate-pulse">
            <p className="text-primary-500 font-medium">Verifying attendance...</p>
          </div>
        )}

        {/* Result for camera mode */}
        {scanResult && !loading && (
          <div className={`mt-6 p-4 rounded-xl border flex items-start gap-3 ${scanResult.success ? 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'}`}>
            {scanResult.success ? <HiOutlineCheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" /> : <HiOutlineXCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />}
            <div>
              <h3 className="font-semibold">{scanResult.success ? 'Success!' : 'Failed'}</h3>
              <p className="text-sm mt-1">{scanResult.message}</p>
            </div>
          </div>
        )}
      </div>

      <div className="relative flex items-center py-2 mb-6">
        <div className="flex-grow border-t border-[var(--border-color)]"></div>
        <span className="flex-shrink-0 mx-4 text-[var(--text-tertiary)] text-sm font-medium uppercase tracking-wider">OR</span>
        <div className="flex-grow border-t border-[var(--border-color)]"></div>
      </div>

      {/* Manual Entry */}
      <div className="card !p-8">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><HiOutlinePencilAlt className="w-5 h-5 text-primary-500" /> Manual Entry</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Event ID</label>
            <input
              type="text"
              value={manualEventId}
              onChange={(e) => setManualEventId(e.target.value)}
              className="input-field"
              placeholder="Paste the Event ID here (e.g. 6a200984b0201b17432907f8)"
              onKeyDown={(e) => { if (e.key === 'Enter') handleManualSubmit(); }}
            />
            <p className="text-xs text-[var(--text-tertiary)] mt-1.5">
              You can find the Event ID on the event detail page or the organizer's dashboard.
            </p>
          </div>
          <button
            type="button"
            onClick={handleManualSubmit}
            disabled={!manualEventId.trim() || loading}
            className="btn-primary w-full !py-3"
          >
            {loading ? 'Verifying...' : 'Mark Attendance'}
          </button>
        </div>
      </div>

      {/* Scan History */}
      {scanHistory.length > 0 && (
        <div className="card mt-6">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><HiOutlineClock className="w-4 h-4" /> Scan History</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {scanHistory.map((record) => (
              <div key={record.id} className={`flex items-center gap-3 p-3 rounded-lg text-sm ${record.success ? 'bg-green-500/5' : 'bg-red-500/5'}`}>
                {record.success ? <HiOutlineCheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" /> : <HiOutlineXCircle className="w-4 h-4 text-red-500 flex-shrink-0" />}
                <span className="flex-1 truncate text-xs">{record.message}</span>
                <span className="text-[10px] text-[var(--text-tertiary)] flex-shrink-0">{record.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanQR;
