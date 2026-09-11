import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  as?: keyof typeof motion;
  className?: string;
  delay?: number;
  children: ReactNode;
};

const variants: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 120, damping: 18 },
  },
};

export default function Reveal({ as = "div", className = "", delay = 0, children }: Props) {
  const MotionTag = motion[as] as typeof motion.div;

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -10% 0px" }}
      transition={{ delay: delay / 1000 }}
    >
      {children}
    </MotionTag>
  );
}
