import { useState } from "react";
import { Plus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import RevealText from "../components/RevealText";
import Reveal from "../components/Reveal";
import { site } from "../lib/siteConfig";

const faqs = [
  {
    q: "Is there a mobile app?",
    a: "Yes — Gremake ERP is available on both Android and iOS with full feature support, offline mode, and biometric login.",
  },
  {
    q: "Do I need to install anything?",
    a: "No. The web app works in any browser. The mobile apps are available on the App Store and Google Play.",
  },
  {
    q: "Is my data safe?",
    a: "Yes. Each company's data is fully isolated. We use encrypted authentication and role-based access control.",
  },
  {
    q: "Which industries does Gremake support?",
    a: "Currently the Construction ERP is live. Manufacturing and Services verticals are launching soon.",
  },
  {
    q: "Can I control who sees what?",
    a: "Absolutely. Gremake has 14+ predefined roles. You control exactly what each team member can access.",
  },
  {
    q: "How do I get started?",
    a: `Email us at ${site.email} and we'll set up your company account.`,
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="px-6 py-28">
      <div className="mx-auto max-w-3xl">
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.3em] text-accent">
          FAQ
        </p>
        <RevealText
          as="h2"
          mode="words"
          className="mx-auto max-w-xl text-center font-display text-4xl font-bold leading-tight text-ink sm:text-5xl"
        >
          Questions, answered
        </RevealText>

        <div className="mt-14 divide-y divide-ink/10 border-y border-ink/10">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal as="div" key={f.q} delay={i * 60}>
                <button
                  className="flex w-full items-center justify-between gap-4 py-6 text-left"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-base font-semibold text-ink sm:text-lg">
                    {f.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="shrink-0 text-accent"
                  >
                    <Plus size={20} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      style={{ overflow: "hidden" }}
                    >
                      <p className="pb-6 pr-10 text-sm leading-relaxed text-ink/60">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
