import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import { sendMail } from '../utils/mailer';
import { VERTICAL_IDS, getVerticalById } from '../../../shared/pricingConfig';

export const enquiriesRouter = Router();

function escHtml(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Schema aligned to frontend GeneralEnquiryPayload
// Vertical defaults to 'construction' for backward compatibility
const baseEnquirySchema = z.object({
  name: z.string().min(1).max(200),
  companyName: z.string().min(1).max(200),
  email: z.string().email().max(320),
  phone: z.string().max(30).optional().default(''),
  subject: z.string().min(1).max(200),
  vertical: z.string().optional().default('construction')
    .refine((v) => VERTICAL_IDS.includes(v as any), {
      message: `Vertical must be one of: ${VERTICAL_IDS.join(', ')}`,
    }),
  userCount: z.number().int().positive().optional(),
  message: z.string().min(1).max(2000),
  honeypot: z.string().max(0, 'Spam detected').optional(),
});

async function handleEnquiry(kind: 'general' | 'demo', req: Request, res: Response) {
  // Honeypot short-circuit (treat as success, do not send email)
  if ((req.body?.honeypot ?? '') !== '') {
    res.json({ success: true, message: 'Submitted.' });
    return;
  }

  const parsed = baseEnquirySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: kind === 'demo' ? 'Invalid demo request data.' : 'Invalid enquiry data.',
      errors: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  const d = parsed.data;

  // Resolve vertical and reject unknown values (even after defaulting)
  const vertical = getVerticalById(d.vertical);
  if (!vertical) {
    res.status(400).json({
      success: false,
      message: `Unknown industry vertical. Allowed: ${VERTICAL_IDS.join(', ')}.`,
    });
    return;
  }

  const now = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short',
  });

  // Subject — prefer client-provided subject but normalize for clarity
  const isDemo = kind === 'demo' || /demo/i.test(d.subject);
  const subject = isDemo
    ? `Gremake ${vertical.name} Demo Request — ${d.companyName}`
    : `Gremake ${vertical.name} Enquiry — ${d.companyName}`;

  const summaryRows = [
    `<tr><td style="padding:6px 0;color:#64748b;width:160px;">Name</td><td style="font-weight:600;">${escHtml(d.name)}</td></tr>`,
    `<tr><td style="padding:6px 0;color:#64748b;">Company</td><td style="font-weight:600;">${escHtml(d.companyName)}</td></tr>`,
    `<tr><td style="padding:6px 0;color:#64748b;">Email</td><td><a href="mailto:${escHtml(d.email)}">${escHtml(d.email)}</a></td></tr>`,
    d.phone ? `<tr><td style="padding:6px 0;color:#64748b;">Phone</td><td>${escHtml(d.phone)}</td></tr>` : '',
    `<tr><td style="padding:6px 0;color:#64748b;">ERP Vertical</td><td style="font-weight:600;">${escHtml(vertical.name)}</td></tr>`,
  ].filter(Boolean).join('');

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;padding:20px;background:#f8fafc;">
      <div style="background:linear-gradient(135deg,#0a0a0a,#1a1a2e);padding:24px;border-radius:16px 16px 0 0;border-bottom:2px solid #4ade80;">
        <h1 style="color:#4ade80;margin:0;font-size:20px;">${escHtml(subject)}</h1>
        <p style="color:#a3a3a3;margin:8px 0 0;font-size:13px;">Received ${escHtml(now)}</p>
      </div>
      <div style="background:#fff;padding:24px;border-radius:0 0 16px 16px;border:1px solid #e2e8f0;">
        <h2 style="font-size:15px;color:#0f172a;margin:0 0 12px;border-bottom:1px solid #f1f5f9;padding-bottom:8px;">Contact Details</h2>
        <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
          ${summaryRows}
        </table>
        <h2 style="font-size:15px;color:#0f172a;margin:8px 0 8px;">Message</h2>
        <div style="white-space:pre-wrap;color:#111827;line-height:1.5;">${escHtml(d.message)}</div>
      </div>
    </div>`;

  const text = `GREMAKE ${vertical.name.toUpperCase()} ${isDemo ? 'DEMO REQUEST' : 'ENQUIRY'}\n` +
    `${subject}\n` +
    `Received: ${now}\n\n` +
    `NAME: ${d.name}\n` +
    `COMPANY: ${d.companyName}\n` +
    `EMAIL: ${d.email}\n` +
    (d.phone ? `PHONE: ${d.phone}\n` : '') +
    `ERP VERTICAL: ${vertical.name}\n\n` +
    `MESSAGE:\n${d.message}`;

  try {
    await sendMail({
      to: 'enquiries@gremake.com',
      subject,
      html,
      text,
    });
    res.json({ success: true, message: isDemo ? 'Demo request submitted successfully.' : 'Enquiry submitted successfully.' });
  } catch (err) {
    console.error(isDemo ? 'Demo request email failed:' : 'Enquiry email failed:', err);
    res.status(500).json({ success: false, message: 'Failed to process your request. Please try again or email us directly.' });
  }
}

// POST /api/enquiries — general contact form (also accepts demo subject)
enquiriesRouter.post('/enquiries', async (req: Request, res: Response) => {
  await handleEnquiry('general', req, res);
});

// POST /api/request-demo — explicit demo endpoint (subject normalized server-side)
enquiriesRouter.post('/request-demo', async (req: Request, res: Response) => {
  // Force a subject if not provided for legacy callers
  if (!req.body || typeof req.body.subject !== 'string' || req.body.subject.trim() === '') {
    req.body = { ...req.body, subject: 'Product Demo Request' };
  }
  await handleEnquiry('demo', req, res);
});
