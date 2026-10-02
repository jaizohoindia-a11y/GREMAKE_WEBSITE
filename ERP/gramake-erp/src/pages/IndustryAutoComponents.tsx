import RevealText from "../components/RevealText";
import Reveal from "../components/Reveal";
import HoverCard from "../components/HoverCard";

export default function IndustryAutoComponents() {
  return (
    <div className="min-h-screen bg-paper pt-28 pb-20 px-6">
      <div className="mx-auto max-w-5xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
          Industry · Auto Components / Industrial Suppliers
        </p>
        <RevealText
          as="h1"
          mode="words"
          className="max-w-2xl font-display text-4xl font-bold leading-tight text-ink sm:text-5xl"
        >
          Auto Components / Industrial Suppliers ERP
        </RevealText>
        <Reveal
          as="p"
          delay={120}
          className="mt-5 max-w-xl text-sm leading-relaxed text-ink/60"
        >
          Order book, dispatches, inventory, and receivables for component
          manufacturers and industrial suppliers — coming soon on the Gremake
          ERP platform.
        </Reveal>

        <Reveal delay={220}>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-accent/40 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-accent">
            Coming Soon
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <HoverCard className="rounded-2xl border border-ink/10 bg-brand/[0.03] p-6">
            <h2 className="font-display text-lg font-semibold text-ink">
              Designed for OEM suppliers and distributors
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/60">
              Keep track of customer schedules, dispatches, and inventory while
              finance teams stay on top of receivables and credit exposure.
            </p>
          </HoverCard>
          <HoverCard className="rounded-2xl border border-ink/10 bg-brand/[0.03] p-6">
            <h2 className="font-display text-lg font-semibold text-ink">
              Join the early conversations
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/60">
              Auto Components / Industrial Suppliers ERP is planned as a
              coming-soon vertical. If you&apos;d like to shape the roadmap, get in
              touch via the contact or demo forms and mention this vertical.
            </p>
          </HoverCard>
        </div>

        <p className="mt-6 text-xs leading-relaxed text-ink/40">
          No numeric pricing or Book Now is available for this vertical yet.
          Commercial details will be finalised closer to launch.
        </p>
      </div>
    </div>
  );
}
