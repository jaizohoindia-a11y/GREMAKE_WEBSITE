import { useRef, useState, type ReactNode } from "react";
import gsap from "gsap";

export default function HoverCard({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [spot, setSpot] = useState({ x: 50, y: 50 });
  const [hovering, setHovering] = useState(false);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(hover: none)").matches) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setSpot({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
    gsap.to(el, {
      rotateX: py * -5,
      rotateY: px * 5,
      y: -4,
      duration: 0.4,
      ease: "power2.out",
      transformPerspective: 700,
    });
  }

  function handleLeave() {
    const el = ref.current;
    if (!el) return;
    setHovering(false);
    gsap.to(el, { rotateX: 0, rotateY: 0, y: 0, duration: 0.5, ease: "power3.out" });
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={handleLeave}
      className={`relative overflow-hidden ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: hovering ? 1 : 0,
          background: `radial-gradient(220px circle at ${spot.x}% ${spot.y}%, color-mix(in srgb, var(--color-brand) 12%, transparent), transparent 70%)`,
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
