import { createFileRoute, Link } from "@tanstack/react-router";
import { RemoteImage } from "@/components/site/RemoteImage";
import { useSite } from "@/lib/site-context";

export const Route = createFileRoute("/artists")({
  head: () => ({
    meta: [
      { title: "Meet Our Tattoo Artists — Leon's Art Tattoo, Aurora IL" },
      {
        name: "description",
        content:
          "Meet the resident tattoo artists at Leon's Art Tattoo in Aurora, IL — specialists in fine line, black & grey, color realism, traditional, and blackwork.",
      },
      { property: "og:title", content: "Meet Our Tattoo Artists — Leon's Art Tattoo" },
      {
        property: "og:description",
        content:
          "Resident tattoo artists at Leon's Art Tattoo in Aurora, IL. Portfolios, specialties, and booking for every hand in the studio.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/artists" },
    ],
    links: [{ rel: "canonical", href: "/artists" }],
  }),
  component: ArtistsPage,
});

function ArtistsPage() {
  const { artists } = useSite();
  return (
    <>
      <section className="px-6 md:px-12 pt-20 md:pt-28 pb-16 border-b border-border">
        <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-6">
          The Collective
        </div>
        <h1 className="font-serif italic text-5xl md:text-6xl max-w-[18ch] leading-[0.95]">
          Meet Our Tattoo Artists
        </h1>
        <p className="mt-6 text-sm uppercase tracking-[0.25em] text-muted-foreground">
          Hands. Disciplines. One studio.
        </p>
      </section>

      <section className="hairline-grid grid grid-cols-1 md:grid-cols-2">
        {artists.map((a) => (
          <Link
            key={a.id}
            to="/artists/$slug"
            params={{ slug: a.slug }}
            className="group block bg-background"
          >
            <RemoteImage path={a.portrait_url} aspect="portrait" label={`Portrait — ${a.name}`} />
            <div className="px-6 py-8 flex items-end justify-between gap-6">
              <div className="min-w-0">
                <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-2">
                  {a.specialties.join(" · ")}
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
