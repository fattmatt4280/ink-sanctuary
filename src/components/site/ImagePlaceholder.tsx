type Props = {
  label?: string;
  aspect?: "square" | "portrait" | "landscape" | "hero" | "wide";
  className?: string;
};

const aspectClass: Record<NonNullable<Props["aspect"]>, string> = {
  square: "aspect-square",
  portrait: "aspect-[4/5]",
  landscape: "aspect-[3/2]",
  hero: "aspect-[4/5]",
  wide: "aspect-[16/9]",
};

export function ImagePlaceholder({ label = "Image", aspect = "square", className = "" }: Props) {
  return (
    <div
      className={`${aspectClass[aspect]} w-full bg-secondary grid place-items-center outline outline-1 -outline-offset-1 outline-border ${className}`}
    >
      <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/60">
        {label}
      </span>
    </div>
  );
}
