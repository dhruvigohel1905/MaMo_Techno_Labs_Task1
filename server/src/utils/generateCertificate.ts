import PDFDocument from 'pdfkit';
import { generateQRCode } from './generateQR';

interface CertificateData {
  participantName: string;
  eventName: string;
  organizationName: string;
  eventDate: string;
  certificateId: string;
  qrVerificationCode: string;
}

export const generateCertificatePDF = async (data: CertificateData): Promise<Buffer> => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({
        layout: 'landscape',
        size: 'A4',
        margins: { top: 40, bottom: 40, left: 60, right: 60 },
      });

      const chunks: Buffer[] = [];
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      const pageWidth = doc.page.width;
      const pageHeight = doc.page.height;

      // --- Background gradient border ---
      doc.rect(20, 20, pageWidth - 40, pageHeight - 40)
        .lineWidth(3)
        .strokeColor('#6366f1')
        .stroke();

      doc.rect(30, 30, pageWidth - 60, pageHeight - 60)
        .lineWidth(1)
        .strokeColor('#a78bfa')
        .stroke();

      // --- Decorative corners ---
      const cornerSize = 40;
      // Top-left
      doc.moveTo(30, 30 + cornerSize).lineTo(30, 30).lineTo(30 + cornerSize, 30).lineWidth(4).strokeColor('#6366f1').stroke();
      // Top-right
      doc.moveTo(pageWidth - 30 - cornerSize, 30).lineTo(pageWidth - 30, 30).lineTo(pageWidth - 30, 30 + cornerSize).stroke();
      // Bottom-left
      doc.moveTo(30, pageHeight - 30 - cornerSize).lineTo(30, pageHeight - 30).lineTo(30 + cornerSize, pageHeight - 30).stroke();
      // Bottom-right
      doc.moveTo(pageWidth - 30 - cornerSize, pageHeight - 30).lineTo(pageWidth - 30, pageHeight - 30).lineTo(pageWidth - 30, pageHeight - 30 - cornerSize).stroke();

      // --- Header ---
      doc.fontSize(14)
        .fillColor('#6366f1')
        .text('CERTIFICATE', 0, 60, { align: 'center', characterSpacing: 8 });

      doc.fontSize(36)
        .fillColor('#1e1b4b')
        .text('of Achievement', 0, 85, { align: 'center' });

      // --- Divider ---
      const dividerY = 135;
      doc.moveTo(pageWidth / 2 - 120, dividerY)
        .lineTo(pageWidth / 2 + 120, dividerY)
        .lineWidth(2)
        .strokeColor('#a78bfa')
        .stroke();

      // --- Body ---
      doc.fontSize(14)
        .fillColor('#4b5563')
        .text('This is to certify that', 0, 160, { align: 'center' });

      doc.fontSize(30)
        .fillColor('#1e1b4b')
        .text(data.participantName, 0, 190, { align: 'center' });

      // Name underline
      const nameWidth = doc.widthOfString(data.participantName);
      const nameX = (pageWidth - nameWidth) / 2;
      doc.moveTo(nameX, 228)
        .lineTo(nameX + nameWidth, 228)
        .lineWidth(1)
        .strokeColor('#6366f1')
        .stroke();

      doc.fontSize(14)
        .fillColor('#4b5563')
        .text('has successfully participated in', 0, 248, { align: 'center' });

      doc.fontSize(22)
        .fillColor('#6366f1')
        .text(data.eventName, 0, 278, { align: 'center' });

      doc.fontSize(12)
        .fillColor('#6b7280')
        .text(`organized by ${data.organizationName}`, 0, 310, { align: 'center' });

      doc.fontSize(12)
        .fillColor('#6b7280')
        .text(`on ${data.eventDate}`, 0, 330, { align: 'center' });

      // --- Signature area ---
      const sigY = 390;
      // Left signature
      doc.moveTo(120, sigY).lineTo(300, sigY).lineWidth(1).strokeColor('#d1d5db').stroke();
      doc.fontSize(10).fillColor('#6b7280').text('Authorized Signature', 120, sigY + 5, { width: 180, align: 'center' });

      // Right signature
      doc.moveTo(pageWidth - 300, sigY).lineTo(pageWidth - 120, sigY).stroke();
      doc.text('Organization Head', pageWidth - 300, sigY + 5, { width: 180, align: 'center' });

      // --- Certificate ID ---
      doc.fontSize(8)
        .fillColor('#9ca3af')
        .text(`Certificate ID: ${data.certificateId}`, 60, pageHeight - 70, { align: 'left' });

      // --- QR Code ---
      const qrDataUrl = await generateQRCode(data.qrVerificationCode);
      const qrBuffer = Buffer.from(qrDataUrl.split(',')[1], 'base64');
      doc.image(qrBuffer, pageWidth - 140, pageHeight - 120, { width: 70, height: 70 });
      doc.fontSize(7)
        .fillColor('#9ca3af')
        .text('Scan to verify', pageWidth - 140, pageHeight - 45, { width: 70, align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
