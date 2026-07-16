import { Instagram, Facebook } from "lucide-react";
import { useSite } from "@/lib/site-context";

// TikTok not in lucide default — use inline SVG
function TikTokIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.86a8.24 8.24 0 0 0 4.83 1.55v-3.4a4.85 4.85 0 0 1-1.9-.32Z" />
    </svg>
  );
}

export function SocialIcons({ className = "", size = "sm" }: { className?: string; size?: "sm" | "md" }) {
  const s = size === "md" ? "size-5" : "size-4";
  const { shop: SHOP } = useSite();
  return (
    <div className={`flex items-center gap-5 ${className}`}>
      <a
        href={SHOP.instagram}
        target="_blank"
        rel="noreferrer"
        aria-label="Instagram"
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        <Instagram className={s} strokeWidth={1.5} />
      </a>
      <a
        href={SHOP.tiktok}
        target="_blank"
        rel="noreferrer"
        aria-label="TikTok"
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        <TikTokIcon className={s} />
      </a>
      <a
        href={SHOP.facebook}
        target="_blank"
        rel="noreferrer"
        aria-label="Facebook"
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        <Facebook className={s} strokeWidth={1.5} />
      </a>
    </div>
  );
}
