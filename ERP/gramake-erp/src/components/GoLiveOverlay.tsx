/**
 * GoLiveOverlay — Gremake Grand Opening / Go Live Experience
 *
 * One-time cinematic launch overlay shown on first visit after deployment.
 *
 * localStorage key: gremake_go_live_seen
 * Dev reset: append ?resetGoLive=true to any URL to clear the flag.
 *
 * To permanently remove this experience in the future:
 *   1. Delete this file.
 *   2. Remove <GoLiveOverlay /> from App.tsx.
 *   Done. No other files are affected.
 */

import { useEffect, useRef, useState, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useAnimationControls,
  cubicBezier,
} from "framer-motion";

// ─── Constants ──────────────────────────────────────────────────────────────

const LS_KEY = "gremake_go_live_seen";
const ACCENT = "#f97316"; // Gremake orange — matches Tailwind orange-500

// Custom easing as a typed EasingFunction (Framer Motion v12 compatible)
const EASE_OUT_EXPO = cubicBezier(0.22, 1, 0.36, 1);

// ─── Utility: localStorage with graceful failure ─────────────────────────────

function getLaunchSeen(): boolean {
  try {
    return localStorage.getItem(LS_KEY) === "true";
  } catch {
    return false;
  }
}

function setLaunchSeen(): void {
  try {
    localStorage.setItem(LS_KEY, "true");
  } catch {
    // Silently fail — website must never break from storage errors
  }
}

// ─── Dev reset: ?resetGoLive=true ────────────────────────────────────────────

function applyDevReset(): void {
  try {
    const url = new URL(window.location.href);
    if (url.searchParams.get("resetGoLive") === "true") {
      localStorage.removeItem(LS_KEY);
      url.searchParams.delete("resetGoLive");
      window.history.replaceState({}, "", url.toString());
    }
  } catch {
    // Non-critical
  }
}

// ─── Precision Particle ──────────────────────────────────────────────────────
// Fine architectural/tech-inspired particles — NOT confetti.
// Think: precision light streaks, structural grid fragments, digital data.

interface Particle {
  id: number;
  x: number;
  y: number;
  angle: number;
  speed: number;
  size: number;
  opacity: number;
  type: "line" | "dot" | "cross";
  delay: number;
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = (Math.random() * 360 * Math.PI) / 180;
    const speed = 120 + Math.random() * 200;
    return {
      id: i,
      x: 50 + (Math.random() - 0.5) * 8,
      y: 48 + (Math.random() - 0.5) * 8,
      angle,
      speed,
      size: 1 + Math.random() * 2.5,
      opacity: 0.4 + Math.random() * 0.6,
      type: (["line", "line", "dot", "dot", "cross"] as const)[
        Math.floor(Math.random() * 5)
      ],
      delay: Math.random() * 0.3,
    };
  });
}

// ─── Particle Canvas ────────────────────────────────────────────────────────

interface ParticleCanvasProps {
  active: boolean;
  reduced: boolean;
}

function ParticleCanvas({ active, reduced }: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number | null>(null);
  const particles = useRef<Particle[]>(generateParticles(reduced ? 20 : 55));

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const DURATION = reduced ? 1200 : 2200;

    const draw = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / DURATION, 1);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current.forEach((p) => {
        const pProgress = Math.max(0, progress - p.delay * 0.15);
        if (pProgress <= 0) return;

        const eased =
          pProgress < 0.5
            ? 2 * pProgress * pProgress
            : 1 - Math.pow(-2 * pProgress + 2, 2) / 2;

        const dx = Math.cos(p.angle) * p.speed * eased * (canvas.width / 100);
        const dy = Math.sin(p.angle) * p.speed * eased * (canvas.height / 100);
        const px = (p.x / 100) * canvas.width + dx;
        const py = (p.y / 100) * canvas.height + dy;
        const fade = pProgress > 0.5 ? 1 - (pProgress - 0.5) * 2 : pProgress * 2;
        const alpha = p.opacity * fade;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = ACCENT;
        ctx.fillStyle = ACCENT;
        ctx.lineWidth = p.size * 0.6;
        ctx.lineCap = "round";
        ctx.translate(px, py);
        ctx.rotate(p.angle);

        if (p.type === "line") {
          const len = p.size * 14;
          ctx.beginPath();
          ctx.moveTo(-len / 2, 0);
          ctx.lineTo(len / 2, 0);
          ctx.stroke();
        } else if (p.type === "dot") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.8, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Precise cross/plus — structural reference
          const arm = p.size * 5;
          ctx.beginPath();
          ctx.moveTo(-arm, 0);
          ctx.lineTo(arm, 0);
          ctx.moveTo(0, -arm);
          ctx.lineTo(0, arm);
          ctx.stroke();
        }
        ctx.restore();
      });

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(draw);
      }
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [active, reduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[10002]"
      style={{ opacity: active ? 1 : 0 }}
    />
  );
}

