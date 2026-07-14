import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle, Send } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { WhatsApp } from "@/components/site/WhatsApp";
import { submitBookingFn } from "@/lib/booking-fns";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/booking")({
  head: () => ({
    meta: [
      { title: "Get a Quotation — GJ Media House" },
      {
        name: "description",
        content:
          "Request a quotation for your event photography or media production with GJ Media House. Events, corporate, conferences, hotels and more.",
      },
    ],
  }),
  component: BookingPage,
});

const occasions = [
  "Corporate Event",
  "Conference / Exhibition",
  "Hotel Occasion",
  "Ramadan / Iftar",
  "Product Launch",
  "Gala / Award Night",
  "Executive Portrait",
  "Other",
];

interface FormData {
  name: string;
  email: string;
  phone: string;
  occasion: string;
  description: string;
}

function BookingPage() {
  const { t, isRTL } = useLang();
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    occasion: "",
    description: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (field: keyof FormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const missing: string[] = [];
    if (!form.name.trim()) missing.push(isRTL ? "الاسم" : "name");
    if (!form.email.trim()) missing.push(isRTL ? "البريد الإلكتروني" : "email");
    if (!form.phone.trim()) missing.push(isRTL ? "رقم الهاتف" : "phone");
    if (!form.occasion) missing.push(isRTL ? "نوع المناسبة" : "occasion type");
    if (missing.length > 0) {
      setError(
        isRTL
          ? `يرجى إكمال الحقول التالية: ${missing.join("، ")}.`
          : `Please fill in: ${missing.join(", ")}.`
      );
      return;
    }

    setLoading(true);
    try {
      await submitBookingFn({ data: form });
      setSubmitted(true);
    } catch (err) {
      console.error("[booking] submitBookingFn threw:", err);
      setError("Something went wrong. Please try again or contact us directly on WhatsApp.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative bg-background text-foreground">
      <Nav />
      <WhatsApp />

      <section className="relative min-h-screen pt-28 md:pt-36">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-32 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gold/5 blur-[180px]"
        />

        <div className="relative mx-auto max-w-2xl px-6 pb-32 md:px-8">
          <Reveal>
            <Link
              to="/"
              className="mb-10 inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-gold"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to Home
            </Link>
          </Reveal>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="py-20 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                  className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-gold/30 bg-gold/10"
                >
                  <CheckCircle className="h-10 w-10 text-gold" />
                </motion.div>
                <h2 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">
                  {t("booking_success_title")}
                </h2>
                <p className="mx-auto mt-6 max-w-sm text-base leading-relaxed text-muted-foreground">
                  {t("booking_success_desc")}
                </p>
                <div className="mt-10 flex flex-wrap justify-center gap-4">
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 bg-gold px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold-foreground transition-transform hover:scale-[1.02]"
                  >
                    Return Home
                  </Link>
                  <a
                    href="https://wa.me/201226098595"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-white/20 px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-foreground transition-all hover:border-[#25D366] hover:text-[#25D366]"
                  >
                    WhatsApp Us
                  </a>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Reveal>
                  <div className="mb-2 flex items-center gap-4 text-xs uppercase tracking-[0.4em] text-gold">
                    <span className="h-px w-10 bg-gold" />
                    GJ Media House
                  </div>
                  <h1 className="font-display text-5xl font-extrabold leading-[0.95] tracking-tight md:text-6xl">
                    {t("booking_title")}
                  </h1>
                  <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                    {t("booking_subtitle")}
                  </p>
                </Reveal>

                <Reveal delay={0.15}>
                  <form onSubmit={handleSubmit} noValidate className="mt-12 space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <Field label={t("booking_name")}>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) => update("name", e.target.value)}
                          placeholder={isRTL ? "الاسم الكامل" : "Your full name"}
                          className="booking-input"
                        />
                      </Field>
                      <Field label={t("booking_email")}>
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => update("email", e.target.value)}
                          placeholder={isRTL ? "name@example.com" : "name@example.com"}
                          className="booking-input"
                        />
                      </Field>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <Field label={t("booking_phone")}>
                        <input
                          type="tel"
                          required
                          value={form.phone}
                          onChange={(e) => update("phone", e.target.value)}
                          placeholder="+20 1XX XXX XXXX"
                          className="booking-input"
                          dir="ltr"
                        />
                      </Field>
                      <Field label={t("booking_occasion")}>
                        <select
                          required
                          value={form.occasion}
                          onChange={(e) => update("occasion", e.target.value)}
                          className="booking-input"
                        >
                          <option value="" disabled>
                            {isRTL ? "اختر نوع المناسبة" : "Select occasion type"}
                          </option>
                          {occasions.map((o) => (
                            <option key={o} value={o}>
                              {o}
                            </option>
                          ))}
                        </select>
                      </Field>
                    </div>

                    <Field label={t("booking_desc")}>
                      <textarea
                        rows={5}
                        value={form.description}
                        onChange={(e) => update("description", e.target.value)}
                        placeholder={
                          isRTL
                            ? "التاريخ المقترح، المكان، أي تفاصيل إضافية…"
                            : "Proposed date, venue, number of attendees, any specific requirements…"
                        }
                        className="booking-input resize-none"
                      />
                    </Field>

                    <AnimatePresence>
                      {error && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-sm text-red-400"
                        >
                          {error}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    <div className="flex flex-wrap items-center gap-4 pt-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="group inline-flex items-center gap-3 bg-gold px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-gold-foreground transition-all hover:scale-[1.02] disabled:opacity-70"
                      >
                        {loading ? t("booking_sending") : t("booking_submit")}
                        {!loading && (
                          <Send className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        )}
                      </button>
                      <a
                        href="https://wa.me/201226098595"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-[#25D366]"
                      >
                        Or chat on WhatsApp →
                      </a>
                    </div>
                  </form>
                </Reveal>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}
