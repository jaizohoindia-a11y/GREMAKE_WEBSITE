/**
 * ============================================================================
 * GREMAKE — CANONICAL VERTICAL + PRICING CONFIGURATION (SINGLE SOURCE OF TRUTH)
 * ============================================================================
 *
 * This file is the ONE canonical, non-secret commercial configuration for the
 * Gremake public website. It is consumed by BOTH:
 *
 *   - the frontend (React/Vite)  → src/lib/pricing.ts re-exports from here
 *   - the backend  (Express)     → routes/validation import from here
 *
 * Rules:
 *   - This file must contain NO secrets (no SMTP creds, no DB URL, no launch
 *     secret, no API keys). Everything here is safe for public exposure.
 *   - Construction ERP pricing values MUST NOT change. They are the live,
 *     commercially-approved numbers.
 *   - Coming-soon verticals MUST NOT have invented final pricing.
 *   - The backend remains authoritative for all pricing calculation. The
 *     frontend may display prices using this config, but the server always
 *     recomputes totals from trusted configuration + selected IDs.
 *
 * Gremake positioning:
 *   Gremake is a MULTI-VERTICAL ERP PLATFORM.
 *   Construction ERP is the first LIVE vertical.
 *   Manufacturing, Engineering / Job Work, and Auto Components / Industrial
 *   Suppliers ERP are COMING SOON.
 */

// ── Core commercial types ─────────────────────────────────────────────────────

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

export interface GstConfig {
  configured: boolean;
  rate: number;
  ratePercent: number;
  label: string;
}

// ── Vertical model ────────────────────────────────────────────────────────────

export type VerticalId = 'construction' | 'manufacturing' | 'engineering' | 'auto_components';
export type VerticalStatus = 'live' | 'coming_soon';

export interface VerticalConfig {
  id: VerticalId;
  slug: string;
  name: string;                   // e.g. "Construction ERP"
  shortName: string;              // e.g. "Construction"
  status: VerticalStatus;
  badge: string;                  // e.g. "Live Now" / "Coming Soon"
  description: string;            // short description
  heroTitle: string;
  heroDescription: string;
  /** Whether pricing configurator + Book Now is available for this vertical. */
  bookable: boolean;
  /** Pricing profile id (only defined for live/bookable verticals). */
  pricingProfileId: string | null;
  /** IDs of basic features included for this vertical. */
  includedModuleIds: string[];
  /** IDs of optional services offered for this vertical. */
  optionalServiceIds: string[];
  seo: {
    title: string;
    description: string;
  };
}

// ── GST Configuration (GLOBAL — 18%) ──────────────────────────────────────────
// 18% GST on one-time investment (license + implementation + add-ons).
// Annual care is shown separately and not included in the calculator GST.
export const gstConfig: GstConfig = {
  configured: true,
  rate: 0.18,
  ratePercent: 18,
  label: 'GST (18%)',
};

// ── Basic ERP Features (Construction baseline — 14 modules) ───────────────────
// PRESERVE EXACTLY. These are the current live Construction ERP basic modules.
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

// ── ERP License Tiers (Construction) ──────────────────────────────────────────
// PRESERVE EXACTLY.
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
// PRESERVE EXACTLY.
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

// ── Optional Services (professional/implementation add-ons) ───────────────────
// These are GLOBAL platform-level services (not ERP modules). PRESERVE EXACTLY.
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

// ── Vertical definitions ──────────────────────────────────────────────────────

const ALL_OPTIONAL_SERVICE_IDS = optionalServices.map(s => s.id);
const ALL_BASIC_MODULE_IDS = basicERPFeatures.map(f => f.id);

