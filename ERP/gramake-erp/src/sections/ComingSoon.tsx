import { Factory, Briefcase, HardHat } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import RevealText from "../components/RevealText";
import HoverCard from "../components/HoverCard";

const liveVertical = {
  icon: HardHat,
  title: "Construction ERP",
  desc: "Sites, projects, procurement, contractors, finance, billing, HR, and executive dashboards — fully live on Web, Android & iOS.",
};

const verticals = [
  {
    icon: Factory,
    title: "Manufacturing ERP",
    desc: "Production orders, BOM, quality control, machine operations, and inventory.",
  },
  {
    icon: Briefcase,
    title: "Services ERP",
    desc: "Project timesheets, client billing, service contracts, and support ticketing.",
  },
];

const gridVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
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

export default function ComingSoon() {
  return (
    <section id="coming-soon" className="px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.3em] text-accent">
          Coming soon
        </p>
        <RevealText
          as="h2"
          mode="words"
          className="mx-auto max-w-2xl text-center font-display text-4xl font-bold leading-tight text-ink sm:text-5xl"
        >
          Three verticals. One platform.
        </RevealText>
        <p className="mx-auto mt-4 max-w-xl text-center text-sm text-ink/50">
          Construction is live today. Manufacturing and Services are on the way.
        </p>

        {/* Construction — Live */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 140, damping: 18 }}
          whileHover={{ y: -4, boxShadow: "0 20px 40px -20px rgba(94,53,177,0.3)" }}
        >
          <HoverCard className="relative overflow-hidden rounded-2xl border border-accent/30 bg-accent/5 p-8">
            <span className="absolute right-6 top-6 flex items-center gap-1.5 rounded-full bg-accent/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              Live Now
            </span>
            <motion.div
              className="inline-block"
              whileHover={{ rotate: 8, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <liveVertical.icon className="text-accent" size={32} strokeWidth={1.5} />
            </motion.div>
            <h3 className="mt-6 font-display text-2xl font-semibold text-ink">
              {liveVertical.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-ink/60">
              {liveVertical.desc}
            </p>
          </HoverCard>
        </motion.div>

        {/* Coming soon verticals */}
        <motion.div
          className="mt-6 grid gap-6 sm:grid-cols-2"
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {verticals.map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              variants={cardVariants}
              whileHover={{ y: -6, boxShadow: "0 20px 40px -20px rgba(94,53,177,0.25)" }}
            >
              <HoverCard className="relative overflow-hidden rounded-2xl border border-ink/10 bg-brand/[0.03] p-8">
                <span className="absolute right-6 top-6 rounded-full border border-accent/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-accent">
                  Coming soon
                </span>
                <motion.div
                  className="inline-block"
                  whileHover={{ rotate: 8, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <Icon className="text-accent" size={32} strokeWidth={1.5} />
                </motion.div>
                <h3 className="mt-6 font-display text-2xl font-semibold text-ink">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/60">
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
