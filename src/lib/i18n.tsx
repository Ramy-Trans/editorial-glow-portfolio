import { createContext, useContext, useState, type ReactNode } from "react";

export type Lang = "en" | "ar";

const t_en = {
  nav_portfolio: "Portfolio",
  nav_about: "About",
  nav_services: "Services",
  nav_contact: "Contact",
  nav_book_now: "Get Quotation",
  hero_label: "Est. 2015 — Media Production & Event Coverage",
  hero_h1: "Crafting Stories,",
  hero_h2: "Building Brands.",
  hero_h3: "",
  hero_desc:
    "Professional media production, event coverage, and live streaming services across Egypt and beyond.",
  hero_cta_portfolio: "View Portfolio",
  hero_cta_book: "Get Quotation",
  hero_scroll: "Scroll",
  about_label: "About the Studio",
  about_heading: "A decade of capturing moments that matter.",
  about_desc:
    "We are a creative media production house specializing in high-quality video production, event coverage, podcast production, and professional photography.",
  about_stat_1_val: "10+",
  about_stat_1_label: "Years of Experience",
  about_stat_2_val: "200+",
  about_stat_2_label: "Events Covered",
  about_stat_3_val: "50+",
  about_stat_3_label: "Corporate Clients",
  about_link: "About the Studio",
  services_label: "What We Do",
  services_heading: "Our Services",
  work_label: "Selected Works",
  work_heading: "Every Frame Tells a Story",
  work_sub: "Selected moments.",
  work_featured: "Featured",
  work_all: "All",
  work_view_all: "View Full Portfolio",
  showcase_label: "Featured Project",
  awards_label: "Our Clients",
  awards_heading: "Trusted by the best.",
  cta_label: "Let's Create",
  cta_h1: "Ready to create",
  cta_h2: "something",
  cta_h3: "extraordinary?",
  cta_desc:
    "We take on a limited number of projects each season. Tell us about your event and let's create something unforgettable together.",
  cta_book: "Get Quotation",
  cta_contact: "Contact Us",
  contact_label: "Get in Touch",
  contact_h1: "Let's talk about",
  contact_h2: "your event",
  contact_desc:
    "We take on a limited number of projects each season to ensure every client receives our full attention. Reach out early to secure your date.",
  contact_email_label: "Email",
  contact_phone_label: "Phone",
  contact_studio_label: "Studio",
  booking_title: "Get Quotation",
  booking_subtitle:
    "Fill in your details and we'll be in touch within 24 hours to discuss your event.",
  booking_name: "Full Name",
  booking_email: "Email Address",
  booking_phone: "Phone Number",
  booking_occasion: "Occasion / Event Type",
  booking_desc: "Tell us about your event",
  booking_submit: "Get Quotation",
  booking_sending: "Sending…",
  booking_success_title: "Request Received!",
  booking_success_desc:
    "Thank you for reaching out. We'll review your request and get back to you within 24 hours.",
  footer_tagline: "Made with light & dedication.",
};

const t_ar: typeof t_en = {
  nav_portfolio: "معرض الأعمال",
  nav_about: "من نحن",
  nav_services: "خدماتنا",
  nav_contact: "اتصل بنا",
  nav_book_now: "احصل على عرض سعر",
  hero_label: "منذ 2015 — إنتاج إعلامي وتغطية فعاليات",
  hero_h1: "نصنع القصص،",
  hero_h2: "نبني العلامات.",
  hero_h3: "",
  hero_desc:
    "إنتاج إعلامي احترافي وتغطية فعاليات وبث مباشر في مصر وخارجها.",
  hero_cta_portfolio: "عرض الأعمال",
  hero_cta_book: "احصل على عرض سعر",
  hero_scroll: "انزل",
  about_label: "عن الاستوديو",
  about_heading: "عقد من التقاط اللحظات الأهم.",
  about_desc:
    "نحن دار إنتاج إعلامي إبداعية متخصصة في إنتاج الفيديو عالي الجودة وتغطية الفعاليات وإنتاج البودكاست والتصوير الاحترافي.",
  about_stat_1_val: "+10",
  about_stat_1_label: "سنوات من الخبرة",
  about_stat_2_val: "+200",
  about_stat_2_label: "فعالية موثقة",
  about_stat_3_val: "+50",
  about_stat_3_label: "عميل مؤسسي",
  about_link: "عن الاستوديو",
  services_label: "ما نقدمه",
  services_heading: "خدماتنا",
  work_label: "أعمال مختارة",
  work_heading: "كل لقطة تحكي قصة",
  work_sub: "لحظات مختارة.",
  work_featured: "مميز",
  work_all: "الكل",
  work_view_all: "عرض كامل الأعمال",
  showcase_label: "مشروع مميز",
  awards_label: "عملاؤنا",
  awards_heading: "ثقة الأفضل.",
  cta_label: "لنبدأ",
  cta_h1: "هل أنت مستعد لإنشاء",
  cta_h2: "شيء",
  cta_h3: "استثنائي؟",
  cta_desc:
    "نقبل عدداً محدوداً من المشاريع في كل موسم. أخبرنا عن فعاليتك ولنصنع معاً شيئاً لا يُنسى.",
  cta_book: "احصل على عرض سعر",
  cta_contact: "تواصل معنا",
  contact_label: "تواصل معنا",
  contact_h1: "دعنا نتحدث عن",
  contact_h2: "فعاليتك",
  contact_desc:
    "نقبل عدداً محدوداً من المشاريع في كل موسم لضمان الاهتمام الكامل بكل عميل. تواصل معنا مبكراً لحجز موعدك.",
  contact_email_label: "البريد الإلكتروني",
  contact_phone_label: "الهاتف",
  contact_studio_label: "الاستوديو",
  booking_title: "احصل على عرض سعر",
  booking_subtitle: "أدخل بياناتك وسنتواصل معك خلال 24 ساعة لمناقشة فعاليتك.",
  booking_name: "الاسم الكامل",
  booking_email: "البريد الإلكتروني",
  booking_phone: "رقم الهاتف",
  booking_occasion: "نوع المناسبة",
  booking_desc: "أخبرنا عن فعاليتك",
  booking_submit: "إرسال الاستفسار",
  booking_sending: "جاري الإرسال…",
  booking_success_title: "تم استلام طلبك!",
  booking_success_desc:
    "شكراً لتواصلك. سنراجع طلبك ونتواصل معك خلال 24 ساعة لمناقشة فعاليتك.",
  footer_tagline: "صُنع بالضوء والإخلاص.",
};

type TranslationKey = keyof typeof t_en;

interface LangContextValue {
  lang: Lang;
  t: (key: TranslationKey) => string;
  toggleLang: () => void;
  isRTL: boolean;
}

const LangContext = createContext<LangContextValue>({
  lang: "en",
  t: (k) => t_en[k],
  toggleLang: () => {},
  isRTL: false,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const isRTL = lang === "ar";
  const dict = lang === "ar" ? t_ar : t_en;
  const t = (key: TranslationKey) => dict[key];
  const toggleLang = () => setLang((l) => (l === "en" ? "ar" : "en"));

  return (
    <LangContext.Provider value={{ lang, t, toggleLang, isRTL }}>
      <div dir={isRTL ? "rtl" : "ltr"} lang={lang}>
        {children}
      </div>
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
