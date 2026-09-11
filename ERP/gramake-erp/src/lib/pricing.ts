/**
 * OFFICIAL GREMAKE ERP PRICING CONFIGURATION
 * Source: Gremake ERP Construction Pricing & Scope Guide
 * DO NOT alter official pricing values without authorisation.
 *
 * calculatorPrice = base/minimum amount used for live calculator arithmetic.
 * displayPrice = official range/starting string shown in the UI.
 * The calculator uses calculatorPrice for exact GST and total computation.
 */

export type PricingType = 'fixed' | 'range' | 'starting';
export type ServiceCategory = 'service' | 'technology' | 'support';

export interface ErpTier {
  id: string;
  name: string;
  tagline: string;
  minUsers: number;
  maxUsers: number;
  licensePrice: number;           // official base price (= calculatorPrice for ERP license)
  licensePriceDisplay: string;
  licensePriceIsStarting: boolean;
  annualCare: number;
  annualCareDisplay: string;
  annualCareIsStarting: boolean;
}

export interface ImplementationOption {
  id: string;
  name: string;
  displayPrice: string;           // official range (shown in UI)
  calculatorPrice: number;        // base/minimum used for live arithmetic
  priceMin: number;
  priceMax: number;
  includes: string[];
}

export interface OptionalService {
  id: string;
  category: ServiceCategory;
  name: string;
  description: string;
  displayPrice: string;           // official range/starting (shown in UI)
  calculatorPrice: number;        // base/minimum used for live arithmetic
  priceUnit?: string;
  priceType: PricingType;
}

export interface BasicFeature {
  id: string;
  name: string;
}

// ── GST Configuration ─────────────────────────────────────────────────────────
// 18% GST on one-time investment (license + implementation + add-ons).
// Annual care is shown separately and not included in the calculator GST.
export const gstConfig = {
  configured: true,
  rate: 0.18,
  ratePercent: 18,
  label: 'GST (18%)',
} as const;

// ── Standard/Basic ERP Features (included in all tiers) ──────────────────────
export const basicERPFeatures: BasicFeature[] = [
  { id: 'core_platform', name: 'Core Platform & Company Management' },
  { id: 'project_mgmt',  name: 'Project Management & Sites' },
  { id: 'site_ops',      name: 'Site Operations & Daily Logs' },
  { id: 'boq_cost',      name: 'BOQ & Quantity / Cost Control' },
  { id: 'materials',     name: 'Materials Management' },
  { id: 'procurement',   name: 'Procurement & Purchase Orders' },
  { id: 'vendors',       name: 'Vendor Management' },
  { id: 'inventory',     name: 'Inventory & Stock Control' },
  { id: 'equipment',     name: 'Equipment & Asset Operations' },
  { id: 'finance',       name: 'Finance & Core Accounting' },
  { id: 'billing',       name: 'Billing & Invoices' },
  { id: 'hr',            name: 'HR & Leave Management' },
  { id: 'sales',         name: 'Sales & Enquiries' },
  { id: 'dashboards',    name: 'Dashboards, Reports & Management Visibility' },
];

// ── ERP License Tiers ─────────────────────────────────────────────────────────
export const erpTiers: ErpTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'For small construction teams getting started with integrated ERP',
    minUsers: 1, maxUsers: 5,
    licensePrice: 150000, licensePriceDisplay: '₹1,50,000', licensePriceIsStarting: false,
    annualCare: 30000, annualCareDisplay: '₹30,000', annualCareIsStarting: false,
  },
  {
    id: 'business',
    name: 'Business',
    tagline: 'For growing construction companies managing multiple projects',
    minUsers: 6, maxUsers: 15,
    licensePrice: 300000, licensePriceDisplay: '₹3,00,000', licensePriceIsStarting: false,
    annualCare: 50000, annualCareDisplay: '₹50,000', annualCareIsStarting: false,
  },
  {
    id: 'professional',
    name: 'Professional',
    tagline: 'For established construction businesses with larger operational teams',
    minUsers: 16, maxUsers: 30,
    licensePrice: 500000, licensePriceDisplay: '₹5,00,000', licensePriceIsStarting: false,
    annualCare: 75000, annualCareDisplay: '₹75,000', annualCareIsStarting: false,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'For large construction organisations with cross-functional teams',
    minUsers: 31, maxUsers: 50,
    licensePrice: 750000, licensePriceDisplay: '₹7,50,000', licensePriceIsStarting: false,
    annualCare: 100000, annualCareDisplay: '₹1,00,000', annualCareIsStarting: false,
  },
  {
    id: 'enterprise_plus',
    name: 'Enterprise+',
    tagline: 'For large enterprise construction groups with 51–100 users',
    minUsers: 51, maxUsers: 100,
    licensePrice: 1200000, licensePriceDisplay: '₹12,00,000', licensePriceIsStarting: true,
    annualCare: 150000, annualCareDisplay: '₹1,50,000', annualCareIsStarting: true,
  },
];

