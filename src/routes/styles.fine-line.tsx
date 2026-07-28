import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { RemoteImage } from "@/components/site/RemoteImage";
import { BookCTA } from "@/components/site/BookCTA";
import { useSite } from "@/lib/site-context";

export const Route = createFileRoute("/styles/fine-line")({
  head: () => ({
    meta: [
      { title: "Fine Line Tattoo Artists in Aurora, IL — Leon's Art Tattoo" },
      {
        name: "description",
        content:
          "Fine line tattoo artists at Leon's Art Tattoo in Aurora, IL. Delicate single-needle work, minimalist script, and botanicals — by appointment.",
      },
      { property: "og:title", content: "Fine Line Tattoo Artists in Aurora, IL — Leon's Art Tattoo" },
      {
        property: "og:description",
        content:
          "Delicate single-needle fine line tattoos by resident artists at Leon's Art Tattoo in Aurora, IL.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/styles/fine-line" },
    ],
    links: [{ rel: "canonical", href: "/styles/fine-line" }],
  }),
  component: FineLinePage,
});

function FineLinePage() {
  const { portfolio, artists } = useSite();
  const fineLineArtists = useMemo(
    () => artists.filter((a) => (a.specialties ?? []).some((s) => /fine/i.test(s))),
    [artists],
  );
  const fineLineWork = useMemo(
    () => portfolio.filter((p) => /fine/i.test(p.style ?? "")),
    [portfolio],
  );

  return (
    <>
      <section className="px-6 md:px-12 pt-20 md:pt-28 pb-16 border-b border-border">
        <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-6">
          Style Guide
        </div>
        <h1 className="font-serif italic text-5xl md:text-6xl max-w-[20ch] leading-[0.95]">
          Fine line tattoo artists in Aurora, Illinois.
        </h1>
        <p className="mt-8 max-w-[62ch] text-base md:text-lg text-muted-foreground leading-relaxed">
          Fine line tattooing uses a single needle or a tight cluster to draw deliberate,
          hairline-thin marks that heal into quiet, permanent script. At Leon's Art Tattoo we
          treat it as a discipline of restraint — botanicals, script, small figurative work,
          and minimalist portraits — designed to age well on skin.
        </p>
        <div className="mt-10">
          <BookCTA variant="inline" label="Book a fine line consultation" />
        </div>
      </section>

      <section className="px-6 md:px-12 py-20 border-b border-border grid gap-10 md:grid-cols-3">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-3">
            Approach
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Every fine line piece starts with a consultation to talk through placement,
            scale, and how the line will read once it settles into skin over the first year.
          </p>
        </div>
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-3">
            Longevity
          </div>
          <p className="text-muted-foreground leading-relaxed">
            The thinnest lines demand the right placement and honest sizing. We'll tell you
            when a design needs to grow to age well — no oversell, no undersell.
          </p>
        </div>
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-3">
            Aftercare
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Fine line heals fast when you leave it alone. See our{" "}
            <Link to="/aftercare" className="underline hover:text-foreground">
              aftercare guide
            </Link>{" "}
            for the exact routine we send home with every client.
          </p>
        </div>
      </section>

      {fineLineArtists.length > 0 && (
        <section className="px-6 md:px-12 py-20 border-b border-border">
          <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-3">
            Our fine line artists
          </div>
          <h2 className="font-serif italic text-3xl md:text-4xl mb-10">Meet the hands.</h2>
          <ul className="grid gap-6 md:grid-cols-3">
            {fineLineArtists.map((a) => (
              <li key={a.id}>
                <Link
                  to="/artists/$slug"
                  params={{ slug: a.slug }}
                  className="block group"
                >
                  <RemoteImage
                    path={a.portrait_url}
                    aspect="portrait"
                    label={`Fine line tattoo artist ${a.name}`}
                  />
                  <div className="mt-4 font-serif italic text-2xl">{a.name}</div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-1">
                    {(a.specialties ?? []).join(" · ")}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {fineLineWork.length > 0 && (
        <section className="py-20">
          <div className="px-6 md:px-8 mb-10">
            <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-3">
              Selected fine line work
            </div>
            <h2 className="font-serif italic text-3xl md:text-4xl">Recent pieces.</h2>
          </div>
          <div className="hairline-grid grid grid-cols-2 md:grid-cols-3">
            {fineLineWork.map((p) => {
              const artist =
                artists.find((a) => a.id === p.artist_id) ??
                artists.find((a) => a.slug === p.artist_slug);
              return (
                <div key={p.id} className="group relative bg-background">
                  <RemoteImage
                    path={p.image_url}
                    aspect="square"
                    label={`Fine line tattoo${artist ? ` by ${artist.name}` : ""}`}
                  />
                </div>
              );
            })}
          </div>
        </section>
      )}

      <BookCTA
        eyebrow="Ready to book?"
        label="Request a fine line consultation"
      />
    </>
  );
}
