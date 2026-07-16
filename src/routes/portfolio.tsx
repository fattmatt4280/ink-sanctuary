import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ImagePlaceholder } from "@/components/site/ImagePlaceholder";
import { ARTISTS, PORTFOLIO, STYLES, type Style } from "@/lib/site-data";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — [SHOP NAME]" },
      {
        name: "description",
        content:
          "The full archive of work from [SHOP NAME], Aurora, IL. Filter by artist and by style: fine line, black & grey, color realism, traditional, blackwork, illustrative.",
      },
      { property: "og:title", content: "Portfolio — [SHOP NAME]" },
    ],
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
  const [artist, setArtist] = useState<string>("all");
  const [style, setStyle] = useState<Style | "all">("all");

  const items = useMemo(
    () =>
      PORTFOLIO.filter(
        (p) => (artist === "all" || p.artistSlug === artist) && (style === "all" || p.style === style),
      ),
    [artist, style],
  );

  return (
    <>
      <section className="px-6 md:px-12 pt-20 md:pt-28 pb-12 border-b border-border">
        <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-6">
          Archive
        </div>
        <h1 className="font-serif italic text-5xl md:text-6xl max-w-[16ch] leading-[0.95]">
          Every piece. Every hand. One archive.
        </h1>
      </section>

      <div className="sticky top-[57px] md:top-[65px] z-40 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="px-6 md:px-8 py-4 flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Artist
            <select
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              className="bg-background border border-border px-3 py-2 text-xs uppercase tracking-[0.2em] text-foreground"
            >
              <option value="all">All</option>
              {ARTISTS.map((a) => (
                <option key={a.slug} value={a.slug}>
                  {a.name}
                </option>
              ))}
            </select>
          </label>
          <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.2em]">
            <button
              onClick={() => setStyle("all")}
              className={`px-3 py-2 border transition-colors ${
                style === "all"
                  ? "border-foreground text-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              All Styles
            </button>
            {STYLES.map((s) => (
              <button
                key={s}
                onClick={() => setStyle(s)}
                className={`px-3 py-2 border transition-colors ${
                  style === s
                    ? "border-foreground text-foreground"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="ml-auto text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            {items.length} pieces
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="px-6 py-32 text-center text-muted-foreground">
          <p className="font-serif italic text-2xl">No work matches that combination.</p>
        </div>
      ) : (
        <section className="hairline-grid grid grid-cols-2 md:grid-cols-3">
          {items.map((p) => {
            const a = ARTISTS.find((x) => x.slug === p.artistSlug);
            return (
              <div key={p.id} className="group relative bg-background">
                <ImagePlaceholder aspect="square" label={p.style} />
                <div className="absolute inset-x-0 bottom-0 p-4 flex items-end justify-between text-[10px] uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-background to-transparent">
                  <span>{p.style}</span>
                  <span className="text-muted-foreground">{a?.name}</span>
                </div>
              </div>
            );
          })}
        </section>
      )}
    </>
  );
}
