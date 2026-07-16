import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { RemoteImage } from "@/components/site/RemoteImage";
import { BookCTA } from "@/components/site/BookCTA";
import { useSite } from "@/lib/site-context";

export const Route = createFileRoute("/artists/$slug")({
  head: () => ({
    meta: [
      { title: "Artist" },
      { name: "description", content: "Portfolio and booking for the artist." },
    ],
  }),
  component: ArtistDetail,
  notFoundComponent: () => (
    <div className="px-6 py-32 text-center">
      <h1 className="font-serif italic text-4xl">Artist not found.</h1>
      <Link
        to="/artists"
        className="mt-8 inline-block text-[10px] uppercase tracking-[0.25em] border-b border-foreground pb-0.5"
      >
        Back to Artists
      </Link>
    </div>
  ),
});

function ArtistDetail() {
  const { slug } = Route.useParams();
  const { artists, portfolio } = useSite();
  const artist = artists.find((a) => a.slug === slug);
  const [filter, setFilter] = useState<string>("All");

  if (!artist) {
    return (
      <div className="px-6 py-32 text-center">
        <h1 className="font-serif italic text-4xl">Artist not found.</h1>
        <Link to="/artists" className="mt-8 inline-block text-[10px] uppercase tracking-[0.25em] border-b border-foreground pb-0.5">
          Back to Artists
        </Link>
      </div>
    );
  }

  const work = portfolio.filter((p) => p.artist_id === artist.id || p.artist_slug === artist.slug);
  const styles = Array.from(new Set(work.map((p) => p.style).filter(Boolean)));
  const filtered = filter === "All" ? work : work.filter((p) => p.style === filter);

  return (
    <>
      <section className="grid md:grid-cols-2 border-b border-border">
        <RemoteImage
          path={artist.portrait_url}
          aspect="hero"
          label={`Portrait — ${artist.name}`}
          className="md:aspect-auto md:h-[80vh]"
        />
        <div className="px-6 md:px-12 py-16 md:py-24">
          <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-6">
            {artist.specialties.join(" · ")}
          </div>
          <h1 className="font-serif italic text-5xl md:text-6xl leading-[0.95] mb-8">
            {artist.name}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-[42ch] mb-10 whitespace-pre-line">
            {artist.bio}
          </p>
          <div className="flex flex-wrap gap-3">
            <BookCTA variant="inline" label={`Book with ${artist.name}`} />
            {artist.instagram && (
              <a
                href={artist.instagram}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center border border-border py-3 px-6 text-sm uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
              >
                Instagram
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-8 pt-20">
        <div className="flex flex-wrap items-baseline justify-between gap-6 mb-10">
          <h2 className="font-serif italic text-3xl md:text-4xl">Portfolio</h2>
          {styles.length > 0 && (
            <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.2em]">
              {(["All", ...styles]).map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-3 py-2 border transition-colors ${
                    filter === s
                      ? "border-foreground text-foreground"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="hairline-grid grid grid-cols-2 md:grid-cols-3">
          {filtered.map((p) => (
            <div key={p.id} className="bg-background">
              <RemoteImage path={p.image_url} aspect="square" label={p.style} />
            </div>
          ))}
        </div>
      </section>

      <BookCTA eyebrow="Ready to Book" label={`Book with ${artist.name}`} />
    </>
  );
}
