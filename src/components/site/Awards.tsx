import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";

const awards = [
  { year: "2025", name: "AZAL Pyramids Hotel", cat: "Official Event Photography Partner" },
  { year: "2025", name: "KUFPEC International Exhibition", cat: "Corporate Event Coverage" },
  { year: "2024", name: "Fourth Education Forum", cat: "Official Media Production" },
  { year: "2024", name: "Corporate Leadership Summit", cat: "Exclusive Photography Partner" },
  { year: "2023", name: "Ramadan Gala Series", cat: "Event Photography — Cairo" },
  { year: "2022", name: "Regional Business Conference", cat: "Multi-Day Media Coverage" },
];

const clients = ["AZAL Hotels", "KUFPEC", "Maison Azur", "Gulf Summit", "Forum Network", "Cairo Elite"];

export function Awards() {
  return (
    <section className="relative border-t border-white/5 bg-background py-28 md:py-40">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <SectionLabel number="06" label="Notable Projects" />
        <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <Reveal>
              <h2 className="font-display text-5xl font-extrabold leading-[0.95] tracking-tight md:text-7xl">
                Trusted by the <span className="italic font-serif font-medium text-gold">best</span>.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-8 max-w-md text-base leading-relaxed text-muted-foreground">
                From five-star hotels in Cairo to international industry exhibitions,
                GJ Media House has been trusted by leading organisations to document
                their most important moments.
              </p>
            </Reveal>
          </div>

          <div className="md:col-span-7">
            <div className="divide-y divide-white/10 border-y border-white/10">
              {awards.map((a, i) => (
                <Reveal key={a.name + i} delay={i * 0.05}>
                  <div className="group flex items-center justify-between gap-6 py-6 transition-colors hover:bg-charcoal/50">
                    <div className="font-display text-xl font-extrabold text-gold md:text-2xl">{a.year}</div>
                    <div className="flex-1 px-4">
                      <div className="font-display text-base font-extrabold md:text-lg">{a.name}</div>
                      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{a.cat}</div>
                    </div>
                    <div className="text-gold opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">→</div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.2}>
              <div className="mt-12 text-[10px] uppercase tracking-[0.4em] text-muted-foreground">— Trusted By</div>
              <div className="mt-6 flex flex-wrap items-center gap-x-10 gap-y-6">
                {clients.map((p) => (
                  <span
                    key={p}
                    className="font-display text-xl font-extrabold tracking-[0.05em] text-foreground/40 transition-colors hover:text-gold md:text-2xl"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
