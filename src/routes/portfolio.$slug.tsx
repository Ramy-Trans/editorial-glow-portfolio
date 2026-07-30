import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, MapPin, Calendar, User, Tag } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Lightbox } from "@/components/site/Lightbox";
import { Reveal } from "@/components/site/Reveal";
import { getPortfolioItem, getRelatedItems } from "@/data/portfolio";

export const Route = createFileRoute("/portfolio/$slug")({
  head: ({ params }) => {
    const item = getPortfolioItem(params.slug);
    return {
      meta: [
        { title: item ? `${item.title} — GJ Media House` : "Not Found" },
        { name: "description", content: item?.description ?? "" },
      ],
    };
  },
  component: PortfolioDetailPage,
  notFoundComponent: () => (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      <h1 className="font-display text-6xl font-extrabold">404</h1>
      <p className="mt-4 text-muted-foreground">Project not found.</p>
      <Link to="/portfolio" className="mt-8 border border-gold px-6 py-3 text-sm uppercase tracking-[0.2em] text-gold hover:bg-gold hover:text-gold-foreground transition-all">
        Back to Portfolio
      </Link>
    </div>
  ),
});

function PortfolioDetailPage() {
  const { slug } = Route.useParams();
  const item = getPortfolioItem(slug);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeImg, setActiveImg] = useState(0);

  if (!item) throw notFound();

  const related = getRelatedItems(slug, 3);
  const hasImages = item.images.length > 0;

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const nextImg = () =>
    setLightboxIndex((prev) =>
      prev !== null ? (prev + 1) % item.images.length : null
    );
  const prevImg = () =>
    setLightboxIndex((prev) =>
      prev !== null ? (prev - 1 + item.images.length) % item.images.length : null
    );

  return (
    <main className="relative bg-background text-foreground">
      <Nav />

      {/* Hero */}
      <section className="relative h-[65vh] overflow-hidden md:h-[80vh]">
        {hasImages ? (
          <AnimatePresence mode="wait">
            <motion.img
              key={item.images[activeImg]}
              src={item.images[activeImg]}
              alt={item.title}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>
        ) : item.coverVideo ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src={item.coverVideo} />
          </video>
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 to-transparent" />

        {/* Back button */}
        <div className="absolute left-6 top-28 z-10 md:left-12 md:top-32">
          <Link
            to="/portfolio"
            className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All Works
          </Link>
        </div>

        {/* Lightbox trigger */}
        {hasImages && (
          <button
            onClick={() => openLightbox(activeImg)}
            className="absolute bottom-8 right-6 z-10 flex items-center gap-2 border border-gold/40 bg-background/50 px-4 py-2.5 text-[10px] uppercase tracking-[0.3em] text-gold backdrop-blur-sm transition-all hover:border-gold hover:bg-gold hover:text-gold-foreground md:right-12"
          >
            View Gallery
          </button>
        )}

        <div className="absolute bottom-8 left-6 z-10 md:left-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="mb-3 text-[10px] uppercase tracking-[0.4em] text-gold">{item.category}</div>
            <h1 className="font-display text-5xl font-extrabold leading-[0.92] tracking-tight md:text-7xl">
              {item.title}
            </h1>
            <p className="mt-2 text-base text-muted-foreground">{item.subtitle}</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1600px] px-6 md:px-12">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
            {/* Description */}
            <div className="md:col-span-7">
              <Reveal>
                <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
                  {item.description}
                </p>
              </Reveal>

              {/* Image grid */}
              {hasImages && (
                <div className="mt-12 grid grid-cols-2 gap-4">
                  {item.images.slice(1).map((img, i) => (
                    <Reveal key={img} delay={i * 0.1}>
                      <div
                        className="group relative cursor-zoom-in overflow-hidden aspect-[4/3] hover-zoom"
                        onClick={() => openLightbox(i + 1)}
                      >
                        <img
                          src={img}
                          alt={`${item.title} — image ${i + 2}`}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-background/20 opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                    </Reveal>
                  ))}
                </div>
              )}
            </div>

            {/* Project info sidebar */}
            <div className="md:col-span-5 md:pl-8">
              <Reveal>
                <div className="sticky top-32 space-y-8">
                  {/* Thumbnail strip */}
                  <div>
                    <div className="mb-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                      Gallery
                    </div>
                    <div className="flex gap-2">
                      {item.images.map((img, i) => (
                        <button
                          key={img}
                          onClick={() => setActiveImg(i)}
                          className={`relative h-14 w-14 flex-shrink-0 overflow-hidden transition-all ${
                            activeImg === i ? "ring-1 ring-gold" : "opacity-50 hover:opacity-100"
                          }`}
                        >
                          <img src={img} alt="" className="h-full w-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <Link
                    to="/booking"
                    className="group flex w-full items-center justify-center gap-3 bg-gold px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-gold-foreground transition-transform hover:scale-[1.01]"
                  >
                    Book a Similar Session
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Related projects */}
      {related.length > 0 && (
        <section className="border-t border-white/5 py-16 md:py-24">
          <div className="mx-auto max-w-[1600px] px-6 md:px-12">
            <div className="mb-10 flex items-center justify-between">
              <h2 className="font-display text-3xl font-extrabold md:text-4xl">Related Projects</h2>
              <Link
                to="/portfolio"
                className="text-[11px] uppercase tracking-[0.3em] text-gold transition-colors hover:text-foreground"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {related.map((rel, i) => (
                <Reveal key={rel.slug} delay={i * 0.1}>
                  <Link
                    to="/portfolio/$slug"
                    params={{ slug: rel.slug }}
                    className="group relative block aspect-[4/3] overflow-hidden"
                  >
                    <img
                      src={rel.coverImage || "/events/kufpec/kufpec-1.webp"}
                      alt={rel.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-108"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-0 left-0 p-6">
                      <div className="translate-y-2 opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100">
                        <div className="text-[10px] uppercase tracking-[0.3em] text-gold">{rel.category}</div>
                        <div className="mt-1 font-display text-xl font-extrabold">{rel.title}</div>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={item.images}
            current={lightboxIndex}
            onClose={closeLightbox}
            onNext={nextImg}
            onPrev={prevImg}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
