import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { SHOP } from "@/lib/site-data";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/artists", label: "Artists" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/booking", label: "Booking" },
  { to: "/travel", label: "Travel" },
  { to: "/merch", label: "Merch" },
  { to: "/aftercare", label: "Aftercare" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/85 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between px-6 py-4 md:hidden">
        <Link to="/" className="text-xs font-semibold tracking-[0.25em] uppercase">
          {SHOP.name}
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          className="text-foreground"
        >
          {open ? <X className="size-5" strokeWidth={1.5} /> : <Menu className="size-5" strokeWidth={1.5} />}
        </button>
      </div>

      {/* Desktop */}
      <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] md:items-center px-8 py-5">
        <Link to="/" className="text-xs font-semibold tracking-[0.25em] uppercase">
          {SHOP.name}
        </Link>
        <nav className="flex gap-6 justify-center text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          {NAV.slice(1).map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeProps={{ className: "text-foreground" }}
              className="hover:text-foreground transition-colors"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="justify-self-end">
          <Link
            to="/booking"
            className="text-[10px] font-semibold uppercase tracking-[0.25em] border-b border-foreground pb-0.5 hover:text-muted-foreground transition-colors"
          >
            Book
          </Link>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <nav className="md:hidden border-t border-border bg-background">
          <ul className="flex flex-col">
            {NAV.map((n) => (
              <li key={n.to} className="border-b border-border">
                <Link
                  to={n.to}
                  onClick={() => setOpen(false)}
                  activeProps={{ className: "text-foreground" }}
                  className="block px-6 py-4 text-sm uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
