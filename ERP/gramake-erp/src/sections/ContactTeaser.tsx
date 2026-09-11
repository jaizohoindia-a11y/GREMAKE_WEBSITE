import { Link } from "react-router-dom";
import RevealText from "../components/RevealText";
import MagneticButton from "../components/MagneticButton";
import Reveal from "../components/Reveal";
import { site } from "../lib/siteConfig";

export default function ContactTeaser() {
  return (
    <section className="px-6 py-28">
      <div className="mx-auto max-w-4xl text-center">
        <RevealText
          as="h2"
          mode="words"
          className="font-display text-4xl font-bold leading-tight text-ink sm:text-6xl"
        >
          Ready to build smarter?
        </RevealText>
        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-ink/60">
          Email us at{" "}
          <a href={`mailto:${site.email}`} className="text-accent">
            {site.email}
          </a>{" "}
          or reach out below and we'll set up your company account.
        </p>
        <Reveal delay={150} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <MagneticButton
            as={Link}
            to="/contact"
            className="rounded-full bg-accent px-8 py-4 text-sm font-semibold text-ink"
          >
            Contact Us
          </MagneticButton>
          <MagneticButton
            as={Link}
            to="/request-demo"
            className="rounded-full border border-ink/15 px-8 py-4 text-sm font-semibold text-ink hover:border-accent hover:text-accent"
          >
            Request a Demo
          </MagneticButton>
        </Reveal>
      </div>
    </section>
  );
}
