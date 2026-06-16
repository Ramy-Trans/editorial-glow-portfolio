import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Instagram, Facebook, Clock } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { SectionLabel } from "@/components/site/SectionLabel";
import { siteSettings } from "@/data/settings";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — GJ Studio" },
      { name: "description", content: "Get in touch with GJ Studio. Book an event photography session or discuss your project." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="relative bg-background text-foreground">
      <Nav />

      <section className="relative pt-32 pb-0 md:pt-40">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 top-20 h-[600px] w-[600px] rounded-full bg-gold/5 blur-[180px]"
        />
        <div className="relative mx-auto max-w-[1600px] px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6 flex items-center gap-4 text-[11px] uppercase tracking-[0.4em] text-gold"
          >
            <span className="h-px w-10 bg-gold" />
            Get in Touch
          </motion.div>
          <h1 className="font-display text-[12vw] font-extrabold leading-[0.92] tracking-[-0.03em] md:text-[7vw]">
            {["Let's talk", "about"].map((word, i) => (
              <span key={i} className="block overflow-hidden">
                <motion.span
                  className="inline-block"
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.3 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
            <span className="block overflow-hidden">
              <motion.span
                className="inline-block italic font-serif font-medium text-gold"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                your story.
              </motion.span>
            </span>
          </h1>
        </div>
      </section>

      <section className="py-20 md:py-32">
        <div className="mx-auto max-w-[1600px] px-6 md:px-12">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
            {/* Info column */}
            <div className="md:col-span-4">
              <Reveal>
                <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                  Bookings are accepted on a limited basis each season. The earlier
                  we begin the conversation, the more freedom we have to craft
                  something exceptional.
                </p>
              </Reveal>

              <div className="mt-12 space-y-6">
                {[
                  { icon: Mail, label: "Email", val: siteSettings.email, href: `mailto:${siteSettings.email}` },
                  { icon: Phone, label: "Phone", val: siteSettings.phone, href: `tel:${siteSettings.phone}` },
                  { icon: MapPin, label: "Studio", val: siteSettings.locations.join(" · "), href: null },
                ].map((c, i) => (
                  <Reveal key={c.label} delay={0.1 + i * 0.06}>
                    <div className="flex items-center gap-5">
                      <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center border border-gold/40 text-gold">
                        <c.icon className="h-4 w-4" />
                      </span>
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                          {c.label}
                        </div>
                        {c.href ? (
                          <a href={c.href} className="mt-1 block font-display font-extrabold transition-colors hover:text-gold">
                            {c.val}
                          </a>
                        ) : (
                          <div className="mt-1 font-display font-extrabold">{c.val}</div>
                        )}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>

              {/* Business hours */}
              <Reveal delay={0.3}>
                <div className="mt-12 border border-white/10 bg-charcoal/40 p-6">
                  <div className="mb-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-gold">
                    <Clock className="h-3.5 w-3.5" />
                    Business Hours
                  </div>
                  <div className="space-y-2">
                    {siteSettings.businessHours.map((h) => (
                      <div key={h.day} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{h.day}</span>
                        <span className="font-medium">{h.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* Social links */}
              <Reveal delay={0.35}>
                <div className="mt-8">
                  <div className="mb-4 text-[10px] uppercase tracking-[0.4em] text-muted-foreground">Follow</div>
                  <div className="flex gap-3">
                    {[
                      { label: "Instagram", icon: Instagram, href: siteSettings.instagram },
                      { label: "Facebook", icon: Facebook, href: siteSettings.facebook },
                      { label: "Behance", icon: null, href: siteSettings.behance },
                    ].map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        aria-label={s.label}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-11 w-11 items-center justify-center border border-white/10 text-muted-foreground transition-all hover:border-gold hover:text-gold"
                      >
                        {s.icon ? <s.icon className="h-4 w-4" /> : <span className="font-display text-xs font-extrabold">Bē</span>}
                      </a>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* Map */}
              <Reveal delay={0.4}>
                <div className="mt-10 aspect-[16/9] overflow-hidden border border-white/10 bg-charcoal">
                  <div className="relative h-full w-full">
                    <div
                      className="absolute inset-0 opacity-50"
                      style={{
                        backgroundImage:
                          "linear-gradient(to right, oklch(1 0 0 / 0.06) 1px, transparent 1px), linear-gradient(to bottom, oklch(1 0 0 / 0.06) 1px, transparent 1px)",
                        backgroundSize: "36px 36px",
                      }}
                    />
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="relative">
                        <span className="absolute inset-0 -m-4 animate-ping rounded-full bg-gold/40" />
                        <span className="relative block h-3 w-3 rounded-full bg-gold" />
                      </div>
                      <div className="mt-4 text-center text-[10px] uppercase tracking-[0.3em] text-gold">
                        Studio · Cairo
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Form column */}
            <div className="md:col-span-8">
              <Reveal delay={0.1}>
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex min-h-[500px] flex-col items-center justify-center border border-white/10 bg-charcoal/40 p-12 text-center backdrop-blur-xl"
                  >
                    <div className="mb-6 flex h-16 w-16 items-center justify-center border border-gold text-gold">
                      <span className="font-display text-2xl">✓</span>
                    </div>
                    <h3 className="font-display text-3xl font-extrabold">Message Sent</h3>
                    <p className="mt-4 max-w-sm text-muted-foreground">
                      Thank you for reaching out. I'll be in touch within 24–48 hours.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-8 border border-white/15 px-8 py-3 text-sm uppercase tracking-[0.2em] text-muted-foreground transition-all hover:border-gold hover:text-gold"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    className="relative overflow-hidden border border-white/10 bg-charcoal/40 p-8 backdrop-blur-xl md:p-12"
                  >
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-gold/10 blur-3xl"
                    />
                    <div className="relative grid grid-cols-1 gap-6 md:grid-cols-2">
                      <Field label="Full Name" name="name" placeholder="Jane Doe" required />
                      <Field label="Email Address" name="email" type="email" placeholder="hello@example.com" required />
                      <Field label="Phone Number" name="phone" type="tel" placeholder="+1 555 000 000" />
                      <Field label="Project Type" name="type" placeholder="Wedding / Editorial / Brand" />
                      <Field label="Budget Range" name="budget" placeholder="€ 2,000 — 5,000" />
                      <Field label="Preferred Date" name="date" type="date" />
                      <div className="md:col-span-2">
                        <label className="mb-3 block text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                          Tell Me About Your Vision
                        </label>
                        <textarea
                          name="message"
                          rows={6}
                          placeholder="Describe your project, vision, or any relevant details…"
                          className="w-full resize-none border-b border-white/15 bg-transparent py-3 text-base text-foreground placeholder:text-white/30 focus:border-gold focus:outline-none"
                        />
                      </div>
                      <div className="md:col-span-2 mt-4">
                        <button
                          type="submit"
                          className="group inline-flex w-full items-center justify-center gap-3 bg-gold px-10 py-5 text-sm font-semibold uppercase tracking-[0.2em] text-gold-foreground transition-transform hover:scale-[1.01] md:w-auto"
                        >
                          Send Message
                          <span className="transition-transform group-hover:translate-x-1">→</span>
                        </button>
                        <p className="mt-4 text-[11px] text-muted-foreground">
                          Prefer to book directly?{" "}
                          <Link to="/booking" className="text-gold hover:underline">
                            Use the booking form →
                          </Link>
                        </p>
                      </div>
                    </div>
                  </form>
                )}
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-3 block text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        {label} {required && <span className="text-gold">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full border-b border-white/15 bg-transparent py-3 text-base text-foreground placeholder:text-white/30 focus:border-gold focus:outline-none [color-scheme:dark]"
      />
    </div>
  );
}
