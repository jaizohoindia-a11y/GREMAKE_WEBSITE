// Central place for values that are placeholders until Gremake provides the real ones.
// Every TODO below must be replaced before this site goes live.

export const site = {
  name: "Gremake",
  tagline: "Build Smarter. Manage Better.",
  email: "gremake.tj@gmail.com", // real — from brief

  // TODO: replace with the real registered business address
  address: "Add your company address here",
  // TODO: replace with the real support/sales phone number
  phone: "+91 00 000 00000",
  // TODO: replace with the real Instagram handle
  instagram: "https://instagram.com/gremake",
  // TODO: replace with the real LinkedIn company page
  linkedin: "https://linkedin.com/company/gremake",

  // API base URL for the Gremake enquiry backend
  // Set VITE_API_URL in .env.local for local development
  // Set VITE_API_URL in Render dashboard for production
  apiBaseUrl: (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:4000",
} as const;

export const timezones = [
  { value: "Asia/Kolkata", label: "IST — India Standard Time (UTC+5:30)" },
  { value: "Etc/GMT", label: "GMT — Greenwich Mean Time (UTC+0)" },
  { value: "America/New_York", label: "EST — Eastern Time (UTC-5)" },
  { value: "America/Los_Angeles", label: "PST — Pacific Time (UTC-8)" },
  { value: "Europe/Berlin", label: "CET — Central European Time (UTC+1)" },
  { value: "Asia/Dubai", label: "GST — Gulf Standard Time (UTC+4)" },
  { value: "Asia/Singapore", label: "SGT — Singapore Time (UTC+8)" },
  { value: "Australia/Sydney", label: "AEST — Australian Eastern Time (UTC+10)" },
] as const;

export const defaultTimezone = "Asia/Kolkata";
