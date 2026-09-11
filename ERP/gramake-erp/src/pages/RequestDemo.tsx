import { useState, type FormEvent } from "react";
import { CloudCheck, Smartphone, ShieldCheck } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import RevealText from "../components/RevealText";
import MagneticButton from "../components/MagneticButton";
import { FieldWrap, TextInput, TextArea, Select } from "../components/FormField";
import { site, timezones, defaultTimezone } from "../lib/siteConfig";
import { submitDemoRequest } from "../utils/api";

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

const trustBadges = [
  { icon: CloudCheck, label: "100% Cloud" },
  { icon: Smartphone, label: "Web · Android · iOS" },
  { icon: ShieldCheck, label: "Role-based access" },
];

export default function RequestDemo() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    const form = e.currentTarget;
    const fd = new FormData(form);

    try {
      const result = await submitDemoRequest({
        name: String(fd.get("name") ?? ""),
        companyName: String(fd.get("company") ?? ""),
        email: String(fd.get("email") ?? ""),
        phone: String(fd.get("phone") ?? ""),
        subject: "Product Demo Request",
        vertical: "construction",
        message: `Preferred time: ${String(fd.get("preferredTime") ?? "Not specified")}. Company size: ${String(fd.get("companySize") ?? "Not specified")}. Timezone: ${String(fd.get("timezone") ?? "IST")}. ${String(fd.get("message") ?? "")}`.trim(),
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
      <div className="mx-auto max-w-4xl">
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.3em] text-accent">
          Request a Demo
        </p>
        <RevealText
          as="h1"
          mode="words"
          className="mx-auto max-w-2xl text-center font-display text-4xl font-bold leading-tight text-ink sm:text-6xl"
        >
          See Gremake ERP in action
        </RevealText>
        <p className="mx-auto mt-6 max-w-md text-center text-sm leading-relaxed text-ink/60">
          Tell us a bit about your business and preferred time — we'll reach
          out within 1 business day to schedule a walkthrough.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
          {trustBadges.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 text-xs text-ink/50"
            >
              <Icon size={16} className="text-accent" />
              {label}
            </div>
          ))}
        </div>

        <motion.form
          onSubmit={handleSubmit}
          className="mt-14 space-y-5 rounded-2xl border border-ink/10 bg-brand/[0.03] p-8"
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
          <motion.div variants={rowVariants} className="grid gap-5 sm:grid-cols-2">
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
            <FieldWrap label="Timezone" name="timezone" required>
              <Select id="timezone" name="timezone" defaultValue={defaultTimezone}>
                {timezones.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </Select>
            </FieldWrap>
          </motion.div>
          <motion.div variants={rowVariants}>
            <FieldWrap label="Preferred Demo Date / Time" name="preferredTime">
              <TextInput
                id="preferredTime"
                name="preferredTime"
                placeholder="e.g. Thu 14 Aug, 3:00 PM"
              />
            </FieldWrap>
          </motion.div>
          <motion.div variants={rowVariants}>
            <FieldWrap label="What are you looking to solve?" name="message">
              <TextArea id="message" name="message" />
            </FieldWrap>
          </motion.div>

          <motion.div variants={rowVariants}>
            <MagneticButton
              as="button"
              type="submit"
              disabled={status === "submitting"}
              className="mt-2 w-full rounded-full bg-accent px-8 py-4 text-sm font-semibold text-ink disabled:opacity-60"
            >
              {status === "submitting" ? "Sending..." : "Request Demo"}
            </MagneticButton>
          </motion.div>

          {status === "success" && (
            <p className="text-sm text-green-600">
              Thanks — we've got your request and will reach out within 1
              business day.
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
  );
}
