import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AFTERCARE_DONTS,
  AFTERCARE_DOS,
  AFTERCARE_FAQ,
  AFTERCARE_PRODUCTS,
  AFTERCARE_STEPS,
} from "@/lib/site-data";

export const Route = createFileRoute("/aftercare")({
  head: () => ({
    meta: [
      { title: "Aftercare — [SHOP NAME]" },
      {
        name: "description",
        content:
          "Step-by-step healing instructions, do's and don'ts, product recommendations, and FAQs for your new tattoo from [SHOP NAME], Aurora, IL.",
      },
      { property: "og:title", content: "Aftercare — [SHOP NAME]" },
    ],
  }),
  component: AftercarePage,
});

function AftercarePage() {
  return (
    <>
      <section className="px-6 md:px-12 pt-20 md:pt-28 pb-16 border-b border-border">
        <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-6">
          Aftercare
        </div>
        <h1 className="font-serif italic text-5xl md:text-6xl max-w-[16ch] leading-[0.95]">
          Keep it clean. Keep it moisturized. Leave it alone.
        </h1>
      </section>

      {/* Steps */}
      <section className="px-6 md:px-12 py-20 grid gap-12 md:gap-16">
        {AFTERCARE_STEPS.map((s, i) => (
          <div key={s.title} className="grid gap-6 md:grid-cols-[120px_1fr] md:gap-16 border-t border-border pt-8 first:border-0 first:pt-0">
            <div className="font-serif italic text-5xl md:text-6xl text-muted-foreground/60">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div>
              <h2 className="font-serif italic text-3xl md:text-4xl mb-4">{s.title}</h2>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-[60ch]">
                {s.body}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* Do / Don't */}
      <section className="grid md:grid-cols-2 border-t border-border">
        <div className="px-6 md:px-12 py-16 border-b md:border-b-0 md:border-r border-border">
          <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-6">
            Do
          </div>
          <ul className="space-y-4 text-lg">
            {AFTERCARE_DOS.map((d) => (
              <li key={d} className="flex gap-4">
                <span className="font-serif italic text-muted-foreground">✓</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="px-6 md:px-12 py-16">
          <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-6">
            Don't
          </div>
          <ul className="space-y-4 text-lg">
            {AFTERCARE_DONTS.map((d) => (
              <li key={d} className="flex gap-4">
                <span className="font-serif italic text-muted-foreground">✕</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Products */}
      <section className="px-6 md:px-8 py-20 border-t border-border">
        <div className="px-0 md:px-4 mb-10">
          <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-3">
            Recommended
          </div>
          <h2 className="font-serif italic text-3xl md:text-4xl">What we use.</h2>
        </div>
        <div className="hairline-grid grid grid-cols-2 md:grid-cols-4">
          {AFTERCARE_PRODUCTS.map((p) => (
            <div key={p.name} className="bg-background p-6 aspect-square flex flex-col justify-end">
              <div className="text-sm font-medium">{p.name}</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-2">
                {p.note}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 md:px-12 py-20 border-t border-border">
        <div className="grid md:grid-cols-[1fr_2fr] gap-12">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-3">
              FAQ
            </div>
            <h2 className="font-serif italic text-3xl md:text-4xl">Common questions.</h2>
          </div>
          <Accordion type="single" collapsible>
            {AFTERCARE_FAQ.map((f, i) => (
              <AccordionItem key={i} value={`f${i}`}>
                <AccordionTrigger className="text-sm uppercase tracking-[0.15em] text-left">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="px-6 md:px-12 py-16 border-t border-border text-center">
        <p className="font-serif italic text-2xl max-w-[36ch] mx-auto">
          If anything looks or feels wrong — infection, unusual swelling, allergic reaction —
          contact us or your physician right away.
        </p>
        <Link
          to="/contact"
          className="mt-8 inline-block text-[10px] uppercase tracking-[0.25em] border-b border-foreground pb-0.5 hover:text-muted-foreground"
        >
          Contact the Studio
        </Link>
      </section>
    </>
  );
}
