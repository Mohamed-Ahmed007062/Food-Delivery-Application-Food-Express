import nodemailer from 'nodemailer';
import { env } from '../../config/env.js';
import { logger } from './logger.js';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (options: SendEmailOptions): Promise<void> => {
  if (env.NODE_ENV === 'development' || env.NODE_ENV === 'test') {
    logger.info(`📧 [MOCK EMAIL SENT] To: ${options.to} | Subject: ${options.subject}`);
    logger.debug(`📧 Content:\n${options.html}`);
    return;
  }

  // In production, use configured SMTP settings
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  });

  await transporter.sendMail({
    from: `"FoodExpress Support" <noreply@foodexpress.com>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  });
};
