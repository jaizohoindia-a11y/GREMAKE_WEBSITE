import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (transporter) return transporter;
  const host = process.env.EMAIL_HOST;
  const port = parseInt(process.env.EMAIL_PORT || '587', 10);
  const user = process.env.EMAIL_USERNAME;
  const pass = process.env.EMAIL_PASSWORD;
  if (!host || !user || !pass) {
    throw new Error('Email configuration incomplete. Set EMAIL_HOST, EMAIL_USERNAME, EMAIL_PASSWORD.');
  }
  transporter = nodemailer.createTransport({
    host, port,
    secure: port === 465,
    auth: { user, pass },
    tls: { rejectUnauthorized: true },
  });
  return transporter;
}

export interface MailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export async function sendMail(options: MailOptions): Promise<void> {
  const t = getTransporter();
  const from = process.env.EMAIL_FROM || process.env.EMAIL_USERNAME || 'noreply@gremake.com';
  const to = process.env.EMAIL_TO || options.to;
  await t.sendMail({
    from: `"Gremake Website" <${from}>`,
    to, subject: options.subject, html: options.html, text: options.text,
  });
}
