import { Camera, Building2, PartyPopper, Presentation, Hotel, Film } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ServiceTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlight?: boolean;
}

export interface Service {
  id: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  tiers: ServiceTier[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export const services: Service[] = [
  {
    id: "events",
    icon: PartyPopper,
    title: "Event Photography",
    subtitle: "Weddings, iftars, galas & private occasions",
    description: "Elegant coverage of your most meaningful celebrations.",
    longDescription:
      "From Ramadan iftars at five-star hotels to private weddings and corporate galas, GJ Studio documents every occasion with artistry and discretion. We capture the atmosphere, the details, and the moments that make your event unforgettable.",
    tiers: [
      {
        name: "Half-Day",
        price: "Contact Us",
        description: "4-hour event coverage",
        features: [
          "4 hours of coverage",
          "150+ edited images",
          "Private online gallery",
          "Digital download",
          "48h turnaround",
        ],
      },
      {
        name: "Full Day",
        price: "Contact Us",
        description: "8-hour event coverage",
        features: [
          "8 hours of coverage",
          "300+ edited images",
          "Private online gallery",
          "Digital download",
          "Priority delivery",
          "Print release",
        ],
        highlight: true,
      },
      {
        name: "Multi-Day",
        price: "Custom",
        description: "Conferences & festivals",
        features: [
          "Multi-day coverage",
          "Second photographer",
          "Daily delivery",
          "Full gallery + USB",
          "Commercial rights",
          "Dedicated account manager",
        ],
      },
    ],
  },
  {
    id: "corporate",
    icon: Building2,
    title: "Corporate Events",
    subtitle: "Business gatherings & leadership forums",
    description: "Professional documentation of corporate milestones.",
    longDescription:
      "Business launches, leadership summits, AGMs, and corporate team events — we provide professional, polished photography that reflects your brand's prestige. Delivered with confidentiality and on-time efficiency.",
    tiers: [
      {
        name: "Starter",
        price: "Contact Us",
        description: "Small corporate event",
        features: [
          "3 hours coverage",
          "100+ edited images",
          "Online gallery",
          "48h delivery",
          "Commercial license",
        ],
      },
      {
        name: "Business",
        price: "Contact Us",
        description: "Full corporate event",
        features: [
          "Full day coverage",
          "250+ edited images",
          "Online gallery",
          "24h priority delivery",
          "Commercial license",
          "Brand alignment review",
        ],
        highlight: true,
      },
      {
        name: "Enterprise",
        price: "Custom",
        description: "Multi-event retainer",
        features: [
          "Ongoing partnership",
          "Monthly event coverage",
          "Priority scheduling",
          "Rapid delivery SLA",
          "Dedicated photographer",
          "Full commercial rights",
        ],
      },
    ],
  },
  {
    id: "conferences",
    icon: Presentation,
    title: "Conferences",
    subtitle: "Exhibitions, summits & trade shows",
    description: "Comprehensive coverage of large-scale industry events.",
    longDescription:
      "International trade shows, industry summits, and multi-hall exhibitions demand photographers who can work quickly, navigate large venues, and deliver consistent quality. GJ Studio has covered major industry events including international oil and gas exhibitions across the region.",
    tiers: [
      {
        name: "Single Day",
        price: "Contact Us",
        description: "One-day conference",
        features: [
          "Full day coverage",
          "200+ edited images",
          "Speaker & audience shots",
          "Online delivery",
          "Commercial license",
        ],
      },
      {
        name: "Multi-Day",
        price: "Contact Us",
        description: "2–3 day conference",
        features: [
          "Multi-day coverage",
          "500+ edited images",
          "Daily delivery",
          "Second photographer",
          "Full gallery + USB",
          "Commercial license",
        ],
        highlight: true,
      },
      {
        name: "Exhibition",
        price: "Custom",
        description: "Trade show & exhibition",
        features: [
          "Booth & floor coverage",
          "Brand stand photography",
          "Executive portraits",
          "Networking moments",
          "Video highlights",
          "Rush delivery available",
        ],
      },
    ],
  },
  {
    id: "hotels",
    icon: Hotel,
    title: "Hotel & Hospitality",
    subtitle: "Five-star events & seasonal occasions",
    description: "Premium event photography for luxury hospitality brands.",
    longDescription:
      "GJ Studio is a trusted partner for premium hotels across Egypt. From Ramadan iftar series to exclusive ballroom galas, we understand hospitality's demand for excellence and discretion. Our imagery reflects the warmth, elegance, and atmosphere your venue delivers.",
    tiers: [
      {
        name: "Session",
        price: "Contact Us",
        description: "Single occasion",
        features: [
          "4 hours coverage",
          "150+ edited images",
          "Venue & decor shots",
          "Guest moments",
          "Online gallery",
        ],
      },
      {
        name: "Season",
        price: "Contact Us",
        description: "Ramadan or seasonal package",
        features: [
          "Multi-night coverage",
          "400+ edited images",
          "Consistent brand styling",
          "Social media optimised",
          "Priority turnaround",
          "Commercial license",
        ],
        highlight: true,
      },
      {
        name: "Partnership",
        price: "Custom",
        description: "Year-round hotel partner",
        features: [
          "All-year coverage",
          "Monthly shoot days",
          "Social & marketing assets",
          "Brand alignment",
          "Dedicated photographer",
          "Full media rights",
        ],
      },
    ],
  },
  {
    id: "portraits",
    icon: Camera,
    title: "Portraits & Headshots",
    subtitle: "Executive & professional portraiture",
    description: "Confident, polished portraits for professionals and teams.",
    longDescription:
      "Executive headshots, team portraits, and personal branding photography for professionals who understand the value of a strong first impression. Studio or on-location. Delivered quickly and without compromises.",
    tiers: [
      {
        name: "Individual",
        price: "Contact Us",
        description: "Single executive headshot",
        features: [
          "1-hour studio session",
          "30+ edited selects",
          "2 outfit options",
          "Private gallery",
          "Commercial license",
        ],
      },
      {
        name: "Team",
        price: "Contact Us",
        description: "Corporate team portraits",
        features: [
          "Half-day on location",
          "Individual + group shots",
          "50+ edited images",
          "Online gallery",
          "Commercial license",
        ],
        highlight: true,
      },
      {
        name: "Brand",
        price: "Contact Us",
        description: "Full personal brand shoot",
        features: [
          "Full day production",
          "Multiple locations",
          "100+ edited images",
          "Social media pack",
          "Commercial license",
        ],
      },
    ],
  },
  {
    id: "video",
    icon: Film,
    title: "Video Production",
    subtitle: "Event reels & promotional content",
    description: "Short-form video content for events and corporate clients.",
    longDescription:
      "Beyond photography, GJ Studio produces polished event highlight reels and promotional video content for corporate clients. From educational forum promos to hotel season trailers, our video work captures the energy and prestige of your occasion.",
    tiers: [
      {
        name: "Highlight Reel",
        price: "Contact Us",
        description: "1–3 minute event video",
        features: [
          "Full event filming",
          "1–3 min highlight reel",
          "Licensed music",
          "Colour grading",
          "MP4 delivery",
        ],
      },
      {
        name: "Promo Film",
        price: "Contact Us",
        description: "Branded promotional video",
        features: [
          "Full day filming",
          "3–5 min promo film",
          "Script & direction",
          "Professional editing",
          "Multiple formats",
          "Commercial license",
        ],
        highlight: true,
      },
      {
        name: "Full Production",
        price: "Custom",
        description: "Multi-day media production",
        features: [
          "Multi-day filming",
          "Photo + video combo",
          "Full post-production",
          "Social media cuts",
          "Broadcast quality",
          "Full media rights",
        ],
      },
    ],
  },
];

export const faq: FAQItem[] = [
  {
    question: "How far in advance should I book?",
    answer:
      "For large events and conferences, we recommend booking 4–8 weeks in advance to ensure availability. For smaller gatherings or corporate headshots, 1–2 weeks is usually sufficient. We do our best to accommodate last-minute requests.",
  },
  {
    question: "Do you cover events outside Cairo?",
    answer:
      "Yes. GJ Studio covers events across Egypt and can travel regionally by arrangement. Travel and accommodation costs for events outside Cairo are agreed in advance.",
  },
  {
    question: "What is your editing style?",
    answer:
      "Our images are characterised by clean, natural colours, precise exposure, and a professional finish. We deliver images that look polished and timeless — suited for corporate use, social media, and print without looking over-processed.",
  },
  {
    question: "How long until I receive my images?",
    answer:
      "Standard delivery is 48–72 hours for events and 1 week for larger conferences. Rush delivery (same or next day) is available at an additional fee. You'll receive a preview selection within 24 hours of your event.",
  },
  {
    question: "Do you offer payment plans?",
    answer:
      "Yes. A deposit secures your date, with the balance due on or before the day of the event. For larger or ongoing projects, we can arrange a custom payment schedule.",
  },
  {
    question: "Can we use the images for marketing and social media?",
    answer:
      "All packages include a commercial license for your organisation's use — website, social media, print materials, and internal communications. Extended licensing for broader commercial use is available on request.",
  },
  {
    question: "Do you work with a team or alone?",
    answer:
      "For smaller events, a single photographer covers everything excellently. For larger events, conferences, or events requiring simultaneous coverage in multiple locations, we bring a second photographer at no surprise cost — it's included in our multi-day packages.",
  },
  {
    question: "Do you also provide video?",
    answer:
      "Yes. GJ Studio provides event highlight reels and promotional video production in addition to photography. Speak to us about a combined photo and video package for your event.",
  },
];
