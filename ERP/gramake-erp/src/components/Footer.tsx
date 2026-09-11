import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { InstagramIcon, LinkedinIcon } from "./BrandIcons";
import { site } from "../lib/siteConfig";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink text-paper">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div>
            <Link to="/" className="font-display text-xl font-bold text-paper">
              Gremake
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-paper/60">
              Built by builders, for builders. The cloud ERP for construction
              companies.
            </p>
            <a
              href={`mailto:${site.email}`}
              className="mt-4 inline-flex items-center gap-2 text-sm text-paper/80 hover:text-accent"
            >
              <Mail size={16} /> {site.email}
            </a>
          </div>

          <div>
            <p className="text-sm font-semibold text-paper/90">Product</p>
            <ul className="mt-4 space-y-2 text-sm text-paper/60">
              <li>
                <a href="/#features" className="hover:text-accent">
                  Features
                </a>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-accent">
                  How It Works
                </Link>
              </li>
              <li>
                <a href="/#coming-soon" className="hover:text-accent">
                  Coming Soon
                </a>
              </li>
              <li>
                <a href="/#pricing" className="hover:text-accent">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-paper/90">Company</p>
            <ul className="mt-4 space-y-2 text-sm text-paper/60">
              <li>
                <a href="/#about" className="hover:text-accent">
                  About
                </a>
              </li>
              <li>
                <Link to="/contact" className="hover:text-accent">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/request-demo" className="hover:text-accent">
                  Request a Demo
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-paper/90">Follow</p>
            <div className="mt-4 flex gap-3">
              <a
                href={site.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="rounded-full border border-white/15 p-2 text-paper/70 transition-colors hover:border-accent hover:text-accent"
              >
                <InstagramIcon size={18} />
              </a>
              <a
                href={site.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="rounded-full border border-white/15 p-2 text-paper/70 transition-colors hover:border-accent hover:text-accent"
              >
                <LinkedinIcon size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-paper/40 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Gremake ERP. All rights reserved.</p>
          <p>Web · Android · iOS — always in sync.</p>
        </div>
      </div>
    </footer>
  );
}
