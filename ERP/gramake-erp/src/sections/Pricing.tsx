import { Link } from "react-router-dom";
import RevealText from "../components/RevealText";
import MagneticButton from "../components/MagneticButton";
import Reveal from "../components/Reveal";

export default function Pricing() {
  return (
    <section id="pricing" className="px-6 py-28">
      <Reveal className="mx-auto max-w-3xl rounded-3xl border border-ink/10 bg-gradient-to-br from-accent/5 to-brand/5 p-12 text-center shadow-sm">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
          Pricing
        </p>
        <RevealText
          as="h2"
          mode="words"
          className="font-display text-3xl font-bold leading-tight text-ink sm:text-4xl"
        >
          Build the ERP package that fits your business
        </RevealText>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-ink/60">
          Choose your team size and the capabilities you need. Your estimated investment updates instantly — no forms, no calls required to see indicative pricing.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <MagneticButton
            as={Link}
            to="/pricing"
            className="rounded-full bg-accent px-8 py-4 text-sm font-semibold text-paper"
          >
            Explore Pricing →
          </MagneticButton>
          <Link
            to="/request-demo"
            className="text-sm font-medium text-ink/60 hover:text-accent transition-colors"
          >
            Request a demo instead
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
