import { Link, useLocation } from "@tanstack/react-router";
import { useSite } from "@/lib/site-context";
import { SocialIcons } from "./SocialIcons";
import { Marquee } from "./Marquee";

export function Footer() {
  const { shop, marquee } = useSite();
  const { pathname } = useLocation();
  if (pathname.startsWith("/studio")) return null;

  return (
    <footer className="bg-card">
      <Marquee items={marquee} className="bg-card" />
      <div className="px-6 md:px-8 py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link to="/" className="text-lg font-semibold tracking-[0.2em] uppercase">
            {shop.name}
          </Link>
          <p className="mt-6 font-serif italic text-xl leading-snug max-w-[24ch] text-foreground">
            {shop.tagline}
          </p>
          <div className="mt-8">
            <SocialIcons />
          </div>
        </div>

        <div>
          <div className="text-[10px] font-semibold tracking-[0.25em] uppercase mb-4 text-muted-foreground">
            Location
          </div>
          <address className="not-italic text-sm leading-relaxed">
            {shop.address1}
            <br />
            {shop.address2}
          </address>
          <div className="mt-6 text-sm text-muted-foreground">
            <div>{shop.phone}</div>
            <div>{shop.email}</div>
          </div>
        </div>

        <div>
          <div className="text-[10px] font-semibold tracking-[0.25em] uppercase mb-4 text-muted-foreground">
            Hours
          </div>
          <ul className="text-sm space-y-2">
            {shop.hours.map((h) => (
              <li key={h.day} className="flex justify-between gap-4 text-muted-foreground">
                <span>{h.day}</span>
                <span className="text-foreground">{h.hours}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="px-6 md:px-8 py-6 border-t border-border flex flex-wrap items-center justify-between gap-4">
        <span className="text-[10px] text-muted-foreground tracking-[0.25em] uppercase">
          © {new Date().getFullYear()} {shop.name}
        </span>
        <nav className="flex gap-6 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          <Link to="/aftercare" className="hover:text-foreground">Aftercare</Link>
          <Link to="/booking" className="hover:text-foreground">Booking</Link>
          <Link to="/contact" className="hover:text-foreground">Contact</Link>
        </nav>
      </div>
    </footer>
  );
}