// ─── Grid Lines (architectural background detail) ────────────────────────────

function ArchGrid({ visible }: { visible: boolean }) {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 1.2 }}
      style={{
        backgroundImage: `
          linear-gradient(rgba(249,115,22,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(249,115,22,0.04) 1px, transparent 1px)
        `,
        backgroundSize: "80px 80px",
      }}
    />
  );
}

// ─── Phase type ───────────────────────────────────────────────────────────────

type Phase =
  | "intro"        // Cinematic entrance
  | "ready"        // CTA visible, waiting for user
  | "celebration"  // Grand opening sequence
  | "exit"         // Fading overlay into website
  | "done";        // Removed from DOM

// ─── Main Component ──────────────────────────────────────────────────────────

export default function GoLiveOverlay() {
  const [phase, setPhase] = useState<Phase | null>(null);
  const [showParticles, setShowParticles] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const reduced = useReducedMotion() ?? false;
  const ctaControls = useAnimationControls();
  const celebrationTimeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  // ── Initialise ───────────────────────────────────────────────────────────
  useEffect(() => {
    applyDevReset();
    if (!getLaunchSeen()) {
      setPhase("intro");
      const t = setTimeout(() => setPhase("ready"), reduced ? 1200 : 3800);
      return () => clearTimeout(t);
    }
  }, [reduced]);

  // ── CTA click: trigger celebration ───────────────────────────────────────
  const handleEnter = useCallback(async () => {
    if (phase !== "ready") return;
    setPhase("celebration");

    await ctaControls.start({
      scale: [1, 0.95, 1.04, 1],
      transition: { duration: 0.35, ease: "easeInOut" },
    });

    const add = (fn: () => void, ms: number) => {
      const t = setTimeout(fn, ms);
      celebrationTimeouts.current.push(t);
    };

    add(() => setShowParticles(true), reduced ? 100 : 200);
    add(() => setShowCongrats(true), reduced ? 600 : 1200);
    add(() => {
      setShowParticles(false);
      setPhase("exit");
    }, reduced ? 1800 : 3600);
    add(() => {
      setLaunchSeen();
      setPhase("done");
    }, reduced ? 2400 : 4800);
  }, [phase, ctaControls, reduced]);

  // ── Keyboard: Enter/Space activates CTA ──────────────────────────────────
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleEnter();
      }
    },
    [handleEnter]
  );

  // ── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      celebrationTimeouts.current.forEach(clearTimeout);
    };
  }, []);

  if (phase === null || phase === "done") return null;

  const isCelebrating = phase === "celebration" || phase === "exit";
  const isExiting = phase === "exit";

  return (
    <>
      {/* Precision particle canvas */}
      <ParticleCanvas active={showParticles} reduced={reduced} />

      <AnimatePresence>
        {(phase === "intro" || phase === "ready" || phase === "celebration" || phase === "exit") && (
          <motion.div
            key="go-live-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Gremake is Live — Grand Opening"
            initial={{ opacity: 0 }}
            animate={{ opacity: isExiting ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: isExiting ? (reduced ? 0.6 : 1.6) : (reduced ? 0.4 : 0.8), ease: "easeInOut" }}
            className="fixed inset-0 z-[10001] flex items-center justify-center overflow-hidden"
            style={{
              background:
                "radial-gradient(ellipse 120% 100% at 50% 60%, rgba(15,10,5,0.97) 0%, rgba(8,6,3,0.99) 70%, #000 100%)",
            }}
          >
            {/* Architectural grid background */}
            <ArchGrid visible={phase === "ready" || phase === "celebration"} />

            {/* Ambient glow */}
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{
                opacity: isCelebrating ? [0.18, 0.38, 0.22] : 0.12,
                scale: isCelebrating ? [1.0, 1.6, 1.2] : 1.0,
              }}
              transition={{
                opacity: { duration: isCelebrating ? 1.2 : 2.0, delay: 0.4, ease: "easeOut" },
                scale: { duration: isCelebrating ? 1.2 : 2.0, delay: 0.4, ease: "easeOut" },
              }}
              style={{
                width: "min(700px, 90vw)",
                height: "min(700px, 90vw)",
                background: `radial-gradient(ellipse at center, ${ACCENT}33 0%, ${ACCENT}11 40%, transparent 70%)`,
                filter: "blur(40px)",
              }}
            />

            {/* Celebration halo burst */}
            <AnimatePresence>
              {isCelebrating && !isExiting && (
                <motion.div
                  aria-hidden="true"
                  key="celebration-halo"
                  className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: [0, 0.5, 0.2, 0], scale: [0.5, 1.8, 2.4, 3.0] }}
                  transition={{ duration: 2.0, ease: "easeOut" }}
                  style={{
                    width: "min(500px, 80vw)",
                    height: "min(500px, 80vw)",
                    background: `radial-gradient(ellipse at center, ${ACCENT}22 0%, transparent 60%)`,
                    filter: "blur(24px)",
                  }}
                />
              )}
            </AnimatePresence>

            {/* Content */}
            <div className="relative z-10 flex w-full max-w-3xl flex-col items-center px-6 text-center">

              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, scale: reduced ? 1 : 0.88, filter: "blur(6px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: reduced ? 0.4 : 1.0, delay: reduced ? 0.05 : 0.3, ease: EASE_OUT_EXPO }}
                className="mb-10"
              >
                <motion.div
                  animate={
                    isCelebrating && !isExiting
                      ? {
                          scale: [1, 1.08, 1.04],
                          filter: [
                            `drop-shadow(0 0 0px ${ACCENT}00)`,
                            `drop-shadow(0 0 24px ${ACCENT}88)`,
                            `drop-shadow(0 0 12px ${ACCENT}44)`,
                          ],
                        }
                      : {}
                  }
                  transition={{ duration: 0.9, ease: "easeOut" }}
                >
                  <svg
                    width="52"
                    height="52"
                    viewBox="0 0 52 52"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-label="Gremake"
                  >
                    <rect x="1" y="1" width="50" height="50" rx="6" stroke={ACCENT} strokeWidth="1.5" fill="none" />
                    <path
                      d="M34 20H26C22.686 20 20 22.686 20 26C20 29.314 22.686 32 26 32H34V26H28"
                      stroke={ACCENT}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                    <line x1="6" y1="6" x2="12" y2="6" stroke={ACCENT} strokeWidth="1" opacity="0.4" />
                    <line x1="6" y1="6" x2="6" y2="12" stroke={ACCENT} strokeWidth="1" opacity="0.4" />
                    <line x1="46" y1="46" x2="40" y2="46" stroke={ACCENT} strokeWidth="1" opacity="0.4" />
                    <line x1="46" y1="46" x2="46" y2="40" stroke={ACCENT} strokeWidth="1" opacity="0.4" />
                  </svg>
                </motion.div>
              </motion.div>

              {/* Staggered content blocks */}
              <AnimatePresence mode="wait">
                {!isCelebrating && (
                  <motion.div
                    key="intro-content"
                    className="flex flex-col items-center"
                    exit={{
                      opacity: 0,
                      y: -16,
                      filter: "blur(8px)",
                      transition: { duration: 0.5, ease: "easeIn" },
                    }}
                  >
                    {/* Eyebrow */}
                    <motion.p
                      initial={{ opacity: 0, y: reduced ? 0 : 12, filter: "blur(4px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ duration: reduced ? 0.4 : 0.9, delay: reduced ? 0.1 : 0.8, ease: EASE_OUT_EXPO }}
                      className="mb-6 text-xs font-semibold tracking-[0.35em] uppercase"
                      style={{ color: ACCENT }}
                    >
                      The Wait Is Over
                    </motion.p>

                    {/* Headline */}
                    <motion.h1
                      initial={{ opacity: 0, y: reduced ? 0 : 24, filter: "blur(8px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ duration: reduced ? 0.5 : 1.1, delay: reduced ? 0.2 : 1.3, ease: EASE_OUT_EXPO }}
                      className="mb-5 text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl"
                    >
                      Gremake{" "}
                      <span
                        className="relative inline-block"
                        style={{
                          backgroundImage: `linear-gradient(135deg, #fff 30%, ${ACCENT} 100%)`,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        is Live.
                      </span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                      initial={{ opacity: 0, y: reduced ? 0 : 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: reduced ? 0.4 : 0.9, delay: reduced ? 0.3 : 2.0, ease: EASE_OUT_EXPO }}
                      className="mb-12 max-w-md text-base font-light leading-relaxed text-white/50 sm:text-lg"
                    >
                      Construction management, reimagined.
                    </motion.p>

                    {/* CTA */}
                    <motion.div
                      initial={{ opacity: 0, y: reduced ? 0 : 16, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: reduced ? 0.4 : 0.8, delay: reduced ? 0.4 : 2.7, ease: EASE_OUT_EXPO }}
                    >
                      <motion.button
                        animate={ctaControls}
                        onClick={handleEnter}
                        onKeyDown={handleKeyDown}
                        tabIndex={0}
                        aria-label="Enter Gremake"
                        className="group relative overflow-hidden rounded-full px-9 py-4 text-sm font-semibold tracking-wide text-white outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: "spring", stiffness: 400, damping: 22 }}
                        style={{
                          background: `linear-gradient(135deg, ${ACCENT}cc, ${ACCENT})`,
                          boxShadow: `0 0 0 1px ${ACCENT}44, 0 8px 32px ${ACCENT}33`,
                        }}
                      >
                        <motion.span
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 rounded-full opacity-0 group-hover:opacity-100"
                          style={{
                            background: `radial-gradient(ellipse at 50% 0%, ${ACCENT}55 0%, transparent 70%)`,
                          }}
                          transition={{ duration: 0.3 }}
                        />
                        <span className="relative z-10">Enter Gremake</span>
                      </motion.button>
                    </motion.div>

                    {/* Bottom accent line */}
                    <motion.div
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: 1 }}
                      transition={{
                        delay: reduced ? 0.5 : 3.1,
                        duration: reduced ? 0.3 : 0.8,
                        ease: EASE_OUT_EXPO,
                      }}
                      className="mt-14 h-px w-24 origin-center"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${ACCENT}66, transparent)`,
                      }}
                    />
                  </motion.div>
                )}

                {/* Congratulations panel */}
                {isCelebrating && showCongrats && !isExiting && (
                  <motion.div
                    key="congrats-content"
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, scale: reduced ? 1 : 0.94, filter: "blur(10px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, transition: { duration: 0.4 } }}
                    transition={{ duration: reduced ? 0.4 : 0.9, ease: EASE_OUT_EXPO }}
                  >
                    <motion.p
                      className="mb-4 text-xs font-semibold tracking-[0.35em] uppercase"
                      style={{ color: ACCENT }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      Officially Launched
                    </motion.p>

                    <motion.h2
                      className="mb-4 text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15, duration: 0.8, ease: EASE_OUT_EXPO }}
                    >
                      Congratulations.
                    </motion.h2>

                    <motion.p
                      className="text-xl font-light text-white/60 sm:text-2xl"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.8, ease: EASE_OUT_EXPO }}
                    >
                      Gremake is officially live.
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom precision bar */}
            <motion.div
              aria-hidden="true"
              className="absolute bottom-0 left-0 right-0 h-px"
              style={{
                background: `linear-gradient(90deg, transparent 0%, ${ACCENT}44 50%, transparent 100%)`,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: reduced ? 0.3 : 1.0, duration: 0.8 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
