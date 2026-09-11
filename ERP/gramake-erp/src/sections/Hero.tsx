import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import RevealText from "../components/RevealText";
import MagneticButton from "../components/MagneticButton";
import Reveal from "../components/Reveal";
import Marquee from "../components/Marquee";
import { useSpringPointer } from "../hooks/usePointer";

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const { x: pointerX, y: pointerY } = useSpringPointer({ stiffness: 40, damping: 20 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.82]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const orbX = useTransform(pointerX, (v) => (v - window.innerWidth / 2) * 0.08);
  const orbY = useTransform(pointerY, (v) => (v - window.innerHeight / 2) * 0.08);

  return (
    <div ref={sectionRef}>
      <section
        id="hero"
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-24 text-center"
      >
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/4 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(94,53,177,0.18), transparent 65%)",
            x: orbX,
            y: orbY,
          }}
        />

        <Reveal as="div" className="relative z-10 mb-6 flex flex-wrap items-center justify-center gap-3">
          <span className="rounded-full bg-accent/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
            🏗️ Construction ERP — Live Now
          </span>
          <span className="rounded-full border border-ink/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-ink/50">
            Web · Android · iOS
          </span>
        </Reveal>

        <motion.div style={{ scale, opacity }} className="relative z-10 w-full">
          <RevealText
            as="h1"
            mode="words"
            eager
            className="mx-auto max-w-5xl font-display text-[13vw] font-bold leading-[0.95] tracking-tight text-ink sm:text-6xl md:text-7xl lg:text-8xl"
          >
            The ERP Built for Construction Companies
          </RevealText>
        </motion.div>

        <Reveal
          as="p"
          delay={200}
          className="relative z-10 mt-4 text-sm font-semibold tracking-wide text-ink/40"
        >
          Build Smarter. Manage Better.
        </Reveal>

        <Reveal
          as="p"
          delay={300}
          className="relative z-10 mt-6 max-w-2xl text-base leading-relaxed text-ink/60 sm:text-lg"
        >
          From site logs to CEO dashboards — Gremake connects your entire
          construction business in one platform. Web, Android, and iOS.
          Always in sync.
        </Reveal>

        <Reveal
          delay={450}
          className="relative z-10 mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <MagneticButton
            as={Link}
            to="/request-demo"
            className="rounded-full bg-accent px-8 py-4 text-sm font-semibold text-ink shadow-lg shadow-accent/30 transition-transform"
          >
            Request a Demo
          </MagneticButton>
          <MagneticButton
            as="a"
            href="#features"
            className="rounded-full border border-ink/15 px-8 py-4 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
          >
            See Features
          </MagneticButton>
        </Reveal>

        <motion.div
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-ink/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <span className="text-[11px] uppercase tracking-widest">
            Scroll to discover
          </span>
        </motion.div>
      </section>

      <Marquee text="Gremake ERP · Build Smarter · Manage Better · Construction — Live Now · Manufacturing Coming Soon · Services Coming Soon" duration={50} />
      <Marquee
        text="Web · Android · iOS — Always in Sync"
        reverse
        className="border-t-0 bg-ink-soft"
      />
    </div>
  );
}
