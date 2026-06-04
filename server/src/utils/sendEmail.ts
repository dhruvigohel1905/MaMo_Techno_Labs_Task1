import nodemailer from 'nodemailer';
import { env } from '../config/env';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: false,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    await transporter.sendMail({
      from: `"Event Platform" <${env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    console.log(`📧 Email sent to ${options.to}`);
  } catch (error) {
    console.error('Email sending failed:', error);
    // Don't throw - email failure shouldn't break the flow
  }
};

export const sendPasswordResetEmail = async (email: string, resetUrl: string): Promise<void> => {
  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #6366f1;">Password Reset Request</h2>
      <p>You requested a password reset. Click the button below to reset your password:</p>
      <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; margin: 16px 0;">
        Reset Password
      </a>
      <p style="color: #6b7280; font-size: 14px;">This link will expire in 10 minutes. If you didn't request this, please ignore this email.</p>
    </div>
  `;
  await sendEmail({ to: email, subject: 'Password Reset - Event Platform', html });
};
