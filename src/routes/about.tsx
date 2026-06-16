import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { SectionLabel } from "@/components/site/SectionLabel";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — GJ Studio" },
      { name: "description", content: "We are a creative media production house specializing in high-quality video production, event coverage, podcast production, and professional photography." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <main className="relative bg-background text-foreground">
      <Nav />

      {/* Hero */}
      <section className="relative min-h-[55vh] overflow-hidden pt-28 flex items-end">
        <div className="absolute inset-0 bg-background" />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/8 blur-[180px]"
        />
        <div className="relative mx-auto w-full max-w-[1600px] px-6 pb-20 md:px-12 md:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-6 flex items-center gap-4 text-[11px] uppercase tracking-[0.4em] text-gold"
          >
            <span className="h-px w-10 bg-gold" />
            The Studio
          </motion.div>
          <h1 className="font-display text-[12vw] font-extrabold leading-[0.92] tracking-[-0.03em] md:text-[7vw]">
            {["About", "Us."].map((word, i) => (
              <span key={i} className="block overflow-hidden">
                <motion.span
                  className="inline-block"
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.4 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                >
                  {i === 1 ? (
                    <>About Us<span className="text-gold">.</span></>
                  ) : null}
                  {i === 0 ? word : null}
                </motion.span>
              </span>
            ))}
          </h1>
        </div>
      </section>

      {/* Bio */}
      <section className="py-20 md:py-32">
        <div className="mx-auto max-w-[1600px] px-6 md:px-12">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
            <div className="md:col-span-5">
              <div className="relative overflow-hidden aspect-[4/5]">
                <img
                  src="/events/kufpec/kufpec-4.jpg"
                  alt="KUFPEC Conference — GJ Studio"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
              </div>
            </div>
            <div className="md:col-span-7 md:pl-8">
              <SectionLabel number="01" label="Our Story" />
              <Reveal>
                <h2 className="font-display text-5xl font-extrabold leading-[0.95] tracking-tight md:text-6xl">
                  Crafting Stories,{" "}
                  <span className="italic font-serif font-medium text-gold">Building</span>{" "}
                  Brands.
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-8 text-base leading-relaxed text-muted-foreground md:text-lg">
                  We are a creative media production house specializing in high-quality
                  video production, event coverage, podcast production, and professional photography.
                </p>
              </Reveal>
              <Reveal delay={0.15}>
                <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                  Our mission is to transform ideas into compelling visual stories that capture
                  attention and leave a lasting impact. From concept development to final delivery,
                  we handle every stage of the production process with creativity, precision, and
                  a deep understanding of modern digital trends.
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                  We collaborate with brands, businesses, and individuals to produce engaging
                  content that not only looks great but also delivers real results. Whether it's
                  covering live events, producing cinematic videos, or creating impactful digital
                  content, we bring your vision to life.
                </p>
              </Reveal>
              <Reveal delay={0.25}>
                <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                  Driven by passion and powered by creativity, we don't just create content —
                  we create experiences.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="border-t border-white/5 bg-charcoal py-20 md:py-32">
        <div className="mx-auto max-w-[1600px] px-6 md:px-12">
          <SectionLabel number="02" label="Our Services" />
          <Reveal>
            <h2 className="mb-16 font-display text-5xl font-extrabold leading-[0.95] tracking-tight md:text-6xl">
              What we{" "}
              <span className="italic font-serif font-medium text-gold">do</span>.
            </h2>
          </Reveal>

          <div className="space-y-0 divide-y divide-white/10 border-y border-white/10">
            {[
              {
                n: "01",
                title: "Media Production",
                desc: "We create high-quality, cinematic videos tailored to your brand's vision. From concept development and scripting to filming and post-production, we handle the entire process to deliver visually compelling content that engages your audience.",
              },
              {
                n: "02",
                title: "Event Coverage",
                desc: "We professionally cover events of all scales, capturing every important moment with precision and creativity. Whether it's corporate events, conferences, or special occasions, we ensure your story is documented and delivered in a dynamic and engaging way.",
              },
              {
                n: "03",
                title: "Live Streaming",
                desc: "Deliver your event to audiences everywhere with our professional live streaming services. We provide high-quality video, crystal-clear audio, and reliable multi-platform broadcasting for conferences, corporate events, webinars, and special occasions.",
              },
            ].map((s, i) => (
              <Reveal key={s.n} delay={i * 0.08}>
                <div className="group flex gap-8 py-10 md:gap-16 hover:bg-background/20 transition-colors px-4 -mx-4">
                  <div className="font-display text-3xl font-extrabold text-gold md:text-4xl w-16 flex-shrink-0">
                    {s.n}
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="font-display text-xl font-extrabold md:text-2xl">{s.title}</h3>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-24 md:py-36">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/8 blur-[150px]"
        />
        <div className="relative flex flex-col items-center justify-center text-center px-6">
          <Reveal>
            <h2 className="font-display text-4xl font-extrabold md:text-6xl">
              Let's create something{" "}
              <span className="italic font-serif font-medium text-gold">extraordinary</span>.
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <Link
              to="/booking"
              className="group mt-10 inline-flex items-center gap-3 bg-gold px-10 py-5 text-sm font-semibold uppercase tracking-[0.2em] text-gold-foreground transition-transform hover:scale-[1.02]"
            >
              Get Quotation
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}
