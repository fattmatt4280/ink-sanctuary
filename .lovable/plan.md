# Admin CMS Plan

## Access
- **URL**: `/studio` (discreet, unlisted, not in nav)
- **Login**: `/studio/login` — email + password sign-in via Lovable Cloud auth
- **Authorization**: Only ONE hardcoded admin email can access the studio. Enforced two ways:
  1. Client-side redirect if signed-in email ≠ admin
  2. Server-side RLS policies check `auth.jwt() ->> 'email' = <admin email>` for all writes
- You'll give me the admin email; I'll store it as a secret (`ADMIN_EMAIL`) and reference it in RLS via a SQL function.

## Backend (Lovable Cloud)
Tables (all with RLS: public read where needed, admin-only write):
- `site_content` — key/value JSON store for global text (shop info, tagline, hours, aftercare copy, press quote, marquee items). One row per "section".
- `artists` — id, slug, name, specialties[], bio, instagram, portrait_path, sort_order
- `portfolio_items` — id, artist_id, style, aspect, image_path, sort_order
- `guest_spots` — id, artist_id, city, venue, start_date, end_date, status
- `page_images` — key/value for named images (hero, about photo, etc.)

Storage bucket: `site-images` (public read, admin-only write).

## Frontend changes
- Replace `src/lib/site-data.ts` static data with async loaders that fetch from Cloud. Fall back to current placeholders when a value is empty so the site never looks broken.
- All existing public routes (`/`, `/artists`, `/portfolio`, `/booking`, `/travel`, `/aftercare`, `/contact`, `/merch`, `/artists/$slug`) become data-driven via loaders.

## Studio UI (`/studio/*`)
- `/studio/login` — email/password form
- `/studio` — dashboard with cards linking to each editor
- `/studio/general` — edit shop name, tagline, address, phone, email, hours, socials, marquee, press quote
- `/studio/homepage` — edit hero image + homepage-specific copy
- `/studio/artists` — list + add/edit/delete artists, upload portraits
- `/studio/portfolio` — upload/reorder/delete portfolio images, assign to artist + style
- `/studio/travel` — CRUD guest spots
- `/studio/aftercare` — edit aftercare steps, dos/don'ts, products, FAQ
- Every editor: inline save, image upload widget (drag-drop → Cloud Storage), toast on save.

## What I need from you
1. Admin email address (the ONE account that can edit)
2. That's it — I'll set a temporary password on account creation; you can change it after first login.

## Delivery order
1. Enable Cloud + migrations + storage bucket + RLS
2. Auth + `/studio` route gate
3. Data-load public site from Cloud (with placeholder fallback)
4. Build each editor page
5. Verify end-to-end: sign in → edit → see change on public site