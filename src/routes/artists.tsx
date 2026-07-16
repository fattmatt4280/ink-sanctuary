import { createFileRoute, Link } from "@tanstack/react-router";
import { ImagePlaceholder } from "@/components/site/ImagePlaceholder";
import { ARTISTS } from "@/lib/site-data";

export const Route = createFileRoute("/artists")({
  head: () => ({
    meta: [
      { title: "Artists — [SHOP NAME]" },
      {
        name: "description",
        content:
          "Meet the resident artists at [SHOP NAME] in Aurora, IL — specialists in fine-line, black & grey, color realism, traditional, and blackwork tattooing.",
      },
      { property: "og:title", content: "Artists — [SHOP NAME]" },
      {
        property: "og:description",
        content: "Resident artists at [SHOP NAME], Aurora, IL.",
      },
    ],
  }),
  component: ArtistsPage,
});

function ArtistsPage() {
  return (
    <>
      <section className="px-6 md:px-12 pt-20 md:pt-28 pb-16 border-b border-border">
        <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-6">
          The Collective
        </div>
        <h1 className="font-serif italic text-5xl md:text-6xl max-w-[18ch] leading-[0.95]">
          Four hands. Four disciplines. One studio.
        </h1>
      </section>

      <section className="hairline-grid grid grid-cols-1 md:grid-cols-2">
        {ARTISTS.map((a) => (
          <Link
            key={a.slug}
            to="/artists/$slug"
            params={{ slug: a.slug }}
            className="group block bg-background"
          >
            <ImagePlaceholder aspect="portrait" label={`Portrait — ${a.name}`} />
            <div className="px-6 py-8 flex items-end justify-between gap-6">
              <div className="min-w-0">
                <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-2">
                  {a.specialty.join(" · ")}
                </div>
                <h2 className="font-serif italic text-3xl truncate">{a.name}</h2>
              </div>
              <span className="text-[10px] uppercase tracking-[0.2em] border-b border-foreground pb-0.5 group-hover:text-muted-foreground shrink-0">
                View
              </span>
            </div>
          </Link>
        ))}
      </section>
    </>
  );
}
