import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRawPointer } from "../hooks/usePointer";

export default function CustomCursor() {
  const { x, y } = useRawPointer();
  const springX = useSpring(x, { stiffness: 500, damping: 40 });
  const springY = useSpring(y, { stiffness: 500, damping: 40 });
  const scale = useMotionValue(1);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;

    function handleMove(e: MouseEvent) {
      const target = e.target as HTMLElement;
      setHovering(!!target.closest("a, button, [role='button'], input, textarea, select"));
    }
    function handleDown() {
      scale.set(0.7);
    }
    function handleUp() {
      scale.set(1);
    }

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mousedown", handleDown);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [scale]);

  return (
    <motion.div
      className={`custom-cursor ${hovering ? "is-hovering" : ""}`}
      style={{ x: springX, y: springY, scale }}
      aria-hidden="true"
    />
  );
}
