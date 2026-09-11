import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, ChevronUp, Minus, Plus, X, Loader2 } from "lucide-react";
import Reveal from "../components/Reveal";
import RevealText from "../components/RevealText";
import MagneticButton from "../components/MagneticButton";
import {
  erpTiers, implementationOptions, optionalServices, basicERPFeatures,
  annualCareIncludes, gstConfig, getTierForUsers,
} from "../lib/pricing";
import type { OptionalService } from "../lib/pricing";

// ── Indian currency formatter ─────────────────────────────────────────────────
function fmt(n: number): string {
  if (n === 0) return "₹0";
  const s = Math.round(n).toString();
  const len = s.length;
  let r = s.slice(len - 3);
  let rem = s.slice(0, len - 3);
  while (rem.length > 2) { r = rem.slice(rem.length - 2) + "," + r; rem = rem.slice(0, rem.length - 2); }
  if (rem.length) r = rem + "," + r;
  return "₹" + r;
}

const CAT_LABELS: Record<string, string> = {
  service: "Data & Reporting",
  technology: "Technology Extensions",
  support: "Support & Training",
};

type BookStatus = "idle" | "submitting" | "success" | "error";

// ── Book Now Modal ────────────────────────────────────────────────────────────
function BookModal({ config, onClose }: {
  config: {
    userCount: number; tierName: string; licensePrice: number; annualCare: number;
    annualCareDisplay: string; implName: string; implPrice: number;
    selectedOptionals: OptionalService[]; subtotal: number; gst: number; total: number;
    isCustom: boolean;
  };
  onClose: () => void;
}) {
  const [status, setStatus] = useState<BookStatus>("idle");
  const [errMsg, setErrMsg] = useState("");
  const [hp, setHp] = useState("");
  const [fields, setFields] = useState({ companyName: "", contactName: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const set = (k: keyof typeof fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFields(p => ({ ...p, [k]: e.target.value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!fields.companyName.trim()) e.companyName = "Company name is required";
    if (!fields.contactName.trim()) e.contactName = "Contact person is required";
    if (!fields.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) e.email = "Invalid email";
    if (!fields.phone.trim()) e.phone = "Phone is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hp || !validate() || status === "submitting") return;
    setStatus("submitting");
    setErrMsg("");
    const implId = implementationOptions.find(o => o.name === config.implName)?.id ?? "standard";
    try {
      const res = await fetch((import.meta.env.VITE_API_URL ?? "http://localhost:4000") + "/api/pricing-bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: fields.companyName.trim(), contactName: fields.contactName.trim(),
          email: fields.email.trim(), phone: fields.phone.trim(), message: fields.message.trim(),
          honeypot: "", userCount: config.userCount, implementationId: implId,
          selectedOptionalIds: config.selectedOptionals.map(s => s.id),
        }),
      });
      const data = await res.json() as { success: boolean; message?: string };
      if (data.success) setStatus("success");
      else { setStatus("error"); setErrMsg(data.message ?? "Submission failed."); }
    } catch {
      setStatus("error");
      setErrMsg("Unable to submit. Please email hello@gremake.com");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(20,16,31,0.7)", backdropFilter: "blur(6px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog" aria-modal="true" aria-label="Book Gremake ERP"
    >
      <motion.div initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 8 }} transition={{ duration: 0.2 }}
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-paper border border-ink/10 shadow-2xl p-6 md:p-8">
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg text-ink/40 hover:text-ink hover:bg-ink/5 transition-colors" aria-label="Close"><X className="w-5 h-5" /></button>
        <h2 className="font-display text-2xl font-bold text-ink mb-1">Book Gremake ERP</h2>
        <p className="text-ink/60 text-sm mb-5">We'll confirm your configuration and send a formal proposal within 1 business day.</p>
        {/* Config summary */}
        <div className="mb-5 rounded-xl border border-ink/10 bg-ink/[0.03] p-4 text-sm space-y-1.5">
          <div className="flex justify-between"><span className="text-ink/50">Plan</span><span className="text-ink font-semibold">{config.tierName} · {config.userCount} users</span></div>
          {!config.isCustom && <>
            <div className="flex justify-between"><span className="text-ink/50">ERP License</span><span className="text-ink font-semibold">{fmt(config.licensePrice)}</span></div>
            <div className="flex justify-between"><span className="text-ink/50">{config.implName}</span><span className="text-ink font-semibold">{fmt(config.implPrice)}</span></div>
            {config.selectedOptionals.map(s => <div key={s.id} className="flex justify-between"><span className="text-ink/50">{s.name}</span><span className="text-ink font-semibold">{fmt(s.calculatorPrice)}</span></div>)}
            <div className="flex justify-between border-t border-ink/10 pt-1 mt-1"><span className="text-ink/50">Subtotal</span><span className="text-ink font-semibold">{fmt(config.subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-ink/50">GST (18%)</span><span className="text-ink font-semibold">{fmt(config.gst)}</span></div>
            <div className="flex justify-between font-bold"><span className="text-ink">Total incl. GST</span><span className="text-accent">{fmt(config.total)}</span></div>
            <div className="flex justify-between pt-1 border-t border-ink/10"><span className="text-ink/50">Annual Care</span><span className="text-ink">{config.annualCareDisplay}/year</span></div>
          </>}
          {config.isCustom && <div className="text-ink/60 text-xs">Custom proposal — pricing to be confirmed</div>}
        </div>
        {status === "success" ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-accent/15 flex items-center justify-center mx-auto mb-3"><Check className="w-8 h-8 text-accent" /></div>
            <p className="text-ink font-bold text-lg mb-1">Booking Submitted</p>
            <p className="text-ink/60 text-sm">Our team will review your configuration and get back to you within 1 business day.</p>
            <button onClick={onClose} className="mt-5 px-6 py-2.5 rounded-xl bg-accent text-paper font-semibold text-sm">Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="hidden" aria-hidden="true"><input tabIndex={-1} autoComplete="off" value={hp} onChange={e => setHp(e.target.value)} /></div>
            <div className="space-y-4">
              <div>
                <label className="block text-ink/70 text-sm mb-1.5 font-medium">Company Name *</label>
                <input value={fields.companyName} onChange={set("companyName")} maxLength={200} className={`w-full rounded-xl bg-white border px-4 py-3 text-ink text-sm focus:outline-none transition-colors ${errors.companyName ? "border-red-500" : "border-ink/20 focus:border-accent"}`} placeholder="Your construction company" />
                {errors.companyName && <p className="text-red-600 text-xs mt-1">{errors.companyName}</p>}
              </div>
              <div>
                <label className="block text-ink/70 text-sm mb-1.5 font-medium">Contact Person *</label>
                <input value={fields.contactName} onChange={set("contactName")} maxLength={200} className={`w-full rounded-xl bg-white border px-4 py-3 text-ink text-sm focus:outline-none transition-colors ${errors.contactName ? "border-red-500" : "border-ink/20 focus:border-accent"}`} placeholder="Your name" />
                {errors.contactName && <p className="text-red-600 text-xs mt-1">{errors.contactName}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-ink/70 text-sm mb-1.5 font-medium">Email Address *</label>
                  <input type="email" value={fields.email} onChange={set("email")} maxLength={320} className={`w-full rounded-xl bg-white border px-4 py-3 text-ink text-sm focus:outline-none transition-colors ${errors.email ? "border-red-500" : "border-ink/20 focus:border-accent"}`} placeholder="you@company.com" />
                  {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-ink/70 text-sm mb-1.5 font-medium">Phone Number *</label>
                  <input type="tel" value={fields.phone} onChange={set("phone")} maxLength={30} className={`w-full rounded-xl bg-white border px-4 py-3 text-ink text-sm focus:outline-none transition-colors ${errors.phone ? "border-red-500" : "border-ink/20 focus:border-accent"}`} placeholder="+91 XXXXX XXXXX" />
                  {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>
              <div>
                <label className="block text-ink/70 text-sm mb-1.5 font-medium">Additional Requirements <span className="text-ink/40">(optional)</span></label>
                <textarea value={fields.message} onChange={set("message")} rows={3} maxLength={2000} className="w-full rounded-xl bg-white border border-ink/20 px-4 py-3 text-ink text-sm focus:outline-none focus:border-accent transition-colors resize-none" placeholder="Any specific requirements..." />
              </div>
            </div>
            {status === "error" && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3"><p className="text-red-700 text-sm">{errMsg}</p></div>}
            <button type="submit" disabled={status === "submitting"} className="mt-5 w-full flex items-center justify-center gap-2 rounded-full bg-accent py-4 text-paper font-bold text-sm hover:bg-accent-light transition-colors disabled:opacity-50">
              {status === "submitting" ? <><Loader2 className="w-4 h-4 animate-spin" />Submitting...</> : "Book Now"}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}

// ── Service checkbox row ──────────────────────────────────────────────────────
function ServiceRow({ svc, checked, onToggle }: { svc: OptionalService; checked: boolean; onToggle: () => void }) {
  return (
    <label className={`flex items-start gap-3 rounded-xl border p-3.5 cursor-pointer transition-all duration-200 ${checked ? "border-accent/40 bg-accent/5" : "border-ink/15 hover:border-ink/30 bg-white"}`}>
      <input type="checkbox" checked={checked} onChange={onToggle} className="sr-only" aria-label={svc.name} />
      <div className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${checked ? "border-accent bg-accent" : "border-ink/30"}`}>
        {checked && <Check className="w-3 h-3 text-paper" strokeWidth={3} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-ink font-semibold text-sm">{svc.name}</p>
        <p className="text-ink/55 text-xs mt-0.5 leading-snug">{svc.description}</p>
        <div className="flex items-baseline gap-2 mt-1 flex-wrap">
          <span className="text-accent font-bold text-sm">{fmt(svc.calculatorPrice)} base estimate</span>
          <span className="text-ink/35 text-xs">Official: {svc.displayPrice}{svc.priceUnit ?? ""}</span>
        </div>
      </div>
    </label>
  );
}

// ── Main Pricing Page ─────────────────────────────────────────────────────────
export default function PricingPage() {
  const [userCount, setUserCount] = useState(10);
  const [selectedImpl, setSelectedImpl] = useState("standard");
  const [selectedOptIds, setSelectedOptIds] = useState<string[]>([]);
  const [basicExpanded, setBasicExpanded] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const tier = useMemo(() => getTierForUsers(userCount), [userCount]);
  const isCustom = userCount > 100;

  const changeUser = useCallback((delta: number) => {
    setUserCount(prev => Math.max(1, Math.min(500, prev + delta)));
  }, []);

  const toggleOpt = useCallback((id: string) => {
    setSelectedOptIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }, []);

  const selectedOptionals = useMemo(() => optionalServices.filter(s => selectedOptIds.includes(s.id)), [selectedOptIds]);
  const implOption = useMemo(() => implementationOptions.find(o => o.id === selectedImpl) ?? implementationOptions[0], [selectedImpl]);

  // Real numeric calculation
  const calc = useMemo(() => {
    if (isCustom || !tier) return null;
    const license = tier.licensePrice;
    const impl = implOption.calculatorPrice;
    const addons = selectedOptionals.reduce((sum, s) => sum + s.calculatorPrice, 0);
    const subtotal = license + impl + addons;
    const gst = Math.round(subtotal * gstConfig.rate);
    const total = subtotal + gst;
    return { license, impl, addons, subtotal, gst, total };
  }, [tier, isCustom, implOption, selectedOptionals]);

  const servicesByCategory: Record<string, OptionalService[]> = {
    service: optionalServices.filter(s => s.category === "service"),
    technology: optionalServices.filter(s => s.category === "technology"),
    support: optionalServices.filter(s => s.category === "support"),
  };

  const modalConfig = useMemo(() => ({
    userCount,
    tierName: isCustom ? "Custom Proposal" : (tier?.name ?? ""),
    licensePrice: calc?.license ?? 0,
    annualCare: tier?.annualCare ?? 0,
    annualCareDisplay: isCustom ? "Custom Proposal" : (tier?.annualCareDisplay ?? ""),
    implName: implOption.name,
    implPrice: calc?.impl ?? 0,
    selectedOptionals,
    subtotal: calc?.subtotal ?? 0,
    gst: calc?.gst ?? 0,
    total: calc?.total ?? 0,
    isCustom,
  }), [userCount, isCustom, tier, implOption, selectedOptionals, calc]);

  return (
    <>
      {/* pt-28 = safe padding below fixed nav (~70px nav + breathing room) */}
      <div className="min-h-screen bg-paper pt-28 pb-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">

          {/* Page header */}
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <Reveal>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-accent">Pricing</p>
            </Reveal>
            <RevealText as="h1" mode="words" className="font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-ink mb-4">
              Build Your Gremake ERP
            </RevealText>
            <Reveal delay={0.15}>
              <p className="text-ink/60 text-base leading-relaxed">
                Choose your team size and the capabilities you need. Your estimated investment — including GST — updates instantly.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-2 text-ink/40 text-xs">
                Live estimates use base pricing for variable-scope services. Final pricing may vary based on actual requirements.
              </p>
            </Reveal>
          </div>

          <div className="grid lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-6 items-start">
            {/* LEFT: Configuration */}
            <div className="space-y-4 min-w-0">

              {/* User Count */}
              <Reveal>
                <div className="rounded-2xl border border-ink/10 bg-white shadow-sm p-5 sm:p-6">
                  <h3 className="text-ink font-semibold text-sm uppercase tracking-wider mb-1 opacity-70">Number of Users</h3>
                  <p className="text-ink/55 text-xs mb-4">User capacity determines your ERP tier and license price.</p>
                  <div className="flex items-center gap-3 mb-3">
                    <button onClick={() => changeUser(-1)} disabled={userCount <= 1} className="w-10 h-10 rounded-xl border border-ink/20 flex items-center justify-center text-ink/60 hover:border-accent hover:text-accent disabled:opacity-30 transition-colors" aria-label="Decrease users">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-ink font-black text-4xl min-w-[80px] text-center">{userCount}</span>
                    <button onClick={() => changeUser(1)} className="w-10 h-10 rounded-xl border border-ink/20 flex items-center justify-center text-ink/60 hover:border-accent hover:text-accent transition-colors" aria-label="Increase users">
                      <Plus className="w-4 h-4" />
                    </button>
                    <span className="text-ink/55 text-sm">users</span>
                  </div>
                  <input type="range" min={1} max={100} value={Math.min(userCount, 100)} onChange={e => setUserCount(Number(e.target.value))} className="w-full accent-[#f97316] mb-3" aria-label="User count slider" />
                  <div className="flex flex-wrap gap-1.5">
                    {erpTiers.map(t => {
                      const active = tier?.id === t.id;
                      return (
                        <span key={t.id} className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${active ? "bg-accent text-paper border-accent" : "bg-ink/5 text-ink/50 border-ink/10"}`}>
                          {t.name} ≤{t.maxUsers}
                        </span>
                      );
                    })}
                    {isCustom && <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-orange-50 text-accent border border-accent/30">Custom &gt;100</span>}
                  </div>
                  {isCustom && (
                    <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200">
                      <p className="text-amber-800 text-xs font-medium">For teams with more than 100 users, Gremake will prepare a custom proposal based on your requirements.</p>
                    </div>
                  )}
                </div>
              </Reveal>

              {/* Basic ERP Features */}
              <Reveal>
                <div className="rounded-2xl border border-accent/25 bg-accent/[0.04] overflow-hidden">
                  <button onClick={() => setBasicExpanded(v => !v)} className="w-full flex items-center justify-between px-5 py-4" aria-expanded={basicExpanded} aria-controls="basic-features-list">
                    <div className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-md bg-accent flex items-center justify-center flex-shrink-0"><Check className="w-3 h-3 text-paper" strokeWidth={3} /></div>
                      <span className="text-ink font-semibold text-sm">Basic ERP Features</span>
                      <span className="text-xs text-accent font-semibold px-2 py-0.5 rounded-full border border-accent/30 bg-accent/10">Always Included</span>
                    </div>
                    {basicExpanded ? <ChevronUp className="w-4 h-4 text-ink/40" /> : <ChevronDown className="w-4 h-4 text-ink/40" />}
                  </button>
                  <AnimatePresence>
                    {basicExpanded && (
                      <motion.div id="basic-features-list" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                        <div className="px-5 pb-5">
                          <p className="text-ink/55 text-xs mb-3">Included in your ERP license at all tiers — no additional charge.</p>
                          <div className="grid sm:grid-cols-2 gap-0.5">
                            {basicERPFeatures.map(f => (
                              <div key={f.id} className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg">
                                <Check className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                                <span className="text-ink/80 text-sm">{f.name}</span>
                                <span className="ml-auto text-ink/40 text-xs flex-shrink-0">Included</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>

              {/* Additional Features */}
              <Reveal>
                <div className="rounded-2xl border border-ink/10 bg-white shadow-sm p-5 sm:p-6">
                  <h3 className="text-ink font-semibold text-sm uppercase tracking-wider mb-1 opacity-70">Additional Features</h3>
                  <p className="text-ink/55 text-xs mb-4">Optional services — select what you need. Each adds its base estimate to the calculated total.</p>
                  {Object.entries(servicesByCategory).map(([cat, services]) => (
                    <div key={cat} className="mb-5 last:mb-0">
                      <p className="text-ink/50 text-xs font-semibold uppercase tracking-widest mb-2.5">{CAT_LABELS[cat]}</p>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {services.map(svc => (
                          <ServiceRow key={svc.id} svc={svc} checked={selectedOptIds.includes(svc.id)} onToggle={() => toggleOpt(svc.id)} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>

              {/* Implementation */}
              <Reveal>
                <div className="rounded-2xl border border-ink/10 bg-white shadow-sm p-5 sm:p-6">
                  <h3 className="text-ink font-semibold text-sm uppercase tracking-wider mb-1 opacity-70">Implementation</h3>
                  <p className="text-ink/55 text-xs mb-4">Select your expected implementation scope. Base estimate is used in the calculator.</p>
                  <div className="space-y-2" role="radiogroup" aria-label="Implementation option">
                    {implementationOptions.map(opt => (
                      <label key={opt.id} className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-all duration-200 ${selectedImpl === opt.id ? "border-accent/40 bg-accent/5" : "border-ink/15 hover:border-ink/30 bg-white"}`}>
                        <input type="radio" name="implementation" value={opt.id} checked={selectedImpl === opt.id} onChange={() => setSelectedImpl(opt.id)} className="sr-only" />
                        <div className={`flex-shrink-0 mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${selectedImpl === opt.id ? "border-accent" : "border-ink/30"}`}>
                          {selectedImpl === opt.id && <div className="w-2 h-2 rounded-full bg-accent" />}
                        </div>
                        <div className="flex-1 flex justify-between items-start gap-2 flex-wrap">
                          <div>
                            <p className="text-ink font-semibold text-sm">{opt.name}</p>
                            <p className="text-ink/50 text-xs mt-0.5">{opt.includes.slice(0, 2).join(" · ")}{opt.includes.length > 2 ? " ···" : ""}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-accent font-bold text-sm">{fmt(opt.calculatorPrice)} base</p>
                            <p className="text-ink/35 text-xs">Official: {opt.displayPrice}</p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>

            {/* RIGHT: Live Price Summary (sticky below nav) */}
            <div className="min-w-0">
              <div className="lg:sticky lg:top-24 space-y-4">
                <Reveal>
                  <div className="rounded-2xl border border-ink/15 bg-white shadow-lg p-5 sm:p-6">
                    <h3 className="text-ink/60 text-xs font-semibold uppercase tracking-widest mb-4">Your Estimated Investment</h3>

                    {/* Tier badge */}
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${isCustom ? "bg-ink/10 text-ink" : "bg-accent text-paper"}`}>
                        {isCustom ? "Custom Proposal" : (tier?.name ?? "Select Users")}
                      </span>
                    </div>
                    {!isCustom && tier && <p className="text-ink/50 text-xs mb-4">{tier.tagline}</p>}
                    {isCustom && <p className="text-ink/50 text-xs mb-4">More than 100 users — Gremake will prepare a custom proposal.</p>}

                    {isCustom ? (
                      <div className="border border-amber-200 rounded-xl bg-amber-50 p-4 text-center">
                        <p className="text-amber-800 font-semibold text-sm">Custom Proposal Required</p>
                        <p className="text-amber-700 text-xs mt-1">Book now to receive a tailored pricing proposal.</p>
                      </div>
                    ) : calc ? (
                      <div className="space-y-0">
                        <div className="border-t border-ink/10 pt-3">
                          <p className="text-ink/50 text-xs uppercase tracking-wider font-semibold mb-2">One-Time Investment</p>

                          <div className="flex justify-between items-start py-1.5">
                            <span className="text-ink/70 text-sm">ERP License</span>
                            <span className="text-ink font-semibold text-sm">{fmt(calc.license)}</span>
                          </div>
                          <div className="flex justify-between items-start py-1.5">
                            <span className="text-ink/70 text-sm">{implOption.name}</span>
                            <span className="text-ink font-semibold text-sm">{fmt(calc.impl)}</span>
                          </div>
                          {selectedOptionals.map(s => (
                            <div key={s.id} className="flex justify-between items-start py-1.5">
                              <span className="text-ink/70 text-sm">{s.name}</span>
                              <span className="text-ink font-semibold text-sm">{fmt(s.calculatorPrice)}</span>
                            </div>
                          ))}

                          <div className="border-t border-ink/15 mt-2 pt-2">
                            <div className="flex justify-between items-center py-1.5">
                              <span className="text-ink/80 font-semibold text-sm">Subtotal</span>
                              <span className="text-ink font-bold text-sm">{fmt(calc.subtotal)}</span>
                            </div>
                            <div className="flex justify-between items-center py-1.5">
                              <span className="text-ink/80 font-semibold text-sm">{gstConfig.label}</span>
                              <span className="text-ink font-bold text-sm">{fmt(calc.gst)}</span>
                            </div>
                          </div>

                          <div className="border-t-2 border-ink/20 mt-1 pt-3">
                            <div className="flex justify-between items-center">
                              <span className="text-ink font-bold text-sm">Total Including GST</span>
                              <span className="text-accent font-black text-xl">{fmt(calc.total)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-ink/10 pt-3 mt-3">
                          <p className="text-ink/50 text-xs uppercase tracking-wider font-semibold mb-2">Annual Recurring</p>
                          <div className="flex justify-between items-center">
                            <span className="text-ink/70 text-sm">Annual Gremake Care</span>
                            <div className="text-right">
                              <span className="text-ink font-bold text-sm">{tier?.annualCareDisplay}<span className="text-ink/50 font-normal text-xs">/year</span></span>
                            </div>
                          </div>
                          <p className="text-ink/35 text-xs mt-1">Not included in the one-time total above.</p>
                        </div>

                        <div className="mt-3 pt-3 border-t border-ink/10">
                          <p className="text-ink/40 text-xs leading-relaxed">
                            Base/minimum calculator prices used for variable-scope services. Final GST and commercial terms confirmed in the signed customer quotation.
                          </p>
                        </div>
                      </div>
                    ) : null}

                    <div className="mt-5">
                      <MagneticButton as="button" type="button" onClick={() => setShowModal(true)}
                        className="w-full rounded-full bg-accent px-8 py-4 text-sm font-bold text-paper hover:bg-accent-light transition-colors text-center">
                        Book Now
                      </MagneticButton>
                    </div>
                  </div>
                </Reveal>

                {/* Annual Care inclusions */}
                <Reveal>
                  <div className="rounded-2xl border border-ink/10 bg-white shadow-sm p-5">
                    <h4 className="text-ink font-semibold text-xs uppercase tracking-wider mb-3 opacity-60">Annual Care Includes</h4>
                    {annualCareIncludes.map(item => (
                      <div key={item} className="flex items-start gap-2 mb-1.5">
                        <Check className="w-3.5 h-3.5 text-accent flex-shrink-0 mt-0.5" />
                        <p className="text-ink/65 text-xs leading-snug">{item}</p>
                      </div>
                    ))}
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showModal && <BookModal config={modalConfig} onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </>
  );
}
