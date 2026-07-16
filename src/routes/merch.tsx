import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/merch")({
  head: () => ({
    meta: [
      { title: "Merch — [SHOP NAME]" },
      {
        name: "description",
        content:
          "Merch from [SHOP NAME] is coming soon. Sign up to be notified when the first drop is available.",
      },
      { property: "og:title", content: "Merch — [SHOP NAME]" },
    ],
  }),
  component: MerchPage,
});

function MerchPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="min-h-[80vh] px-6 md:px-12 py-24 md:py-32 grid place-items-center border-b border-border">
      <div className="max-w-xl text-center">
        <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-6">
          Coming Soon
        </div>
        <h1 className="font-serif italic text-5xl md:text-7xl leading-[0.95] mb-8">
          Something worth wearing is on the way.
        </h1>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-10">
          The first [SHOP NAME] drop is in production. Leave an email and we'll tell you
          the moment it's live — no other mailings.
        </p>
        {submitted ? (
          <p className="font-serif italic text-xl">You're on the list.</p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="bg-background border border-border px-4 py-3 text-sm min-w-0 sm:w-80 placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
            />
            <button
              type="submit"
              className="bg-foreground text-background px-6 py-3 text-sm uppercase tracking-[0.2em] hover:bg-muted-foreground transition-colors"
            >
              Notify Me
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
