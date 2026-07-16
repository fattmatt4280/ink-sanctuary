import { useEffect, useState } from "react";
import { resolveImageUrl } from "@/lib/storage";
import { ImagePlaceholder } from "./ImagePlaceholder";

type Aspect = "square" | "portrait" | "landscape" | "hero";

export function RemoteImage({
  path,
  aspect = "square",
  label,
  className,
  alt,
}: {
  path: string | null | undefined;
  aspect?: Aspect;
  label?: string;
  className?: string;
  alt?: string;
}) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    if (!path) {
      setUrl(null);
      return;
    }
    resolveImageUrl(path).then((u) => {
      if (alive) setUrl(u);
    });
    return () => {
      alive = false;
    };
  }, [path]);

  if (!url) return <ImagePlaceholder aspect={aspect} label={label} className={className} />;

  const aspectClass =
    aspect === "portrait"
      ? "aspect-[3/4]"
      : aspect === "landscape"
        ? "aspect-[4/3]"
        : aspect === "hero"
          ? "aspect-[4/5] md:aspect-auto"
          : "aspect-square";

  return (
    <div className={`overflow-hidden bg-card ${aspectClass} ${className ?? ""}`}>
      <img src={url} alt={alt ?? label ?? ""} className="w-full h-full object-cover" loading="lazy" />
    </div>
  );
}
