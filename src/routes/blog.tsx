import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RemoteImage } from "@/components/site/RemoteImage";
import { useSite } from "@/lib/site-context";

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover_image_url: string | null;
  published_at: string | null;
};

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Journal — Leon's Art Tattoo" },
      { name: "description", content: "Notes, essays, and studio updates from Leon's Art Tattoo in Aurora, IL." },
      { property: "og:title", content: "Journal — Leon's Art Tattoo" },
      { property: "og:description", content: "Notes, essays, and studio updates from Leon's Art Tattoo." },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const { shop } = useSite();
  const [posts, setPosts] = useState<Post[] | null>(null);

  useEffect(() => {
    supabase
      .from("blog_posts")
      .select("id, slug, title, excerpt, cover_image_url, published_at")
      .eq("published", true)
      .order("published_at", { ascending: false })
      .then(({ data }) => setPosts((data as Post[]) ?? []));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 md:px-10 py-24">
      <div className="mb-16 border-b border-border pb-10">
        <div className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-4">Journal</div>
        <h1 className="font-serif italic text-5xl md:text-7xl leading-[0.95]">
          Field notes from the studio.
        </h1>
        <p className="mt-6 text-muted-foreground max-w-xl">
          Essays, process breakdowns, and dispatches from {shop.name}.
        </p>
      </div>

      {posts === null ? null : posts.length === 0 ? (
        <p className="text-muted-foreground">No posts yet.</p>
      ) : (
        <div className="grid gap-14">
          {posts.map((p) => (
            <article key={p.id} className="grid md:grid-cols-[1fr_2fr] gap-8 items-start group">
              <Link to="/blog/$slug" params={{ slug: p.slug }} className="block">
                <RemoteImage path={p.cover_image_url} aspect="landscape" label={p.title} alt={p.title} />
              </Link>
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">
                  {p.published_at ? new Date(p.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : ""}
                </div>
                <h2 className="font-serif italic text-3xl md:text-4xl leading-tight">
                  <Link to="/blog/$slug" params={{ slug: p.slug }} className="hover:text-muted-foreground transition-colors">
                    {p.title}
                  </Link>
                </h2>
                {p.excerpt && <p className="mt-4 text-muted-foreground">{p.excerpt}</p>}
                <Link
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
                  className="inline-block mt-6 text-[10px] uppercase tracking-[0.3em] border-b border-foreground pb-1"
                >
                  Read
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
