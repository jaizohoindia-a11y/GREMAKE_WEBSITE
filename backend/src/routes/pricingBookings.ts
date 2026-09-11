import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { sendMail } from '../utils/mailer';

export const pricingBookingRouter = Router();

function escHtml(s: string): string {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function formatINR(n: number): string {
  if (n === 0) return '₹0';
  const s = Math.round(n).toString(); const len = s.length;
  let r = s.slice(len - 3); let rem = s.slice(0, len - 3);
  while (rem.length > 2) { r = rem.slice(rem.length - 2) + ',' + r; rem = rem.slice(0, rem.length - 2); }
  if (rem.length) r = rem + ',' + r;
  return '₹' + r;
}

// Server-side pricing config (mirrors frontend lib/pricing.ts)
const SERVER_TIERS = [
  { id:'starter',       name:'Starter',       minUsers:1,  maxUsers:5,   licenseDisplay:'₹1,50,000',  careDisplay:'₹30,000',   careIsStarting:false, licenseIsStarting:false, licensePrice:150000, annualCare:30000 },
  { id:'business',      name:'Business',      minUsers:6,  maxUsers:15,  licenseDisplay:'₹3,00,000',  careDisplay:'₹50,000',   careIsStarting:false, licenseIsStarting:false, licensePrice:300000, annualCare:50000 },
  { id:'professional',  name:'Professional',  minUsers:16, maxUsers:30,  licenseDisplay:'₹5,00,000',  careDisplay:'₹75,000',   careIsStarting:false, licenseIsStarting:false, licensePrice:500000, annualCare:75000 },
  { id:'enterprise',    name:'Enterprise',    minUsers:31, maxUsers:50,  licenseDisplay:'₹7,50,000',  careDisplay:'₹1,00,000', careIsStarting:false, licenseIsStarting:false, licensePrice:750000, annualCare:100000 },
  { id:'enterprise_plus',name:'Enterprise+',  minUsers:51, maxUsers:100, licenseDisplay:'₹12,00,000', careDisplay:'₹1,50,000', careIsStarting:true,  licenseIsStarting:true,  licensePrice:1200000,annualCare:150000 },
];

const SERVER_IMPL: Record<string, { name: string; display: string; calculatorPrice: number }> = {
  standard: { name:'Standard Setup',           display:'₹25,000–₹50,000',        calculatorPrice:25000 },
  business: { name:'Business Implementation',   display:'₹50,000–₹1,00,000',     calculatorPrice:50000 },
  complex:  { name:'Complex Implementation',    display:'₹1,00,000–₹2,00,000+',  calculatorPrice:100000 },
};

const SERVER_OPTIONAL: Record<string, { name: string; display: string; calculatorPrice: number; priceType: string }> = {
  data_migration:          { name:'Data Migration',           display:'₹25,000–₹1,50,000+',      calculatorPrice:25000,  priceType:'range' },
  custom_reports:          { name:'Custom Reports',           display:'₹20,000+',                calculatorPrice:20000,  priceType:'starting' },
  workflow_customisation:  { name:'Workflow Customisation',   display:'₹15,000–₹1,50,000+',      calculatorPrice:15000,  priceType:'range' },
  third_party_integrations:{ name:'Third-Party Integrations', display:'₹50,000+',                calculatorPrice:50000,  priceType:'starting' },
  whatsapp_automation:     { name:'WhatsApp Automation',      display:'₹50,000+',                calculatorPrice:50000,  priceType:'starting' },
  native_mobile_app:       { name:'Native Mobile App',        display:'₹1,50,000+',              calculatorPrice:150000, priceType:'starting' },
  ai_features:             { name:'AI Features',              display:'₹1,00,000+',              calculatorPrice:100000, priceType:'starting' },
  dedicated_infrastructure:{ name:'Dedicated Infrastructure', display:'₹2,00,000–₹5,00,000+/year', calculatorPrice:200000, priceType:'range' },
  advanced_training:       { name:'Advanced Training',        display:'₹10,000+',                calculatorPrice:10000,  priceType:'starting' },
};

const BASIC_FEATURES = [
  'Core Platform & Company Management',
  'Project Management & Sites',
  'Site Operations & Daily Logs',
  'BOQ & Quantity / Cost Control',
  'Materials Management',
  'Procurement & Purchase Orders',
  'Vendor Management',
  'Inventory & Stock Control',
  'Equipment & Asset Operations',
  'Finance & Core Accounting',
  'Billing & Invoices',
  'HR & Leave Management',
  'Sales & Enquiries',
  'Dashboards, Reports & Management Visibility',
];

const bookingSchema = z.object({
  companyName: z.string().min(1).max(200),
  contactName: z.string().min(1).max(200),
  email: z.string().email().max(320),
  phone: z.string().min(1).max(30),
  message: z.string().max(2000).optional().default(''),
  honeypot: z.string().max(0, 'Spam detected').optional(),
  // Configuration
  userCount: z.number().int().min(1).max(10000),
  implementationId: z.string().max(50),
  selectedOptionalIds: z.array(z.string().max(100)).max(20),
});

function getServerTier(userCount: number) {
  if (userCount > 100) return null;
  return SERVER_TIERS.find(t => userCount >= t.minUsers && userCount <= t.maxUsers) ?? null;
}

pricingBookingRouter.post('/', async (req: Request, res: Response) => {
  if (req.body.honeypot) { res.json({ success: true, message: 'Submitted.' }); return; }

  const parsed = bookingSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, message: 'Invalid booking data.', errors: parsed.error.flatten().fieldErrors });
    return;
  }

  const d = parsed.data;

  // Reject invalid optional IDs
  const invalidIds = d.selectedOptionalIds.filter(id => !SERVER_OPTIONAL[id]);
  if (invalidIds.length > 0) {
    res.status(400).json({ success: false, message: 'Invalid feature selection.' });
    return;
  }

  // Server-side tier derivation (never trust client)
  const tier = getServerTier(d.userCount);
  const isCustom = d.userCount > 100;

  const tierName = isCustom ? 'Custom Proposal (>100 users)' : (tier?.name ?? 'Unknown');
  const licenseDisplay = isCustom ? 'Custom Proposal' : tier ? (tier.licenseIsStarting ? tier.licenseDisplay + '+' : tier.licenseDisplay) : 'Unknown';
  const careDisplay = isCustom ? 'Custom Proposal' : tier ? (tier.careIsStarting ? tier.careDisplay + '+' : tier.careDisplay) : 'Unknown';

  const implKey = d.implementationId as keyof typeof SERVER_IMPL;
  const impl = SERVER_IMPL[implKey] ?? SERVER_IMPL.standard;

  const verifiedOptionals = d.selectedOptionalIds.map(id => ({ id, ...SERVER_OPTIONAL[id] }));

  // Server-side GST calculation (18%)
  const GST_RATE = 0.18;
  const serverImplCalcPrice = isCustom ? 0 : impl.calculatorPrice;
  const serverLicensePrice = isCustom ? 0 : (tier?.licensePrice ?? 0);
  const serverAddonsTotal = isCustom ? 0 : verifiedOptionals.reduce((sum, s) => sum + s.calculatorPrice, 0);
  const serverSubtotal = serverLicensePrice + serverImplCalcPrice + serverAddonsTotal;
  const serverGst = isCustom ? 0 : Math.round(serverSubtotal * GST_RATE);
  const serverTotal = serverSubtotal + serverGst;
  const serverAnnualCare = isCustom ? 0 : (tier?.annualCare ?? 0);

  const subject = `Gremake ERP Pricing Booking — ${d.companyName}`;

  const basicFeaturesHtml = BASIC_FEATURES.map(f => `<tr><td style="padding:4px 12px;color:#475569;font-size:13px;">✓ ${escHtml(f)}</td><td style="padding:4px 12px;text-align:right;color:#16a34a;font-size:13px;">Included</td></tr>`).join('');

  const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short' });

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;padding:20px;background:#f8fafc;">
      <div style="background:linear-gradient(135deg,#0a0a0a,#1a1a2e);padding:32px;border-radius:16px 16px 0 0;border-bottom:2px solid #4ade80;">
        <h1 style="color:#4ade80;margin:0;font-size:22px;">Gremake ERP Pricing Booking</h1>
        <p style="color:#a3a3a3;margin:8px 0 0;font-size:14px;">${escHtml(d.companyName)} — received ${now}</p>
      </div>
      <div style="background:#fff;padding:32px;border-radius:0 0 16px 16px;border:1px solid #e2e8f0;">

        <h2 style="font-size:16px;color:#0f172a;margin:0 0 16px;border-bottom:1px solid #f1f5f9;padding-bottom:8px;">Customer Details</h2>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
          <tr><td style="padding:7px 0;color:#64748b;width:160px;">Company</td><td style="font-weight:700;font-size:16px;">${escHtml(d.companyName)}</td></tr>
          <tr><td style="padding:7px 0;color:#64748b;">Contact Person</td><td>${escHtml(d.contactName)}</td></tr>
          <tr><td style="padding:7px 0;color:#64748b;">Email</td><td><a href="mailto:${escHtml(d.email)}">${escHtml(d.email)}</a></td></tr>
          <tr><td style="padding:7px 0;color:#64748b;">Phone</td><td>${escHtml(d.phone)}</td></tr>
          ${d.message ? `<tr><td style="padding:7px 0;color:#64748b;vertical-align:top;">Message</td><td style="white-space:pre-wrap;">${escHtml(d.message)}</td></tr>` : ''}
        </table>

        <h2 style="font-size:16px;color:#0f172a;margin:0 0 16px;border-bottom:1px solid #f1f5f9;padding-bottom:8px;">ERP Configuration</h2>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
          <tr><td style="padding:7px 0;color:#64748b;width:160px;">Users</td><td style="font-weight:600;">${d.userCount}</td></tr>
          <tr><td style="padding:7px 0;color:#64748b;">ERP Tier</td><td style="font-weight:700;color:#4ade80;font-size:16px;">${escHtml(tierName)}</td></tr>
        </table>

        <h2 style="font-size:16px;color:#0f172a;margin:0 0 12px;border-bottom:1px solid #f1f5f9;padding-bottom:8px;">Pricing Summary (Server-Calculated)</h2>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;background:#f8fafc;border-radius:8px;">
          ${isCustom ? `<tr><td colspan="2" style="padding:10px 12px;color:#64748b;font-style:italic;">Custom proposal required — pricing to be confirmed.</td></tr>` : `
          <tr><td style="padding:8px 12px;color:#64748b;">ERP License (${escHtml(tierName)})</td><td style="padding:8px 12px;text-align:right;font-weight:600;">${escHtml(formatINR(serverLicensePrice))}</td></tr>
          <tr><td style="padding:8px 12px;color:#64748b;">${escHtml(impl.name)}</td><td style="padding:8px 12px;text-align:right;font-weight:600;">${escHtml(formatINR(serverImplCalcPrice))}</td></tr>
          ${verifiedOptionals.length > 0 ? verifiedOptionals.map(s => `<tr><td style="padding:8px 12px;color:#64748b;">${escHtml(s.name)}</td><td style="padding:8px 12px;text-align:right;font-weight:600;">${escHtml(formatINR(s.calculatorPrice))}</td></tr>`).join('') : ''}
          <tr style="border-top:1px solid #e2e8f0;"><td style="padding:10px 12px;font-weight:700;">Subtotal (One-Time)</td><td style="padding:10px 12px;text-align:right;font-weight:700;">${escHtml(formatINR(serverSubtotal))}</td></tr>
          <tr><td style="padding:8px 12px;color:#64748b;">GST (18%)</td><td style="padding:8px 12px;text-align:right;font-weight:600;">${escHtml(formatINR(serverGst))}</td></tr>
          <tr style="background:#f0fdf4;"><td style="padding:12px;font-weight:800;font-size:16px;color:#16a34a;">Total Including GST</td><td style="padding:12px;text-align:right;font-weight:800;font-size:16px;color:#16a34a;">${escHtml(formatINR(serverTotal))}</td></tr>
          <tr><td style="padding:8px 12px;color:#64748b;">Annual Gremake Care</td><td style="padding:8px 12px;text-align:right;font-weight:600;">${escHtml(formatINR(serverAnnualCare))}/year</td></tr>
          `}
          <tr><td style="padding:8px 12px;color:#94a3b8;font-size:11px;" colspan="2">Base/minimum calculator prices used for variable-scope services. Final pricing subject to confirmed scope.</td></tr>
        </table>

        <h2 style="font-size:16px;color:#0f172a;margin:0 0 12px;border-bottom:1px solid #f1f5f9;padding-bottom:8px;">Basic ERP Features (Included)</h2>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;background:#f8fafc;border-radius:8px;">
          ${basicFeaturesHtml}
        </table>

        <p style="color:#94a3b8;font-size:12px;margin-top:20px;">⚠️ Pricing is server-calculated using base/minimum prices. Final commercial terms are confirmed in the signed customer proposal.</p>
        <p style="color:#94a3b8;font-size:12px;">Source: Gremake Website Pricing Configurator · ${now}</p>
      </div>
    </div>`;

  const text = `GREMAKE ERP PRICING BOOKING