export const verticals: VerticalConfig[] = [
  {
    id: 'construction',
    slug: 'construction',
    name: 'Construction ERP',
    shortName: 'Construction',
    status: 'live',
    badge: 'Live Now',
    description: 'Sites, projects, procurement, contractors, finance, billing, HR, and executive dashboards — fully live on Web, Android & iOS.',
    heroTitle: 'Construction ERP',
    heroDescription: 'From site logs to CEO dashboards — Gremake connects your entire construction business in one platform. Live today on Web, Android, and iOS.',
    bookable: true,
    pricingProfileId: 'construction_default',
    includedModuleIds: ALL_BASIC_MODULE_IDS,
    optionalServiceIds: ALL_OPTIONAL_SERVICE_IDS,
    seo: {
      title: 'Gremake Construction ERP — Built for Construction Companies',
      description: 'Gremake Construction ERP is live today: projects, sites, procurement, inventory, finance, billing, HR and executive dashboards in one connected platform. Web, Android and iOS.',
    },
  },
  {
    id: 'manufacturing',
    slug: 'manufacturing',
    name: 'Manufacturing ERP',
    shortName: 'Manufacturing',
    status: 'coming_soon',
    badge: 'Coming Soon',
    description: 'Production orders, BOM, quality control, machine operations, and inventory — built on the Gremake platform.',
    heroTitle: 'Manufacturing ERP',
    heroDescription: 'A Manufacturing ERP vertical is coming to the Gremake platform. Register your interest and we\u2019ll keep you updated as it goes live.',
    bookable: false,
    pricingProfileId: null,
    includedModuleIds: [],
    optionalServiceIds: [],
    seo: {
      title: 'Gremake Manufacturing ERP — Coming Soon',
      description: 'Manufacturing ERP is coming soon to the Gremake multi-vertical ERP platform. Register your interest to be notified.',
    },
  },
  {
    id: 'engineering',
    slug: 'engineering',
    name: 'Engineering / Job Work ERP',
    shortName: 'Engineering / Job Work',
    status: 'coming_soon',
    badge: 'Coming Soon',
    description: 'Job work, engineering operations and project execution — built on the Gremake platform.',
    heroTitle: 'Engineering / Job Work ERP',
    heroDescription: 'An Engineering / Job Work ERP vertical is coming to the Gremake platform. Register your interest and we\u2019ll keep you updated as it goes live.',
    bookable: false,
    pricingProfileId: null,
    includedModuleIds: [],
    optionalServiceIds: [],
    seo: {
      title: 'Gremake Engineering / Job Work ERP — Coming Soon',
      description: 'Engineering / Job Work ERP is coming soon to the Gremake multi-vertical ERP platform. Register your interest to be notified.',
    },
  },
  {
    id: 'auto_components',
    slug: 'auto-components',
    name: 'Auto Components / Industrial Suppliers ERP',
    shortName: 'Auto Components',
    status: 'coming_soon',
    badge: 'Coming Soon',
    description: 'ERP for auto components manufacturers and industrial suppliers — built on the Gremake platform.',
    heroTitle: 'Auto Components / Industrial Suppliers ERP',
    heroDescription: 'An Auto Components / Industrial Suppliers ERP vertical is coming to the Gremake platform. Register your interest and we\u2019ll keep you updated as it goes live.',
    bookable: false,
    pricingProfileId: null,
    includedModuleIds: [],
    optionalServiceIds: [],
    seo: {
      title: 'Gremake Auto Components / Industrial Suppliers ERP — Coming Soon',
      description: 'Auto Components / Industrial Suppliers ERP is coming soon to the Gremake multi-vertical ERP platform. Register your interest to be notified.',
    },
  },
];

export const VERTICAL_IDS: VerticalId[] = verticals.map(v => v.id);

export function getVerticalById(id: string): VerticalConfig | null {
  return verticals.find(v => v.id === id) ?? null;
}

export function getVerticalBySlug(slug: string): VerticalConfig | null {
  return verticals.find(v => v.slug === slug) ?? null;
}

export function isValidVerticalId(id: string): id is VerticalId {
  return VERTICAL_IDS.includes(id as VerticalId);
}

export function isBookableVertical(id: string): boolean {
  const v = getVerticalById(id);
  return !!v && v.bookable && v.status === 'live';
}

// ── Pricing profiles (per-vertical pricing bundle) ────────────────────────────
// Only the construction profile has real numeric pricing. Future verticals get
// their own profile once business approves their commercials.

export interface VerticalPricingProfile {
  id: string;
  verticalId: VerticalId;
  gst: GstConfig;
  tiers: ErpTier[];
  implementationOptions: ImplementationOption[];
  optionalServices: OptionalService[];
  basicFeatures: BasicFeature[];
}

export const pricingProfiles: Record<string, VerticalPricingProfile> = {
  construction_default: {
    id: 'construction_default',
    verticalId: 'construction',
    gst: gstConfig,
    tiers: erpTiers,
    implementationOptions,
    optionalServices,
    basicFeatures: basicERPFeatures,
  },
};

export function getPricingProfileForVertical(verticalId: string): VerticalPricingProfile | null {
  const v = getVerticalById(verticalId);
  if (!v || !v.pricingProfileId) return null;
  return pricingProfiles[v.pricingProfileId] ?? null;
}
