import QRCode from 'qrcode';

export const generateQRCode = async (data: string): Promise<string> => {
  try {
    const qrDataUrl = await QRCode.toDataURL(data, {
      width: 300,
      margin: 2,
      color: {
        dark: '#1e1b4b',
        light: '#ffffff',
      },
    });
    return qrDataUrl;
  } catch (error) {
    console.error('QR Code generation failed:', error);
    throw new Error('Failed to generate QR code');
  }
};

export const generateQRString = async (data: string): Promise<string> => {
  try {
    return await QRCode.toString(data, { type: 'svg' });
  } catch (error) {
    console.error('QR String generation failed:', error);
    throw new Error('Failed to generate QR string');
  }
};
