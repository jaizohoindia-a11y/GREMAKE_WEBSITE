import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import MagneticButton from "./MagneticButton";

const links = [
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Mobile Apps", href: "/#mobile" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

const menuVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const menuItemVariants: Variants = {
  hidden: { opacity: 0, y: -8 },
  visible: { opacity: 1, y: 0 },
};

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-paper/85 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link to="/" className="font-display text-xl font-bold text-ink">
          Gremake
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main" onMouseLeave={() => setHovered(null)}>
          {links.map((l) => {
            const isHashLink = l.href.startsWith("/#");
            const isActive = !isHashLink && location.pathname === l.href;
            const isHighlighted = hovered === l.href || (!hovered && isActive);
            const sharedProps = {
              key: l.href,
              className: "relative py-1 text-sm font-medium text-ink/70 transition-colors hover:text-accent",
              onMouseEnter: () => setHovered(l.href),
            };
            const underline = isHighlighted ? (
              <motion.span
                layoutId="nav-underline"
                className="absolute -bottom-1 left-0 h-[2px] w-full bg-accent"
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
              />
            ) : null;

            return isHashLink ? (
              <a {...sharedProps} href={l.href}>
                {l.label}
                {underline}
              </a>
            ) : (
              <Link {...sharedProps} to={l.href}>
                {l.label}
                {underline}
              </Link>
            );
          })}
        </nav>

        <MagneticButton
          as={Link}
          to="/request-demo"
          className="hidden rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-ink transition-transform md:inline-block"
        >
          Request a Demo
        </MagneticButton>

        <button
          className="text-ink md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
            className="bg-paper/95 backdrop-blur-md md:hidden"
          >
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-1 px-6 pb-6"
            >
              {links.map((l) => {
                const isHashLink = l.href.startsWith("/#");
                return isHashLink ? (
                  <motion.a
                    key={l.href}
                    href={l.href}
                    variants={menuItemVariants}
                    className="rounded-lg px-3 py-3 text-base font-medium text-ink/90 hover:bg-ink/5"
                  >
                    {l.label}
                  </motion.a>
                ) : (
                  <motion.div key={l.href} variants={menuItemVariants}>
                    <Link
                      to={l.href}
                      className="block rounded-lg px-3 py-3 text-base font-medium text-ink/90 hover:bg-ink/5"
                    >
                      {l.label}
                    </Link>
                  </motion.div>
                );
              })}
              <motion.div variants={menuItemVariants}>
                <Link
                  to="/request-demo"
                  className="mt-2 block rounded-full bg-accent px-5 py-3 text-center text-base font-semibold text-ink"
                >
                  Request a Demo
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
