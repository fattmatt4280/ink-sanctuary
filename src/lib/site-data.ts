export const SHOP = {
  name: "Leon's Art Tattoo",
  tagline: "Custom tattoos by appointment. Walk-ins welcome.",
  address1: "1161 N Farnsworth Ave",
  address2: "Aurora, IL 60505",
  phone: "(630) 000-0000",
  email: "hello@leonsarttattoo.com",
  instagram: "https://instagram.com/",
  tiktok: "https://tiktok.com/",
  facebook: "https://facebook.com/",
  hours: [
    { day: "Tue — Thu", hours: "12:00 — 20:00" },
    { day: "Fri — Sat", hours: "12:00 — 22:00" },
    { day: "Sun — Mon", hours: "By Appointment" },
  ],
};

export const MARQUEE_ITEMS = [
  "Walk-ins Welcome",
  "Leon's Art Tattoo · Aurora, IL",
  "Custom tattoos by appointment",
  "Fine line · Black & Grey · Color Realism",
  "Est. 2024",
];

export const STYLES = [
  "Fine Line",
  "Black & Grey",
  "Color Realism",
  "Traditional",
  "Blackwork",
  "Illustrative",
] as const;
export type Style = (typeof STYLES)[number];

export type Artist = {
  slug: string;
  name: string;
  specialty: Style[];
  bio: string;
  instagram: string;
};

export const ARTISTS: Artist[] = [
  {
    slug: "artist-one",
    name: "Resident Artist",
    specialty: ["Fine Line", "Black & Grey"],
    bio: "A resident artist at Leon's Art Tattoo specializing in fine line and delicate black & grey work. Full bio coming soon.",
    instagram: "https://instagram.com/",
  },
  {
    slug: "artist-two",
    name: "Resident Artist",
    specialty: ["Color Realism", "Illustrative"],
    bio: "A resident artist at Leon's Art Tattoo focused on vibrant color realism and illustrative pieces. Full bio coming soon.",
    instagram: "https://instagram.com/",
  },
  {
    slug: "artist-three",
    name: "Resident Artist",
    specialty: ["Traditional", "Blackwork"],
    bio: "A resident artist at Leon's Art Tattoo rooted in bold traditional and blackwork tattooing. Full bio coming soon.",
    instagram: "https://instagram.com/",
  },
  {
    slug: "artist-four",
    name: "Resident Artist",
    specialty: ["Blackwork", "Illustrative"],
    bio: "A resident artist at Leon's Art Tattoo working across heavy blackwork and illustrative styles. Full bio coming soon.",
    instagram: "https://instagram.com/",
  },
];

export type PortfolioItem = {
  id: string;
  artistSlug: string;
  style: Style;
  aspect: "square" | "portrait" | "landscape";
};

export const PORTFOLIO: PortfolioItem[] = [
  { id: "p01", artistSlug: "artist-one", style: "Fine Line", aspect: "portrait" },
  { id: "p02", artistSlug: "artist-two", style: "Color Realism", aspect: "square" },
  { id: "p03", artistSlug: "artist-three", style: "Traditional", aspect: "square" },
  { id: "p04", artistSlug: "artist-four", style: "Blackwork", aspect: "portrait" },
  { id: "p05", artistSlug: "artist-one", style: "Black & Grey", aspect: "square" },
  { id: "p06", artistSlug: "artist-two", style: "Illustrative", aspect: "portrait" },
  { id: "p07", artistSlug: "artist-three", style: "Blackwork", aspect: "square" },
  { id: "p08", artistSlug: "artist-four", style: "Illustrative", aspect: "landscape" },
  { id: "p09", artistSlug: "artist-one", style: "Fine Line", aspect: "square" },
  { id: "p10", artistSlug: "artist-two", style: "Color Realism", aspect: "portrait" },
  { id: "p11", artistSlug: "artist-three", style: "Traditional", aspect: "portrait" },
  { id: "p12", artistSlug: "artist-four", style: "Blackwork", aspect: "square" },
];

