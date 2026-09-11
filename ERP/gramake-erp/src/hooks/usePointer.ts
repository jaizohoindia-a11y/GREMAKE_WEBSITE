import { useEffect } from "react";
import { useMotionValue, useSpring, type SpringOptions } from "framer-motion";

const listeners = new Set<(x: number, y: number) => void>();
let started = false;

function ensureListening() {
  if (started) return;
  started = true;
  window.addEventListener("mousemove", (e) => {
    listeners.forEach((fn) => fn(e.clientX, e.clientY));
  });
}

/** Shared raw pointer position in viewport coordinates — one mousemove listener for every consumer. */
export function useRawPointer() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    ensureListening();
    const fn = (px: number, py: number) => {
      x.set(px);
      y.set(py);
    };
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  }, [x, y]);

  return { x, y };
}

/** Spring-smoothed pointer position, for trailing follow effects. */
export function useSpringPointer(options: SpringOptions = { stiffness: 300, damping: 30 }) {
  const { x, y } = useRawPointer();
  const springX = useSpring(x, options);
  const springY = useSpring(y, options);
  return { x: springX, y: springY };
}
