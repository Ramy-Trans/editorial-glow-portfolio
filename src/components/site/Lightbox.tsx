import { useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface LightboxProps {
  images: string[];
  current: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export function Lightbox({ images, current, onClose, onNext, onPrev }: LightboxProps) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    },
    [onClose, onNext, onPrev]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-xl"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute right-6 top-6 z-10 flex h-12 w-12 items-center justify-center border border-white/15 text-foreground transition-all hover:border-gold hover:text-gold"
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Counter */}
      <div className="absolute left-6 top-6 font-display text-sm tracking-[0.3em] text-muted-foreground">
        {String(current + 1).padStart(2, "0")}{" "}
        <span className="text-white/30">/ {String(images.length).padStart(2, "0")}</span>
      </div>

      {/* Prev */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-4 z-10 flex h-14 w-14 items-center justify-center border border-white/15 text-foreground transition-all hover:border-gold hover:text-gold md:left-8"
        aria-label="Previous image"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      {/* Image */}
      <div className="relative flex h-full w-full items-center justify-center px-20 py-16" onClick={(e) => e.stopPropagation()}>
        <AnimatePresence mode="wait">
          <motion.img
            key={images[current]}
            src={images[current]}
            alt={`Image ${current + 1}`}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="max-h-full max-w-full object-contain shadow-luxe"
            draggable={false}
          />
        </AnimatePresence>
      </div>

      {/* Next */}
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-4 z-10 flex h-14 w-14 items-center justify-center border border-white/15 text-foreground transition-all hover:border-gold hover:text-gold md:right-8"
        aria-label="Next image"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Thumbnails */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2" onClick={(e) => e.stopPropagation()}>
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              if (i > current) for (let j = current; j < i; j++) onNext();
              else for (let j = current; j > i; j--) onPrev();
            }}
            className={`h-1 transition-all duration-300 ${i === current ? "w-8 bg-gold" : "w-3 bg-white/30 hover:bg-white/60"}`}
            aria-label={`Go to image ${i + 1}`}
          />
        ))}
      </div>

      {/* Keyboard hint */}
      <div className="absolute bottom-6 right-6 hidden gap-6 text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60 md:flex">
        <span className="flex items-center gap-2"><kbd className="border border-white/10 px-1.5 py-0.5">←→</kbd> Navigate</span>
        <span className="flex items-center gap-2"><kbd className="border border-white/10 px-1.5 py-0.5">Esc</kbd> Close</span>
      </div>
    </motion.div>
  );
}
