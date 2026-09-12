/**
 * PreLaunchScreen — Public "Launching Soon" gate
 *
 * Shown to ALL normal public visitors when launched=false.
 * No Nav, no Footer, no website content is rendered.
 * Lightweight — no heavy animations, no expensive imports.
 *
 * NOT accessible from this component: launch controls.
 * The private launch interface is accessed via ?launchMode=true.
 */

import { motion } from "framer-motion";

const ACCENT = "#f97316";

export default function PreLaunchScreen() {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={{
        background:
          "radial-gradient(ellipse 140% 120% at 50% 70%, rgba(12,8,4,0.98) 0%, rgba(5,3,1,0.99) 65%, #000 100%)",
      }}
      aria-label="Gremake — Launching Soon"
    >
      {/* Subtle ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: "min(600px, 85vw)",
          height: "min(600px, 85vw)",
          background: `radial-gradient(ellipse at center, ${ACCENT}18 0%, ${ACCENT}08 40%, transparent 70%)`,
          filter: "blur(50px)",
        }}
      />

      {/* Bottom precision bar */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${ACCENT}33 50%, transparent 100%)`,
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center px-8 text-center"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        {/* Logo mark */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 52 52"
            fill="none"
            aria-label="Gremake"
          >
            <rect
              x="1" y="1" width="50" height="50" rx="6"
              stroke={ACCENT} strokeWidth="1.5" fill="none"
            />
            <path
              d="M34 20H26C22.686 20 20 22.686 20 26C20 29.314 22.686 32 26 32H34V26H28"
              stroke={ACCENT} strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" fill="none"
            />
            <line x1="6" y1="6" x2="12" y2="6" stroke={ACCENT} strokeWidth="1" opacity="0.35" />
            <line x1="6" y1="6" x2="6" y2="12" stroke={ACCENT} strokeWidth="1" opacity="0.35" />
            <line x1="46" y1="46" x2="40" y2="46" stroke={ACCENT} strokeWidth="1" opacity="0.35" />
            <line x1="46" y1="46" x2="46" y2="40" stroke={ACCENT} strokeWidth="1" opacity="0.35" />
          </svg>
        </motion.div>

        {/* Brand name */}
        <motion.p
          className="mb-6 text-xs font-semibold tracking-[0.4em] uppercase"
          style={{ color: ACCENT }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          Gremake
        </motion.p>

        {/* Primary headline */}
        <motion.h1
          className="mb-5 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.8, ease: "easeOut" }}
        >
          Something powerful
          <br />
          <span
            className="relative inline-block"
            style={{
              backgroundImage: `linear-gradient(135deg, #fff 20%, ${ACCENT} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            is coming.
          </span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          className="mb-12 max-w-sm text-base font-light leading-relaxed text-white/45 sm:text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          Construction management, reimagined.
        </motion.p>

        {/* Launching Soon badge */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
        >
          <div
            className="inline-flex items-center gap-2 rounded-full border px-5 py-2 text-xs font-semibold tracking-[0.25em] uppercase text-white/60"
            style={{ borderColor: `${ACCENT}33` }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: ACCENT, opacity: 0.7 }}
            />
            Launching Soon
          </div>
        </motion.div>

        {/* Refined bottom line */}
        <motion.div
          className="mt-16 h-px w-16 origin-center"
          style={{
            background: `linear-gradient(90deg, transparent, ${ACCENT}55, transparent)`,
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.7, ease: "easeOut" }}
        />
      </motion.div>
    </div>
  );
}
