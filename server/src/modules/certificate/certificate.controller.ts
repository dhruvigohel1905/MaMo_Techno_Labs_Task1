import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { CertificateService } from './certificate.service';

const certificateService = new CertificateService();

export class CertificateController {
  async generate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.body.userId || req.user._id;
      const certificate = await certificateService.generate(req.params.eventId, userId);
      res.status(201).json({ success: true, data: certificate });
    } catch (error) {
      next(error);
    }
  }

  async getMyCertificates(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const certificates = await certificateService.getMyCertificates(req.user._id);
      res.json({ success: true, data: certificates });
    } catch (error) {
      next(error);
    }
  }

  async download(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const pdfBuffer = await certificateService.downloadCertificate(req.params.id);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=certificate-${req.params.id}.pdf`);
      res.send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }

  async verify(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await certificateService.verifyCertificate(req.params.code);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}
