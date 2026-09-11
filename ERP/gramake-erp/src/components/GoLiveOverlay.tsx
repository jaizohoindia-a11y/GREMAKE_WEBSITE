/**
 * GoLiveOverlay — Gremake Grand Opening / Go Live Experience
 *
 * ─── Architecture ────────────────────────────────────────────────────────────
 *
 * Source of truth: backend PostgreSQL (GET /api/launch-status)
 * localStorage: optional client-side read optimization only
 *
 * NORMAL PUBLIC VISITORS (all URLs):
 *   - On mount, fetches GET /api/launch-status.
 *   - If { launched: true }  → phase="done" → nothing rendered.
 *   - If { launched: false } → phase="done" → nothing rendered.
 *   - PUBLIC VISITORS NEVER SEE THE LAUNCH OVERLAY.
 *
 * AUTHORIZED INTERNAL LAUNCH:
 *   - Access: ?launchMode=true  (no secret in URL)
 *   - Shows a private authentication screen with a password input.
 *   - Operator types the LAUNCH_SECRET into the input.
 *   - Secret is sent ONLY in the HTTPS Authorization header to POST /api/launch.
 *   - Secret is NEVER stored in localStorage, URL, source code, or console logs.
 *   - On POST success (server confirms DB write): cinematic celebration plays.
 *   - On POST failure: clear error shown, NO launch state set, operator can retry.
 *   - After celebration completes: transitions to normal website.
 *
 * AFTER GLOBAL LAUNCH (PostgreSQL launched=true):
 *   - GET /api/launch-status returns { launched: true }.
 *   - Every visitor (any browser, any device, incognito) sees normal website.
 *   - Clearing localStorage has no effect — server is the source of truth.
 *
 * localStorage key: gremake_go_live_seen
 *   - Used ONLY to skip the initial GET on subsequent visits from the same browser.
 *   - NOT the source of truth. Server always overrides.
 *
 * Dev reset: ?resetGoLive=true  (clears localStorage cache only)
 *
 * To remove entirely:
 *   1. Delete this file.
 *   2. Remove <GoLiveOverlay /> from App.tsx.
 */

import { useEffect, useRef, useState, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useAnimationControls,
  cubicBezier,
} from "framer-motion";
import { site } from "../lib/siteConfig";

// ─── Constants ───────────────────────────────────────────────────────────────

const LS_KEY = "gremake_go_live_seen";
const ACCENT = "#f97316"; // Gremake orange
const EASE_OUT_EXPO = cubicBezier(0.22, 1, 0.36, 1);

// ─── URL helpers ──────────────────────────────────────────────────────────────

function isLaunchMode(): boolean {
  try {
    return new URL(window.location.href).searchParams.get("launchMode") === "true";
  } catch { return false; }
}

function applyDevReset(): void {
  try {
    const url = new URL(window.location.href);
    if (url.searchParams.get("resetGoLive") === "true") {
      localStorage.removeItem(LS_KEY);
      url.searchParams.delete("resetGoLive");
      window.history.replaceState({}, "", url.toString());
    }
  } catch { /* non-critical */ }
}

// ─── localStorage helpers (optimization only) ─────────────────────────────────

function getCachedLaunched(): boolean {
  try { return localStorage.getItem(LS_KEY) === "true"; } catch { return false; }
}
function setCachedLaunched(): void {
  try { localStorage.setItem(LS_KEY, "true"); } catch { /* ignore */ }
}

// ─── API calls ────────────────────────────────────────────────────────────────

async function fetchLaunchStatus(): Promise<boolean> {
  try {
    const res = await fetch(`${site.apiBaseUrl}/api/launch-status`);
    if (!res.ok) return false;
    const data = await res.json() as { launched?: boolean };
    return data.launched === true;
  } catch { return false; }
}

// Secret sent only in Authorization header — NEVER in URL or body
async function postLaunch(secret: string): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`${site.apiBaseUrl}/api/launch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${secret}`,
      },
    });
    const data = await res.json() as { success?: boolean; message?: string };
    if (!res.ok) {
      return { success: false, message: data.message ?? `Error ${res.status}` };
    }
    return { success: data.success === true };
  } catch (err) {
    return { success: false, message: (err as Error).message };
  }
}

// ─── Precision Particle Canvas ────────────────────────────────────────────────

