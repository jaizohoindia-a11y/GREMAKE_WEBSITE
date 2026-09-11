import { motion, type Variants } from "framer-motion";

type Props = {
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  children: string;
  /** "words" staggers word-by-word (headlines), "lines" staggers whole lines (paragraphs) */
  mode?: "words" | "lines";
  /** Play immediately on mount instead of waiting for scroll-into-view (e.g. above-the-fold hero text) */
  eager?: boolean;
};

const container = (stagger: number): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger } },
});

const unitVariants: Variants = {
  hidden: { y: "110%" },
  visible: {
    y: "0%",
    transition: { type: "spring", stiffness: 140, damping: 16, mass: 0.6 },
  },
};

export default function RevealText({
  as = "h2",
  className = "",
  children,
  mode = "words",
  eager = false,
}: Props) {
  const Tag = motion[as];

  const units =
    mode === "words"
      ? children.split(" ").filter(Boolean)
      : children.split(/\n+/).filter(Boolean);

  const stagger = mode === "words" ? 0.045 : 0.1;
  const viewportProps = eager
    ? {}
    : { whileInView: "visible" as const, viewport: { once: true, amount: 0.3 } };

  return (
    <Tag
      className={className}
      variants={container(stagger)}
      initial="hidden"
      animate={eager ? "visible" : undefined}
      {...viewportProps}
    >
      {units.map((unit, i) => (
        <span
          key={i}
          style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top" }}
        >
          <motion.span
            variants={unitVariants}
            style={{ display: mode === "words" ? "inline-block" : "block" }}
          >
            {unit}
            {mode === "words" && i < units.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
