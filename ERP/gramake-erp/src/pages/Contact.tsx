import { useState, type FormEvent } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import RevealText from "../components/RevealText";
import MagneticButton from "../components/MagneticButton";
import { FieldWrap, TextInput, TextArea, Select } from "../components/FormField";
import { InstagramIcon, LinkedinIcon } from "../components/BrandIcons";
import { site } from "../lib/siteConfig";
import { submitGeneralEnquiry } from "../utils/api";

const companySizes = ["1-10", "11-50", "51-200", "201-500", "500+"];

type Status = "idle" | "submitting" | "success" | "error";

const formVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 160, damping: 20 } },
};

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    const form = e.currentTarget;
    const fd = new FormData(form);

    try {
      const result = await submitGeneralEnquiry({
        name: String(fd.get("name") ?? ""),
        companyName: String(fd.get("company") ?? ""),
        email: String(fd.get("email") ?? ""),
        phone: String(fd.get("phone") ?? ""),
        subject: "General Enquiry",
        vertical: "construction",
        message: String(fd.get("message") ?? ""),
        honeypot: "",
      });
      if (result.success) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="px-6 pb-28 pt-40">
      <div className="mx-auto max-w-6xl">
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.3em] text-accent">
          Contact
        </p>
        <RevealText
          as="h1"
          mode="words"
          className="mx-auto max-w-2xl text-center font-display text-4xl font-bold leading-tight text-ink sm:text-6xl"
        >
          Get in touch with Gremake
        </RevealText>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          {/* Company details panel */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-ink/10 bg-brand/[0.03] p-8">
              <h2 className="font-display text-lg font-semibold text-ink">
                Gremake ERP
              </h2>
              <ul className="mt-6 space-y-5 text-sm text-ink/70">
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 shrink-0 text-accent" size={18} />
                  <span>{site.address}</span>
                </li>
                <li className="flex gap-3">
                  <Phone className="mt-0.5 shrink-0 text-accent" size={18} />
                  <a href={`tel:${site.phone}`} className="hover:text-accent">
                    {site.phone}
                  </a>
                </li>
                <li className="flex gap-3">
                  <Mail className="mt-0.5 shrink-0 text-accent" size={18} />
                  <a href={`mailto:${site.email}`} className="hover:text-accent">
                    {site.email}
                  </a>
                </li>
                <li className="flex gap-3">
                  <InstagramIcon className="mt-0.5 shrink-0 text-accent" size={18} />
                  <a
                    href={site.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-accent"
                  >
                    Instagram
                  </a>
                </li>
                <li className="flex gap-3">
                  <LinkedinIcon className="mt-0.5 shrink-0 text-accent" size={18} />
                  <a
                    href={site.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-accent"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
            <p className="px-2 text-xs leading-relaxed text-ink/40">
              Address, phone, Instagram and LinkedIn shown above are
              placeholders pending final company details.
            </p>
          </div>

          {/* Contact form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-2xl border border-ink/10 bg-brand/[0.03] p-8"
            variants={formVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div variants={rowVariants} className="grid gap-5 sm:grid-cols-2">
              <FieldWrap label="Name" name="name" required>
                <TextInput id="name" name="name" required autoComplete="name" />
              </FieldWrap>
              <FieldWrap label="Company Name" name="company" required>
                <TextInput id="company" name="company" required />
              </FieldWrap>
            </motion.div>
            <motion.div variants={rowVariants} className="grid gap-5 sm:grid-cols-2">
              <FieldWrap label="Email" name="email" required>
                <TextInput
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                />
              </FieldWrap>
              <FieldWrap label="Phone" name="phone">
                <TextInput id="phone" name="phone" type="tel" autoComplete="tel" />
              </FieldWrap>
            </motion.div>
            <motion.div variants={rowVariants}>
              <FieldWrap label="Company Size" name="companySize">
                <Select id="companySize" name="companySize" defaultValue="">
                  <option value="" disabled>
                    Select company size
                  </option>
                  {companySizes.map((s) => (
                    <option key={s} value={s}>
                      {s} employees
                    </option>
                  ))}
                </Select>
              </FieldWrap>
            </motion.div>
            <motion.div variants={rowVariants}>
              <FieldWrap label="Message / Requirements" name="message" required>
                <TextArea id="message" name="message" required />
              </FieldWrap>
            </motion.div>

            <motion.div variants={rowVariants}>
              <MagneticButton
                as="button"
                type="submit"
                disabled={status === "submitting"}
                className="mt-2 w-full rounded-full bg-accent px-8 py-4 text-sm font-semibold text-ink disabled:opacity-60"
              >
                {status === "submitting" ? "Sending..." : "Send Message"}
              </MagneticButton>
            </motion.div>

            {status === "success" && (
              <p className="text-sm text-green-600">
                Thanks — we've received your message and will be in touch soon.
              </p>
            )}
            {status === "error" && (
              <p className="text-sm text-red-600">
                Something went wrong sending this. Please email us directly at{" "}
                {site.email}.
              </p>
            )}
          </motion.form>
        </div>
      </div>
    </div>
  );
}