interface Particle {
  id: number; x: number; y: number; angle: number; speed: number;
  size: number; opacity: number; type: "line" | "dot" | "cross"; delay: number;
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i, x: 50 + (Math.random() - 0.5) * 8, y: 48 + (Math.random() - 0.5) * 8,
    angle: (Math.random() * 360 * Math.PI) / 180, speed: 120 + Math.random() * 200,
    size: 1 + Math.random() * 2.5, opacity: 0.4 + Math.random() * 0.6,
    type: (["line", "line", "dot", "dot", "cross"] as const)[Math.floor(Math.random() * 5)],
    delay: Math.random() * 0.3,
  }));
}

function ParticleCanvas({ active, reduced }: { active: boolean; reduced: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number | null>(null);
  const particles = useRef<Particle[]>(generateParticles(reduced ? 20 : 55));

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize(); window.addEventListener("resize", resize);
    const DURATION = reduced ? 1200 : 2200;
    const draw = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const progress = Math.min((ts - startRef.current) / DURATION, 1);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.current.forEach((p) => {
        const pp = Math.max(0, progress - p.delay * 0.15); if (pp <= 0) return;
        const eased = pp < 0.5 ? 2 * pp * pp : 1 - Math.pow(-2 * pp + 2, 2) / 2;
        const px = (p.x / 100) * canvas.width + Math.cos(p.angle) * p.speed * eased * (canvas.width / 100);
        const py = (p.y / 100) * canvas.height + Math.sin(p.angle) * p.speed * eased * (canvas.height / 100);
        const fade = pp > 0.5 ? 1 - (pp - 0.5) * 2 : pp * 2;
        ctx.save(); ctx.globalAlpha = p.opacity * fade;
        ctx.strokeStyle = ACCENT; ctx.fillStyle = ACCENT;
        ctx.lineWidth = p.size * 0.6; ctx.lineCap = "round";
        ctx.translate(px, py); ctx.rotate(p.angle);
        if (p.type === "line") { const len = p.size * 14; ctx.beginPath(); ctx.moveTo(-len / 2, 0); ctx.lineTo(len / 2, 0); ctx.stroke(); }
        else if (p.type === "dot") { ctx.beginPath(); ctx.arc(0, 0, p.size * 0.8, 0, Math.PI * 2); ctx.fill(); }
        else { const arm = p.size * 5; ctx.beginPath(); ctx.moveTo(-arm, 0); ctx.lineTo(arm, 0); ctx.moveTo(0, -arm); ctx.lineTo(0, arm); ctx.stroke(); }
        ctx.restore();
      });
      if (progress < 1) rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", resize); };
  }, [active, reduced]);

  return (
    <canvas ref={canvasRef} aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[10002]"
      style={{ opacity: active ? 1 : 0 }} />
  );
}

function ArchGrid({ visible }: { visible: boolean }) {
  return (
    <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0"
      initial={{ opacity: 0 }} animate={{ opacity: visible ? 1 : 0 }} transition={{ duration: 1.2 }}
      style={{
        backgroundImage: `linear-gradient(rgba(249,115,22,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.04) 1px, transparent 1px)`,
        backgroundSize: "80px 80px",
      }} />
  );
}

// ─── Gremake Logo Mark ────────────────────────────────────────────────────────

function GremakeMark({ celebrating }: { celebrating: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, filter: "blur(6px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 1.0, delay: 0.3, ease: EASE_OUT_EXPO }}
      className="mb-10"
    >
      <motion.div
        animate={celebrating ? {
          scale: [1, 1.08, 1.04],
          filter: [`drop-shadow(0 0 0px ${ACCENT}00)`, `drop-shadow(0 0 24px ${ACCENT}88)`, `drop-shadow(0 0 12px ${ACCENT}44)`],
        } : {}}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-label="Gremake">
          <rect x="1" y="1" width="50" height="50" rx="6" stroke={ACCENT} strokeWidth="1.5" fill="none" />
          <path d="M34 20H26C22.686 20 20 22.686 20 26C20 29.314 22.686 32 26 32H34V26H28" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <line x1="6" y1="6" x2="12" y2="6" stroke={ACCENT} strokeWidth="1" opacity="0.4" />
          <line x1="6" y1="6" x2="6" y2="12" stroke={ACCENT} strokeWidth="1" opacity="0.4" />
          <line x1="46" y1="46" x2="40" y2="46" stroke={ACCENT} strokeWidth="1" opacity="0.4" />
          <line x1="46" y1="46" x2="46" y2="40" stroke={ACCENT} strokeWidth="1" opacity="0.4" />
        </svg>
      </motion.div>
    </motion.div>
  );
}

// ─── Phase type ───────────────────────────────────────────────────────────────

type Phase =
  | "auth"         // Internal: password input screen
  | "intro"        // Cinematic entrance (after auth)
  | "ready"        // CTA visible
  | "launching"    // POST in progress
  | "celebration"  // Success: grand opening animation
  | "exit"         // Fading out
  | "done";        // Removed from DOM

