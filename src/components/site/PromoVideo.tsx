import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

export function PromoVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const vid = videoRef.current;
    const section = sectionRef.current;
    if (!vid || !section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          vid.play().catch(() => {});
        } else {
          vid.pause();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden bg-background">
      <div className="relative aspect-video w-full max-h-[85vh]">
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          poster="/events/kufpec/kufpec-2.jpg"
          className="h-full w-full object-cover"
        >
          <source src="/drone-promo.webm" type="video/webm" />
          <source src="/drone-promo.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-background/30" />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="absolute bottom-6 left-6 md:bottom-10 md:left-12 flex items-center gap-4"
        >
          <span className="h-px w-8 bg-gold" />
          <span className="text-[10px] uppercase tracking-[0.4em] text-foreground/80">
            Aerial Showcase
          </span>
        </motion.div>

        <button
          onClick={toggleMute}
          className="absolute bottom-6 right-6 md:bottom-10 md:right-12 flex h-10 w-10 items-center justify-center border border-white/20 bg-background/40 backdrop-blur-sm text-foreground/80 transition-all hover:border-gold hover:text-gold"
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      </div>
    </section>
  );
}
