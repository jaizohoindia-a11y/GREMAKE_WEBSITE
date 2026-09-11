import RevealText from "../components/RevealText";

export default function About() {
  return (
    <section id="about" className="relative px-6 py-32">
      <div className="mx-auto max-w-4xl text-center">
        <p className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
          Our story
        </p>
        <RevealText
          as="h2"
          mode="lines"
          className="font-display text-3xl font-bold leading-tight text-ink sm:text-5xl"
        >
          {"Built by builders,\nfor builders."}
        </RevealText>
        <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-ink/60">
          Gremake started with a simple frustration: construction teams were
          running on ten different apps and one shared spreadsheet. We built
          the ERP we wished existed — one platform connecting sites, finance,
          procurement, HR, and the CEO's dashboard, in real time, on any
          device.
        </p>
      </div>
    </section>
  );
}
