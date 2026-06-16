export interface PortfolioItem {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  year: string;
  client: string;
  location: string;
  coverImage: string;
  coverVideo?: string;
  images: string[];
  description: string;
  featured?: boolean;
}

export const portfolio: PortfolioItem[] = [
  {
    slug: "kufpec-conference",
    title: "KUFPEC Conference",
    subtitle: "International Industry Exhibition",
    category: "Conference & Exhibition",
    year: "2024",
    client: "KUFPEC",
    location: "Cairo, Egypt",
    coverImage: "/events/kufpec/kufpec-1.jpg",
    images: Array.from({ length: 10 }, (_, i) => `/events/kufpec/kufpec-${i + 1}.jpg`),
    description:
      "Professional coverage of the KUFPEC international industry conference and exhibition. Capturing executive meetings, booth interactions, and high-level networking moments with discretion and precision. A visual archive reflecting the scale and prestige of a world-class industry event.",
    featured: true,
  },
  {
    slug: "abiec-event",
    title: "ABIEC Event",
    subtitle: "Corporate Gathering & Networking",
    category: "Corporate Event",
    year: "2025",
    client: "ABIEC",
    location: "Cairo, Egypt",
    coverImage: "/events/abiec/abiec-1.jpg",
    images: Array.from({ length: 5 }, (_, i) => `/events/abiec/abiec-${i + 1}.jpg`),
    description:
      "Comprehensive event photography for the ABIEC corporate gathering. From keynote addresses to candid networking moments, every key moment was documented with a cinematic, editorial eye that matches the prestige of the occasion.",
    featured: true,
  },
  {
    slug: "sparix-event",
    title: "Spirax Sarco Event",
    subtitle: "Corporate Product Launch & Showcase",
    category: "Corporate Event",
    year: "2025",
    client: "Spirax Sarco",
    location: "Cairo, Egypt",
    coverImage: "/events/sparix/sparix-1.jpg",
    images: Array.from({ length: 12 }, (_, i) => `/events/sparix/sparix-${i + 1}.jpg`),
    description:
      "A full-day corporate event coverage for Spirax Sarco, capturing product demonstrations, executive presentations, and brand activations. Detailed, professional photography that communicates the precision and quality of their engineering brand.",
    featured: true,
  },
  {
    slug: "event-coverage",
    title: "Event Coverage",
    subtitle: "Multi-Event Documentation",
    category: "Event Coverage",
    year: "2025",
    client: "Various Clients",
    location: "Cairo, Egypt",
    coverImage: "/events/event-coverage/1.jpg",
    images: Array.from({ length: 18 }, (_, i) => `/events/event-coverage/${i + 1}.jpg`),
    description:
      "A curated selection of event photography spanning corporate gatherings, cultural celebrations, and private occasions across Cairo. Each image reflects our commitment to capturing authentic moments with a polished, editorial approach.",
    featured: true,
  },
  {
    slug: "media-production",
    title: "Media Production",
    subtitle: "Commercial & Corporate Video Production",
    category: "Media Production",
    year: "2025",
    client: "Various Clients",
    location: "Cairo, Egypt",
    coverImage: "/events/media-production/1.jpg",
    images: Array.from({ length: 4 }, (_, i) => `/events/media-production/${i + 1}.jpg`),
    description:
      "High-end media production services covering commercial video, drone cinematography, and corporate content creation. Every project is approached with a cinematic sensibility and a commitment to telling compelling visual stories.",
  },
  {
    slug: "mapso",
    title: "Mapso",
    subtitle: "Corporate Event Coverage",
    category: "Corporate Event",
    year: "2025",
    client: "Mapso",
    location: "Cairo, Egypt",
    coverImage: "/events/mabso/1.webp",
    images: Array.from({ length: 5 }, (_, i) => `/events/mabso/${i + 1}.webp`),
    description:
      "Full-scale event documentation for Mapso, capturing the energy, the crowd, and the carefully staged moments that define a successful corporate event. Every frame was selected to tell a story of professionalism and passion.",
  },
  {
    slug: "nas-academy",
    title: "NAS Academy Event",
    subtitle: "Educational Event Coverage",
    category: "Corporate Event",
    year: "2025",
    client: "NAS Academy",
    location: "Cairo, Egypt",
    coverImage: "/events/nasacademy/1.webp",
    images: Array.from({ length: 5 }, (_, i) => `/events/nasacademy/${i + 1}.webp`),
    description:
      "Dynamic coverage of the NAS Academy event, blending candid audience shots with polished stage photography. The visual narrative reflects the academy's commitment to education, innovation, and community engagement.",
  },
  {
    slug: "pharmaoverses",
    title: "Pharmaoverses",
    subtitle: "Pharmaceutical Event Coverage",
    category: "Corporate Event",
    year: "2024",
    client: "Pharmaoverses",
    location: "Cairo, Egypt",
    coverImage: "/events/pharmaoverses/1.webp",
    images: Array.from({ length: 2 }, (_, i) => `/events/pharmaoverses/${i + 1}.webp`),
    description:
      "Professional event photography for Pharmaoverses, capturing key presentations, executive interactions, and the dynamic atmosphere of the industry gathering.",
  },
  {
    slug: "sohur-event",
    title: "Sohur Event",
    subtitle: "Ramadan Occasion Coverage",
    category: "Social Event",
    year: "2025",
    client: "Private Client",
    location: "Cairo, Egypt",
    coverImage: "/events/sohur/1.webp",
    images: Array.from({ length: 6 }, (_, i) => `/events/sohur/${i + 1}.webp`),
    description:
      "Intimate and atmospheric coverage of a Ramadan Sohur gathering. The photography captures warm, candid moments between guests in a beautifully lit setting, preserving memories of a cherished occasion.",
  },
];

export function getPortfolioItem(slug: string): PortfolioItem | undefined {
  return portfolio.find((item) => item.slug === slug);
}

export function getRelatedItems(slug: string, count = 3): PortfolioItem[] {
  return portfolio.filter((item) => item.slug !== slug).slice(0, count);
}
