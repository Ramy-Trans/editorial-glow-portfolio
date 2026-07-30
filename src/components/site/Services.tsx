import { useState } from "react";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";
import { Clapperboard, CalendarCheck, Radio } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { mediaProductionImages } from "@/assets/media-production/index";
import { eventCoverageImages } from "@/assets/event-coverage/index";

type ServiceKey = "media" | "event" | "live" | null;

const services = [
  {
    key: "media" as ServiceKey,
    icon: Clapperboard,
    title: "Media Production",
    desc: "We create high-quality, cinematic videos tailored to your brand's vision. From concept development and scripting to filming and post-production, we handle the entire process to deliver visually compelling content that engages your audience.",
    hasContent: true,
  },
  {
    key: "event" as ServiceKey,
    icon: CalendarCheck,
    title: "Event Coverage",
    desc: "We professionally cover events of all scales, capturing every important moment with precision and creativity. Whether it's corporate events, conferences, or special occasions, we ensure your story is documented and delivered in a dynamic and engaging way.",
    hasContent: true,
  },
  {
    key: "live" as ServiceKey,
    icon: Radio,
    title: "Live Streaming",
    desc: "Deliver your event to audiences everywhere with our professional live streaming services. We provide high-quality video, crystal-clear audio, and reliable multi-platform broadcasting for conferences, corporate events, webinars, and special occasions.",
    hasContent: false,
  },
];

export function Services() {
  const [open, setOpen] = useState<ServiceKey>(null);

  const activeService = services.find((s) => s.key === open);
  const activeImages = open === "media" ? mediaProductionImages : open === "event" ? eventCoverageImages : [];

  return (
    <section id="services" className="relative border-t border-white/5 bg-background py-20 md:py-40">
      <div className="relative mx-auto max-w-[1600px] px-5 md:px-12">
        <SectionLabel label="Services" />
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:mb-20 md:flex-row md:items-end">
          <Reveal>
            <h2 className="max-w-3xl font-display text-4xl font-extrabold leading-[0.95] tracking-tight md:text-7xl">
              Our <span className="italic font-serif font-medium text-gold">Services</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              From concept to delivery — we handle every stage of the production process
              with creativity and precision.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-px bg-white/10 md:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.06}>
              <div className="group relative h-full overflow-hidden bg-background p-6 transition-colors duration-500 hover:bg-charcoal md:p-10">
                <s.icon className="relative h-8 w-8 text-gold transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-110 md:h-9 md:w-9" strokeWidth={1.4} />
                <h3 className="relative mt-8 font-display text-xl font-extrabold tracking-tight md:mt-10 md:text-3xl">
                  {s.title}
                </h3>
                <p className="relative mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground md:mt-4">
                  {s.desc}
                </p>
                <button
                  onClick={() => setOpen(s.key)}
                  className="relative mt-8 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-gold opacity-0 transition-all duration-500 group-hover:opacity-100 cursor-pointer md:mt-10"
                >
                  Explore <span>→</span>
                </button>
                <div className="absolute bottom-0 left-0 h-px w-0 bg-gold transition-all duration-700 group-hover:w-full" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <Dialog open={open !== null} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="w-[95vw] max-w-4xl bg-background border-white/10 max-h-[88vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-extrabold text-foreground md:text-2xl">
              {activeService?.title}
            </DialogTitle>
          </DialogHeader>

          {activeService && (
            <div className="mt-2">
              <p className="text-sm leading-relaxed text-muted-foreground mb-6">
                {activeService.desc}
              </p>

              {activeService.hasContent && activeImages.length > 0 ? (
                <div className="columns-2 gap-2 md:columns-3 md:gap-3">
                  {activeImages.map((src, idx) => (
                    <div key={idx} className="mb-2 break-inside-avoid overflow-hidden md:mb-3">
                      <img
                        src={src}
                        alt={`${activeService.title} ${idx + 1}`}
                        className="w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center border border-white/10 text-sm text-muted-foreground uppercase tracking-widest">
                  Coming Soon
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
