import { createFileRoute } from "@tanstack/react-router";
import { Loader } from "@/components/site/Loader";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { LogoCarousel } from "@/components/site/LogoCarousel";
import { About } from "@/components/site/About";
import { PromoVideo } from "@/components/site/PromoVideo";
import { Services } from "@/components/site/Services";
import { Work } from "@/components/site/Work";
import { Showcase } from "@/components/site/Showcase";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { WhatsApp } from "@/components/site/WhatsApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GJ Studio — Media Production & Event Coverage" },
      {
        name: "description",
        content:
          "Creative media production house specializing in video production, event coverage, live streaming, and professional photography across Egypt and beyond.",
      },
      {
        property: "og:title",
        content: "GJ Studio — Media Production & Event Coverage",
      },
      {
        property: "og:description",
        content:
          "Crafting stories and building brands through cinematic video production, event coverage, and live streaming.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative bg-background text-foreground">
      <Loader />
      <Nav />
      <Hero />
      <LogoCarousel />
      <About />
      <PromoVideo />
      <Services />
      <Work />
      <Showcase />
      <Contact />
      <Footer />
      <WhatsApp />
    </main>
  );
}
