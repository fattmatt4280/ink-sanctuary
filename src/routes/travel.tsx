import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ARTISTS, GUEST_SPOTS } from "@/lib/site-data";

export const Route = createFileRoute("/travel")({
  head: () => ({
    meta: [
      { title: "Travel & Guest Spots — [SHOP NAME]" },
      {
        name: "description",
        content:
          "Upcoming conventions and guest spots from [SHOP NAME] artists — cities, dates, and host studios.",
      },
      { property: "og:title", content: "Travel & Guest Spots — [SHOP NAME]" },
    ],
  }),
  component: TravelPage,
});

function fmt(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function TravelPage() {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const items = GUEST_SPOTS.filter((g) => g.status === tab).sort((a, b) =>
    tab === "upcoming" ? a.start.localeCompare(b.start) : b.start.localeCompare(a.start),
  );

  return (
    <>
      <section className="px-6 md:px-12 pt-20 md:pt-28 pb-16 border-b border-border">
        <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-6">
          On the Road
        </div>
        <h1 className="font-serif italic text-5xl md:text-6xl max-w-[18ch] leading-[0.95]">
          Guest spots and conventions.
        </h1>
      </section>

      <div className="px-6 md:px-8 py-6 border-b border-border flex gap-2">
        {(["upcoming", "past"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-[10px] uppercase tracking-[0.25em] border transition-colors ${
              tab === t
                ? "border-foreground text-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="px-6 py-32 text-center text-muted-foreground">
          <p className="font-serif italic text-2xl">Nothing scheduled here yet.</p>
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {items.map((g) => {
            const artist = ARTISTS.find((a) => a.slug === g.artistSlug);
            return (
              <li key={g.id} className="px-6 md:px-12 py-8 grid gap-4 md:grid-cols-[220px_1fr_1fr_auto] md:items-baseline">
                <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                  {fmt(g.start)} — {fmt(g.end)}
                </div>
                <div className="font-serif italic text-2xl md:text-3xl">{g.city}</div>
                <div className="text-sm text-muted-foreground">{g.venue}</div>
                <div className="text-[10px] uppercase tracking-[0.25em]">{artist?.name}</div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
