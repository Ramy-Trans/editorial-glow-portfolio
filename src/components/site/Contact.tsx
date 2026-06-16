import { useState } from "react";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";
import { Mail, Phone } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { siteSettings } from "@/data/settings";
import { useLang } from "@/lib/i18n";
import { submitContactFn } from "@/lib/booking-fns";

export function Contact() {
  const { t } = useLang();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    event_type: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setStatus("sending");
    try {
      await submitContactFn({ data: form });
      setStatus("sent");
      setForm({ name: "", email: "", phone: "", event_type: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="relative border-t border-white/5 bg-background py-28 md:py-40">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <SectionLabel number="06" label={t("contact_label")} />
        <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <Reveal>
              <h2 className="font-display text-5xl font-extrabold leading-[0.95] tracking-tight md:text-7xl">
                {t("contact_h1")}{" "}
                <span className="italic font-serif font-medium text-gold">{t("contact_h2")}</span>.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-8 max-w-md text-base leading-relaxed text-muted-foreground">
                {t("contact_desc")}
              </p>
            </Reveal>

            <div className="mt-12 space-y-6">
              {[
                { icon: Mail, label: t("contact_email_label"), val: siteSettings.email, href: `mailto:${siteSettings.email}` },
                { icon: Phone, label: t("contact_phone_label"), val: siteSettings.phone, href: `tel:${siteSettings.phone.replace(/\s/g, "")}` },
              ].map((c, i) => (
                <Reveal key={c.label} delay={0.15 + i * 0.05}>
                  <a href={c.href} className="group flex items-center gap-5 transition-colors">
                    <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center border border-gold/40 text-gold transition-colors group-hover:bg-gold group-hover:text-gold-foreground">
                      <c.icon className="h-4 w-4" />
                    </span>
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                        {c.label}
                      </div>
                      <div className="font-display text-base font-extrabold transition-colors group-hover:text-gold">
                        {c.val}
                      </div>
                    </div>
                  </a>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.3}>
              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href={`https://wa.me/${siteSettings.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-[#25D366]/40 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#25D366] transition-all hover:bg-[#25D366] hover:text-white"
                >
                  WhatsApp
                </a>
              </div>
            </Reveal>
          </div>

          <div className="md:col-span-7">
            <Reveal delay={0.1}>
              <div className="relative overflow-hidden border border-white/10 bg-charcoal/40 p-8 backdrop-blur-xl md:p-12">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-gold/10 blur-3xl"
                />
                <div className="relative space-y-6">
                  <div className="mb-6">
                    <h3 className="font-display text-2xl font-extrabold tracking-tight">
                      Send an Inquiry
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      For detailed booking requests, use our{" "}
                      <Link to="/booking" className="text-gold underline-offset-2 hover:underline">
                        booking form
                      </Link>{" "}
                      — or fill in the quick form below.
                    </p>
                  </div>

                  {status === "sent" ? (
                    <div className="flex flex-col items-start gap-3 py-8">
                      <div className="flex h-10 w-10 items-center justify-center border border-gold/40 text-gold">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="font-display text-lg font-extrabold">Message received.</p>
                      <p className="text-sm text-muted-foreground">We'll get back to you within 24 hours.</p>
                      <button
                        onClick={() => setStatus("idle")}
                        className="mt-2 text-xs uppercase tracking-[0.2em] text-gold hover:underline"
                      >
                        Send another →
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      <div className="grid gap-6 md:grid-cols-2">
                        <ContactField label="Name" name="name" placeholder="Your Name" value={form.name} onChange={handleChange} required />
                        <ContactField label="Email" name="email" type="email" placeholder="hello@example.com" value={form.email} onChange={handleChange} required />
                        <ContactField label="Phone" name="phone" type="tel" placeholder="+20 100 000 0000" value={form.phone} onChange={handleChange} />
                        <ContactField label="Event Type" name="event_type" placeholder="Corporate / Hotel / Conference" value={form.event_type} onChange={handleChange} />
                        <div className="md:col-span-2">
                          <label className="mb-3 block text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                            Message
                          </label>
                          <textarea
                            name="message"
                            rows={5}
                            placeholder="Tell us about your event…"
                            value={form.message}
                            onChange={handleChange}
                            className="w-full resize-none border-b border-white/15 bg-transparent py-3 text-base text-foreground placeholder:text-white/30 focus:border-gold focus:outline-none"
                          />
                        </div>
                        <div className="md:col-span-2 mt-2 flex items-center gap-4">
                          <button
                            type="submit"
                            disabled={status === "sending"}
                            className="group inline-flex items-center justify-center gap-3 bg-gold px-10 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-gold-foreground transition-all hover:scale-[1.01] disabled:opacity-60 w-full md:w-auto"
                          >
                            {status === "sending" ? "Sending…" : "Send Inquiry"}
                            {status !== "sending" && (
                              <span className="transition-transform group-hover:translate-x-1">→</span>
                            )}
                          </button>
                          {status === "error" && (
                            <p className="text-xs text-red-400">Something went wrong — please try again.</p>
                          )}
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactField({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-3 block text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        {label}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border-b border-white/15 bg-transparent py-3 text-base text-foreground placeholder:text-white/30 focus:border-gold focus:outline-none"
      />
    </div>
  );
}
