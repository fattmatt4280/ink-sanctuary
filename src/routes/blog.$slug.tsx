import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RemoteImage } from "@/components/site/RemoteImage";

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  published_at: string | null;
};

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} — Leon's Art Tattoo` },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: `/blog/${params.slug}` }],
  }),
  component: BlogPost,
  notFoundComponent: () => (
    <div className="max-w-2xl mx-auto px-6 py-24 text-center">
      <h1 className="font-serif italic text-4xl mb-4">Not found</h1>
      <Link to="/blog" className="text-[10px] uppercase tracking-[0.3em] border-b border-foreground pb-1">
        Back to journal
      </Link>
    </div>
  ),
});

function BlogPost() {
  const { slug } = Route.useParams();
  const [post, setPost] = useState<Post | null | undefined>(undefined);

  useEffect(() => {
    supabase
      .from("blog_posts")
      .select("id, slug, title, excerpt, content, cover_image_url, published_at")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle()
      .then(({ data }) => setPost((data as Post) ?? null));
  }, [slug]);

  if (post === undefined) return null;
  if (post === null) throw notFound();

  return (
    <article className="max-w-3xl mx-auto px-6 md:px-10 py-24">
      <Link to="/blog" className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground">
        ← Journal
      </Link>
      <header className="mt-8 mb-12 border-b border-border pb-10">
        <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4">
          {post.published_at ? new Date(post.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : ""}
        </div>
        <h1 className="font-serif italic text-4xl md:text-6xl leading-[1.05]">{post.title}</h1>
        {post.excerpt && <p className="mt-6 text-lg text-muted-foreground">{post.excerpt}</p>}
      </header>

      {post.cover_image_url && (
        <div className="mb-12">
          <RemoteImage path={post.cover_image_url} aspect="landscape" alt={post.title} />
        </div>
      )}

      <div className="prose prose-invert max-w-none whitespace-pre-wrap font-sans text-base leading-relaxed text-foreground/90">
        {post.content}
      </div>
    </article>
  );
}