${subject}
Received: ${now}

CUSTOMER
Company: ${d.companyName}
Contact: ${d.contactName}
Email: ${d.email}
Phone: ${d.phone}
${d.message ? `Message: ${d.message}` : ''}

CONFIGURATION
Users: ${d.userCount}
Tier: ${tierName}

PRICING (Server-Calculated with 18% GST)
${isCustom ? 'Custom Proposal — pricing to be confirmed.' : `ERP License (${tierName}): ${formatINR(serverLicensePrice)}
Implementation (${impl.name}): ${formatINR(serverImplCalcPrice)}${verifiedOptionals.length > 0 ? '\n' + verifiedOptionals.map(s => `${s.name}: ${formatINR(s.calculatorPrice)}`).join('\n') : ''}
Subtotal (One-Time): ${formatINR(serverSubtotal)}
GST (18%): ${formatINR(serverGst)}
TOTAL INCLUDING GST: ${formatINR(serverTotal)}
Annual Gremake Care: ${formatINR(serverAnnualCare)}/year`}

BASIC ERP FEATURES (All Included)
${BASIC_FEATURES.map(f => `✓ ${f}`).join('\n')}

---
Base/minimum calculator prices used. Final pricing subject to confirmed scope.
Source: Gremake Website Pricing Configurator`;

  try {
    await sendMail({ to: process.env.EMAIL_TO || 'bookings@gremake.com', subject, html, text });
    res.json({ success: true, message: 'Booking submitted successfully.' });
  } catch (err) {
    console.error('Pricing booking email failed:', err);
    res.status(500).json({ success: false, message: 'Failed to process your booking. Please try again or email us directly.' });
  }
});
