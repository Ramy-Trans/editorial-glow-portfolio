import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Services } from "@/components/site/Services";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — GJ Studio" },
      { name: "description", content: "Media production, event coverage, and live streaming services by GJ Studio." },
    ],
  }),
  component: ServicesPage,
});

const carouselImages = [
  "/events/kufpec/kufpec-1.jpg",
  "/events/kufpec/kufpec-2.jpg",
  "/events/kufpec/kufpec-3.jpg",
  "/events/sparix/sparix-1.jpg",
  "/events/sparix/sparix-2.jpg",
  "/events/sparix/sparix-3.jpg",
  "/events/abiec/abiec-1.jpg",
  "/events/abiec/abiec-2.jpg",
  "/events/kufpec/kufpec-4.jpg",
  "/events/kufpec/kufpec-5.jpg",
  "/events/sparix/sparix-4.jpg",
  "/events/sparix/sparix-5.jpg",
  "/events/kufpec/kufpec-6.jpg",
  "/events/kufpec/kufpec-7.jpg",
  "/events/sparix/sparix-6.jpg",
  "/events/kufpec/kufpec-8.jpg",
];

function ImageCarousel() {
  const doubled = [...carouselImages, ...carouselImages];
  return (
    <section className="overflow-hidden border-t border-white/5 py-20">
      <motion.div
        className="flex gap-4"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        style={{ width: "max-content" }}
      >
        {doubled.map((src, i) => (
          <div key={i} className="relative h-56 w-80 flex-shrink-0 overflow-hidden md:h-72 md:w-96">
            <img
              src={src}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </motion.div>
    </section>
  );
}

function ServicesPage() {
  return (
    <main className="relative bg-background text-foreground">
      <Nav />

      {/* Hero slogan */}
      <section className="relative flex min-h-[60vh] items-center border-b border-white/5 bg-charcoal px-6 pb-20 pt-40 md:px-12 md:pt-52">
        <div aria-hidden className="pointer-events-none absolute left-0 top-0 h-full w-full bg-gradient-to-br from-gold/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-[1600px] w-full">
          <Reveal>
            <p className="mb-6 text-[11px] uppercase tracking-[0.4em] text-gold">GJ Studio</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="font-display text-6xl font-extrabold leading-[0.92] tracking-tight md:text-8xl lg:text-[9vw]">
              Crafting Stories,{" "}
              <span className="italic font-serif font-medium text-gold">Building</span> Brands.
            </h1>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              From concept to delivery — every stage of the production process handled with
              creativity, precision, and a passion for visual storytelling.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-10 flex gap-4">
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 bg-gold px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-background transition-transform hover:scale-[1.02]"
              >
                Get Quotation →
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 border border-white/20 px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-foreground transition-all hover:border-gold hover:text-gold"
              >
                Get in Touch
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Services section (same as home) */}
      <Services />

      {/* Scrolling image carousel */}
      <ImageCarousel />

      <Footer />
    </main>
  );
}
