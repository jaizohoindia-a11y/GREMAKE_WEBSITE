import { ScanFace, WifiOff, BellRing } from "lucide-react";
import RevealText from "../components/RevealText";
import Reveal from "../components/Reveal";

const points = [
  {
    icon: ScanFace,
    title: "Biometric Login",
    desc: "Face ID on iPhone, fingerprint on Android — quick, secure access.",
  },
  {
    icon: WifiOff,
    title: "Works Offline",
    desc: "Keep logging site data with no signal. It syncs the moment you're back online.",
  },
  {
    icon: BellRing,
    title: "Real-Time Alerts",
    desc: "Approvals and notifications land the instant they're needed.",
  },
];

export default function MobileApps() {
  return (
    <section
      id="mobile"
      className="relative overflow-hidden px-6 py-28"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            Android &amp; iOS
          </p>
          <RevealText
            as="h2"
            mode="words"
            className="font-display text-4xl font-bold leading-tight text-ink sm:text-5xl"
          >
            Built for daily field use
          </RevealText>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-ink/60">
            Full feature parity with web, available on Google Play and the
            App Store. Dashboards, modules, and shortcuts — right from the
            home screen.
          </p>

          <div className="mt-10 space-y-6">
            {points.map(({ icon: Icon, title, desc }, i) => (
              <Reveal key={title} delay={i * 100} className="flex gap-4">
                <Icon className="mt-0.5 shrink-0 text-accent" size={22} strokeWidth={1.5} />
                <div>
                  <h3 className="font-display text-base font-semibold text-ink">
                    {title}
                  </h3>
                  <p className="mt-1 text-sm text-ink/60">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal
          delay={150}
          className="relative mx-auto aspect-[9/17] w-full max-w-xs rounded-[2.5rem] border border-ink/10 bg-gradient-to-b from-brand/30 to-transparent p-3 shadow-2xl"
        >
          <div className="flex h-full flex-col rounded-[2rem] bg-ink-soft p-5">
            <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-white/20" />
            <p className="text-xs text-paper/40">Good morning</p>
            <p className="font-display text-lg font-semibold text-paper">
              Project Dashboard
            </p>
            <div className="mt-6 space-y-3">
              {["Site Health", "Budget Used", "Open Issues"].map((label, i) => (
                <div
                  key={label}
                  className="rounded-xl border border-white/10 bg-white/5 p-3"
                >
                  <div className="flex items-center justify-between text-xs text-paper/50">
                    <span>{label}</span>
                    <span className="text-accent">{[92, 64, 3][i]}{i < 2 ? "%" : ""}</span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-white/10">
                    <div
                      className="h-1.5 rounded-full bg-accent"
                      style={{ width: `${[92, 64, 30][i]}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
