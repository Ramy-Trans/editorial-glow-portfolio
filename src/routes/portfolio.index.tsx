import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Lightbox } from "@/components/site/Lightbox";
import { portfolio } from "@/data/portfolio";

export const Route = createFileRoute("/portfolio/")({
  head: () => ({
    meta: [
      { title: "Portfolio — GJ Media House" },
      { name: "description", content: "A curated archive of events, corporate gatherings, conferences, and exhibitions across Egypt." },
    ],
  }),
  component: PortfolioPage,
});

function VideoCard({ item, i }: { item: typeof portfolio[0]; i: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    if (videoRef.current)
      videoRef.current.play().catch((err) => console.debug("[portfolio] autoplay blocked:", err));
  };
  const handleMouseLeave = () => {
    if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: i * 0.05 }}
      className="group mb-4 break-inside-avoid"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link to="/portfolio/$slug" params={{ slug: item.slug }} className="block">
        <div className="relative overflow-hidden aspect-[4/3]">
          {item.coverVideo ? (
            <>
              <img
                src={item.coverImage || "/events/kufpec/kufpec-1.jpg"}
                alt={item.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-0"
              />
              <video
                ref={videoRef}
                muted
                loop
                playsInline
                preload="none"
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              >
                {item.coverVideo && <source src={item.coverVideo} />}
              </video>
            </>
          ) : (
            <img
              src={item.coverImage || "/events/kufpec/kufpec-1.jpg"}
              alt={item.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <h3 className="font-display text-xl font-bold leading-tight text-foreground">
              {item.title}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{item.subtitle}</p>
            <div className="mt-3 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold">
              View Project <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>
          {item.coverVideo && (
            <div className="absolute right-3 top-3 flex items-center gap-1 border border-gold/40 bg-background/60 px-2 py-1 text-[9px] uppercase tracking-[0.2em] text-gold backdrop-blur-sm opacity-100 group-hover:opacity-0 transition-opacity">
              ▶ Promo
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

function PortfolioPage() {
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null);

  const closeLightbox = () => setLightbox(null);
  const nextImage = () =>
    setLightbox((lb) => lb ? { ...lb, index: (lb.index + 1) % lb.images.length } : null);
  const prevImage = () =>
    setLightbox((lb) => lb ? { ...lb, index: (lb.index - 1 + lb.images.length) % lb.images.length } : null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />

      {/* Hero */}
      <section className="relative h-[55vh] min-h-[420px] overflow-hidden">
        <img
          src="/events/kufpec/kufpec-3.jpg"
          alt="GJ Media House Portfolio"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/20 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 to-transparent" />
        <div className="relative flex h-full flex-col justify-end pb-16 pl-6 md:pl-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="mb-3 text-[11px] uppercase tracking-[0.4em] text-gold">Selected Works</p>
            <h1 className="font-display text-5xl font-extrabold leading-[0.92] tracking-tight md:text-7xl lg:text-8xl">
              Every Frame<br />
              <span className="italic font-serif font-medium text-gold">Tells</span> a Story.
            </h1>
            <p className="mt-4 max-w-lg text-base text-muted-foreground md:text-lg">
              A curated archive of events, corporate gatherings, conferences, and exhibitions across Egypt.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery */}
      <section className="mx-auto max-w-screen-xl px-6 py-16 md:px-12">
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          <AnimatePresence>
            {portfolio.map((item, i) => (
              <VideoCard key={item.slug} item={item} i={i} />
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/8 py-24 text-center">
        <p className="font-display text-[11px] uppercase tracking-[0.35em] text-gold">Ready to begin?</p>
        <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tight md:text-5xl">
          Let's Create Something<br />Extraordinary
        </h2>
        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <Link
            to="/booking"
            className="inline-flex items-center gap-2 bg-gold px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-background transition-transform hover:scale-[1.02]"
          >
            Get Quotation <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 border border-white/20 px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-foreground transition-all hover:border-gold hover:text-gold"
          >
            Get in Touch
          </Link>
        </div>
      </section>

      <Footer />

      <AnimatePresence>
        {lightbox && (
          <Lightbox
            images={lightbox.images}
            current={lightbox.index}
            onClose={closeLightbox}
            onNext={nextImage}
            onPrev={prevImage}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
