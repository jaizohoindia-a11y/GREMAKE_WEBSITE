import Reveal from "../components/Reveal";
import CountUp from "../components/CountUp";

const stats = [
  { value: 10, suffix: "+", label: "Modules covering every department" },
  { value: 14, suffix: "+", label: "User roles for precise access control" },
  { value: 3, suffix: "", label: "Platforms — Web, Android, iOS" },
  { value: 100, suffix: "%", label: "Cloud — no installation, no IT team" },
];

export default function Stats() {
  return (
    <section className="border-y border-ink/10 bg-brand/[0.03] px-6 py-16">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 sm:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 90} className="text-center">
            <CountUp
              value={s.value}
              suffix={s.suffix}
              className="font-display text-4xl font-bold text-accent sm:text-5xl"
            />
            <p className="mt-2 text-xs leading-relaxed text-ink/60">
              {s.label}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
