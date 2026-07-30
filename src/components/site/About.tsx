import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";
import { motion } from "framer-motion";

const col1Images = [
  "/events/kufpec/kufpec-1.jpg",
  "/events/kufpec/kufpec-3.jpg",
  "/events/sparix/sparix-1.jpg",
  "/events/abiec/abiec-1.jpg",
];

const col2Images = [
  "/events/kufpec/kufpec-2.jpg",
  "/events/sparix/sparix-2.jpg",
  "/events/kufpec/kufpec-4.jpg",
  "/events/abiec/abiec-2.jpg",
];

function ScrollColumn({ images, direction }: { images: string[]; direction: "up" | "down" }) {
  const doubled = [...images, ...images];
  return (
    <div className="relative overflow-hidden" style={{ height: "520px" }}>
      <motion.div
        className="flex flex-col gap-3"
        animate={{ y: direction === "up" ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((src, i) => (
          <div key={i} className="relative aspect-[3/2] w-full flex-shrink-0 overflow-hidden">
            <img
              src={src}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function About() {
  return (
    <section id="about" className="relative border-t border-white/5 bg-charcoal py-20 md:py-40">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-12 px-6 md:grid-cols-12 md:gap-16 md:px-12">

        {/* Scrolling image columns */}
        <div className="md:col-span-5">
          <div className="grid grid-cols-2 gap-3 overflow-hidden">
            <ScrollColumn images={col1Images} direction="up" />
            <ScrollColumn images={col2Images} direction="down" />
          </div>
          <Reveal delay={0.2} className="mt-6 flex items-baseline justify-between border-t border-white/10 pt-6">
            <div className="font-display text-5xl font-extrabold text-gold">GJ</div>
            <div className="text-right text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Cairo — Egypt
            </div>
          </Reveal>
        </div>

        <div className="md:col-span-7 md:pl-12">
          <SectionLabel label="About the Studio" />
          <Reveal>
            <h2 className="font-display text-4xl font-extrabold leading-[0.95] tracking-tight md:text-7xl">
              Crafting Stories,{" "}
              <span className="italic font-serif font-medium text-gold">Building</span> Brands.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground">
              We are a creative media production house specializing in high-quality video production,
              event coverage, podcast production, and professional photography.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
              Our mission is to transform ideas into compelling visual stories that capture
              attention and leave a lasting impact. From concept development to final delivery,
              we handle every stage of the production process with creativity, precision, and
              a deep understanding of modern digital trends.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
              We collaborate with brands, businesses, and individuals to produce engaging content
              that not only looks great but also delivers real results. Driven by passion and
              powered by creativity, we don't just create content — we create experiences.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
