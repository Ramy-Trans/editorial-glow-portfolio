import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface PageHeroProps {
  label?: string;
  eyebrow?: string;
  title: string | ReactNode;
  titleAccent?: string;
  subtitle?: string;
  image?: string;
  imageAlt?: string;
}

export function PageHero({ label, eyebrow, title, titleAccent, subtitle, image, imageAlt }: PageHeroProps) {
  const headerLabel = label ?? eyebrow;
  const isStringTitle = typeof title === "string";
  const words = isStringTitle ? (title as string).split(" ") : [];

  return (
    <section className="relative flex min-h-[45vh] items-end overflow-hidden border-b border-white/5 pb-16 pt-40 md:min-h-[55vh] md:pb-24">
      {image && (
        <>
          <motion.img
            src={image}
            alt={imageAlt ?? (isStringTitle ? (title as string) : "")}
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
        </>
      )}
      {!image && (
        <>
          <div
            aria-hidden
            className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-gold/5 blur-[150px]"
          />
        </>
      )}

      <div className="relative mx-auto w-full max-w-[1600px] px-6 md:px-12">
        {headerLabel && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6 flex items-center gap-4 text-[11px] uppercase tracking-[0.4em] text-gold"
          >
            <span className="h-px w-10 bg-gold" />
            {headerLabel}
          </motion.div>
        )}

        <h1 className="font-display text-[13vw] font-extrabold leading-[0.92] tracking-[-0.03em] md:text-[7vw]">
          {isStringTitle ? (
            <>
              {words.map((word, i) => (
                <span key={i} className="mr-[0.2em] inline-block overflow-hidden">
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
              {titleAccent && (
                <span className="inline-block overflow-hidden">
                  <motion.span
                    className="inline-block font-serif font-medium italic text-gold"
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.9, delay: 0.3 + words.length * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {titleAccent}
                  </motion.span>
                </span>
              )}
            </>
          ) : (
            <motion.span
              className="inline"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {title}
              {titleAccent && (
                <span className="ml-[0.2em] font-serif font-medium italic text-gold">{titleAccent}</span>
              )}
            </motion.span>
          )}
        </h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.8 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
}
