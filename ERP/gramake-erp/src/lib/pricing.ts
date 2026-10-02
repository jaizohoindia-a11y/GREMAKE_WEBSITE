/**
 * OFFICIAL GREMAKE ERP PRICING CONFIGURATION — COMPATIBILITY / ACCESS LAYER
 *
 * The single canonical source of truth now lives in:
 *   GREMAKE_WEBSITE/shared/pricingConfig.ts
 *
 * This module re-exports the canonical commercial configuration so existing
 * frontend imports (basicERPFeatures, erpTiers, implementationOptions,
 * optionalServices, gstConfig, getTierForUsers, annualCareIncludes, and the
 * associated types) keep working without duplication.
 *
 * DO NOT re-declare pricing values here. Update the canonical config instead.
 */

export type {
  PricingType,
  ServiceCategory,
  ErpTier,
  ImplementationOption,
  OptionalService,
  BasicFeature,
  GstConfig,
  VerticalId,
  VerticalStatus,
  VerticalConfig,
  VerticalPricingProfile,
} from '../../../../shared/pricingConfig';

export {
  gstConfig,
  basicERPFeatures,
  erpTiers,
  getTierForUsers,
  implementationOptions,
  optionalServices,
  annualCareIncludes,
  // Vertical model + helpers
  verticals,
  VERTICAL_IDS,
  getVerticalById,
  getVerticalBySlug,
  isValidVerticalId,
  isBookableVertical,
  pricingProfiles,
  getPricingProfileForVertical,
} from '../../../../shared/pricingConfig';
