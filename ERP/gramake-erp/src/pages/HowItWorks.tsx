import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import RevealText from "../components/RevealText";
import MagneticButton from "../components/MagneticButton";
import Reveal from "../components/Reveal";

const steps = [
  {
    n: "01",
    title: "Capture",
    desc: "A customer enquiry comes in and enters the Sales pipeline — a Kanban board moving from Initial Contact to Site Visit, Proposal, Negotiation, and Won.",
    guideline: "Owned by: Sales / Sales Manager. Every enquiry is logged with source and value so nothing falls through.",
  },
  {
    n: "02",
    title: "Convert",
    desc: "A won lead converts directly into a Project, with stages and milestones set up from foundation to handover.",
    guideline: "Owned by: Project Manager. The project inherits the enquiry's history — no re-entering data.",
  },
  {
    n: "03",
    title: "Plan",
    desc: "The Quantity Surveyor builds the Bill of Quantities and material plan, and Finance sets the budget the project will be tracked against.",
    guideline: "Owned by: Quantity Surveyor, Finance Manager. BOQ and budget are locked in before execution starts.",
  },
  {
    n: "04",
    title: "Execute",
    desc: "Site Engineers log daily progress, attendance, material consumption, and equipment usage from the field — on web or mobile, even offline.",
    guideline: "Owned by: Site Engineer, Inventory Staff. Mobile app syncs automatically once back online.",
  },
  {
    n: "05",
    title: "Control",
    desc: "The cost ledger, budget-vs-actual analysis, approvals, and issue/punch-list tracking keep every project on schedule and on budget.",
    guideline: "Owned by: Project Manager, Finance Manager. Multi-level approvals route through a single Approval Centre inbox.",
  },
  {
    n: "06",
    title: "Bill",
    desc: "GRNs confirm delivered materials, invoices and credit notes go out to customers, and subcontractor payments are processed against completed work.",
    guideline: "Owned by: Accountant, Purchase Manager. GST-compliant templates, ready to print or send.",
  },
  {
    n: "07",
    title: "Oversee",
    desc: "Executive dashboards — Project Health, Budget Analysis, Cash Flow, Procurement, and Equipment Utilization — give leadership live visibility from any device.",
    guideline: "Owned by: Admin / CEO. Every action across the lifecycle is captured in the audit trail.",
  },
];

export default function HowItWorks() {
  const stepsRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: stepsRef,
    offset: ["start center", "end center"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="px-6 pb-28 pt-40">
      <div className="mx-auto max-w-4xl">
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.3em] text-accent">
          How it works
        </p>
        <RevealText
          as="h1"
          mode="words"
          className="mx-auto max-w-2xl text-center font-display text-4xl font-bold leading-tight text-ink sm:text-6xl"
        >
          One platform, from enquiry to handover
        </RevealText>
        <p className="mx-auto mt-6 max-w-xl text-center text-sm leading-relaxed text-ink/60">
          Gremake ERP follows your project's real lifecycle. Here's how data
          flows through the system, and who's responsible at each step.
        </p>

        <div ref={stepsRef} className="relative mt-20 space-y-16">
          <div className="absolute left-10 top-0 hidden h-full w-px bg-ink/10 sm:block" aria-hidden="true">
            <motion.div
              className="w-px bg-accent"
              style={{ scaleY: lineScale, transformOrigin: "top", height: "100%" }}
            />
          </div>

          {steps.map((s) => (
            <Reveal
              as="div"
              key={s.n}
              className="grid gap-6 border-t border-ink/10 pt-10 sm:grid-cols-[80px_1fr]"
            >
              <span className="font-display text-3xl font-bold text-brand-light/60">
                {s.n}
              </span>
              <div>
                <RevealText
                  as="h2"
                  mode="words"
                  className="font-display text-2xl font-semibold text-ink sm:text-3xl"
                >
                  {s.title}
                </RevealText>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink/60">
                  {s.desc}
                </p>
                <div className="mt-5 max-w-2xl rounded-xl border border-accent/20 bg-accent/5 px-5 py-4 text-xs leading-relaxed text-ink/70">
                  {s.guideline}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-20 text-center">
          <MagneticButton
            as={Link}
            to="/request-demo"
            className="inline-block rounded-full bg-accent px-8 py-4 text-sm font-semibold text-ink"
          >
            Request a Demo
          </MagneticButton>
        </div>
      </div>
    </div>
  );
}
