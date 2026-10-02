import { Link } from "react-router-dom";
import RevealText from "../components/RevealText";
import Reveal from "../components/Reveal";
import HoverCard from "../components/HoverCard";

export default function IndustryConstruction() {
  return (
    <div className="min-h-screen bg-paper pt-28 pb-20 px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 lg:flex-row">
        <div className="lg:w-3/5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            Industry · Construction
          </p>
          <RevealText
            as="h1"
            mode="words"
            className="max-w-2xl font-display text-4xl font-bold leading-tight text-ink sm:text-5xl"
          >
            Construction ERP
          </RevealText>
          <Reveal
            as="p"
            delay={120}
            className="mt-5 max-w-xl text-sm leading-relaxed text-ink/60"
          >
            Sites, projects, procurement, contractors, finance, billing, HR,
            and executive dashboards — fully live on Web, Android & iOS.
            Built for construction companies that need one connected ERP.
          </Reveal>

          <Reveal delay={220}>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent/15 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              Live Now
            </div>
          </Reveal>

          <Reveal delay={280}>
            <div className="mt-8 flex flex-wrap gap-3 text-xs text-ink/50">
              <span className="rounded-full border border-ink/15 px-3 py-1">
                Project & Site Management
              </span>
              <span className="rounded-full border border-ink/15 px-3 py-1">
                BOQ, Materials & Procurement
              </span>
              <span className="rounded-full border border-ink/15 px-3 py-1">
                Finance, Billing & HR
              </span>
              <span className="rounded-full border border-ink/15 px-3 py-1">
                Executive Dashboards
              </span>
            </div>
          </Reveal>

          <Reveal delay={340}>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/request-demo"
                className="rounded-full bg-accent px-7 py-3 text-sm font-semibold text-ink shadow-lg shadow-accent/30"
              >
                Request Construction ERP demo
              </Link>
              <Link
                to="/pricing"
                className="rounded-full border border-ink/15 px-7 py-3 text-sm font-semibold text-ink hover:border-accent hover:text-accent"
              >
                View pricing & configuration
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="lg:w-2/5">
          <HoverCard className="h-full rounded-2xl border border-ink/10 bg-brand/[0.03] p-6">
            <h2 className="font-display text-lg font-semibold text-ink">
              Why Construction ERP first?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/60">
              Gremake started in construction — working with real projects,
              project managers, site engineers, and finance teams. The
              construction vertical is our first fully live implementation of
              the Gremake ERP platform.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-ink/60">
              The same backbone will power Manufacturing, Engineering / Job
              Work, and Auto Components / Industrial Suppliers ERP, so your
              organisation can scale across businesses while staying on one
              platform.
            </p>
          </HoverCard>
        </div>
      </div>
    </div>
  );
}
