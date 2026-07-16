import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { uploadImage, resolveImageUrl, deleteImage } from "@/lib/storage";
import { useSite } from "@/lib/site-context";

export const Route = createFileRoute("/studio/")({
  component: StudioHome,
});

/* ------------------------------- helpers ------------------------------- */

async function upsertContent(key: string, value: any) {
  const { error } = await supabase.from("site_content").upsert({ key, value }, { onConflict: "key" });
  if (error) throw error;
}

function TextInput({ label, value, onChange, ...rest }: any) {
  return (
    <label className="block">
      <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">{label}</div>
      <input
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-background border border-border px-3 py-2 text-sm focus:outline-none focus:border-foreground"
        {...rest}
      />
    </label>
  );
}

function TextArea({ label, value, onChange, rows = 4 }: any) {
  return (
    <label className="block">
      <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">{label}</div>
      <textarea
        rows={rows}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-background border border-border px-3 py-2 text-sm focus:outline-none focus:border-foreground"
      />
    </label>
  );
}

function Button({ children, variant = "primary", ...rest }: any) {
  const cls =
    variant === "primary"
      ? "bg-foreground text-background hover:bg-muted-foreground"
      : variant === "danger"
        ? "border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
        : "border border-border text-muted-foreground hover:text-foreground";
  return (
    <button
      {...rest}
      className={`px-4 py-2 text-[10px] uppercase tracking-[0.25em] transition-colors disabled:opacity-50 ${cls} ${rest.className ?? ""}`}
    >
      {children}
    </button>
  );
}

