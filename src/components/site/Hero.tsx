import { motion, type Variants } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";

const word: Variants = {
  hidden: { y: "110%" },
  show: (i: number) => ({
    y: 0,
    transition: { duration: 1, delay: 2 + i * 0.12, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function Hero() {
  const { t, isRTL } = useLang();
  const headline = [t("hero_h1"), t("hero_h2")].filter(Boolean);

  return (
    <section className="relative h-[100svh] min-h-[600px] w-full overflow-hidden">
      {/* Mobile: static image — skip the 58 MB video entirely */}
      <img
        src="/events/kufpec/kufpec-2.jpg"
        alt=""
        aria-hidden
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover md:hidden"
      />

      {/* Desktop: video background — lazy-loaded after page paint */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        poster="/events/kufpec/kufpec-2.jpg"
        className="absolute inset-0 hidden h-full w-full object-cover md:block"
      >
        <source src="/drone-promo.webm" type="video/webm" />
        <source src="/drone-promo.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-background/60" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent"
      />

      <div
        className={`relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-5 pb-16 md:px-12 md:pb-28 ${
          isRTL ? "items-end text-right" : ""
        }`}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="mb-5 flex items-center gap-4 text-[10px] uppercase tracking-[0.35em] text-gold md:mb-6"
        >
          <span className="h-px w-8 bg-gold md:w-10" />
          <span>{t("hero_label")}</span>
        </motion.div>

        <h1 className="font-display text-[10vw] font-extrabold leading-[0.9] tracking-[-0.03em] sm:text-[9vw] md:text-[8.5vw] lg:text-[7.5vw]">
          {headline.map((line, i) => (
            <span key={i} className="block overflow-hidden">
              <motion.span
                variants={word}
                initial="hidden"
                animate="show"
                custom={i}
                className="inline-block"
              >
                {i === 1 ? (
                  <>
                    {isRTL ? (
                      line
                    ) : (
                      <>
                        Building Brands<span className="text-gold">.</span>
                      </>
                    )}
                  </>
                ) : (
                  line
                )}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.6, duration: 1 }}
          className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground md:mt-8 md:max-w-xl md:text-base"
        >
          {t("hero_desc")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.8, duration: 1 }}
          className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4 md:mt-8"
        >
          <Link
            to="/portfolio"
            className="group inline-flex items-center justify-center gap-3 bg-gold px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold-foreground transition-transform duration-300 hover:scale-[1.03] sm:justify-start"
          >
            {t("hero_cta_portfolio")}
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
          <Link
            to="/booking"
            className="inline-flex items-center justify-center gap-3 border border-white/20 px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-foreground transition-all duration-300 hover:border-gold hover:text-gold sm:justify-start"
          >
            {t("hero_cta_book")}
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.2, duration: 1 }}
        className="absolute bottom-8 right-6 z-10 hidden flex-col items-center gap-3 md:right-12 md:flex"
      >
        <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
          {t("hero_scroll")}
        </span>
        <span className="relative block h-12 w-px overflow-hidden bg-white/15">
          <motion.span
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-x-0 top-0 h-1/2 bg-gold"
          />
        </span>
      </motion.div>
    </section>
  );
}
