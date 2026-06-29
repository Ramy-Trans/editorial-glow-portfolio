import c1 from "@/assets/client-1.webp";
import c2 from "@/assets/client-2.webp";
import c3 from "@/assets/client-3.webp";
import azalPool from "@/assets/event-azal-pool.webp";

export interface Testimonial {
  id: string;
  img: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  category: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    img: c1,
    name: "Ahmed Al-Rashid",
    role: "Events Manager, AZAL Pyramids Hotel",
    quote:
      "GJ Media House doesn't just take photographs — they capture the atmosphere, the detail, and the emotion of every moment. Our Ramadan events have never looked more beautiful.",
    rating: 5,
    category: "Hotels",
  },
  {
    id: "2",
    img: c2,
    name: "Sarah Khalil",
    role: "Head of Communications, KUFPEC",
    quote:
      "Working with GJ Media House on our international exhibition was seamless. They navigated a complex, multi-hall event with professionalism and delivered images that truly represented our brand.",
    rating: 5,
    category: "Exhibitions",
  },
  {
    id: "3",
    img: c3,
    name: "Omar Nasser",
    role: "CEO, Gulf Corporate Partners",
    quote:
      "Consistent quality, professional conduct, and images that always exceed expectations. GJ Media House is our go-to partner for every corporate event we host.",
    rating: 5,
    category: "Corporate",
  },
  {
    id: "4",
    img: azalPool,
    name: "Layla Hassan",
    role: "Director, Forum Network",
    quote:
      "We trusted GJ Media House with the coverage of our Fourth Education Forum — the promo video and photography were outstanding. Delivered on time, every time.",
    rating: 5,
    category: "Events",
  },
  {
    id: "5",
    img: c1,
    name: "Tariq Al-Mansouri",
    role: "Marketing Director, Maison Azur",
    quote:
      "Our brand photography before GJ Media House was average. After — it was exceptional. The team's eye for composition and light is genuinely world-class.",
    rating: 5,
    category: "Corporate",
  },
  {
    id: "6",
    img: c2,
    name: "Hana Fouad",
    role: "Event Coordinator, Cairo Elite",
    quote:
      "We brought GJ Media House in for a high-profile gala with over 400 guests. They moved through the event quietly and delivered a gallery of images that left everyone speechless.",
    rating: 5,
    category: "Events",
  },
];
