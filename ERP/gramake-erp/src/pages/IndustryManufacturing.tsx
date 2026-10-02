import RevealText from "../components/RevealText";
import Reveal from "../components/Reveal";
import HoverCard from "../components/HoverCard";

export default function IndustryManufacturing() {
  return (
    <div className="min-h-screen bg-paper pt-28 pb-20 px-6">
      <div className="mx-auto max-w-5xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
          Industry · Manufacturing
        </p>
        <RevealText
          as="h1"
          mode="words"
          className="max-w-2xl font-display text-4xl font-bold leading-tight text-ink sm:text-5xl"
        >
          Manufacturing ERP
        </RevealText>
        <Reveal
          as="p"
          delay={120}
          className="mt-5 max-w-xl text-sm leading-relaxed text-ink/60"
        >
          Production orders, BOM, quality, machine operations, and inventory —
          built on the same Gremake ERP platform as Construction. Designed for
          discrete manufacturing teams planning their ERP rollout.
        </Reveal>

        <Reveal delay={220}>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-accent/40 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-accent">
            Coming Soon
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <HoverCard className="rounded-2xl border border-ink/10 bg-brand/[0.03] p-6">
            <h2 className="font-display text-lg font-semibold text-ink">
              Built for the shop floor and the CFO
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/60">
              Plan and track production orders, manage BOMs, and keep inventory
              aligned with actual consumption, while finance teams stay in
              sync on one ERP platform.
            </p>
          </HoverCard>
          <HoverCard className="rounded-2xl border border-ink/10 bg-brand/[0.03] p-6">
            <h2 className="font-display text-lg font-semibold text-ink">
              Join the early access list
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/60">
              Manufacturing ERP is in active product design. If you&apos;d like to
              explore whether Gremake is a fit for your plant, reach out via
              the contact or demo forms and mention Manufacturing ERP.
            </p>
          </HoverCard>
        </div>

        <p className="mt-6 text-xs leading-relaxed text-ink/40">
          Pricing and booking for Manufacturing ERP will be finalised closer to
          launch. No numeric pricing or Book Now is available yet.
        </p>
      </div>
    </div>
  );
}
