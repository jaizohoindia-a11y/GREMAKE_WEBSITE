import RevealText from "../components/RevealText";
import Reveal from "../components/Reveal";

const audiences = [
  {
    title: "Construction Companies",
    desc: "From small builders to large developers — every size, one system.",
  },
  {
    title: "Developers & Contractors",
    desc: "Real estate developers, infrastructure firms, and civil contractors.",
  },
  {
    title: "Project & Site Teams",
    desc: "Project managers, site engineers, and quantity surveyors in the field.",
  },
  {
    title: "Finance & HR",
    desc: "Finance managers, accountants, and HR teams running the back office.",
  },
  {
    title: "Business Owners & CEOs",
    desc: "Live data on the business, from any device, anywhere.",
  },
];

export default function WhoItsFor() {
  return (
    <section id="who-its-for" className="px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.3em] text-accent">
          Who it's for
        </p>
        <RevealText
          as="h2"
          mode="words"
          className="mx-auto max-w-3xl text-center font-display text-4xl font-bold leading-tight text-ink sm:text-5xl"
        >
          Built for everyone on the job
        </RevealText>

        <div className="mt-16 flex flex-col divide-y divide-ink/10 border-y border-ink/10">
          {audiences.map((a, i) => (
            <Reveal
              key={a.title}
              delay={i * 80}
              className="grid gap-2 py-8 sm:grid-cols-[100px_1fr_2fr] sm:items-center sm:gap-8"
            >
              <span className="font-display text-sm text-ink/30">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-xl font-semibold text-ink">
                {a.title}
              </h3>
              <p className="text-sm leading-relaxed text-ink/60">{a.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
