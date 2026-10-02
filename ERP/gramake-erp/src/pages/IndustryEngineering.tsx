import RevealText from "../components/RevealText";
import Reveal from "../components/Reveal";
import HoverCard from "../components/HoverCard";

export default function IndustryEngineering() {
  return (
    <div className="min-h-screen bg-paper pt-28 pb-20 px-6">
      <div className="mx-auto max-w-5xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
          Industry · Engineering / Job Work
        </p>
        <RevealText
          as="h1"
          mode="words"
          className="max-w-2xl font-display text-4xl font-bold leading-tight text-ink sm:text-5xl"
        >
          Engineering / Job Work ERP
        </RevealText>
        <Reveal
          as="p"
          delay={120}
          className="mt-5 max-w-xl text-sm leading-relaxed text-ink/60"
        >
          Job work, machine utilisation, subcontracting, and cost control for
          engineering and fabrication shops — on the same Gremake ERP
          backbone.
        </Reveal>

        <Reveal delay={220}>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-accent/40 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-accent">
            Coming Soon
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <HoverCard className="rounded-2xl border border-ink/10 bg-brand/[0.03] p-6">
            <h2 className="font-display text-lg font-semibold text-ink">
              For job work and fabrication units
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/60">
              Track job work orders, machine utilisation, subcontracting, and
              delivery commitments while keeping finance and operations aligned
              in one ERP.
            </p>
          </HoverCard>
          <HoverCard className="rounded-2xl border border-ink/10 bg-brand/[0.03] p-6">
            <h2 className="font-display text-lg font-semibold text-ink">
              Built on the same Gremake platform
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/60">
              Engineering / Job Work ERP will reuse the same core platform
              that powers Construction ERP, so your teams can scale across
              verticals without switching systems.
            </p>
          </HoverCard>
        </div>

        <p className="mt-6 text-xs leading-relaxed text-ink/40">
          Pricing and Book Now will be introduced closer to launch. For now,
          reach out via the contact or demo forms if you&apos;d like to discuss
          Engineering / Job Work ERP.
        </p>
      </div>
    </div>
  );
}
