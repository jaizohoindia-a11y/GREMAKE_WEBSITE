/**
 * Gremake ERP Pricing Engine
 * Pure TypeScript — no React dependencies.
 * Unit-testable.
 */
import { getTierForUsers, optionalServices } from './pricing';
import type { ErpTier, OptionalService } from './pricing';

export interface PricingResult {
  userCount: number;
  tier: ErpTier | null;
  isCustom: boolean;
  licenseDisplay: string;
  licenseIsStarting: boolean;
  annualCareDisplay: string;
  annualCareIsStarting: boolean;
  selectedOptionalIds: string[];
  selectedOptionals: OptionalService[];
  hasVariablePricing: boolean;
  implementationId: string | null;
}

export interface PricingEnquiryPayload {
  name: string;
  companyName: string;
  email: string;
  phone: string;
  country: string;
  vertical: string;
  userCount: number;
  tierName: string;
  licenseDisplay: string;
  annualCareDisplay: string;
  implementationId: string;
  implementationName: string;
  implementationDisplay: string;
  selectedOptionalIds: string[];
  selectedOptionalSummary: string;
  message: string;
  honeypot?: string;
}

export interface GeneralEnquiryPayload {
  name: string;
  companyName: string;
  email: string;
  phone: string;
  subject: string;
  vertical: string;
  userCount?: number;
  message: string;
  honeypot?: string;
}

/**
 * Format a number as Indian currency (₹X,XX,XXX)
 */
export function formatIndianCurrency(amount: number): string {
  if (amount === 0) return '₹0';
  const str = Math.round(Math.abs(amount)).toString();
  const len = str.length;
  let result = '';
  if (len <= 3) {
    result = str;
  } else {
    result = str.slice(len - 3);
    let rem = str.slice(0, len - 3);
    while (rem.length > 2) {
      result = rem.slice(rem.length - 2) + ',' + result;
      rem = rem.slice(0, rem.length - 2);
    }
    if (rem.length > 0) result = rem + ',' + result;
  }
  return '₹' + result;
}

/**
 * Calculate pricing result from user selections.
 * NEVER produces fake totals from range/starting-from prices.
 */
export function calculatePricing(
  userCount: number,
  selectedImplementationId: string | null,
  selectedOptionalIds: string[],
): PricingResult {
  const tier = getTierForUsers(userCount);
  const isCustom = userCount > 100;

  const selectedOptionals = selectedOptionalIds
    .map(id => optionalServices.find(s => s.id === id))
    .filter((s): s is OptionalService => s !== undefined);

  const hasVariablePricing =
    selectedImplementationId !== null ||
    selectedOptionals.some(s => s.priceType !== 'fixed');

  return {
    userCount,
    tier,
    isCustom,
    licenseDisplay: isCustom
      ? 'Contact for custom proposal'
      : tier
      ? (tier.licensePriceIsStarting ? tier.licensePriceDisplay + '+' : tier.licensePriceDisplay)
      : '',
    licenseIsStarting: tier?.licensePriceIsStarting ?? false,
    annualCareDisplay: isCustom
      ? 'Contact for custom proposal'
      : tier
      ? (tier.annualCareIsStarting ? tier.annualCareDisplay + '+' : tier.annualCareDisplay)
      : '',
    annualCareIsStarting: tier?.annualCareIsStarting ?? false,
    selectedOptionalIds,
    selectedOptionals,
    hasVariablePricing,
    implementationId: selectedImplementationId,
  };
}

/**
 * Validate user count input.
 */
export function validateUserCount(userCount: number): string[] {
  const errors: string[] = [];
  if (!Number.isInteger(userCount) || userCount < 1) {
    errors.push('User count must be a positive integer.');
  }
  return errors;
}

// ── Unit-testable tier boundary tests ─────────────────────────────────────────
export function runPricingTests(): void {
  const cases: [number, string | null, number | null, number | null][] = [
    [1,   'starter',        150000, 30000],
    [5,   'starter',        150000, 30000],
    [6,   'business',       300000, 50000],
    [15,  'business',       300000, 50000],
    [16,  'professional',   500000, 75000],
    [30,  'professional',   500000, 75000],
    [31,  'enterprise',     750000, 100000],
    [50,  'enterprise',     750000, 100000],
    [51,  'enterprise_plus',1200000,150000],
    [100, 'enterprise_plus',1200000,150000],
    [101, null,             null,   null],
  ];

  let passed = 0; let failed = 0;
  for (const [users, expectedId, expectedLicense, expectedCare] of cases) {
    const tier = getTierForUsers(users);
    if (expectedId === null) {
      if (tier !== null) { failed++; console.error(`FAIL: ${users} users: expected null, got ${tier.id}`); }
      else passed++;
    } else {
      if (tier === null) { failed++; console.error(`FAIL: ${users} users: expected ${expectedId}, got null`); continue; }
      if (tier.id !== expectedId) { failed++; console.error(`FAIL: ${users} users: tier ${tier.id} !== ${expectedId}`); }
      else if (tier.licensePrice !== expectedLicense) { failed++; console.error(`FAIL: ${users} users: license ${(tier as unknown as Record<string,number>)['licensePrice']} !== ${expectedLicense}`); }
      else if (tier.annualCare !== expectedCare) { failed++; console.error(`FAIL: ${users} users: care ${(tier as unknown as Record<string,number>)['annualCare']} !== ${expectedCare}`); }
      else passed++;
    }
  }

  // formatIndianCurrency tests
  const currCases: [number, string][] = [
    [0,'₹0'],[1000,'₹1,000'],[15000,'₹15,000'],[30000,'₹30,000'],
    [50000,'₹50,000'],[75000,'₹75,000'],[100000,'₹1,00,000'],
    [150000,'₹1,50,000'],[300000,'₹3,00,000'],[500000,'₹5,00,000'],
    [750000,'₹7,50,000'],[1200000,'₹12,00,000'],
  ];
  for (const [input, expected] of currCases) {
    const result = formatIndianCurrency(input);
    if (result !== expected) { failed++; console.error(`FAIL: formatIndianCurrency(${input}) expected ${expected} got ${result}`); }
    else passed++;
  }

  // Optional services must not be fixed type
  for (const svc of optionalServices) {
    if (svc.priceType === 'fixed') { failed++; console.error(`FAIL: ${svc.id} should not be fixed-price`); }
    else passed++;
  }

  console.log(`\nPricing tests: ${passed} passed, ${failed} failed`);
  if (failed > 0) throw new Error(`${failed} pricing test(s) failed`);
}