export type GuestSpot = {
  id: string;
  artistSlug: string;
  city: string;
  venue: string;
  start: string; // ISO
  end: string;
  status: "upcoming" | "past";
};

export const GUEST_SPOTS: GuestSpot[] = [
  {
    id: "g1",
    artistSlug: "artist-one",
    city: "Brooklyn, NY",
    venue: "Guest studio TBA",
    start: "2026-08-14",
    end: "2026-08-18",
    status: "upcoming",
  },
  {
    id: "g2",
    artistSlug: "artist-two",
    city: "Chicago, IL",
    venue: "Villain Arts Convention",
    start: "2026-09-05",
    end: "2026-09-07",
    status: "upcoming",
  },
  {
    id: "g3",
    artistSlug: "artist-three",
    city: "Austin, TX",
    venue: "Guest studio TBA",
    start: "2026-10-22",
    end: "2026-10-26",
    status: "upcoming",
  },
  {
    id: "g4",
    artistSlug: "artist-four",
    city: "Los Angeles, CA",
    venue: "Guest studio TBA",
    start: "2026-05-10",
    end: "2026-05-14",
    status: "past",
  },
  {
    id: "g5",
    artistSlug: "artist-one",
    city: "Denver, CO",
    venue: "Mile High Tattoo Convention",
    start: "2026-03-01",
    end: "2026-03-03",
    status: "past",
  },
];

export const AFTERCARE_STEPS = [
  {
    title: "Days 1 — 5",
    body: "Leave the dermal water-resistant bandage on for 3–5 days. It's designed to stay in place through showers — don't peel it back early or re-bandage on your own.",
  },
  {
    title: "Bandage Removal",
    body: "Remove the bandage in the shower and wash the tattoo thoroughly with unscented soap under warm water. After your shower, pat dry with a clean towel or, preferably, a paper towel — then let it air dry for 30 minutes before applying anything.",
  },
  {
    title: "Week 1",
    body: "Apply a thin layer of Blue Dream Budder (or your preferred aftercare) 3–4 times a day. The tattoo should feel light and hydrated — never soaked or slick.",
  },
  {
    title: "Week 2 and On",
    body: "Begin tapering off usage after the first week as the skin finishes healing. Keep moisturized, avoid direct sun, and once fully healed, apply SPF 50 to preserve the work.",
  },
];

export const AFTERCARE_DOS = [
  "Wash with clean hands only",
  "Use unscented soap and lotion",
  "Sleep on clean sheets",
  "Drink water and rest",
];

export const AFTERCARE_DONTS = [
  "No pools, oceans, hot tubs, or baths for 3 weeks",
  "No direct sunlight or tanning beds",
  "No scratching, picking, or peeling",
  "No workouts that soak the area in sweat for 5 days",
];

export const AFTERCARE_PRODUCTS = [
  { name: "Dermal Water-Resistant Bandage", note: "Worn 3–5 days" },
  { name: "Blue Dream Budder", note: "3–4x daily, first week" },
  { name: "Dr. Bronner's Unscented", note: "Gentle wash" },
  { name: "SPF 50 Mineral", note: "Long-term protection" },
];

export const AFTERCARE_FAQ = [
  {
    q: "Is a little redness and swelling normal?",
    a: "Yes — for the first 48 hours. If it worsens after day 3, spreads, or feels hot, contact us.",
  },
  {
    q: "What if it scabs heavily?",
    a: "Light flaking is expected. Thick scabbing usually means it's over-moisturized or has been re-injured. Ease off ointment and keep it clean.",
  },
  {
    q: "When can I swim or work out?",
    a: "Light movement is fine after 48 hours. No soaking (pools, oceans, hot tubs, baths) for a full 3 weeks.",
  },
  {
    q: "When should I book a touch-up?",
    a: "Wait at least 6 weeks after your session. First touch-ups within 3 months are complimentary for our clients.",
  },
];

export const PRESS_QUOTE = {
  quote:
    "A serious room with a serious hand — Aurora finally has a studio worth the drive.",
  source: "— Local client review",
};
