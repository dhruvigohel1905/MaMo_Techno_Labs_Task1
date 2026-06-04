import { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import api from '../../utils/api';
import { HiOutlineQrcode, HiOutlineCheckCircle, HiOutlineXCircle, HiOutlinePencilAlt } from 'react-icons/hi';

const ScanQR = () => {
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [scannerReady, setScannerReady] = useState(false);
  const [scannerError, setScannerError] = useState<string | null>(null);
  const [manualMode, setManualMode] = useState(false);
  const [manualEventId, setManualEventId] = useState('');
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    try {
      scannerRef.current = new Html5QrcodeScanner(
        'qr-reader',
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
          rememberLastUsedCamera: true,
        },
        false
      );

      scannerRef.current.render(onScanSuccess, onScanFailure);
      setScannerReady(true);
    } catch (err: any) {
      setScannerError(err.message || 'Failed to initialize camera scanner.');
      setManualMode(true);
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
      }
    };
  }, []);

  const processAttendance = async (eventId: string, userId?: string) => {
    try {
      setLoading(true);
      setScanResult(null);

      const payload: any = { eventId, method: 'qr' };
      if (userId) payload.userId = userId;

      await api.post('/attendance/mark', payload);
      setScanResult({
        success: true,
        message: 'Attendance marked successfully!',
      });
    } catch (err: any) {
      setScanResult({
        success: false,
        message: err.response?.data?.message || 'Failed to mark attendance. Check the QR code and try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const onScanSuccess = async (decodedText: string) => {
    if (scannerRef.current) scannerRef.current.pause(true);

    try {
      const data = JSON.parse(decodedText);
      await processAttendance(data.eventId, data.userId);
    } catch {
      setScanResult({
        success: false,
        message: 'Invalid QR Code format. Expected JSON with eventId.',
      });
    }

    // Auto resume after 3 seconds
    setTimeout(() => {
      setScanResult(null);
      if (scannerRef.current) {
        try { scannerRef.current.resume(); } catch {}
      }
    }, 3000);
  };

  const onScanFailure = (_error: any) => {
    // Ignore frequent scan failures — these are normal when no QR is in frame
  };

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
        <p className="text-[var(--text-secondary)] mt-2">Scan an event QR code or enter the Event ID manually to mark attendance.</p>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-3 mb-6 justify-center">
        <button
          onClick={() => setManualMode(false)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${!manualMode ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
        >
          <HiOutlineQrcode className="w-4 h-4" /> Camera Scan
        </button>
        <button
          onClick={() => setManualMode(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${manualMode ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
        >
          <HiOutlinePencilAlt className="w-4 h-4" /> Manual Entry
        </button>
      </div>

      <div className="card !p-8">
        {/* Camera Scanner */}
        {!manualMode && (
          <>
            <div id="qr-reader" className="overflow-hidden rounded-xl border-2 border-[var(--border-color)]"></div>
            {scannerError && (
              <div className="mt-4 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-sm">
                <p className="font-medium mb-1">Camera not available</p>
                <p>{scannerError}</p>
                <button onClick={() => setManualMode(true)} className="mt-2 text-primary-500 hover:underline font-medium text-sm">
                  Switch to manual entry →
                </button>
              </div>
            )}
          </>
        )}

        {/* Manual Entry */}
        {manualMode && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Event ID</label>
              <input
                type="text"
                value={manualEventId}
                onChange={(e) => setManualEventId(e.target.value)}
                className="input-field"
                placeholder="Paste the Event ID here..."
              />
              <p className="text-xs text-[var(--text-tertiary)] mt-1.5">
                The Event ID can be found on the event detail page or provided by the organizer.
              </p>
            </div>
            <button
              onClick={handleManualSubmit}
              disabled={!manualEventId.trim() || loading}
              className="btn-primary w-full !py-3"
            >
              {loading ? 'Verifying...' : 'Mark Attendance'}
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && !manualMode && (
          <div className="mt-6 text-center animate-pulse">
            <p className="text-primary-500 font-medium">Verifying attendance...</p>
          </div>
        )}

        {/* Result */}
        {scanResult && !loading && (
          <div className={`mt-6 p-4 rounded-xl border flex items-start gap-3 ${scanResult.success ? 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'}`}>
            {scanResult.success ? <HiOutlineCheckCircle className="w-6 h-6 flex-shrink-0" /> : <HiOutlineXCircle className="w-6 h-6 flex-shrink-0" />}
            <div>
              <h3 className="font-semibold">{scanResult.success ? 'Success' : 'Scan Failed'}</h3>
              <p className="text-sm mt-1">{scanResult.message}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanQR;
