import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Reveal } from "./Reveal";

export function Showcase() {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-20% 0px" });

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (isInView) {
      vid.play().catch((err) => console.debug("[Showcase] autoplay blocked:", err));
    } else {
      vid.pause();
    }
  }, [isInView]);

  return (
    <section
      ref={ref}
      className="relative border-t border-white/5 bg-charcoal py-20 md:py-32 overflow-hidden"
    >
      <div className="mx-auto max-w-[1600px] px-5 md:px-12">
        <div className="mb-6 flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] text-gold">
          <span className="h-px w-8 bg-gold" />
          <span>Behind The Scenes</span>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12 mb-8">
          <div className="md:col-span-7">
            <Reveal>
              <h2 className="font-display text-4xl font-extrabold leading-[0.95] tracking-tight md:text-6xl">
                Behind the{" "}
                <span className="italic font-serif font-medium text-gold">Scenes</span>.
              </h2>
            </Reveal>
          </div>
          <div className="md:col-span-5 flex items-end">
            <Reveal delay={0.1}>
              <p className="text-sm leading-relaxed text-muted-foreground">
                A glimpse into our process — the moments and effort that go into
                every production before the final frame is captured.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Landscape BTS video — full width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden aspect-video w-full"
        >
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="none"
            poster="/events/kufpec/kufpec-2.jpg"
            className="h-full w-full object-cover"
          >
            <source src="/drone-promo.mp4" type="video/mp4" />
            <source src="/drone-promo.webm" type="video/webm" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent pointer-events-none" />
          <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-foreground/80 pointer-events-none">
            <span className="h-px w-6 bg-gold" />
            <span>Behind The Scenes — GJ Media House</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
