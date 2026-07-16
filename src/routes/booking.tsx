import { createFileRoute } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/booking")({
  head: () => ({
    meta: [
      { title: "Booking — [SHOP NAME]" },
      {
        name: "description",
        content:
          "Book a consultation or session at [SHOP NAME] in Aurora, IL. Deposits, cancellation policy, and what to bring to your appointment.",
      },
      { property: "og:title", content: "Booking — [SHOP NAME]" },
    ],
  }),
  component: BookingPage,
});

function BookingPage() {
  return (
    <>
      <section className="px-6 md:px-12 pt-20 md:pt-28 pb-16 grid md:grid-cols-2 gap-12 border-b border-border">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-6">
            Booking
          </div>
          <h1 className="font-serif italic text-5xl md:text-6xl leading-[0.95] max-w-[18ch]">
            Reserve a session. We'll take it from there.
          </h1>
        </div>
        <div className="text-base md:text-lg text-muted-foreground leading-relaxed">
          <p>
            Every appointment begins with a short consultation — in person or by message —
            to align on concept, placement, sizing, and pricing. Deposits secure your date
            and are applied to the final cost.
          </p>
          <p className="mt-6">
            Choose an artist to begin, or send a general inquiry and we'll route it to the
            right hand.
          </p>
        </div>
      </section>

      {/* Booking embed placeholder */}
      <section className="px-6 md:px-8 py-16">
        <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-6">
          Schedule
        </div>
        <div
          className="border border-dashed border-border p-12 min-h-[480px] grid place-items-center text-center"
          data-embed-slot="booking"
        >
          <div className="max-w-md">
            <div className="font-serif italic text-2xl mb-4">[BOOKING EMBED]</div>
            <p className="text-sm text-muted-foreground">
              Drop in your Square, Boulevard, Calendly, or custom booking widget here.
              Replace this block with an <code className="text-foreground">&lt;iframe&gt;</code> or
              provider script — the surrounding layout will hold.
            </p>
          </div>
        </div>
      </section>

      {/* Deposit / policy */}
      <section className="px-6 md:px-12 py-20 border-t border-border">
        <div className="grid md:grid-cols-[1fr_2fr] gap-12">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-4">
              Deposits & Policy
            </div>
            <h2 className="font-serif italic text-3xl md:text-4xl leading-tight">
              Read this before you book.
            </h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="deposit">
              <AccordionTrigger className="text-sm uppercase tracking-[0.2em]">
                Deposit
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                A non-refundable deposit of [$AMOUNT] is required to hold your date. The
                deposit is applied toward the final cost of your tattoo.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="cancel">
              <AccordionTrigger className="text-sm uppercase tracking-[0.2em]">
                Rescheduling & Cancellation
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Reschedule with at least [##] hours' notice and your deposit carries to the
                new date. Cancellations forfeit the deposit.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="prep">
              <AccordionTrigger className="text-sm uppercase tracking-[0.2em]">
                Day-of Preparation
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Eat a full meal, hydrate, wear comfortable clothing that exposes the area,
                and bring photo ID. No alcohol for 24 hours before your appointment.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="age">
              <AccordionTrigger className="text-sm uppercase tracking-[0.2em]">
                Age & Consent
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Clients must be 18+ with a valid photo ID. No exceptions.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="touchup">
              <AccordionTrigger className="text-sm uppercase tracking-[0.2em]">
                Touch-Ups
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                First touch-ups within 3 months are complimentary for our clients.
                Reach out through your booking artist to schedule.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </>
  );
}
