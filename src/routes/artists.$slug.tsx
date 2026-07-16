import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ImagePlaceholder } from "@/components/site/ImagePlaceholder";
import { BookCTA } from "@/components/site/BookCTA";
import { ARTISTS, PORTFOLIO, type Style } from "@/lib/site-data";

export const Route = createFileRoute("/artists/$slug")({
  loader: ({ params }) => {
    const artist = ARTISTS.find((a) => a.slug === params.slug);
    if (!artist) throw notFound();
    return { artist };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.artist.name ?? "Artist";
    return {
      meta: [
        { title: `${name} — [SHOP NAME]` },
        {
          name: "description",
          content: `Portfolio and booking for ${name} at [SHOP NAME], Aurora, IL.`,
        },
        { property: "og:title", content: `${name} — [SHOP NAME]` },
      ],
    };
  },
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
  const { artist } = Route.useLoaderData();
  const work = PORTFOLIO.filter((p) => p.artistSlug === artist.slug);
  const styles = Array.from(new Set(work.map((p) => p.style)));
  const [filter, setFilter] = useState<Style | "All">("All");
  const filtered = filter === "All" ? work : work.filter((p) => p.style === filter);

  return (
    <>
      <section className="grid md:grid-cols-2 border-b border-border">
        <ImagePlaceholder
          aspect="hero"
          label={`Portrait — ${artist.name}`}
          className="md:aspect-auto md:h-[80vh]"
        />
        <div className="px-6 md:px-12 py-16 md:py-24">
          <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-6">
            {artist.specialty.join(" · ")}
          </div>
          <h1 className="font-serif italic text-5xl md:text-6xl leading-[0.95] mb-8">
            {artist.name}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-[42ch] mb-10">
            {artist.bio}
          </p>
          <div className="flex flex-wrap gap-3">
            <BookCTA variant="inline" label={`Book with ${artist.name}`} />
            <a
              href={artist.instagram}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center border border-border py-3 px-6 text-sm uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
            >
              Instagram
            </a>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-8 pt-20">
        <div className="flex flex-wrap items-baseline justify-between gap-6 mb-10">
          <h2 className="font-serif italic text-3xl md:text-4xl">Portfolio</h2>
          <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.2em]">
            {(["All", ...styles] as const).map((s) => (
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
        </div>
        <div className="hairline-grid grid grid-cols-2 md:grid-cols-3">
          {filtered.map((p) => (
            <div key={p.id} className="bg-background">
              <ImagePlaceholder aspect="square" label={p.style} />
            </div>
          ))}
        </div>
      </section>

      <BookCTA eyebrow="Ready to Book" label={`Book with ${artist.name}`} />
    </>
  );
}
