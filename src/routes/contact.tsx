import { createFileRoute } from "@tanstack/react-router";
import { useSite } from "@/lib/site-context";
import { SocialIcons } from "@/components/site/SocialIcons";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact" },
      { name: "description", content: "Address, hours, phone, and directions." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { shop } = useSite();
  const mapQuery = encodeURIComponent(`${shop.address1}, ${shop.address2}`);
  return (
    <>
      <section className="px-6 md:px-12 pt-20 md:pt-28 pb-16 border-b border-border">
        <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-6">
          Visit
        </div>
        <h1 className="font-serif italic text-5xl md:text-6xl max-w-[16ch] leading-[0.95]">
          {shop.address1}. Aurora, Illinois.
        </h1>
      </section>

      <section className="grid md:grid-cols-2 border-b border-border">
        <div className="px-6 md:px-12 py-16 grid gap-12">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-4">
              Address
            </div>
            <address className="not-italic font-serif italic text-2xl leading-snug">
              {shop.address1}
              <br />
              {shop.address2}
            </address>
          </div>

          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-4">
              Reach Us
            </div>
            <div className="space-y-2 text-lg">
              <div>
                <a href={`tel:${shop.phone}`} className="hover:text-muted-foreground">
                  {shop.phone}
                </a>
              </div>
              <div>
                <a href={`mailto:${shop.email}`} className="hover:text-muted-foreground">
                  {shop.email}
                </a>
              </div>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-4">
              Hours
            </div>
            <ul className="space-y-2 text-base">
              {shop.hours.map((h) => (
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
