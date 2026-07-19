import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import { useSite } from "@/lib/site-context";
import { TextField, TextAreaField, SelectField } from "@/components/site/FormFields";

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

      <section className="px-6 md:px-12 py-16">
        <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-6">
          Schedule
        </div>
        <ConsultationForm />
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
                Clients must be 18+ with a valid photo ID. No exceptions. Every client completes
                a{" "}
                <Link to="/consent" className="underline hover:text-foreground">
                  digital consent form
                </Link>{" "}
                before their session.
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

function ConsultationForm() {
  const { artists } = useSite();
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredArtist, setPreferredArtist] = useState("");
  const [tattooIdea, setTattooIdea] = useState("");
  const [placement, setPlacement] = useState("");
  const [sizeEstimate, setSizeEstimate] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [preferredDates, setPreferredDates] = useState("");
  const [notes, setNotes] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const { error } = await supabase.from("consultation_requests").insert({
        name,
        email,
        phone,
        preferred_artist: preferredArtist,
        tattoo_idea: tattooIdea,
        placement,
        size_estimate: sizeEstimate,
        budget_range: budgetRange,
        preferred_dates: preferredDates,
        notes,
      });
      if (error) throw error;
      setSubmitted(true);
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (submitted) {
    return (
      <div className="border border-border p-12 text-center">
        <div className="font-serif italic text-3xl mb-4">Request sent.</div>
        <p className="text-muted-foreground max-w-md mx-auto">
          We'll review your idea and follow up by email or phone to schedule your consultation.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 max-w-2xl">
      <div className="grid md:grid-cols-2 gap-6">
        <TextField label="Name" required value={name} onChange={(e) => setName(e.target.value)} />
        <TextField label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField label="Phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <SelectField label="Preferred artist" value={preferredArtist} onChange={(e) => setPreferredArtist(e.target.value)}>
          <option value="">No preference</option>
          {artists.map((a) => (
            <option key={a.id} value={a.name}>{a.name}</option>
          ))}
        </SelectField>
        <TextField label="Placement" placeholder="e.g. left forearm" value={placement} onChange={(e) => setPlacement(e.target.value)} />
        <TextField label="Approximate size" placeholder="e.g. palm-sized" value={sizeEstimate} onChange={(e) => setSizeEstimate(e.target.value)} />
        <TextField label="Budget range" placeholder="e.g. $300–500" value={budgetRange} onChange={(e) => setBudgetRange(e.target.value)} />
        <TextField label="Preferred dates" placeholder="e.g. weekday afternoons in [MONTH]" value={preferredDates} onChange={(e) => setPreferredDates(e.target.value)} />
      </div>
      <TextAreaField label="Describe your tattoo idea" required value={tattooIdea} onChange={(e) => setTattooIdea(e.target.value)} />
      <TextAreaField label="Anything else we should know? (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
      <button
        type="submit"
        disabled={busy}
        className="justify-self-start bg-foreground text-background px-8 py-4 text-sm uppercase tracking-[0.25em] disabled:opacity-50"
      >
        {busy ? "Sending…" : "Request consultation"}
      </button>
    </form>
  );
}
