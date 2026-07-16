type Props = { items?: string[]; className?: string };

const DEFAULT = [
  "Walk-ins Welcome",
  "[SHOP NAME] · Aurora, IL",
  "Custom Work by Appointment",
];

export function Marquee({ items = DEFAULT, className = "" }: Props) {
  const seq = [...items, ...items, ...items, ...items];
  return (
    <section
      className={`py-4 border-y border-border overflow-hidden bg-background ${className}`}
      aria-hidden="true"
    >
      <div className="animate-marquee whitespace-nowrap gap-12 text-[10px] font-bold uppercase tracking-[0.3em]">
        {seq.map((item, i) => (
          <span key={i} className="flex items-center gap-12 pr-12">
            {item}
            <span className="text-muted-foreground">/</span>
          </span>
        ))}
      </div>
    </section>
  );
}
