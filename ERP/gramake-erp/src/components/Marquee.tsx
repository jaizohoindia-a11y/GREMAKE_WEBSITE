import { useState } from "react";

export default function Marquee({
  text,
  reverse = false,
  className = "",
  duration,
}: {
  text: string;
  reverse?: boolean;
  className?: string;
  duration?: number; // seconds — overrides CSS default
}) {
  const [paused, setPaused] = useState(false);
  const items = Array(6).fill(text);

  return (
    <div
      className={`overflow-hidden whitespace-nowrap border-y border-ink/10 bg-ink text-paper ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className={`marquee-track py-3 ${reverse ? "is-reverse" : ""} ${paused ? "is-paused" : ""}`}
        style={duration ? { animationDuration: `${duration}s` } : undefined}
      >
        {[...items, ...items].map((t, i) => (
          <span
            key={i}
            className="mx-6 font-display text-sm font-medium uppercase tracking-widest text-paper/80"
          >
            {t} <span className="text-accent">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
