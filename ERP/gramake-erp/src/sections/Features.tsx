import {
  HardHat,
  Building2,
  Package,
  Users,
  Wrench,
  Wallet,
  PhoneCall,
  Receipt,
  LayoutDashboard,
  CheckSquare,
  UserCog,
  ShieldCheck,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";
import RevealText from "../components/RevealText";
import HoverCard from "../components/HoverCard";

const modules = [
  {
    icon: HardHat,
    title: "Site Operations",
    desc: "Daily logs, site management, inspections, and progress photos.",
  },
  {
    icon: Building2,
    title: "Project Management",
    desc: "Dashboards, stages, milestones, and issue/punch-list tracking.",
  },
  {
    icon: Package,
    title: "Procurement & Materials",
    desc: "Purchase orders, BOQ, stock, GRNs, and full inventory ledger.",
  },
  {
    icon: Users,
    title: "Contractor & Labour",
    desc: "Subcontractor management, work orders, and attendance.",
  },
  {
    icon: Wrench,
    title: "Equipment Management",
    desc: "Registry, usage logs, and utilization dashboards.",
  },
  {
    icon: Wallet,
    title: "Finance & Cost Control",
    desc: "Cost ledger, budget vs actual, and live cash flow.",
  },
  {
    icon: PhoneCall,
    title: "Sales & Enquiry (CRM)",
    desc: "Enquiry capture, Kanban pipeline, and lead conversion.",
  },
  {
    icon: Receipt,
    title: "Billing & Invoicing",
    desc: "GST-compliant invoices, aging reports, and credit notes.",
  },
  {
    icon: LayoutDashboard,
    title: "Executive Dashboards",
    desc: "Project health, budget, procurement, and cash flow — CEO view.",
  },
  {
    icon: CheckSquare,
    title: "Approvals & Workflow",
    desc: "Multi-level approvals with a single approval centre inbox.",
  },
  {
    icon: UserCog,
    title: "HR & Employee Management",
    desc: "Leave, expense claims, travel requests, and payroll.",
  },
  {
    icon: ShieldCheck,
    title: "Access Control & Compliance",
    desc: "14+ role-based permissions, audit trails, and activity logs.",
  },
];

const gridVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 140, damping: 18 },
  },
};

export default function Features() {
  return (
    <section id="features" className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.3em] text-accent">
          Construction ERP — Live Now
        </p>
        <RevealText
          as="h2"
          mode="words"
          className="mx-auto max-w-3xl text-center font-display text-4xl font-bold leading-tight text-ink sm:text-5xl"
        >
          Every department, one platform
        </RevealText>
        <p className="mx-auto mt-4 max-w-xl text-center text-sm text-ink/50">
          All 12 modules below are fully live for construction companies today.
          Manufacturing &amp; Services verticals are coming soon.
        </p>

        <motion.div
          className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {modules.map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              variants={cardVariants}
              whileHover={{ y: -6, boxShadow: "0 20px 40px -20px rgba(94,53,177,0.25)" }}
            >
              <HoverCard className="rounded-2xl border border-ink/10 bg-brand/[0.03] p-6 transition-colors hover:border-brand-light/50">
                <motion.div
                  className="inline-block"
                  whileHover={{ rotate: 8, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <Icon className="text-accent" size={28} strokeWidth={1.5} />
                </motion.div>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/60">
                  {desc}
                </p>
              </HoverCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
