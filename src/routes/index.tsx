import { createFileRoute, Link } from "@tanstack/react-router";
import { Marquee } from "@/components/site/Marquee";
import { BookCTA } from "@/components/site/BookCTA";
import { RemoteImage } from "@/components/site/RemoteImage";
import { ImagePlaceholder } from "@/components/site/ImagePlaceholder";
import { useSite } from "@/lib/site-context";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tattoo Studio · Aurora, IL" },
      {
        name: "description",
        content:
          "A contemporary tattoo studio in Aurora, IL. Fine-line, black & grey, color realism, and traditional work by appointment. Walk-ins welcome.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { shop, marquee, press, hero, stats, portfolio, artists } = useSite();
  const featured = portfolio.slice(0, 6);
  return (
    <>
      <section className="grid md:grid-cols-2 border-b border-border">
        {hero.imageUrl ? (
          <RemoteImage
            path={hero.imageUrl}
            aspect="hero"
            label="Hero"
            className="md:aspect-auto md:h-[80vh]"
          />
        ) : (
          <ImagePlaceholder
            aspect="hero"
            label="Hero — Studio Feature"
            className="md:aspect-auto md:h-[80vh]"
          />
        )}
        <div className="px-6 md:px-12 py-16 md:py-24 flex flex-col items-start justify-center">
          <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-8">
            {hero.eyebrow}
          </div>
          <h1 className="font-serif italic text-5xl md:text-6xl leading-[0.95] text-balance max-w-[16ch] mb-8">
            {hero.headline}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-[38ch] mb-10 whitespace-pre-line">
            {hero.body}
          </p>
          <div className="flex flex-wrap gap-3">
            <BookCTA variant="inline" label="Book Consultation" />
            <Link
              to="/artists"
              className="inline-flex items-center border border-border py-3 px-6 text-sm uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
            >
              Meet the Artists
            </Link>
          </div>
        </div>
      </section>

      <Marquee items={marquee} />

      <section className="pt-20 md:pt-28">
        <div className="px-6 md:px-8 flex items-baseline justify-between mb-10">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-3">
              Selected Work
            </div>
            <h2 className="font-serif italic text-3xl md:text-4xl">Recent from the studio.</h2>
          </div>
          <Link
            to="/portfolio"
            className="text-[10px] uppercase tracking-[0.25em] border-b border-foreground pb-0.5 hover:text-muted-foreground"
          >
            View All
          </Link>
        </div>
        <div className="hairline-grid grid grid-cols-2 md:grid-cols-3">
          {featured.map((p) => {
            const artist = artists.find((a) => a.id === p.artist_id) ?? artists.find((a) => a.slug === p.artist_slug);
            const target = artist ? artist.slug : "";
            const Wrapper: any = target
              ? ({ children, ...r }: any) => <Link to="/artists/$slug" params={{ slug: target }} {...r}>{children}</Link>
              : ({ children, ...r }: any) => <div {...r}>{children}</div>;
            return (
              <Wrapper key={p.id} className="group relative block bg-background">
                <RemoteImage path={p.image_url} aspect="square" label={p.style} />
                <div className="absolute inset-x-0 bottom-0 p-4 flex items-end justify-between text-[10px] uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-background to-transparent">
                  <span>{p.style}</span>
                  <span className="text-muted-foreground">{artist?.name}</span>
                </div>
              </Wrapper>
            );
          })}
        </div>
      </section>

      <section className="py-24 px-6 md:px-12 border-y border-border grid gap-12 md:grid-cols-3 mt-20">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-3">
            Audience
          </div>
          <div className="font-serif italic text-4xl">{stats.followers}</div>
          <div className="text-sm text-muted-foreground mt-2">Instagram followers</div>
        </div>
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-3">
            Reviews
          </div>
          <div className="font-serif italic text-4xl">{stats.rating}</div>
          <div className="text-sm text-muted-foreground mt-2">Google · {stats.reviewCount} reviews</div>
        </div>
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-3">
            Press
          </div>
          <div className="font-serif italic text-xl leading-snug text-balance">
            "{press.quote}"
          </div>
          <div className="text-[10px] uppercase tracking-[0.2em] mt-3 text-muted-foreground">
            {press.source}
          </div>
        </div>
      </section>

      <BookCTA
        eyebrow={`Book at ${shop.name}`}
        label="Schedule Now"
      />
    </>
  );
}
