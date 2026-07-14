import { Instagram, Facebook, Linkedin } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { siteSettings } from "@/data/settings";

const navLinks = [
  { to: "/portfolio", label: "Portfolio" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/contact", label: "Contact" },
  { to: "/booking", label: "Get Quotation" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-background">
      <div className="mx-auto max-w-[1600px] px-6 py-16 md:px-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Link to="/" className="font-display text-2xl font-extrabold tracking-tight">
              GJ <span className="text-gold">Media</span> House
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Professional event, corporate, conference, and hotel photography
              studio based in Cairo, Egypt.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <SocialLink label="Instagram" href={siteSettings.instagram}><Instagram className="h-4 w-4" /></SocialLink>
              <SocialLink label="Facebook" href={siteSettings.facebook}><Facebook className="h-4 w-4" /></SocialLink>
              <SocialLink label="LinkedIn" href={siteSettings.linkedin}><Linkedin className="h-4 w-4" /></SocialLink>
            </div>
          </div>

          <div className="md:col-span-2 md:col-start-6">
            <div className="mb-4 text-[10px] uppercase tracking-[0.4em] text-gold">Navigation</div>
            <nav className="flex flex-col gap-3">
              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="text-sm text-muted-foreground transition-colors hover:text-gold"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="md:col-span-3 md:col-start-9">
            <div className="mb-4 text-[10px] uppercase tracking-[0.4em] text-gold">Contact</div>
            <div className="space-y-3 text-sm text-muted-foreground">
              <a href={`mailto:${siteSettings.email}`} className="block transition-colors hover:text-gold">
                {siteSettings.email}
              </a>
              <a href={`tel:${siteSettings.phone}`} className="block transition-colors hover:text-gold">
                {siteSettings.phone}
              </a>
              <div>{siteSettings.locations.join(" · ")}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-3 border-t border-white/5 px-6 py-6 text-[10px] uppercase tracking-[0.3em] text-muted-foreground md:flex-row md:px-12">
        <div>© {siteSettings.year} {siteSettings.studio} — All rights reserved.</div>
        <div>Made with light &amp; dedication.</div>
      </div>
    </footer>
  );
}

function SocialLink({ children, label, href }: { children: React.ReactNode; label: string; href: string }) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-10 w-10 items-center justify-center border border-white/10 text-muted-foreground transition-all hover:border-gold hover:text-gold"
    >
      {children}
    </a>
  );
}
