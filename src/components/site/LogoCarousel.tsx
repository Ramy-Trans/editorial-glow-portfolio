import { clientLogos } from "@/assets/logos/index";

export function LogoCarousel() {
  return (
    <section className="w-full bg-white py-14 md:py-20">
      <div className="mb-8 px-6 md:px-12 text-center">
        <span className="text-[10px] uppercase tracking-[0.45em] text-neutral-400">
          — Trusted By
        </span>
      </div>

      <div className="relative flex overflow-hidden select-none [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="flex animate-[scroll_40s_linear_infinite] items-center gap-20">
          {[...clientLogos, ...clientLogos].map((logo, i) => (
            <div
              key={i}
              className="shrink-0 flex h-[132px] items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-300"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                style={{
                  maxHeight: `${logo.imgH}px`,
                  maxWidth: `${logo.imgW}px`,
                  width: "auto",
                  height: "auto",
                }}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
