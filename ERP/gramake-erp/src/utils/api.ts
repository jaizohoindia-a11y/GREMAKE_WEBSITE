import { site } from '../lib/siteConfig';
import type { GeneralEnquiryPayload, PricingEnquiryPayload } from '../lib/pricingEngine';

export interface ApiResponse {
  success: boolean;
  message: string;
}

async function postJSON(path: string, data: unknown): Promise<ApiResponse> {
  const res = await fetch(`${site.apiBaseUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { message?: string };
    throw new Error(body.message ?? `Request failed: ${res.status}`);
  }
  return res.json() as Promise<ApiResponse>;
}

export function submitGeneralEnquiry(data: GeneralEnquiryPayload): Promise<ApiResponse> {
  return postJSON('/api/enquiries', data);
}

export function submitPricingEnquiry(data: PricingEnquiryPayload): Promise<ApiResponse> {
  return postJSON('/api/pricing-enquiries', data);
}

export function submitDemoRequest(data: GeneralEnquiryPayload): Promise<ApiResponse> {
  return postJSON('/api/enquiries', { ...data, subject: 'Product Demo Request' });
}
