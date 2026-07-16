import { Link } from "@tanstack/react-router";

type Props = {
  eyebrow?: string;
  label?: string;
  note?: string;
  variant?: "block" | "inline";
};

export function BookCTA({
  eyebrow = "Secure a Session",
  label = "Book Consultation",
  note,
  variant = "block",
}: Props) {
  if (variant === "inline") {
    return (
      <Link
        to="/booking"
        className="inline-flex items-center gap-2 bg-foreground text-background py-3 px-6 text-sm font-medium tracking-wide hover:bg-muted-foreground transition-colors"
      >
        <svg
          className="size-4 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        {label}
      </Link>
    );
  }

  return (
    <section className="py-24 px-6 text-center border-t border-border">
      <h2 className="text-xs font-bold uppercase tracking-[0.4em] mb-10">{eyebrow}</h2>
      <Link
        to="/booking"
        className="inline-flex items-center bg-foreground text-background py-4 px-10 text-sm font-medium tracking-wide mb-6 hover:bg-muted-foreground transition-colors"
      >
        {label}
      </Link>
      {note && (
        <p className="text-[10px] text-muted-foreground tracking-[0.25em] uppercase">{note}</p>
      )}
    </section>
  );
}
