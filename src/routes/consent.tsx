import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSite } from "@/lib/site-context";
import { uploadIdPhoto } from "@/lib/idPhotos";
import { TextField, TextAreaField, SelectField, CheckboxRow } from "@/components/site/FormFields";

export const Route = createFileRoute("/consent")({
  head: () => ({
    meta: [
      { title: "Digital Consent Form" },
      {
        name: "description",
        content: "Complete your tattoo consent and health disclosure form before your appointment.",
      },
    ],
  }),
  component: ConsentPage,
});

const HEALTH_CONDITIONS = [
  "Pregnant or nursing",
  "Diabetes",
  "Hemophilia or blood clotting disorder",
  "Epilepsy or seizure disorder",
  "Heart condition",
  "Skin condition (psoriasis, eczema, keloids)",
  "Allergy to latex, pigments, or adhesives",
  "Currently on blood thinners",
  "Under the influence of alcohol or drugs",
];

const today = () => new Date().toISOString().slice(0, 10);

function ConsentPage() {
  const { shop, artists } = useSite();
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);

  const [clientName, setClientName] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [artistName, setArtistName] = useState("");
  const [tattooDescription, setTattooDescription] = useState("");
  const [placement, setPlacement] = useState("");
  const [conditions, setConditions] = useState<string[]>([]);
  const [healthNotes, setHealthNotes] = useState("");
  const [confirms18, setConfirms18] = useState(false);
  const [confirmsNotImpaired, setConfirmsNotImpaired] = useState(false);
  const [confirmsAccurateHealth, setConfirmsAccurateHealth] = useState(false);
  const [understandsRisks, setUnderstandsRisks] = useState(false);
  const [understandsAftercare, setUnderstandsAftercare] = useState(false);
  const [consentsToProcedure, setConsentsToProcedure] = useState(false);
  const [signatureName, setSignatureName] = useState("");
  const [idPhoto, setIdPhoto] = useState<File | null>(null);
  const [idPhotoPreview, setIdPhotoPreview] = useState<string | null>(null);

  function handleIdPhoto(file: File | null) {
    if (idPhotoPreview) URL.revokeObjectURL(idPhotoPreview);
    setIdPhoto(file);
    setIdPhotoPreview(file ? URL.createObjectURL(file) : null);
  }

  const allAcknowledged =
    confirms18 &&
    confirmsNotImpaired &&
    confirmsAccurateHealth &&
    understandsRisks &&
    understandsAftercare &&
    consentsToProcedure;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!allAcknowledged) {
      toast.error("Please check all acknowledgements before signing.");
      return;
    }
    if (!signatureName.trim()) {
      toast.error("Type your full legal name as your signature.");
      return;
    }
    if (!idPhoto) {
      toast.error("Add a photo of your ID before submitting.");
      return;
    }
    setBusy(true);
    try {
      const idPhotoPath = await uploadIdPhoto(idPhoto);
      const { error } = await supabase.from("consent_forms").insert({
        client_name: clientName,
        date_of_birth: dob,
        phone,
        email,
        emergency_contact_name: emergencyName,
        emergency_contact_phone: emergencyPhone,
        artist_name: artistName,
        tattoo_description: tattooDescription,
        placement,
        health_conditions: conditions,
        health_notes: healthNotes,
        confirms_18_plus: confirms18,
        confirms_not_impaired: confirmsNotImpaired,
        confirms_accurate_health_info: confirmsAccurateHealth,
        understands_risks: understandsRisks,
        understands_aftercare: understandsAftercare,
        consents_to_procedure: consentsToProcedure,
        signature_name: signatureName,
        signature_date: today(),
        id_photo_path: idPhotoPath,
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
      <section className="px-6 md:px-12 pt-20 md:pt-28 pb-28 min-h-[60vh] grid place-items-center text-center">
        <div className="max-w-md">
          <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-6">
            Consent Recorded
          </div>
          <h1 className="font-serif italic text-4xl md:text-5xl leading-tight mb-6">
            Thank you, {clientName.split(" ")[0] || "friend"}.
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Your consent form has been received. Bring a valid photo ID to your appointment —
            we'll see you soon.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="px-6 md:px-12 pt-20 md:pt-28 pb-16 border-b border-border">
        <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-6">
          Before Your Appointment
        </div>
        <h1 className="font-serif italic text-5xl md:text-6xl max-w-[18ch] leading-[0.95]">
          Digital consent & health disclosure.
        </h1>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-[60ch] mt-6">
          Complete this form before your session at {shop.name}. It takes about three minutes
          and helps us keep every appointment safe.
        </p>
      </section>

      <form onSubmit={handleSubmit} className="px-6 md:px-12 py-16 grid gap-16 max-w-2xl">
        <div className="grid gap-6">
          <h2 className="font-serif italic text-2xl">Your information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <TextField label="Full legal name" required value={clientName} onChange={(e) => setClientName(e.target.value)} />
            <TextField label="Date of birth" type="date" required value={dob} onChange={(e) => setDob(e.target.value)} />
            <TextField label="Phone" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} />
            <TextField label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField label="Emergency contact name" required value={emergencyName} onChange={(e) => setEmergencyName(e.target.value)} />
            <TextField label="Emergency contact phone" type="tel" required value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value)} />
          </div>
        </div>

        <div className="grid gap-6">
          <h2 className="font-serif italic text-2xl">Photo ID</h2>
          <p className="text-sm text-muted-foreground -mt-3">
            Required to confirm you're 18 or older. Take a photo now or upload one from your device.
          </p>
          <IdPhotoField preview={idPhotoPreview} onFile={handleIdPhoto} />
        </div>

        <div className="grid gap-6">
          <h2 className="font-serif italic text-2xl">Your appointment</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <SelectField label="Artist" value={artistName} onChange={(e) => setArtistName(e.target.value)}>
              <option value="">Select an artist</option>
              {artists.map((a) => (
                <option key={a.id} value={a.name}>{a.name}</option>
              ))}
            </SelectField>
            <TextField label="Placement" required placeholder="e.g. left forearm" value={placement} onChange={(e) => setPlacement(e.target.value)} />
          </div>
          <TextAreaField label="Describe your tattoo" required value={tattooDescription} onChange={(e) => setTattooDescription(e.target.value)} />
        </div>

        <div className="grid gap-6">
          <h2 className="font-serif italic text-2xl">Health disclosure</h2>
          <p className="text-sm text-muted-foreground -mt-3">Check any that apply to you.</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {HEALTH_CONDITIONS.map((c) => (
              <CheckboxRow
                key={c}
                checked={conditions.includes(c)}
                onCheckedChange={(v) =>
                  setConditions((prev) => (v ? [...prev, c] : prev.filter((x) => x !== c)))
                }
              >
                {c}
              </CheckboxRow>
            ))}
          </div>
          <TextAreaField
            label="Details (optional)"
            placeholder="Explain any conditions checked above, current medications, or anything else we should know"
            value={healthNotes}
            onChange={(e) => setHealthNotes(e.target.value)}
          />
        </div>

        <div className="grid gap-4">
          <h2 className="font-serif italic text-2xl mb-2">Acknowledgement & release</h2>
          <CheckboxRow checked={confirms18} onCheckedChange={setConfirms18}>
            I confirm I am 18 years of age or older and have provided valid photo ID.
          </CheckboxRow>
          <CheckboxRow checked={confirmsNotImpaired} onCheckedChange={setConfirmsNotImpaired}>
            I confirm I am not currently under the influence of alcohol or recreational drugs.
          </CheckboxRow>
          <CheckboxRow checked={confirmsAccurateHealth} onCheckedChange={setConfirmsAccurateHealth}>
            I confirm the health information provided above is complete and accurate.
          </CheckboxRow>
          <CheckboxRow checked={understandsRisks} onCheckedChange={setUnderstandsRisks}>
            I understand that tattooing carries inherent risks including infection, allergic
            reaction, and scarring, and I voluntarily accept these risks.
          </CheckboxRow>
          <CheckboxRow checked={understandsAftercare} onCheckedChange={setUnderstandsAftercare}>
            I have read and understand the studio's{" "}
            <a href="/aftercare" target="_blank" className="underline hover:text-muted-foreground">
              aftercare instructions
            </a>{" "}
            and am responsible for following them.
          </CheckboxRow>
          <CheckboxRow checked={consentsToProcedure} onCheckedChange={setConsentsToProcedure}>
            I voluntarily consent to receive a tattoo and release {shop.name} and its artists
            from liability for risks inherent to the procedure.
          </CheckboxRow>
        </div>

        <div className="grid gap-6 border-t border-border pt-8">
          <h2 className="font-serif italic text-2xl">Signature</h2>
          <TextField
            label="Type your full legal name to sign"
            required
            value={signatureName}
            onChange={(e) => setSignatureName(e.target.value)}
          />
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Signed {today()}
          </p>
          <button
            type="submit"
            disabled={busy}
            className="justify-self-start bg-foreground text-background px-8 py-4 text-sm uppercase tracking-[0.25em] disabled:opacity-50"
          >
            {busy ? "Submitting…" : "Submit consent form"}
          </button>
        </div>
      </form>
    </>
  );
}

function IdPhotoField({
  preview,
  onFile,
}: {
  preview: string | null;
  onFile: (file: File | null) => void;
}) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const uploadRef = useRef<HTMLInputElement>(null);

  if (preview) {
    return (
      <div className="grid gap-3 max-w-xs">
        <img src={preview} alt="ID preview" className="w-full border border-border" />
        <button
          type="button"
          onClick={() => onFile(null)}
          className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground justify-self-start"
        >
          Remove & retake
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-4">
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0] ?? null)}
      />
      <input
        ref={uploadRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0] ?? null)}
      />
      <button
        type="button"
        onClick={() => cameraRef.current?.click()}
        className="border border-border px-6 py-3 text-sm uppercase tracking-[0.2em] hover:border-foreground"
      >
        Take Photo
      </button>
      <button
        type="button"
        onClick={() => uploadRef.current?.click()}
        className="border border-border px-6 py-3 text-sm uppercase tracking-[0.2em] hover:border-foreground"
      >
        Upload File
      </button>
    </div>
  );
}