export function getTierForUsers(userCount: number): ErpTier | null {
  if (userCount > 100) return null;
  return erpTiers.find(t => userCount >= t.minUsers && userCount <= t.maxUsers) ?? null;
}

// ── Implementation Options ────────────────────────────────────────────────────
// calculatorPrice = base/minimum used in live arithmetic.
export const implementationOptions: ImplementationOption[] = [
  {
    id: 'standard',
    name: 'Standard Setup',
    displayPrice: '₹25,000–₹50,000',
    calculatorPrice: 25000,
    priceMin: 25000, priceMax: 50000,
    includes: ['Environment setup', 'Company and master configuration', 'User and role onboarding', 'Initial workflow configuration', 'Administrator training'],
  },
  {
    id: 'business',
    name: 'Business Implementation',
    displayPrice: '₹50,000–₹1,00,000',
    calculatorPrice: 50000,
    priceMin: 50000, priceMax: 100000,
    includes: ['Everything in Standard Setup', 'Agreed data migration', 'Key-user training sessions', 'Go-live assistance and handover', 'Extended workflow configuration'],
  },
  {
    id: 'complex',
    name: 'Complex Implementation',
    displayPrice: '₹1,00,000–₹2,00,000+',
    calculatorPrice: 100000,
    priceMin: 100000, priceMax: 200000,
    includes: ['Everything in Business Implementation', 'Complex data migration and transformation', 'Custom workflow design', 'Multi-phase go-live management', 'Extended team training programme'],
  },
];

// ── Optional Services ─────────────────────────────────────────────────────────
// calculatorPrice = base/minimum used in live arithmetic.
// displayPrice = official range/starting price shown in UI.
export const optionalServices: OptionalService[] = [
  { id:'data_migration',           category:'service',    name:'Data Migration',           description:'Migration of existing business data into Gremake ERP',              displayPrice:'₹25,000–₹1,50,000+', calculatorPrice:25000,   priceType:'range' },
  { id:'custom_reports',           category:'service',    name:'Custom Reports',           description:'Bespoke report design and development',                             displayPrice:'₹20,000+',           calculatorPrice:20000,   priceType:'starting' },
  { id:'workflow_customisation',   category:'service',    name:'Workflow Customisation',   description:'Tailored business process and workflow configuration',               displayPrice:'₹15,000–₹1,50,000+', calculatorPrice:15000,   priceType:'range' },
  { id:'third_party_integrations', category:'technology', name:'Third-Party Integrations', description:'Integration with external business systems',                        displayPrice:'₹50,000+',           calculatorPrice:50000,   priceType:'starting' },
  { id:'whatsapp_automation',      category:'technology', name:'WhatsApp Automation',      description:'Business communication automation via WhatsApp',                    displayPrice:'₹50,000+',           calculatorPrice:50000,   priceType:'starting' },
  { id:'native_mobile_app',        category:'technology', name:'Native Mobile App',        description:'iOS and Android mobile applications',                              displayPrice:'₹1,50,000+',         calculatorPrice:150000,  priceType:'starting' },
  { id:'ai_features',              category:'technology', name:'AI Features',              description:'AI-powered insights, automation and intelligence features',         displayPrice:'₹1,00,000+',         calculatorPrice:100000,  priceType:'starting' },
  { id:'dedicated_infrastructure', category:'technology', name:'Dedicated Infrastructure', description:'Dedicated cloud infrastructure and isolated environment',           displayPrice:'₹2,00,000–₹5,00,000+', calculatorPrice:200000, priceUnit:'/year', priceType:'range' },
  { id:'advanced_training',        category:'support',    name:'Advanced Training',        description:'Extended team training and knowledge transfer sessions',             displayPrice:'₹10,000+',           calculatorPrice:10000,   priceType:'starting' },
];

// ── Annual Care Inclusions ─────────────────────────────────────────────────────
export const annualCareIncludes: string[] = [
  'Cloud infrastructure and production application runtime',
  'Managed production database and operational maintenance',
  'Scheduled backup strategy appropriate to deployment',
  'Security, dependency and configuration maintenance',
  'Monitoring and operational issue investigation',
  'Bug fixes in standard Gremake ERP functionality',
  'Standard product maintenance and compatibility updates',
  'Technical support within the agreed service scope',
];