function ImagePicker({
  path,
  onChange,
  folder,
  label = "Image",
}: {
  path: string | null;
  onChange: (path: string | null) => void;
  folder: string;
  label?: string;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let alive = true;
    if (path) resolveImageUrl(path).then((u) => alive && setUrl(u));
    else setUrl(null);
    return () => {
      alive = false;
    };
  }, [path]);

  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">{label}</div>
      <div className="flex items-center gap-4">
        <div className="w-24 h-24 bg-card border border-border overflow-hidden grid place-items-center">
          {url ? (
            <img src={url} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-[9px] text-muted-foreground uppercase tracking-[0.2em]">No image</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              setBusy(true);
              try {
                const p = await uploadImage(f, folder);
                if (path) await deleteImage(path).catch(() => {});
                onChange(p);
                toast.success("Image uploaded");
              } catch (err: any) {
                toast.error(err.message ?? "Upload failed");
              } finally {
                setBusy(false);
                if (fileRef.current) fileRef.current.value = "";
              }
            }}
          />
          <Button type="button" onClick={() => fileRef.current?.click()} disabled={busy}>
            {busy ? "Uploading…" : path ? "Replace" : "Upload"}
          </Button>
          {path && (
            <Button
              type="button"
              variant="danger"
              onClick={async () => {
                await deleteImage(path).catch(() => {});
                onChange(null);
              }}
            >
              Remove
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- General ------------------------------- */

function GeneralTab() {
  const { shop, marquee, press, refresh } = useSite();
  const [s, setS] = useState(shop);
  const [m, setM] = useState<string[]>(marquee);
  const [p, setP] = useState(press);
  const [saving, setSaving] = useState(false);

  useEffect(() => setS(shop), [shop]);
  useEffect(() => setM(marquee), [marquee]);
  useEffect(() => setP(press), [press]);

  async function save() {
    setSaving(true);
    try {
      await Promise.all([
        upsertContent("shop", s),
        upsertContent("marquee", { items: m.filter((x) => x.trim()) }),
        upsertContent("press", p),
      ]);
      await refresh();
      toast.success("Saved");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 max-w-3xl">
      <h2 className="font-serif italic text-2xl">Studio info</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput label="Shop name" value={s.name} onChange={(v: string) => setS({ ...s, name: v })} />
        <TextInput label="Tagline" value={s.tagline} onChange={(v: string) => setS({ ...s, tagline: v })} />
        <TextInput label="Address line 1" value={s.address1} onChange={(v: string) => setS({ ...s, address1: v })} />
        <TextInput label="Address line 2" value={s.address2} onChange={(v: string) => setS({ ...s, address2: v })} />
        <TextInput label="Phone" value={s.phone} onChange={(v: string) => setS({ ...s, phone: v })} />
        <TextInput label="Email" value={s.email} onChange={(v: string) => setS({ ...s, email: v })} />
        <TextInput label="Instagram URL" value={s.instagram} onChange={(v: string) => setS({ ...s, instagram: v })} />
        <TextInput label="TikTok URL" value={s.tiktok} onChange={(v: string) => setS({ ...s, tiktok: v })} />
        <TextInput label="Facebook URL" value={s.facebook} onChange={(v: string) => setS({ ...s, facebook: v })} />
      </div>

      <div>
        <h3 className="font-serif italic text-xl mb-3">Hours</h3>
        <div className="grid gap-2">
          {s.hours.map((h, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-end">
              <TextInput
                label={i === 0 ? "Day / label" : ""}
                value={h.day}
                onChange={(v: string) => {
                  const copy = [...s.hours];
                  copy[i] = { ...copy[i], day: v };
                  setS({ ...s, hours: copy });
                }}
              />
              <TextInput
                label={i === 0 ? "Hours" : ""}
                value={h.hours}
                onChange={(v: string) => {
                  const copy = [...s.hours];
                  copy[i] = { ...copy[i], hours: v };
                  setS({ ...s, hours: copy });
                }}
              />
              <Button
                variant="danger"
                onClick={() => setS({ ...s, hours: s.hours.filter((_, j) => j !== i) })}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            variant="secondary"
            onClick={() => setS({ ...s, hours: [...s.hours, { day: "", hours: "" }] })}
          >
            + Add row
          </Button>
        </div>
      </div>

      <div>
        <h3 className="font-serif italic text-xl mb-3">Marquee ticker</h3>
        <div className="grid gap-2">
          {m.map((item, i) => (
            <div key={i} className="grid grid-cols-[1fr_auto] gap-2">
              <input
                value={item}
                onChange={(e) => {
                  const copy = [...m];
                  copy[i] = e.target.value;
                  setM(copy);
                }}
                className="bg-background border border-border px-3 py-2 text-sm focus:outline-none focus:border-foreground"
              />
              <Button variant="danger" onClick={() => setM(m.filter((_, j) => j !== i))}>Remove</Button>
            </div>
          ))}
          <Button variant="secondary" onClick={() => setM([...m, ""])}>+ Add item</Button>
        </div>
      </div>

      <div>
        <h3 className="font-serif italic text-xl mb-3">Press / pull quote</h3>
        <div className="grid gap-4">
          <TextArea label="Quote" value={p.quote} onChange={(v: string) => setP({ ...p, quote: v })} />
          <TextInput label="Source" value={p.source} onChange={(v: string) => setP({ ...p, source: v })} />
        </div>
      </div>

      <div>
        <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
      </div>
    </div>
  );
}

/* ------------------------------- Homepage ------------------------------- */

function HomeTab() {
  const { hero, stats, refresh } = useSite();
  const [h, setH] = useState(hero);
  const [st, setSt] = useState(stats);
  const [saving, setSaving] = useState(false);

  useEffect(() => setH(hero), [hero]);
  useEffect(() => setSt(stats), [stats]);

  async function save() {
    setSaving(true);
    try {
      await Promise.all([upsertContent("hero", h), upsertContent("stats", st)]);
      await refresh();
      toast.success("Saved");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 max-w-3xl">
      <h2 className="font-serif italic text-2xl">Homepage hero</h2>
      <TextInput label="Eyebrow" value={h.eyebrow} onChange={(v: string) => setH({ ...h, eyebrow: v })} />
      <TextArea label="Headline" value={h.headline} onChange={(v: string) => setH({ ...h, headline: v })} rows={2} />
      <TextArea label="Body copy" value={h.body} onChange={(v: string) => setH({ ...h, body: v })} rows={4} />
      <ImagePicker
        path={h.imageUrl ?? null}
        onChange={(p) => setH({ ...h, imageUrl: p })}
        folder="hero"
        label="Hero image"
      />

      <h2 className="font-serif italic text-2xl mt-4">Social proof strip</h2>
      <div className="grid grid-cols-3 gap-4">
        <TextInput label="Followers" value={st.followers} onChange={(v: string) => setSt({ ...st, followers: v })} />
        <TextInput label="Rating" value={st.rating} onChange={(v: string) => setSt({ ...st, rating: v })} />
        <TextInput label="Review count" value={st.reviewCount} onChange={(v: string) => setSt({ ...st, reviewCount: v })} />
      </div>

      <div>
        <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
      </div>
    </div>
  );
}

/* ------------------------------- Artists ------------------------------- */

type DbArtist = {
  id: string;
  slug: string;
  name: string;
  specialties: string[];
  bio: string;
  instagram: string;
  portrait_url: string | null;
  sort_order: number;
};

function ArtistsTab() {
  const [items, setItems] = useState<DbArtist[]>([]);
  const [editing, setEditing] = useState<DbArtist | null>(null);
  const { refresh: refreshSite } = useSite();

  async function load() {
    const { data, error } = await supabase.from("artists").select("*").order("sort_order").order("created_at");
    if (error) return toast.error(error.message);
    setItems((data ?? []) as DbArtist[]);
  }
  useEffect(() => {
    load();
  }, []);

  async function save(a: DbArtist) {
    const payload = {
      slug: a.slug,
      name: a.name,
      specialties: a.specialties,
      bio: a.bio,
      instagram: a.instagram,
      portrait_url: a.portrait_url,
      sort_order: a.sort_order,
    };
    const { error } = a.id.startsWith("new-")
      ? await supabase.from("artists").insert(payload)
      : await supabase.from("artists").update(payload).eq("id", a.id);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEditing(null);
    await load();
    await refreshSite();
  }

  async function remove(id: string) {
    if (!confirm("Delete this artist?")) return;
    const { error } = await supabase.from("artists").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    await load();
    await refreshSite();
  }

  if (editing) {
    return (
      <div className="max-w-2xl grid gap-4">
        <h2 className="font-serif italic text-2xl">
          {editing.id.startsWith("new-") ? "New artist" : "Edit artist"}
        </h2>
        <TextInput label="Name" value={editing.name} onChange={(v: string) => setEditing({ ...editing, name: v })} />
        <TextInput label="URL slug" value={editing.slug} onChange={(v: string) => setEditing({ ...editing, slug: v })} />
        <TextInput
          label="Specialties (comma separated)"
          value={editing.specialties.join(", ")}
          onChange={(v: string) => setEditing({ ...editing, specialties: v.split(",").map((s) => s.trim()).filter(Boolean) })}
        />
        <TextInput label="Instagram URL" value={editing.instagram} onChange={(v: string) => setEditing({ ...editing, instagram: v })} />
        <TextArea label="Bio" value={editing.bio} onChange={(v: string) => setEditing({ ...editing, bio: v })} rows={6} />
        <TextInput
          type="number"
          label="Sort order"
          value={editing.sort_order}
          onChange={(v: string) => setEditing({ ...editing, sort_order: Number(v) || 0 })}
        />
        <ImagePicker
          label="Portrait"
          path={editing.portrait_url}
          folder="artists"
          onChange={(p) => setEditing({ ...editing, portrait_url: p })}
        />
        <div className="flex gap-3">
          <Button onClick={() => save(editing)}>Save</Button>
          <Button variant="secondary" onClick={() => setEditing(null)}>Cancel</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-serif italic text-2xl">Artists</h2>
        <Button
          onClick={() =>
            setEditing({
              id: "new-" + Math.random(),
              slug: "",
              name: "",
              specialties: [],
              bio: "",
              instagram: "",
              portrait_url: null,
              sort_order: items.length,
            })
          }
        >
          + New artist
        </Button>
      </div>
      <div className="border border-border divide-y divide-border">
        {items.length === 0 && (
          <div className="p-6 text-sm text-muted-foreground">No artists yet. Add your first.</div>
        )}
        {items.map((a) => (
          <div key={a.id} className="p-4 flex items-center justify-between gap-4">
            <div>
              <div className="font-medium">{a.name}</div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                /{a.slug} · {a.specialties.join(" · ")}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setEditing(a)}>Edit</Button>
              <Button variant="danger" onClick={() => remove(a.id)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------- Portfolio ------------------------------- */

type DbPortfolio = {
  id: string;
  artist_id: string | null;
  style: string;
  aspect: string;
  image_url: string;
  caption: string;
  sort_order: number;
};

function PortfolioTab() {
  const { refresh: refreshSite, artists } = useSite();
  const [items, setItems] = useState<DbPortfolio[]>([]);
  const [editing, setEditing] = useState<DbPortfolio | null>(null);

  async function load() {
    const { data, error } = await supabase.from("portfolio_items").select("*").order("sort_order").order("created_at");
    if (error) return toast.error(error.message);
    setItems((data ?? []) as DbPortfolio[]);
  }
  useEffect(() => {
    load();
  }, []);

  async function save(p: DbPortfolio) {
    if (!p.image_url) return toast.error("Upload an image first");
    const payload = {
      artist_id: p.artist_id,
      style: p.style,
      aspect: p.aspect,
      image_url: p.image_url,
      caption: p.caption,
      sort_order: p.sort_order,
    };
    const { error } = p.id.startsWith("new-")
      ? await supabase.from("portfolio_items").insert(payload)
      : await supabase.from("portfolio_items").update(payload).eq("id", p.id);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEditing(null);
    await load();
    await refreshSite();
  }

  async function remove(item: DbPortfolio) {
    if (!confirm("Delete this piece?")) return;
    if (item.image_url && !item.image_url.startsWith("http")) {
      await deleteImage(item.image_url).catch(() => {});
    }
    const { error } = await supabase.from("portfolio_items").delete().eq("id", item.id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    await load();
    await refreshSite();
  }

  if (editing) {
    return (
      <div className="max-w-2xl grid gap-4">
        <h2 className="font-serif italic text-2xl">
          {editing.id.startsWith("new-") ? "New portfolio piece" : "Edit portfolio piece"}
        </h2>
        <label className="block">
          <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">Artist</div>
          <select
            value={editing.artist_id ?? ""}
            onChange={(e) => setEditing({ ...editing, artist_id: e.target.value || null })}
            className="w-full bg-background border border-border px-3 py-2 text-sm"
          >
            <option value="">— unassigned —</option>
            {artists.filter((a) => !a.id.startsWith("default-")).map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </label>
        <TextInput label="Style" value={editing.style} onChange={(v: string) => setEditing({ ...editing, style: v })} />
        <label className="block">
          <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">Aspect</div>
          <select
            value={editing.aspect}
            onChange={(e) => setEditing({ ...editing, aspect: e.target.value })}
            className="w-full bg-background border border-border px-3 py-2 text-sm"
          >
            <option value="square">square</option>
            <option value="portrait">portrait</option>
            <option value="landscape">landscape</option>
          </select>
        </label>
        <TextInput label="Caption (optional)" value={editing.caption} onChange={(v: string) => setEditing({ ...editing, caption: v })} />
        <TextInput type="number" label="Sort order" value={editing.sort_order} onChange={(v: string) => setEditing({ ...editing, sort_order: Number(v) || 0 })} />
        <ImagePicker
          label="Image"
          path={editing.image_url || null}
          folder="portfolio"
          onChange={(p) => setEditing({ ...editing, image_url: p ?? "" })}
        />
        <div className="flex gap-3">
          <Button onClick={() => save(editing)}>Save</Button>
          <Button variant="secondary" onClick={() => setEditing(null)}>Cancel</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-serif italic text-2xl">Portfolio</h2>
        <Button
          onClick={() =>
            setEditing({
              id: "new-" + Math.random(),
              artist_id: null,
              style: "",
              aspect: "square",
              image_url: "",
              caption: "",
              sort_order: items.length,
            })
          }
        >
          + New piece
        </Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map((p) => (
          <PortfolioTile key={p.id} item={p} onEdit={() => setEditing(p)} onRemove={() => remove(p)} artists={artists} />
        ))}
      </div>
    </div>
  );
}

function PortfolioTile({ item, onEdit, onRemove, artists }: any) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    resolveImageUrl(item.image_url).then((u) => alive && setUrl(u));
    return () => {
      alive = false;
    };
  }, [item.image_url]);
  const artist = artists.find((a: any) => a.id === item.artist_id);
  return (
    <div className="border border-border">
      <div className="aspect-square bg-card">
        {url && <img src={url} alt="" className="w-full h-full object-cover" />}
      </div>
      <div className="p-3">
        <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground truncate">
          {item.style || "—"} · {artist?.name ?? "unassigned"}
        </div>
        <div className="flex gap-2 mt-2">
          <Button variant="secondary" onClick={onEdit}>Edit</Button>
          <Button variant="danger" onClick={onRemove}>Del</Button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- Travel ------------------------------- */

type DbGuest = {
  id: string;
  artist_id: string | null;
  city: string;
  venue: string;
  start_date: string;
  end_date: string;
  status: string;
  sort_order: number;
};

function TravelTab() {
  const { refresh: refreshSite, artists } = useSite();
  const [items, setItems] = useState<DbGuest[]>([]);
  const [editing, setEditing] = useState<DbGuest | null>(null);

  async function load() {
    const { data, error } = await supabase.from("guest_spots").select("*").order("start_date", { ascending: false });
    if (error) return toast.error(error.message);
    setItems((data ?? []) as DbGuest[]);
  }
  useEffect(() => {
    load();
  }, []);

  async function save(g: DbGuest) {
    const payload = {
      artist_id: g.artist_id,
      city: g.city,
      venue: g.venue,
      start_date: g.start_date,
      end_date: g.end_date,
      status: g.status,
      sort_order: g.sort_order,
    };
    const { error } = g.id.startsWith("new-")
      ? await supabase.from("guest_spots").insert(payload)
      : await supabase.from("guest_spots").update(payload).eq("id", g.id);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEditing(null);
    await load();
    await refreshSite();
  }

  async function remove(id: string) {
    if (!confirm("Delete?")) return;
    const { error } = await supabase.from("guest_spots").delete().eq("id", id);
    if (error) return toast.error(error.message);
    await load();
    await refreshSite();
  }

  if (editing) {
    return (
      <div className="max-w-2xl grid gap-4">
        <h2 className="font-serif italic text-2xl">{editing.id.startsWith("new-") ? "New guest spot" : "Edit"}</h2>
        <label className="block">
          <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">Artist</div>
          <select
            value={editing.artist_id ?? ""}
            onChange={(e) => setEditing({ ...editing, artist_id: e.target.value || null })}
            className="w-full bg-background border border-border px-3 py-2 text-sm"
          >
            <option value="">— unassigned —</option>
            {artists.filter((a) => !a.id.startsWith("default-")).map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </label>
        <TextInput label="City" value={editing.city} onChange={(v: string) => setEditing({ ...editing, city: v })} />
        <TextInput label="Venue / booth" value={editing.venue} onChange={(v: string) => setEditing({ ...editing, venue: v })} />
        <div className="grid grid-cols-2 gap-4">
          <TextInput type="date" label="Start date" value={editing.start_date} onChange={(v: string) => setEditing({ ...editing, start_date: v })} />
          <TextInput type="date" label="End date" value={editing.end_date} onChange={(v: string) => setEditing({ ...editing, end_date: v })} />
        </div>
        <label className="block">
          <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">Status</div>
          <select
            value={editing.status}
            onChange={(e) => setEditing({ ...editing, status: e.target.value })}
            className="w-full bg-background border border-border px-3 py-2 text-sm"
          >
            <option value="upcoming">upcoming</option>
            <option value="past">past</option>
          </select>
        </label>
        <div className="flex gap-3">
          <Button onClick={() => save(editing)}>Save</Button>
          <Button variant="secondary" onClick={() => setEditing(null)}>Cancel</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-serif italic text-2xl">Travel / guest spots</h2>
        <Button
          onClick={() =>
            setEditing({
              id: "new-" + Math.random(),
              artist_id: null,
              city: "",
              venue: "",
              start_date: new Date().toISOString().slice(0, 10),
              end_date: new Date().toISOString().slice(0, 10),
              status: "upcoming",
              sort_order: 0,
            })
          }
        >
          + New
        </Button>
      </div>
      <div className="border border-border divide-y divide-border">
        {items.map((g) => {
          const a = artists.find((x) => x.id === g.artist_id);
          return (
            <div key={g.id} className="p-4 flex items-center justify-between gap-4">
              <div>
                <div className="font-medium">{g.city} · {g.venue}</div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  {g.start_date} → {g.end_date} · {g.status} · {a?.name ?? "unassigned"}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setEditing(g)}>Edit</Button>
                <Button variant="danger" onClick={() => remove(g.id)}>Delete</Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------- Aftercare ------------------------------- */

function AftercareTab() {
  const { aftercare, refresh } = useSite();
  const [a, setA] = useState(aftercare);
  const [saving, setSaving] = useState(false);
  useEffect(() => setA(aftercare), [aftercare]);

  async function save() {
    setSaving(true);
    try {
      await upsertContent("aftercare", a);
      await refresh();
      toast.success("Saved");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-8 max-w-3xl">
      <div>
        <h2 className="font-serif italic text-2xl mb-3">Healing steps</h2>
        <div className="grid gap-3">
          {a.steps.map((s, i) => (
            <div key={i} className="border border-border p-3 grid gap-2">
              <TextInput label={`Step ${i + 1} title`} value={s.title} onChange={(v: string) => {
                const copy = [...a.steps]; copy[i] = { ...copy[i], title: v }; setA({ ...a, steps: copy });
              }} />
              <TextArea label="Body" value={s.body} onChange={(v: string) => {
                const copy = [...a.steps]; copy[i] = { ...copy[i], body: v }; setA({ ...a, steps: copy });
              }} />
              <Button variant="danger" onClick={() => setA({ ...a, steps: a.steps.filter((_, j) => j !== i) })}>Remove step</Button>
            </div>
          ))}
          <Button variant="secondary" onClick={() => setA({ ...a, steps: [...a.steps, { title: "", body: "" }] })}>+ Add step</Button>
        </div>
      </div>

      <SimpleList label="Do's" items={a.dos} onChange={(dos) => setA({ ...a, dos })} />
      <SimpleList label="Don'ts" items={a.donts} onChange={(donts) => setA({ ...a, donts })} />

      <div>
        <h2 className="font-serif italic text-2xl mb-3">Recommended products</h2>
        <div className="grid gap-3">
          {a.products.map((p, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-end">
              <TextInput label={i === 0 ? "Name" : ""} value={p.name} onChange={(v: string) => {
                const copy = [...a.products]; copy[i] = { ...copy[i], name: v }; setA({ ...a, products: copy });
              }} />
              <TextInput label={i === 0 ? "Note" : ""} value={p.note} onChange={(v: string) => {
                const copy = [...a.products]; copy[i] = { ...copy[i], note: v }; setA({ ...a, products: copy });
              }} />
              <Button variant="danger" onClick={() => setA({ ...a, products: a.products.filter((_, j) => j !== i) })}>Remove</Button>
            </div>
          ))}
          <Button variant="secondary" onClick={() => setA({ ...a, products: [...a.products, { name: "", note: "" }] })}>+ Add product</Button>
        </div>
      </div>

      <div>
        <h2 className="font-serif italic text-2xl mb-3">FAQ</h2>
        <div className="grid gap-3">
          {a.faq.map((f, i) => (
            <div key={i} className="border border-border p-3 grid gap-2">
              <TextInput label="Question" value={f.q} onChange={(v: string) => {
                const copy = [...a.faq]; copy[i] = { ...copy[i], q: v }; setA({ ...a, faq: copy });
              }} />
              <TextArea label="Answer" value={f.a} onChange={(v: string) => {
                const copy = [...a.faq]; copy[i] = { ...copy[i], a: v }; setA({ ...a, faq: copy });
              }} />
              <Button variant="danger" onClick={() => setA({ ...a, faq: a.faq.filter((_, j) => j !== i) })}>Remove</Button>
            </div>
          ))}
          <Button variant="secondary" onClick={() => setA({ ...a, faq: [...a.faq, { q: "", a: "" }] })}>+ Add FAQ</Button>
        </div>
      </div>

      <div>
        <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
      </div>
    </div>
  );
}

function SimpleList({ label, items, onChange }: { label: string; items: string[]; onChange: (v: string[]) => void }) {
  return (
    <div>
      <h2 className="font-serif italic text-2xl mb-3">{label}</h2>
      <div className="grid gap-2">
        {items.map((item, i) => (
          <div key={i} className="grid grid-cols-[1fr_auto] gap-2">
            <input
              value={item}
              onChange={(e) => {
                const copy = [...items]; copy[i] = e.target.value; onChange(copy);
              }}
              className="bg-background border border-border px-3 py-2 text-sm"
            />
            <Button variant="danger" onClick={() => onChange(items.filter((_, j) => j !== i))}>Remove</Button>
          </div>
        ))}
        <Button variant="secondary" onClick={() => onChange([...items, ""])}>+ Add</Button>
      </div>
    </div>
  );
}

/* ------------------------------- Root ------------------------------- */

function StudioHome() {
  const tabs = useMemo(
    () => [
      { v: "general", label: "General", el: <GeneralTab /> },
      { v: "home", label: "Homepage", el: <HomeTab /> },
      { v: "artists", label: "Artists", el: <ArtistsTab /> },
      { v: "portfolio", label: "Portfolio", el: <PortfolioTab /> },
      { v: "travel", label: "Travel", el: <TravelTab /> },
      { v: "aftercare", label: "Aftercare", el: <AftercareTab /> },
    ],
    [],
  );
  return (
    <div className="p-6 md:p-10">
      <Tabs defaultValue="general">
        <TabsList className="mb-8 flex-wrap h-auto">
          {tabs.map((t) => (
            <TabsTrigger key={t.v} value={t.v} className="text-[10px] uppercase tracking-[0.25em]">
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((t) => (
          <TabsContent key={t.v} value={t.v}>{t.el}</TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
