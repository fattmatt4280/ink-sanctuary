import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  SHOP as DEFAULT_SHOP,
  MARQUEE_ITEMS as DEFAULT_MARQUEE,
  PRESS_QUOTE as DEFAULT_PRESS,
  AFTERCARE_STEPS,
  AFTERCARE_DOS,
  AFTERCARE_DONTS,
  AFTERCARE_PRODUCTS,
  AFTERCARE_FAQ,
  ARTISTS as DEFAULT_ARTISTS,
  PORTFOLIO as DEFAULT_PORTFOLIO,
  GUEST_SPOTS as DEFAULT_GUEST_SPOTS,
} from "./site-data";

export type ShopInfo = typeof DEFAULT_SHOP;
export type Aftercare = {
  steps: typeof AFTERCARE_STEPS;
  dos: string[];
  donts: string[];
  products: typeof AFTERCARE_PRODUCTS;
  faq: typeof AFTERCARE_FAQ;
};
export type HeroCopy = { eyebrow: string; headline: string; body: string; imageUrl?: string | null };
export type HomeStats = { followers: string; rating: string; reviewCount: string };
export type Artist = {
  id: string;
  slug: string;
  name: string;
  specialties: string[];
  bio: string;
  instagram: string;
  portrait_url: string | null;
};
export type PortfolioRow = {
  id: string;
  artist_id: string | null;
  artist_slug?: string;
  artist_name?: string;
  style: string;
  aspect: "square" | "portrait" | "landscape" | string;
  image_url: string;
  caption: string;
  sort_order: number;
};
export type GuestSpotRow = {
  id: string;
  artist_id: string | null;
  artist_name?: string;
  city: string;
  venue: string;
  start_date: string;
  end_date: string;
  status: "upcoming" | "past" | string;
};

const DEFAULT_HERO: HeroCopy = {
  eyebrow: "Aurora, Illinois · Est. [YEAR]",
  headline: "The body is a canvas for permanent narrative.",
  body: `${DEFAULT_SHOP.name} is a contemporary sanctuary for fine-line, blackwork, and illustrative realism. Custom appointments and select walk-ins at ${DEFAULT_SHOP.address1}.`,
};

const DEFAULT_STATS: HomeStats = {
  followers: "[###]K",
  rating: "4.9 / 5",
  reviewCount: "[###]",
};

type SiteData = {
  shop: ShopInfo;
  marquee: string[];
  press: { quote: string; source: string };
  hero: HeroCopy;
  stats: HomeStats;
  aftercare: Aftercare;
  artists: Artist[];
  portfolio: PortfolioRow[];
  guestSpots: GuestSpotRow[];
  refresh: () => Promise<void>;
};

const FALLBACK: Omit<SiteData, "refresh"> = {
  shop: DEFAULT_SHOP,
  marquee: DEFAULT_MARQUEE,
  press: DEFAULT_PRESS,
  hero: DEFAULT_HERO,
  stats: DEFAULT_STATS,
  aftercare: {
    steps: AFTERCARE_STEPS,
    dos: AFTERCARE_DOS,
    donts: AFTERCARE_DONTS,
    products: AFTERCARE_PRODUCTS,
    faq: AFTERCARE_FAQ,
  },
  artists: DEFAULT_ARTISTS.map((a, i) => ({
    id: `default-${i}`,
    slug: a.slug,
    name: a.name,
    specialties: a.specialty as unknown as string[],
    bio: a.bio,
    instagram: a.instagram,
    portrait_url: null,
  })),
  portfolio: DEFAULT_PORTFOLIO.map((p) => ({
    id: p.id,
    artist_id: null,
    artist_slug: p.artistSlug,
    artist_name: DEFAULT_ARTISTS.find((a) => a.slug === p.artistSlug)?.name,
    style: p.style,
    aspect: p.aspect,
    image_url: "",
    caption: "",
    sort_order: 0,
  })),
  guestSpots: DEFAULT_GUEST_SPOTS.map((g) => ({
    id: g.id,
    artist_id: null,
    artist_name: DEFAULT_ARTISTS.find((a) => a.slug === g.artistSlug)?.name,
    city: g.city,
    venue: g.venue,
    start_date: g.start,
    end_date: g.end,
    status: g.status,
  })),
};

const Ctx = createContext<SiteData | null>(null);

async function loadFromDb(): Promise<Omit<SiteData, "refresh">> {
  const [contentRes, artistsRes, portfolioRes, guestRes] = await Promise.all([
    supabase.from("site_content").select("key, value"),
    supabase.from("artists").select("*").order("sort_order").order("created_at"),
    supabase.from("portfolio_items").select("*").order("sort_order").order("created_at"),
    supabase.from("guest_spots").select("*").order("start_date"),
  ]);

  const contentMap = new Map<string, any>();
  (contentRes.data ?? []).forEach((r: any) => contentMap.set(r.key, r.value));

  const artists: Artist[] = (artistsRes.data ?? []).length
    ? (artistsRes.data as any[]).map((a) => ({
        id: a.id,
        slug: a.slug,
        name: a.name,
        specialties: a.specialties ?? [],
        bio: a.bio ?? "",
        instagram: a.instagram ?? "",
        portrait_url: a.portrait_url,
      }))
    : FALLBACK.artists;

  const artistById = new Map(artists.map((a) => [a.id, a]));

  const portfolio: PortfolioRow[] = (portfolioRes.data ?? []).length
    ? (portfolioRes.data as any[]).map((p) => {
        const a = p.artist_id ? artistById.get(p.artist_id) : undefined;
        return {
          id: p.id,
          artist_id: p.artist_id,
          artist_slug: a?.slug,
          artist_name: a?.name,
          style: p.style ?? "",
          aspect: p.aspect ?? "square",
          image_url: p.image_url ?? "",
          caption: p.caption ?? "",
          sort_order: p.sort_order ?? 0,
        };
      })
    : FALLBACK.portfolio;

  const guestSpots: GuestSpotRow[] = (guestRes.data ?? []).length
    ? (guestRes.data as any[]).map((g) => ({
        id: g.id,
        artist_id: g.artist_id,
        artist_name: g.artist_id ? artistById.get(g.artist_id)?.name : undefined,
        city: g.city,
        venue: g.venue,
        start_date: g.start_date,
        end_date: g.end_date,
        status: g.status,
      }))
    : FALLBACK.guestSpots;

  return {
    shop: { ...FALLBACK.shop, ...(contentMap.get("shop") ?? {}) },
    marquee: contentMap.get("marquee")?.items ?? FALLBACK.marquee,
    press: { ...FALLBACK.press, ...(contentMap.get("press") ?? {}) },
    hero: { ...FALLBACK.hero, ...(contentMap.get("hero") ?? {}) },
    stats: { ...FALLBACK.stats, ...(contentMap.get("stats") ?? {}) },
    aftercare: { ...FALLBACK.aftercare, ...(contentMap.get("aftercare") ?? {}) },
    artists,
    portfolio,
    guestSpots,
  };
}

export function SiteProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Omit<SiteData, "refresh">>(FALLBACK);

  const refresh = useMemo(
    () => async () => {
      try {
        const fresh = await loadFromDb();
        setData(fresh);
      } catch (e) {
        console.warn("site content load failed", e);
      }
    },
    [],
  );

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo<SiteData>(() => ({ ...data, refresh }), [data, refresh]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSite(): SiteData {
  const v = useContext(Ctx);
  if (!v) throw new Error("useSite must be used within SiteProvider");
  return v;
}
