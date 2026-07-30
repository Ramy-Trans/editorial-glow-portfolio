import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useRouter } from "@tanstack/react-router";
import { MoreVertical } from "lucide-react";
import { MobileMenu } from "./MobileMenu";
import { useLang } from "@/lib/i18n";
import gjLogo from "@/assets/gj-logo-new.png";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const { t, lang, toggleLang } = useLang();

  const links = [
    { to: "/portfolio" as const, label: t("nav_portfolio") },
    { to: "/about" as const, label: t("nav_about") },
    { to: "/services" as const, label: t("nav_services") },
    { to: "/contact" as const, label: t("nav_contact") },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const unsub = router.subscribe("onResolved", () => setMenuOpen(false));
    return unsub;
  }, [router]);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 z-50 w-full transition-all duration-500 ${
          scrolled
            ? "border-b border-white/5 bg-background/90 backdrop-blur-xl py-4"
            : "py-6"
        }`}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 md:px-12">
          <Link to="/" className="flex items-center">
            <img src={gjLogo} alt="GJ Media House" className="h-8 w-8 object-contain md:h-9 md:w-9" />
          </Link>

          <nav className="hidden items-center gap-10 md:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="group relative text-sm font-medium uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full [.active_&]:w-full" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={toggleLang}
              className="hidden items-center gap-1.5 border border-white/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground transition-all duration-300 hover:border-gold hover:text-gold md:flex"
              aria-label="Toggle language"
            >
              {lang === "en" ? "عربي" : "EN"}
            </button>
            <Link
              to="/booking"
              className="hidden border border-gold px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-gold transition-all duration-300 hover:bg-gold hover:text-gold-foreground md:inline-block"
            >
              {t("nav_book_now")}
            </Link>
            {/* Mobile: three-dot menu button */}
            <button
              onClick={() => setMenuOpen(true)}
              className="flex h-9 w-9 items-center justify-center border border-white/15 text-foreground transition-all hover:border-gold hover:text-gold md:hidden"
              aria-label="Open menu"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
