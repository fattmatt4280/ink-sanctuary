
## Scope

Build a full multi-page tattoo studio site for [SHOP NAME] at 1161 N Farnsworth Ave, Aurora, IL 60505, in the selected "Split typographic manifesto" direction. Real content the user hasn't supplied stays as clearly-labeled placeholders (`[SHOP NAME]`, `[ARTIST NAME]`, `[BIO TEXT]`, `[TAGLINE]`) — no lorem ipsum.

## Design tokens (locked from selected prototype)

- Background `#09090b`, ink `#fafafa`, muted `#a1a1aa`, border `#27272a`
- Fonts: **Instrument Sans** (display/UI) + **Instrument Serif** italic (accents/quotes)
- Marquee animation, hairline-grid outline utility
- Load fonts via `<link>` in `src/routes/__root.tsx`; tokens in `src/styles.css` via `@theme inline` mapped to shadcn semantic tokens (`--background`, `--foreground`, etc.) so components stay semantic

## Routes (TanStack file-based)

```
src/routes/
  __root.tsx           header (sticky nav), footer, marquee, font links, per-page head()
  index.tsx            Home
  artists.tsx          Artists index (grid)
  artists.$slug.tsx    Individual artist page
  portfolio.tsx        Master gallery, filter by artist + style
  booking.tsx          Booking embed placeholder + deposit/policy
  travel.tsx           Guest spots / conventions (upcoming vs past)
  merch.tsx            Coming soon + email capture (non-functional form UI)
  aftercare.tsx        Steps, do's/don'ts, products, FAQ accordion
  contact.tsx          Address, map embed, phone, email, hours, socials
```

Each route sets its own `head()` with unique title + description + og:title/og:description. `__root.tsx` stays image-free; leaf routes may set og:image later.

## Global components

- `src/components/site/Header.tsx` — sticky nav: [SHOP NAME] wordmark + links (Home, Artists, Portfolio, Booking, Travel, Merch, Aftercare, Contact). Mobile: hamburger drawer.
- `src/components/site/Footer.tsx` — address, hours, IG/TikTok/FB icon set (lucide), repeated marquee.
- `src/components/site/Marquee.tsx` — customizable text array prop; CSS-only infinite scroll.
- `src/components/site/BookCTA.tsx` — reusable Book Now block (used top + bottom on Home, and across pages).
- `src/components/site/SocialIcons.tsx` — shared icon set for header/footer.
- `src/components/site/ImagePlaceholder.tsx` — dark tile with label; stands in for tattoo/portrait imagery so no stock imagery ships. Real photos go in later.
- `src/lib/site-data.ts` — typed placeholder data: artists (`[ARTIST 1]…[ARTIST 4]` with `[SPECIALTY]` tags), styles list (color realism, black & grey, traditional, fine line, blackwork, illustrative), portfolio items, guest-spot events, aftercare FAQ, marquee ticker items. Single source of truth for grids and filters.

## Page composition (matches selected direction)

**Home** — split hero (image tile + serif italic manifesto + Book CTA) → marquee → featured portfolio hairline 2×N grid → social proof strip (follower count + serif italic pull quote) → repeated Book CTA → footer.

**Artists** — hairline grid of artist cards (portrait tile, name, specialty tags). Cards link to `/artists/[slug]`.

**Artist detail** — split hero (portrait + serif italic bio placeholder) → specialty tag row → filterable portfolio grid (by style) → Instagram link + "Book with [ARTIST NAME]" CTA.

**Portfolio** — filter bar (artist dropdown + style chips) → hairline grid, client-side filtered via `useState`.

**Booking** — split intro (serif manifesto + Book CTA) → placeholder embed slot (labeled div for Square/Boulevard/Calendly) → deposit/policy accordion.

**Travel** — segmented "Upcoming / Past" toggle → list rows (dates · city · shop/booth · artist).

**Merch** — full-bleed serif "Coming Soon" + email input (non-functional, styled to match).

**Aftercare** — numbered step list (serif numerals, sans body) → do's/don'ts two-column → recommended products tiles → FAQ shadcn `<Accordion>` → contact note.

**Contact** — address block + hours table + phone/email + social row + placeholder map tile (iframe slot for Google Maps embed later).

## Composition discipline

- Full-bleed dark charcoal. Photography (or its placeholder tile) is the hero everywhere.
- Instrument Sans for headers/UI, Instrument Serif italic ONLY for accents/quotes/manifesto lines.
- Hairline outlines between grid cells; generous whitespace; no rounded cards, no gradient buttons, no drop shadows.
- Single Book CTA style; two CTAs on Home only (top hero + bottom section). Other pages use one.
- No "Trusted by / As seen in" filler beyond the one social-proof strip on Home.

## Non-goals (this pass)

- No real booking integration, no email backend for merch capture, no CMS. Booking form + merch email are visual placeholders wired to no-op handlers.
- No image generation — placeholder tiles ship instead so the user can drop in real photography later.
- No animations beyond the marquee and subtle hover opacity/scale.

## Technical notes

- Use `<Link to="…">` from `@tanstack/react-router` for all nav; dynamic artist route uses `params={{ slug }}`.
- Font loading via `<link>` in `__root.tsx` head (not `@import`).
- Tokens in `src/styles.css` mapped through `@theme inline`; shadcn `--primary` etc. re-pointed to the direction's palette so all shadcn primitives (Accordion, Button) match automatically.
- Every new route file must be created before any `<Link to>` references it (strict build).
