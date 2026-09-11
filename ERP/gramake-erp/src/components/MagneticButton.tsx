import { useRef, type ReactNode, type ElementType } from "react";
import gsap from "gsap";

type Props = {
  as?: ElementType;
  href?: string;
  to?: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
};

export default function MagneticButton({
  as,
  className = "",
  children,
  ...rest
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const Tag = as ?? (rest.href ? "a" : "button");

  function handleMove(e: React.MouseEvent<HTMLElement>) {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(hover: none)").matches) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(el, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: "power2.out" });
  }

  function handleLeave() {
    const el = ref.current;
    if (!el) return;
    gsap.to(el, { x: 0, y: 0, duration: 0.4, ease: "power3.out" });
  }

  return (
    <Tag
      ref={ref as never}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      {...rest}
    >
      {children}
    </Tag>
  );
}
