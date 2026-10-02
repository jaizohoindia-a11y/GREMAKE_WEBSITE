import { Link } from "react-router-dom";
import RevealText from "../components/RevealText";
import Reveal from "../components/Reveal";
import HoverCard from "../components/HoverCard";
import { verticals as canonicalVerticals } from "../lib/pricing";

// Page-specific marketing descriptions retained locally (not part of canonical config)
const descriptions: Record<string, string> = {
  construction:
    "Sites, projects, procurement, contractors, finance, billing, HR, and executive dashboards — fully live on Web, Android & iOS.",
  manufacturing:
    "Production orders, BOM, quality, machine operations, and inventory — built on the same Gremake ERP platform.",
  engineering:
    "Job work, machine utilisation, subcontracting, and cost control for engineering and fabrication shops.",
  auto_components:
    "Order book, dispatches, inventory, and receivables for component manufacturers and industrial suppliers.",
};

const verticalCards = canonicalVerticals.map((v) => ({
  id: v.id,
  name: v.name,
  // Preserve existing routes and links using canonical slug
  slug: `/industries/${v.slug}`,
  status: v.status === "live" ? "Live Now" : "Coming Soon",
  badgeTone: (v.status === "live" ? "live" : "soon"),
  description: descriptions[v.id] ?? "",
}));

export default function Industries() {
  return (
    <div className="min-h-screen bg-paper pt-28 pb-20 px-6">
      <div className="mx-auto max-w-6xl">
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.3em] text-accent">
          Industries
        </p>
        <RevealText
          as="h1"
          mode="words"
          className="mx-auto max-w-3xl text-center font-display text-4xl font-bold leading-tight text-ink sm:text-5xl"
        >
          {"One ERP platform.\nMultiple industries."}
        </RevealText>
        <Reveal
          as="p"
          delay={120}
          className="mx-auto mt-5 max-w-2xl text-center text-sm leading-relaxed text-ink/60"
        >
          Gremake is a multi-vertical ERP platform. Construction ERP is live
          today. Manufacturing, Engineering / Job Work, and Auto Components /
          Industrial Suppliers ERP are coming soon on the same backbone.
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {verticalCards.map((v, idx) => (
            <Reveal key={v.id} delay={idx * 80}>
              <HoverCard className="relative flex h-full flex-col justify-between rounded-2xl border border-ink/10 bg-brand/[0.03] p-6">
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="font-display text-xl font-semibold text-ink">
                      {v.name}
                    </h2>
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                        v.badgeTone === "live"
                          ? "bg-accent/15 text-accent border border-accent/40"
                          : "border border-accent/40 text-accent"
                      }`}
                    >
                      {v.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-ink/60">
                    {v.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <Link
                    to={v.slug}
                    className="text-sm font-semibold text-accent hover:text-accent/80"
                  >
                    View details
                  </Link>
                  {v.id === "construction" && (
                    <Link
                      to="/request-demo"
                      className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/40 hover:text-accent"
                    >
                      Request Construction ERP demo
                    </Link>
                  )}
                </div>
              </HoverCard>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
