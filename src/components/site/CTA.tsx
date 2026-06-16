import { Reveal } from "./Reveal";
import { Link } from "@tanstack/react-router";

export function CTA() {
  return (
    <section className="relative overflow-hidden border-t border-white/5 bg-charcoal py-32 md:py-48">
      <div className="relative mx-auto max-w-[1400px] px-6 text-center md:px-12">
        <Reveal>
          <div className="mb-8 text-xs uppercase tracking-[0.4em] text-gold">— Let&apos;s Create</div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mx-auto max-w-5xl font-display text-[12vw] font-extrabold leading-[0.9] tracking-[-0.04em] md:text-[7vw]">
            Ready to create something{" "}
            <span className="italic font-serif font-medium text-gold">extraordinary</span>?
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-14 flex flex-wrap justify-center gap-4">
            <Link
              to="/booking"
              className="group inline-flex items-center gap-3 bg-gold px-10 py-5 text-sm font-semibold uppercase tracking-[0.2em] text-gold-foreground transition-transform duration-300 hover:scale-[1.03]"
            >
              Get Quotation
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 border border-white/20 px-10 py-5 text-sm font-semibold uppercase tracking-[0.2em] text-foreground transition-all duration-300 hover:border-gold hover:text-gold"
            >
              Contact Us
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
