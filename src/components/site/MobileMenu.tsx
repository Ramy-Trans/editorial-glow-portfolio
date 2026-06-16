import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { siteSettings } from "@/data/settings";
import { useLang } from "@/lib/i18n";
import gjLogo from "@/assets/gj-logo-new.png";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const { t, lang, toggleLang } = useLang();

  const links = [
    { to: "/portfolio" as const, label: t("nav_portfolio") },
    { to: "/about" as const, label: t("nav_about") },
    { to: "/services" as const, label: t("nav_services") },
    { to: "/contact" as const, label: t("nav_contact") },
    { to: "/booking" as const, label: t("nav_book_now") },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[80] flex flex-col bg-background/98 backdrop-blur-2xl"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/8 blur-[150px]"
          />

          <div className="flex items-center justify-between px-6 py-6">
            <Link
              to="/"
              onClick={onClose}
              className="flex items-center"
            >
              <img src={gjLogo} alt="GJ Studio" className="h-9 w-9 object-contain" />
            </Link>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleLang}
                className="border border-white/15 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground"
              >
                {lang === "en" ? "عربي" : "EN"}
              </button>
              <button
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center border border-white/15 text-foreground"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <nav className="flex flex-1 flex-col justify-center px-8">
            {links.map((link, i) => (
              <motion.div
                key={link.to}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{
                  duration: 0.5,
                  delay: 0.1 + i * 0.07,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Link
                  to={link.to}
                  onClick={onClose}
                  className="group flex items-center gap-4 border-b border-white/5 py-5"
                >
                  <span className="font-display text-sm text-gold opacity-50">
                    0{i + 1}
                  </span>
                  <span className="font-display text-4xl font-extrabold tracking-tight transition-colors group-hover:text-gold">
                    {link.label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </nav>

          <div className="px-8 py-8 text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
            {siteSettings.email}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
