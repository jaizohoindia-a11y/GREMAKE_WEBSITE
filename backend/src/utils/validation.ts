import { z } from 'zod';

export const generalEnquirySchema = z.object({
  name: z.string().min(1).max(200),
  companyName: z.string().max(200).optional().default(''),
  email: z.string().email().max(320),
  phone: z.string().max(30).optional().default(''),
  subject: z.string().min(1).max(200),
  vertical: z.string().max(100).optional().default(''),
  userCount: z.number().int().positive().optional(),
  message: z.string().min(1).max(2000),
  honeypot: z.string().max(0, 'Spam detected').optional(),
});

export const pricingEnquirySchema = z.object({
  name: z.string().min(1).max(200),
  companyName: z.string().min(1).max(200),
  email: z.string().email().max(320),
  phone: z.string().max(30).optional().default(''),
  country: z.string().max(100).optional().default(''),
  vertical: z.string().min(1).max(100),
  userCount: z.number().int().min(1).max(10000),
  tierName: z.string().max(100),
  licenseDisplay: z.string().max(200),
  annualCareDisplay: z.string().max(200),
  implementationId: z.string().max(50),
  implementationName: z.string().max(200),
  implementationDisplay: z.string().max(200),
  selectedOptionalIds: z.array(z.string().max(100)).max(20),
  selectedOptionalSummary: z.string().max(2000),
  message: z.string().max(2000).optional().default(''),
  honeypot: z.string().max(0, 'Spam detected').optional(),
});

export type GeneralEnquiryInput = z.infer<typeof generalEnquirySchema>;
export type PricingEnquiryInput = z.infer<typeof pricingEnquirySchema>;

// ── Server-side pricing lookup (mirrors frontend lib/pricing.ts) ───────────────
interface ServerTier {
  name: string; minUsers: number; maxUsers: number;
  licensePriceDisplay: string; licensePriceIsStarting: boolean;
  annualCareDisplay: string; annualCareIsStarting: boolean;
}

export const SERVER_TIERS: ServerTier[] = [
  { name: 'Starter',      minUsers: 1,  maxUsers: 5,   licensePriceDisplay: '₹1,50,000',  licensePriceIsStarting: false, annualCareDisplay: '₹30,000',   annualCareIsStarting: false },
  { name: 'Business',     minUsers: 6,  maxUsers: 15,  licensePriceDisplay: '₹3,00,000',  licensePriceIsStarting: false, annualCareDisplay: '₹50,000',   annualCareIsStarting: false },
  { name: 'Professional', minUsers: 16, maxUsers: 30,  licensePriceDisplay: '₹5,00,000',  licensePriceIsStarting: false, annualCareDisplay: '₹75,000',   annualCareIsStarting: false },
  { name: 'Enterprise',   minUsers: 31, maxUsers: 50,  licensePriceDisplay: '₹7,50,000',  licensePriceIsStarting: false, annualCareDisplay: '₹1,00,000', annualCareIsStarting: false },
  { name: 'Enterprise+',  minUsers: 51, maxUsers: 100, licensePriceDisplay: '₹12,00,000', licensePriceIsStarting: true,  annualCareDisplay: '₹1,50,000', annualCareIsStarting: true  },
];

export const SERVER_IMPL_OPTIONS: Record<string, { name: string; priceDisplay: string }> = {
  '':        { name: 'Not required / Self-managed', priceDisplay: 'N/A' },
  standard:  { name: 'Standard Setup',              priceDisplay: '₹25,000–₹50,000' },
  business:  { name: 'Business Implementation',     priceDisplay: '₹50,000–₹1,00,000' },
  complex:   { name: 'Complex Implementation',      priceDisplay: '₹1,00,000–₹2,00,000+' },
};

export const SERVER_OPTIONAL_SERVICES: Record<string, { name: string; priceDisplay: string }> = {
  data_migration:           { name: 'Data Migration',            priceDisplay: '₹25,000–₹1,50,000+' },
  custom_reports:           { name: 'Custom Reports',            priceDisplay: '₹20,000+' },
  workflow_customisation:   { name: 'Workflow Customisation',    priceDisplay: '₹15,000–₹1,50,000+' },
  third_party_integrations: { name: 'Third-Party Integrations',  priceDisplay: '₹50,000+' },
  whatsapp_automation:      { name: 'WhatsApp Automation',       priceDisplay: '₹50,000+' },
  native_mobile_app:        { name: 'Native Mobile App',         priceDisplay: '₹1,50,000+' },
  ai_features:              { name: 'AI Features',               priceDisplay: '₹1,00,000+' },
  dedicated_infrastructure: { name: 'Dedicated Infrastructure',  priceDisplay: '₹2,00,000–₹5,00,000+/year' },
  advanced_training:        { name: 'Advanced Training',         priceDisplay: '₹10,000+' },
};

export function getServerTierForUsers(userCount: number): ServerTier | null {
  if (userCount > 100) return null;
  return SERVER_TIERS.find(t => userCount >= t.minUsers && userCount <= t.maxUsers) ?? null;
}
