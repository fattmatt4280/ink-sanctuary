export const SHOP = {
  name: "[SHOP NAME]",
  tagline: "[TAGLINE]",
  address1: "1161 N Farnsworth Ave",
  address2: "Aurora, IL 60505",
  phone: "[PHONE]",
  email: "[EMAIL]",
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
  "[SHOP NAME] · Aurora, IL",
  "[TAGLINE]",
  "Custom Work by Appointment",
  "[PRESS MENTION]",
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
    name: "[ARTIST NAME 1]",
    specialty: ["Fine Line", "Black & Grey"],
    bio: "[BIO TEXT — short paragraph about the artist, their approach, and years of practice.]",
    instagram: "https://instagram.com/",
  },
  {
    slug: "artist-two",
    name: "[ARTIST NAME 2]",
    specialty: ["Color Realism", "Illustrative"],
    bio: "[BIO TEXT — short paragraph about the artist, their approach, and years of practice.]",
    instagram: "https://instagram.com/",
  },
  {
    slug: "artist-three",
    name: "[ARTIST NAME 3]",
    specialty: ["Traditional", "Blackwork"],
    bio: "[BIO TEXT — short paragraph about the artist, their approach, and years of practice.]",
    instagram: "https://instagram.com/",
  },
  {
    slug: "artist-four",
    name: "[ARTIST NAME 4]",
    specialty: ["Blackwork", "Illustrative"],
    bio: "[BIO TEXT — short paragraph about the artist, their approach, and years of practice.]",
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
    venue: "[GUEST SHOP]",
    start: "2026-08-14",
    end: "2026-08-18",
    status: "upcoming",
  },
  {
    id: "g2",
    artistSlug: "artist-two",
    city: "Chicago, IL",
    venue: "Villain Arts Convention · Booth [##]",
    start: "2026-09-05",
    end: "2026-09-07",
    status: "upcoming",
  },
  {
    id: "g3",
    artistSlug: "artist-three",
    city: "Austin, TX",
    venue: "[GUEST SHOP]",
    start: "2026-10-22",
    end: "2026-10-26",
    status: "upcoming",
  },
  {
    id: "g4",
    artistSlug: "artist-four",
    city: "Los Angeles, CA",
    venue: "[GUEST SHOP]",
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
    title: "First 24 Hours",
    body: "Leave the initial bandage on for 2–4 hours. Wash gently with unscented soap and lukewarm water. Pat dry with a clean paper towel. Do not re-bandage unless instructed.",
  },
  {
    title: "Days 2 — 5",
    body: "Wash twice daily. Apply a thin layer of recommended ointment. The tattoo should feel like a light sunburn — never soaked or slick.",
  },
  {
    title: "Days 6 — 14",
    body: "Switch to unscented lotion as peeling begins. Do not pick or scratch. Flaking is normal — let it fall off on its own.",
  },
  {
    title: "Weeks 3 — 6",
    body: "Full healing continues under the surface. Keep moisturized. Avoid direct sun. Once fully healed, apply SPF 50 to preserve the work.",
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
  { name: "Aquaphor Healing Ointment", note: "Thin layer, days 2–5" },
  { name: "Dr. Bronner's Unscented", note: "Gentle wash" },
  { name: "Lubriderm / Cetaphil", note: "Unscented daily lotion" },
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
    "[PULL QUOTE — a short line from a review, press mention, or repeat client that sets the tone.]",
  source: "— [PRESS OR CLIENT SOURCE]",
};