// ─── Main Component ───────────────────────────────────────────────────────────

export default function GoLiveOverlay() {
  const [phase, setPhase] = useState<Phase | null>(null);
  const [secretInput, setSecretInput] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [launchError, setLaunchError] = useState<string | null>(null);
  const [isLaunching, setIsLaunching] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const secretRef = useRef<string>("");           // Holds secret in memory only
  const reduced = useReducedMotion() ?? false;
  const ctaControls = useAnimationControls();
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
  const secretInputRef = useRef<HTMLInputElement>(null);

  // ── Initialise ───────────────────────────────────────────────────────────
  useEffect(() => {
    applyDevReset();

    if (!isLaunchMode()) {
      // Normal public visitor: immediately done — no overlay shown
      setPhase("done");
      return;
    }

    // Internal launch mode — check if already globally launched
    const cached = getCachedLaunched();
    if (cached) {
      // Verify against server (server is source of truth)
      fetchLaunchStatus().then((serverLaunched) => {
        if (serverLaunched) { setCachedLaunched(); setPhase("done"); }
        else setPhase("auth");
      });
      return;
    }

    fetchLaunchStatus().then((serverLaunched) => {
      if (serverLaunched) { setCachedLaunched(); setPhase("done"); }
      else setPhase("auth");
    });
  }, []);

  // Focus input when auth screen appears
  useEffect(() => {
    if (phase === "auth") {
      setTimeout(() => secretInputRef.current?.focus(), 300);
    }
  }, [phase]);

  // ── Auth: operator submits secret ────────────────────────────────────────
  const handleAuth = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = secretInput.trim();
    if (!trimmed) { setAuthError("Please enter the launch secret."); return; }
    setAuthError(null);
    secretRef.current = trimmed;
    setSecretInput(""); // Clear from state immediately
    setPhase("intro");
    const t = setTimeout(() => setPhase("ready"), reduced ? 1200 : 3800);
    timeouts.current.push(t);
  }, [secretInput, reduced]);

  // ── CTA: LAUNCH Gremake ───────────────────────────────────────────────────
  const handleLaunch = useCallback(async () => {
    if (phase !== "ready" || isLaunching) return;
    setIsLaunching(true);
    setLaunchError(null);
    setPhase("launching");

    // CTA animation
    await ctaControls.start({
      scale: [1, 0.95, 1.04, 1],
      transition: { duration: 0.35, ease: "easeInOut" },
    });

    // POST to backend — secret sent via Authorization header only
    const result = await postLaunch(secretRef.current);
    secretRef.current = ""; // Clear immediately after use

    if (!result.success) {
      // FAILURE: do NOT mark as launched, do NOT celebrate
      setIsLaunching(false);
      setPhase("ready");
      setLaunchError(result.message ?? "Launch failed. Please retry.");
      return;
    }

    // SUCCESS: global launch persisted in DB — begin celebration
    setCachedLaunched();
    setPhase("celebration");

    const add = (fn: () => void, ms: number) => {
      const t = setTimeout(fn, ms); timeouts.current.push(t);
    };
    add(() => setShowParticles(true), reduced ? 100 : 200);
    add(() => setShowCongrats(true), reduced ? 600 : 1200);
    add(() => { setShowParticles(false); setPhase("exit"); }, reduced ? 1800 : 3600);
    add(() => setPhase("done"), reduced ? 2400 : 4800);
  }, [phase, isLaunching, ctaControls, reduced]);

  const handleLaunchKey = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleLaunch(); }
  }, [handleLaunch]);

  useEffect(() => () => { timeouts.current.forEach(clearTimeout); }, []);

  if (phase === null || phase === "done") return null;

  const isOverlayVisible = phase !== "auth";
  const isCelebrating = phase === "celebration" || phase === "exit";
  const isExiting = phase === "exit";

  // ── Auth screen ──────────────────────────────────────────────────────────
  if (phase === "auth") {
    return (
      <div
        className="fixed inset-0 z-[10001] flex items-center justify-center"
        style={{ background: "radial-gradient(ellipse 120% 100% at 50% 60%, rgba(12,8,4,0.98) 0%, rgba(5,3,1,0.99) 70%, #000 100%)" }}
        role="dialog"
        aria-modal="true"
        aria-label="Gremake Internal Launch Authentication"
      >
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
          className="flex w-full max-w-sm flex-col items-center px-8"
        >
          {/* Logo */}
          <div className="mb-8">
            <svg width="44" height="44" viewBox="0 0 52 52" fill="none" aria-label="Gremake">
              <rect x="1" y="1" width="50" height="50" rx="6" stroke={ACCENT} strokeWidth="1.5" fill="none" />
              <path d="M34 20H26C22.686 20 20 22.686 20 26C20 29.314 22.686 32 26 32H34V26H28" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>

          <p className="mb-1 text-xs font-semibold tracking-[0.3em] uppercase" style={{ color: ACCENT }}>
            Internal Launch Access
          </p>
          <h1 className="mb-8 text-xl font-bold text-white tracking-tight">
            Gremake Grand Opening
          </h1>

          <form onSubmit={handleAuth} className="w-full" noValidate>
            <label htmlFor="launch-secret" className="sr-only">Launch Secret</label>
            <input
              id="launch-secret"
              ref={secretInputRef}
              type="password"
              value={secretInput}
              onChange={(e) => { setSecretInput(e.target.value); setAuthError(null); }}
              placeholder="Launch secret"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              className="w-full rounded-lg border bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:ring-2 focus:ring-orange-400 focus:ring-offset-1 focus:ring-offset-black"
              style={{ borderColor: authError ? "#f87171" : `${ACCENT}33` }}
              aria-invalid={!!authError}
              aria-describedby={authError ? "auth-error" : undefined}
            />
            {authError && (
              <p id="auth-error" className="mt-2 text-xs text-red-400/80">{authError}</p>
            )}
            <button
              type="submit"
              className="mt-4 w-full rounded-full py-3 text-sm font-semibold text-white outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              style={{
                background: `linear-gradient(135deg, ${ACCENT}cc, ${ACCENT})`,
                boxShadow: `0 0 0 1px ${ACCENT}33, 0 6px 20px ${ACCENT}28`,
              }}
            >
              Continue
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-white/20">
            Authorized personnel only
          </p>
        </motion.div>
      </div>
    );
  }

  // ── Main overlay (intro → ready → launching → celebration → exit) ─────────
  return (
    <>
      <ParticleCanvas active={showParticles} reduced={reduced} />

      <AnimatePresence>
        {isOverlayVisible && (
          <motion.div
            key="go-live-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Gremake Grand Opening"
            initial={{ opacity: 0 }}
            animate={{ opacity: isExiting ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: isExiting ? (reduced ? 0.6 : 1.6) : (reduced ? 0.4 : 0.8), ease: "easeInOut" }}
            className="fixed inset-0 z-[10001] flex items-center justify-center overflow-hidden"
            style={{ background: "radial-gradient(ellipse 120% 100% at 50% 60%, rgba(15,10,5,0.97) 0%, rgba(8,6,3,0.99) 70%, #000 100%)" }}
          >
            <ArchGrid visible={phase === "ready" || phase === "launching" || phase === "celebration"} />

            {/* Ambient glow */}
            <motion.div aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{
                opacity: isCelebrating ? [0.18, 0.38, 0.22] : 0.12,
                scale: isCelebrating ? [1.0, 1.6, 1.2] : 1.0,
              }}
              transition={{ opacity: { duration: isCelebrating ? 1.2 : 2.0, delay: 0.4, ease: "easeOut" }, scale: { duration: isCelebrating ? 1.2 : 2.0, delay: 0.4, ease: "easeOut" } }}
              style={{ width: "min(700px, 90vw)", height: "min(700px, 90vw)", background: `radial-gradient(ellipse at center, ${ACCENT}33 0%, ${ACCENT}11 40%, transparent 70%)`, filter: "blur(40px)" }} />

            {/* Celebration halo */}
            <AnimatePresence>
              {isCelebrating && !isExiting && (
                <motion.div aria-hidden="true" key="halo"
                  className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: [0, 0.5, 0.2, 0], scale: [0.5, 1.8, 2.4, 3.0] }}
                  transition={{ duration: 2.0, ease: "easeOut" }}
                  style={{ width: "min(500px, 80vw)", height: "min(500px, 80vw)", background: `radial-gradient(ellipse at center, ${ACCENT}22 0%, transparent 60%)`, filter: "blur(24px)" }} />
              )}
            </AnimatePresence>

            <div className="relative z-10 flex w-full max-w-3xl flex-col items-center px-6 text-center">
              <GremakeMark celebrating={isCelebrating && !isExiting} />

              <AnimatePresence mode="wait">
                {!isCelebrating && (
                  <motion.div key="intro-content" className="flex flex-col items-center"
                    exit={{ opacity: 0, y: -16, filter: "blur(8px)", transition: { duration: 0.5, ease: "easeIn" } }}
                  >
                    <motion.p
                      initial={{ opacity: 0, y: reduced ? 0 : 12, filter: "blur(4px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ duration: reduced ? 0.4 : 0.9, delay: reduced ? 0.1 : 0.8, ease: EASE_OUT_EXPO }}
                      className="mb-6 text-xs font-semibold tracking-[0.35em] uppercase"
                      style={{ color: ACCENT }}
                    >
                      The Wait Is Over
                    </motion.p>

                    <motion.h1
                      initial={{ opacity: 0, y: reduced ? 0 : 24, filter: "blur(8px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ duration: reduced ? 0.5 : 1.1, delay: reduced ? 0.2 : 1.3, ease: EASE_OUT_EXPO }}
                      className="mb-5 text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl"
                    >
                      Gremake{" "}
                      <span className="relative inline-block" style={{ backgroundImage: `linear-gradient(135deg, #fff 30%, ${ACCENT} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                        is Live.
                      </span>
                    </motion.h1>

                    <motion.p
                      initial={{ opacity: 0, y: reduced ? 0 : 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: reduced ? 0.4 : 0.9, delay: reduced ? 0.3 : 2.0, ease: EASE_OUT_EXPO }}
                      className="mb-12 max-w-md text-base font-light leading-relaxed text-white/50 sm:text-lg"
                    >
                      Construction management, reimagined.
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: reduced ? 0 : 16, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: reduced ? 0.4 : 0.8, delay: reduced ? 0.4 : 2.7, ease: EASE_OUT_EXPO }}
                    >
                      <motion.button
                        animate={ctaControls}
                        onClick={handleLaunch}
                        onKeyDown={handleLaunchKey}
                        tabIndex={0}
                        aria-label="Launch Gremake"
                        disabled={phase === "launching"}
                        className="group relative overflow-hidden rounded-full px-9 py-4 text-sm font-semibold tracking-wide text-white outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:opacity-60 disabled:cursor-not-allowed"
                        whileHover={phase !== "launching" ? { scale: 1.04 } : {}}
                        whileTap={phase !== "launching" ? { scale: 0.97 } : {}}
                        transition={{ type: "spring", stiffness: 400, damping: 22 }}
                        style={{ background: `linear-gradient(135deg, ${ACCENT}cc, ${ACCENT})`, boxShadow: `0 0 0 1px ${ACCENT}44, 0 8px 32px ${ACCENT}33` }}
                      >
                        <motion.span aria-hidden="true"
                          className="pointer-events-none absolute inset-0 rounded-full opacity-0 group-hover:opacity-100"
                          style={{ background: `radial-gradient(ellipse at 50% 0%, ${ACCENT}55 0%, transparent 70%)` }}
                          transition={{ duration: 0.3 }} />
                        <span className="relative z-10">
                          {phase === "launching" ? "Launching…" : "LAUNCH Gremake"}
                        </span>
                      </motion.button>

                      {/* Launch error — clear and tasteful */}
                      {launchError && (
                        <motion.p
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-4 text-center text-xs text-red-400/80"
                        >
                          {launchError}
                        </motion.p>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: 1 }}
                      transition={{ delay: reduced ? 0.5 : 3.1, duration: reduced ? 0.3 : 0.8, ease: EASE_OUT_EXPO }}
                      className="mt-14 h-px w-24 origin-center"
                      style={{ background: `linear-gradient(90deg, transparent, ${ACCENT}66, transparent)` }}
                    />
                  </motion.div>
                )}

                {/* Congratulations */}
                {isCelebrating && showCongrats && !isExiting && (
                  <motion.div key="congrats-content" className="flex flex-col items-center"
                    initial={{ opacity: 0, scale: reduced ? 1 : 0.94, filter: "blur(10px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, transition: { duration: 0.4 } }}
                    transition={{ duration: reduced ? 0.4 : 0.9, ease: EASE_OUT_EXPO }}
                  >
                    <motion.p className="mb-4 text-xs font-semibold tracking-[0.35em] uppercase" style={{ color: ACCENT }}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                      Officially Launched
                    </motion.p>
                    <motion.h2 className="mb-4 text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl"
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15, duration: 0.8, ease: EASE_OUT_EXPO }}>
                      Congratulations.
                    </motion.h2>
                    <motion.p className="text-xl font-light text-white/60 sm:text-2xl"
                      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.8, ease: EASE_OUT_EXPO }}>
                      Gremake is officially live.
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.div aria-hidden="true"
              className="absolute bottom-0 left-0 right-0 h-px"
              style={{ background: `linear-gradient(90deg, transparent 0%, ${ACCENT}44 50%, transparent 100%)` }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: reduced ? 0.3 : 1.0, duration: 0.8 }} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
