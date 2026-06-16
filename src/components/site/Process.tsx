import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";

const steps = [
  { n: "01", t: "Consultation", d: "We meet — in person or virtually — to understand your vision, story, and creative ambition." },
  { n: "02", t: "Planning", d: "Locations, mood boards, schedules, lighting plans. Every detail mapped with precision." },
  { n: "03", t: "Shooting", d: "The session itself. Calm direction, decisive moments, cinematic intentionality." },
  { n: "04", t: "Editing", d: "Hand-graded by me. Each frame color-finished to feel cohesive and timeless." },
  { n: "05", t: "Delivery", d: "Final gallery delivered in a private vault, optional fine-art prints and albums." },
];

export function Process() {
  return (
    <section id="process" className="relative border-t border-white/5 bg-charcoal py-28 md:py-40">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <SectionLabel number="05" label="The Process" />
        <Reveal>
          <h2 className="mb-24 max-w-4xl font-display text-5xl font-extrabold leading-[0.95] tracking-tight md:text-7xl">
            From first <span className="italic font-serif font-medium text-gold">conversation</span> to final frame.
          </h2>
        </Reveal>

        <div className="relative">
          <div className="absolute left-0 right-0 top-[3.25rem] hidden h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent md:block" />

          <div className="grid grid-cols-1 gap-12 md:grid-cols-5 md:gap-6">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.08}>
                <div className="relative">
                  <div className="relative z-10 mb-6 flex h-[6.5rem] items-center justify-center">
                    <div className="absolute inset-0 flex items-center justify-center font-display text-[6rem] font-extrabold leading-none text-white/[0.04]">
                      {s.n}
                    </div>
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-gold bg-charcoal font-display text-sm font-extrabold tracking-wider text-gold">
                      {s.n}
                    </div>
                  </div>
                  <h3 className="font-display text-xl font-extrabold tracking-tight md:text-2xl">{s.t}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
