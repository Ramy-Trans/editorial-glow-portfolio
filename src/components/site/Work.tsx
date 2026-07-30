import { useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";
import { portfolio } from "@/data/portfolio";

const visible = portfolio.slice(0, 6);

function PortfolioCard({ item, i }: { item: typeof portfolio[0]; i: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    if (videoRef.current)
      videoRef.current.play().catch((err) => console.debug("[Work] autoplay blocked:", err));
  };
  const handleMouseLeave = () => {
    if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; }
  };

  return (
    <motion.div
      key={item.slug}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group relative block overflow-hidden bg-background"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative w-full overflow-hidden aspect-[4/3]">
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
            className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-90" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
          <div className="translate-y-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <div className="mt-2 font-display text-xl font-extrabold tracking-tight md:text-2xl">
              {item.title}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">{item.location}</div>
          </div>
        </div>
      </div>
      <Link
        to="/portfolio/$slug"
        params={{ slug: item.slug }}
        className="absolute inset-0 z-10"
        aria-label={`View ${item.title}`}
      />
      <div className="absolute right-5 top-5 z-20 pointer-events-none opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <span className="flex h-10 w-10 items-center justify-center border border-gold bg-background/60 text-gold backdrop-blur-sm">
          ↗
        </span>
      </div>
    </motion.div>
  );
}

export function Work() {
  return (
    <section id="work" className="relative border-t border-white/5 bg-charcoal py-28 md:py-40">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <SectionLabel label="Our Work" />
        <Reveal>
          <h2 className="mb-12 font-display text-5xl font-extrabold leading-[0.95] tracking-tight md:text-7xl">
            Selected{" "}
            <span className="italic font-serif font-medium text-gold">moments</span>.
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {visible.map((item, i) => (
            <PortfolioCard key={item.slug} item={item} i={i} />
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-14 flex justify-center">
            <Link
              to="/portfolio"
              className="group inline-flex items-center gap-3 border border-white/20 px-10 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-foreground transition-all duration-300 hover:border-gold hover:text-gold"
            >
              View Full Portfolio
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
