import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Star, ArrowLeft, ArrowRight } from "lucide-react";
import c1 from "@/assets/client-1.webp";
import c2 from "@/assets/client-2.webp";
import c3 from "@/assets/client-3.webp";
import { SectionLabel } from "./SectionLabel";
import { Reveal } from "./Reveal";

const items = [
  {
    img: c1,
    name: "Ahmed Al-Rashid",
    role: "Events Manager, AZAL Pyramids Hotel",
    quote:
      "GJ Studio doesn't just take photographs — they capture the atmosphere, the detail, and the emotion of every moment. Our Ramadan events have never looked more beautiful.",
  },
  {
    img: c2,
    name: "Sarah Khalil",
    role: "Head of Communications, KUFPEC",
    quote:
      "Working with GJ Studio on our international exhibition was seamless. They navigated a complex, multi-hall event with professionalism and delivered images that truly represented our brand.",
  },
  {
    img: c3,
    name: "Omar Nasser",
    role: "CEO, Gulf Corporate Partners",
    quote:
      "Consistent quality, professional conduct, and images that always exceed expectations. GJ Studio is our go-to partner for every corporate event we host.",
  },
];

export function Testimonials() {
  const [i, setI] = useState(0);
  const current = items[i];
  const next = () => setI((p) => (p + 1) % items.length);
  const prev = () => setI((p) => (p - 1 + items.length) % items.length);

  return (
    <section className="relative border-t border-white/5 bg-background py-28 md:py-40">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <SectionLabel number="04" label="Testimonials" />
        <Reveal>
          <h2 className="mb-20 max-w-4xl font-display text-5xl font-extrabold leading-[0.95] tracking-tight md:text-7xl">
            Words from those who <span className="italic font-serif font-medium text-gold">trusted</span> us.
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-4">
            <div className="relative aspect-[4/5] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={current.img}
                  src={current.img}
                  alt={current.name}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
            </div>
          </div>

          <div className="flex flex-col justify-between md:col-span-8 md:pl-8">
            <div>
              <div className="mb-8 flex gap-1">
                {[...Array(5)].map((_, k) => (
                  <Star key={k} className="h-4 w-4 fill-gold text-gold" />
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.blockquote
                  key={current.quote}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="font-display text-2xl font-medium leading-[1.3] tracking-tight md:text-4xl"
                >
                  <span className="font-serif text-6xl leading-none text-gold">&ldquo;</span>{" "}
                  {current.quote}
                </motion.blockquote>
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="mt-10"
                >
                  <div className="font-display text-lg font-extrabold">{current.name}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.3em] text-gold">{current.role}</div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-12 flex items-center justify-between border-t border-white/10 pt-6">
              <div className="font-display text-sm tracking-[0.3em] text-muted-foreground">
                0{i + 1} <span className="text-white/30">/ 0{items.length}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={prev}
                  className="flex h-12 w-12 items-center justify-center border border-white/15 text-foreground transition-all hover:border-gold hover:text-gold"
                  aria-label="Previous"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={next}
                  className="flex h-12 w-12 items-center justify-center border border-gold bg-gold text-gold-foreground transition-all hover:bg-transparent hover:text-gold"
                  aria-label="Next"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
