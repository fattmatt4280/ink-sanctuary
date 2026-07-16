import { createFileRoute } from "@tanstack/react-router";
import { SHOP } from "@/lib/site-data";
import { SocialIcons } from "@/components/site/SocialIcons";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — [SHOP NAME]" },
      {
        name: "description",
        content:
          "Visit [SHOP NAME] at 1161 N Farnsworth Ave, Aurora, IL 60505. Hours, phone, email, and directions.",
      },
      { property: "og:title", content: "Contact — [SHOP NAME]" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const mapQuery = encodeURIComponent(`${SHOP.address1}, ${SHOP.address2}`);
  return (
    <>
      <section className="px-6 md:px-12 pt-20 md:pt-28 pb-16 border-b border-border">
        <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-6">
          Visit
        </div>
        <h1 className="font-serif italic text-5xl md:text-6xl max-w-[16ch] leading-[0.95]">
          {SHOP.address1}. Aurora, Illinois.
        </h1>
      </section>

      <section className="grid md:grid-cols-2 border-b border-border">
        <div className="px-6 md:px-12 py-16 grid gap-12">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-4">
              Address
            </div>
            <address className="not-italic font-serif italic text-2xl leading-snug">
              {SHOP.address1}
              <br />
              {SHOP.address2}
            </address>
          </div>

          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-4">
              Reach Us
            </div>
            <div className="space-y-2 text-lg">
              <div>
                <a href={`tel:${SHOP.phone}`} className="hover:text-muted-foreground">
                  {SHOP.phone}
                </a>
              </div>
              <div>
                <a href={`mailto:${SHOP.email}`} className="hover:text-muted-foreground">
                  {SHOP.email}
                </a>
              </div>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-4">
              Hours
            </div>
            <ul className="space-y-2 text-base">
              {SHOP.hours.map((h) => (
                <li key={h.day} className="flex justify-between gap-8 max-w-xs">
                  <span className="text-muted-foreground">{h.day}</span>
                  <span>{h.hours}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-4">
              Follow
            </div>
            <SocialIcons size="md" />
          </div>
        </div>

        <div className="min-h-[420px] md:min-h-full border-t md:border-t-0 md:border-l border-border">
          <iframe
            title="Studio location map"
            src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
            className="w-full h-full min-h-[420px] grayscale contrast-125 opacity-80"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </>
  );
}
