import { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import api from '../../utils/api';
import { HiOutlineQrcode, HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi';

const ScanQR = () => {
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string; participantName?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    // Initialize Scanner
    scannerRef.current = new Html5QrcodeScanner(
      'qr-reader',
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
        rememberLastUsedCamera: true
      },
      false
    );

    scannerRef.current.render(onScanSuccess, onScanFailure);

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
      }
    };
  }, []);

  const onScanSuccess = async (decodedText: string) => {
    // Pause scanner to prevent multiple scans of the same code quickly
    if (scannerRef.current) scannerRef.current.pause(true);

    try {
      setLoading(true);
      // The QR code contains { eventId, type: 'attendance' } for event codes
      // Or it might contain { eventId, userId } if it's a ticket QR code.
      // Let's parse it first.
      const data = JSON.parse(decodedText);
      
      const payload = {
        eventId: data.eventId,
        userId: data.userId, // Will be undefined if it's a generic event QR code (then targetUserId = req.user._id)
        method: 'qr'
      };

      const res = await api.post('/attendance/mark', payload);
      setScanResult({
        success: true,
        message: 'Attendance marked successfully!',
      });
      
      // Auto resume after 3 seconds
      setTimeout(() => {
        setScanResult(null);
        if (scannerRef.current) scannerRef.current.resume();
      }, 3000);

    } catch (err: any) {
      setScanResult({
        success: false,
        message: err.response?.data?.message || 'Invalid QR Code or already marked.',
      });
      
      // Auto resume after 3 seconds
      setTimeout(() => {
        setScanResult(null);
        if (scannerRef.current) scannerRef.current.resume();
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const onScanFailure = (error: any) => {
    // Ignore frequent scan failures
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <HiOutlineQrcode className="w-8 h-8 text-primary-500" />
        </div>
        <h1 className="font-display text-2xl font-bold">QR Attendance Scanner</h1>
        <p className="text-[var(--text-secondary)] mt-2">Scan an event QR code or participant ticket to verify attendance.</p>
      </div>

      <div className="card !p-8">
        <div id="qr-reader" className="overflow-hidden rounded-xl border-2 border-[var(--border-color)]"></div>
        
        {loading && (
          <div className="mt-6 text-center animate-pulse">
            <p className="text-primary-500 font-medium">Verifying...</p>
          </div>
        )}

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
