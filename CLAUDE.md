# Love You, Ci — Makeup Artistry frontend

Custom React + TypeScript + TailwindCSS frontend for **Love You, Ci**, the business of Ciara Latrice ("Ci"), a professional makeup artist. Clients use it to learn about Ci, view her portfolio, book appointments and buy products. The backend is an existing **Wix** site, reached through **Wix Headless** (`@wix/sdk`):

- **Wix Bookings** → appointments (`/book`)
- **Wix Stores** → products (`/shop`)
- **Wix Members** → "Log In" (later phase, hosted login; there is no `/login` page)

The visual source of truth is [reference/template.html](reference/template.html). The landing page (`/`) must match it **1:1** in presentation and behavior, and every other page uses the same palette, type and components.

## Working rules

- **Ask, don't assume.** If a requirement, content, link target or Wix setting is unclear, ask the user before building it.
- **Never write Wix API calls from memory.** Look up the method, package and shape first (`wix:wix-docs` skill or the Wix MCP `SearchWixSDKDocumentation` / `ReadFullDocsMethodSchema` tools).
- Work on a feature branch (current: `feat/landing-page`). Commit after each completed phase; end commit messages with the `Co-Authored-By` trailer.
- A phase is done only when `npm run lint`, `npm run build` and `npm test` all pass.
- Keep the template's look unless the user approves a change. Approved deviations are listed under "Accepted differences".

## Stack and commands

Vite 8 · React 19 (React Compiler enabled via babel preset, so no manual `useMemo`/`useCallback`/`memo`) · TypeScript · Tailwind v4 (`@tailwindcss/vite`) · React Router (`react-router`) · `lucide-react` · Vitest + React Testing Library · npm.

```bash
npm run dev      # Vite dev server, http://localhost:5173
npm run build    # tsc -b && vite build
npm run lint     # eslint
npm test         # vitest
```

Environment: copy `.env.example` to `.env.local` and set `VITE_WIX_CLIENT_ID` (the Wix Headless OAuth client ID). `.env.local` is gitignored; never commit secrets.

## Structure

```
reference/                 template.html + its two logos (visual reference, do not edit)
src/
  main.tsx                 RouterProvider
  router.tsx               createBrowserRouter: Layout + routes, catch-all → "/"
  index.css                Tailwind import, @theme tokens, base layer, component classes
  assets/                  ci-signature.png, love-you-ci-logo.png
  config/nav.ts            single source for header + footer links
  components/
    layout/                Layout (header, <Outlet/>, footer, <ScrollRestoration/>), SiteHeader, SiteFooter
    ui/                    Icon (Lucide wrapper + ICON_STROKE), Wordmark, Cta, TextLink, PhotoSlot
    icons/                 InstagramIcon, YoutubeIcon (Lucide-style inline SVG)
  hooks/                   useCarousel, useParallaxFallback
  lib/wix.ts               Wix SDK client, visitor session, dev smoke test
  test/                    Vitest setup (IO/matchMedia/CSS mocks) + renderRoute helper
  pages/
    home/                  HomePage + sections: Hero, Ribbon, MeetCi, Story, Looks
    shop/                  ShopPage (grid), ProductPage (/shop/:slug), ShopThankYouPage
    AboutPage.tsx PortfolioPage.tsx ContactPage.tsx
```

Conventions: function components, named exports, one component per file, typed props (no `any`). Links come from `config/nav.ts`, never hard-coded twice.

## Routes and links

| Nav label | Route | Page title |
|---|---|---|
| (wordmark / home) | `/` | `Love You, Ci \| Makeup Artistry` |
| About Ci | `/about` | `About Ci \| Love You, Ci` |
| Book Appointment | `/book` | `Book Appointment \| Love You, Ci` |
| Portfolio | `/portfolio` | `Portfolio \| Love You, Ci` |
| Contact Ci | `/contact` | `Contact Ci \| Love You, Ci` |
| Shop Our Products | `/shop` | `Shop Our Products \| Love You, Ci` |
| (product page) | `/shop/:slug` | `<Product name> \| Love You, Ci` |
| (after checkout) | `/shop/thank-you` | `Thank You \| Love You, Ci` |

- Unknown URLs redirect to `/` (`<Navigate to="/" replace />`). There is no 404 page.
- Both "Book Now" CTAs go to `/book`. The Meet Ci "Portfolio" text link goes to `/portfolio`. Footer links mirror the nav.
- Scroll resets to the top on every route change (React Router `<ScrollRestoration />` in Layout).
- Titles use React 19's native `<title>` inside each page component.
- **Active nav link**: the rose-gold underline stays visible on the current route's link, with `aria-current="page"` (`NavLink`).
- **Log In** (desktop and mobile menu) is a `<button type="button">` that does nothing yet and looks exactly like the template's link. TODO: wire it to Wix Members hosted login.
- Social links: Instagram `https://www.instagram.com/loveyouci`, YouTube `https://www.youtube.com/c/CiaraLatrice/featured` (open in a new tab with `rel="noopener noreferrer"`).
- Stub page (Portfolio) is bare for now: header, a plain `h1` on the paper background, footer.
- **Contact** (`/contact`, `ContactPage.tsx`): see "Contact form (feat/contact-page)" below.
- **About** (`/about`, `AboutPage.tsx`): Ci's portrait (`assets/about-ci.jpg`, cropped from her shoot) on mist with an oval feather (`.about-photo`), darkening to ink (`.about-fade`) like her About graphic. The heading sits on the seam: a giant "ABOUT" whose letters fade from paper into the ink (`.about-word`), signed across its lower half by a rose-gold script "Ci" (`.about-ci`) that swings in and shimmers once on load (off with reduced motion). `--title` on `<main>` is the heading size, and the portrait is sized from it so the whole heading fits the first screen. The intro sits on ink, an eased scrim (`.about-unfade`) returns to paper for the story, the "my stamp" passage is the feature quote over a parallax "LOVE YOU" ghost word, and it signs off with "Ciara Latrice". **All wording lives in `src/content/about.ts`**, word-for-word from her graphic.

## Design system

Tokens live in `src/index.css`. Colors and fonts are in `@theme`, so they work as utilities (`bg-ink`, `text-rose-deep`, `font-display`). Every page uses these tokens only. Do not add new colors without asking.

| Token | Value | Use |
|---|---|---|
| `ink` | `#161415` | text, dark bands, CTA background |
| `ink-2` | `#211e1f` | story band base |
| `paper` | `#fbfafa` | page background |
| `mist` | `#eeebe9` | hero media, looks band, ghost text |
| `stone` | `#6b6664` | secondary text |
| `stone-light` | `#a9a3a1` | text on dark |
| `rose` | `#b98a80` | accents, focus ring, link underline |
| `rose-deep` | `#96665d` | "MAKEUP ARTISTRY", link hover |
| `--rose-gold` | `linear-gradient(115deg, #a5645f 0%, #e6c1b4 45%, #b97c74 70%, #8e5552 100%)` | underlines, CTA hover fill, signature text |
| `--hair` / `--hair-light` | `rgba(22,20,21,.1)` / `rgba(251,250,250,.14)` | hairline borders |

- **Fonts** (Google Fonts `<link>` in `index.html`): `font-display` Italiana (headings, wordmark), `font-body` Barlow (weight 300 body, 400/500/600 UI), `font-script` Mrs Saint Delafield (signature).
- **Type scale** (1.25 ratio, 17px base): `t-sm` 0.875rem, `t-base` 1.0625rem, `t-lg` 1.25rem, `t-xl` clamp(1.5rem, 2.2vw, 1.875rem), `t-2xl` clamp(2.25rem, 4.6vw, 3.75rem), `t-ghost` clamp(7rem, 24vw, 22rem).
- **Layout vars**: `--gutter: clamp(16px, 5vw, 72px)`, `--max: 1320px`, `--bar: 72px` (header height), `--ease: cubic-bezier(0.16, 1, 0.3, 1)`.
- **Breakpoints** are max-width, as in the template: 1080px (desktop nav becomes the menu button), 860px (hero and Meet stack to one column), 560px (small phone tweaks). Use the custom variants `bp-1080:`, `bp-860:`, `bp-560:` (defined with `@custom-variant` in `index.css`). Do not use Tailwind's `max-[1080px]:`, which compiles to `width < 1080px` and misses exactly 1080px, and do not swap them for min-width `sm`/`md`/`lg`.

### Styling policy (hybrid)

- Layout, spacing, typography and colors go in JSX as Tailwind utilities, with arbitrary values copied exactly from the template (for example `py-[clamp(96px,13vw,180px)]`). Use `[transform:rotate(...)]` rather than `rotate-*`, because Tailwind's `rotate-*` sets the separate `rotate` property, which composes differently with the keyframe animations. Use `--edge` for the template's `max(var(--gutter), calc((100vw - var(--max)) / 2 + var(--gutter)))` inset.
- Things that are awkward as utilities are small classes in `@layer components`: `.wrap`, `.slot` / `.slot.on-dark`, `.taped` / `.tape-rose` (torn tape `::before` with clip-path), `[data-parallax]` (`@property --p` + `animation-timeline: view()`), `.cta` / `.cta.light` (rose-gold fill `::before`), nav underline `::after`, `.text-link`, story noise texture `::after`, and the keyframes (`marquee`, `rise`, `drop`, `stick`, `parallax`) with their `prefers-reduced-motion` overrides.
- **Preflight caveat**: the template has no CSS reset, but Tailwind Preflight does. When something looks off, check Preflight first: button border and background, `ul`/`blockquote`/`figure` margins, heading font sizes, `img` display. Set the template's values explicitly.

### Icons

The template uses Phosphor Light. The app uses `lucide-react`:

| Phosphor | Lucide |
|---|---|
| `ph-user-circle` | `CircleUser` |
| `ph-list` / `ph-x` | `Menu` / `X` |
| `ph-caret-right` | `ChevronRight` |
| `ph-image` | `Image` |
| `ph-heart` | `Heart` |
| `ph-arrow-left` / `ph-arrow-right` | `ArrowLeft` / `ArrowRight` |
| `ph-instagram-logo` / `ph-youtube-logo` | `components/icons/InstagramIcon`, `YoutubeIcon` (Lucide v1 has no brand icons) |

Render icons through `<Icon icon={X} size={n} />` (`components/ui/Icon.tsx`), which applies `ICON_STROKE` (1.25) and `aria-hidden`. `size` equals the template's icon font-size in px (for example 18 for 1.125rem).

## Behavior to preserve (from the template's JS)

- **Mobile menu** (≤1080px): the button toggles `.open` on the nav and updates `aria-expanded` and `aria-label` ("Open menu"/"Close menu"). The icon swaps between Menu and X. Clicking a link closes the menu. Escape closes it and returns focus to the button.
- **Carousel** (Our Looks): the arrows scroll one card step (`card[1].offsetLeft - card[0].offsetLeft`) with smooth `scrollBy`. ArrowLeft/ArrowRight do the same when the track has focus. Prev is disabled while the first card is ≥95% visible and Next while the last card is (IntersectionObserver, `root: track`, threshold 0.95).
- **Parallax**: CSS scroll-driven animations where supported. Otherwise, and only without reduced motion, a rAF loop driven by IntersectionObserver sets `--p` on visible `[data-parallax]` elements.
- **Page load**: hero copy rises in, staggered with `--i`. The hero photo drops in and the tape "sticks".
- **Marquee**: runs for 38s linear infinite and stops with reduced motion.
- **Copyright year** is `new Date().getFullYear()`.

## Parity check (template vs app)

1. `python3 -m http.server 4000 --directory reference` (run in background) and `npm run dev` (if port 5173 is taken by another project, use `--port 5180` and the matching URL below).
2. Open two headed sessions:
   ```bash
   playwright-cli -s=template open --headed http://localhost:4000/template.html
   playwright-cli -s=app open --headed http://localhost:5173/
   ```
3. For each width in **375, 414, 560, 561, 768, 860, 861, 1024, 1080, 1081, 1280, 1440, 1920**: `resize` both sessions, take full-page `screenshot`s and compare them. Then `eval` computed styles and bounding boxes of the key elements (wordmark, hero h1, CTA, photo slots, ribbon, meet grid, story, look cards, footer) and diff them.
4. Test interactions in both: nav hover underline, CTA hover fill, text-link hover, mobile menu (open, close, Escape, link click), carousel arrows, disabled ends and keyboard, marquee, load animations, parallax at several scroll offsets, and `set-reduced-motion reduce`.
5. Repeat until the only differences left are accepted ones.

Gotchas: compare element boxes at 0px tolerance. Pause the marquee (`set-reduced-motion reduce`) before diffing positions. Full-page screenshots stitch the sticky header in mid-page and can shift by 1px, so set the header to `position: relative` before capturing, or compare viewport screenshots instead. Make sure the app session is back on `/` after link-click tests. Remember that playwright `hover` needs a single-element locator (`>> nth=0`).

Last result (feat/landing-page): computed styles and boxes identical at every listed width, at several scroll offsets and with reduced motion. Menu, hover states and carousel behave identically. Viewport pixel diffs show only the icon glyphs.

**Accepted differences:** icon glyph shapes (Lucide vs Phosphor; size, position, color and stroke weight must match), the active-link underline on non-home pages, Log In being a `<button>`, and the header cart button (right of Log In on desktop, left of the menu button at ≤1080px; it shifts the desktop nav left), and the tighter footer (`feat/footer-polish`: less top padding, smaller logo, closer spacing, `<nav aria-label="Footer">` with a rose active link, socials and copyright on one row split by a hairline).

Keep scratch screenshots and scripts in the session scratchpad, not the repo.

## Wix Headless

- Packages: `@wix/sdk`, `@wix/bookings`, `@wix/stores`, `@wix/ecom`, `@wix/categories`, `@wix/redirects`, `@wix/forms`.
- **One auth seam:** `src/wix/sdk.ts` (`wixModule(module)`, `wixFetch(path)`) builds the single OAuth visitor client from `src/wix/config.ts` (`VITE_WIX_CLIENT_ID`) and persists tokens in localStorage. Every Wix call goes through it; never create another client. `src/lib/wix.ts` only holds the dev smoke test.
- `VITE_WIX_CLIENT_ID` is typed in `src/vite-env.d.ts`.
- Ci's Wix site belongs to **her** Wix account: "CIARA LATRICE" (site ID `21782089-2304-4c5f-b2de-dfdfba302da5`, https://www.loveyouci.com, Premium). The Wix MCP is authenticated with her account (Oct 21, 2026), so MCP site context and admin calls apply to her site. Apps include Bookings, Stores, Members Area, Forms & Payments, Invoices (V1) and Chat. The visitor client (`VITE_WIX_CLIENT_ID` in a throwaway node script with `node --env-file=.env.local`) is still the way to check what the frontend itself sees.
- Stores catalog version on her site is **V3** (confirmed through MCP site context, Oct 21, 2026). Use `productsV3` and `/stores/v3/` APIs only, never the V1 `products` module.
- In dev, when `VITE_WIX_CLIENT_ID` is set, `main.tsx` runs `wixSmokeTest()`, which logs the counts of booking services and products to the console.
- Planned phases after the landing page: ~~Bookings flow on `/book`~~ (done, see below) (services, availability, booking, checkout), ~~Stores on `/shop`~~ (done, see below) (products, cart, hosted checkout), Members login, then real content for About and Portfolio (Contact is done, see below). Ask the user for content and requirements for each page before building it.

## Bookings (feat/bookings-flow)

Built on Wix's verified headless bookings code, vendored from the `wix-headless-templates` skill (`bookings/app`) into `src/wix/bookings/*` and `src/hooks/bookings/*`. **Booking logic only goes through those exports** (`useBookingFlow`, `useServices`, `fetchServiceBySlug`). Never hand-build bookings, carts or checkout URLs. The skill's `INSTRUCTIONS.md` is the contract. The vendored files are exempt from `no-explicit-any` in `eslint.config.js`.

Local changes to vendored files (re-apply if you ever re-copy them):
- `wix/config.ts`: `WIX_CLIENT_ID` reads `import.meta.env.VITE_WIX_CLIENT_ID`.
- `booking-core.ts` `checkoutRedirectRequest`: `thankYouPageUrl` is `/book/thank-you` and `postFlowUrl` (abandoned checkout) is `/book`.
- `booking-flow-store.ts`: a `{ window: 'month' }` option adds `month`, `nextMonth()` and `prevMonth()`, and `jumpTo` follows the month.
- **Add-ons** (the vendored template ships them display-only; we book them, verified live):
  - `booking-core.ts`: `SlotsWindow.addOnIds` / `NextAvailableOptions.addOnIds` → Time Slots V2 `customerChoices.addOnIds`, so Wix returns slots already lengthened by add-on minutes. `BookingOptions.addOns` → Create Booking `bookedAddOns: [{ _id, groupId, quantity? }]`, where `quantity` is only for non-duration add-ons. `showsNextAvailability` no longer excludes add-on services.
  - `booking-flow-store.ts`: `initialAddOnIds` option, `setAddOnIds(ids)` (reloads slots and next availability), `addOnGroupsLoaded`. `book()` sends `bookedAddOns`.
- `services.ts` `fetchServices`: sorted by `sortOrder` ascending, which is the service order Ci sets in the Wix dashboard. Change the order there, not in code.
- `useBookingFlow` / `useServices`: the store lives in lazy `useState` (React Compiler forbids reading refs during render). Remount with `key={service.id}` to switch services.

Add-ons flow: "Book" on a card with `hasAddOns` opens `AddOnsModal` (native `<dialog>`) over `/book`. Next, or closing it, goes to `/book/:slug?addons=id1,id2` (`bookingPath.ts`). An **empty** `addons=` means "chose none", and a **missing** param makes the service page open the modal first (shared links). The summary's "Edit" reopens it, keeping the old choice on close. `Continue` and "Change date & time" preserve the query string. The class has no add-ons and skips the modal.

Booking policy: `/book` shows `components/booking/BookingPolicy.tsx` between the page header and the services: key notes, hours/studio/add-on prices, the 7 policy rules with Lucide icons, and a "Tag us in your Selfies" band: full-bleed mist with a parallax ghost word and a taped polaroid of `assets/selfie.jpg` (a square 800×800 client selfie; keep replacements 1:1, at least 600px). **All wording lives in `src/content/bookingPolicy.ts`**, transcribed word-for-word from her policy graphic. Only the short rule titles are ours. The booking summary's Location now shows the studio address plus a suite-number note.

Routes: `/book` (taped service cards), `/book/:slug` (`ServiceBookingLayout` loads the service and owns the one flow store; index is `SchedulePage` with the month calendar, times by Morning/Afternoon/Evening and the summary), `/book/:slug/details` (`DetailsPage`: schema-driven Wix form and the CTA; it redirects back to the calendar if no slot is picked), `/book/thank-you`.

Rules:
- The CTA label comes from `ctaState` plus the deposit ("Book · $42 deposit"). Gate it on `canBook` and show `flow.error`.
- Arriving at `/book/thank-you` is **not** proof of payment. The copy points to the confirmation email and never says "confirmed".
- Don't write policy or copy Ci didn't supply (balances, guarantees, cancellation terms).
- Remaining spots ("N left") show only for classes.
- Ci's form text uses `**bold**` and blank-line notes. The first line is the label and the rest is help text (`BookingFormFields`).

Ci's setup (checked through the client ID, Oct 2026): 4 appointments (Natural, Soft, Full Glam, Sunday Appointment) with a $42 deposit, and 1 class (Flawless Glam 1:1, $181 deposit). Location is "Upon Approval". The forms' `address` field (`BOOKINGS_ADDRESS`) shows as required in the schema, but it is a built-in Bookings field that only applies to services held at the client's location. Ci's services aren't, so the vendored form layer skipping it is correct. The live test confirmed it: a booking without an address was accepted. Wix's checkout collects the billing address itself.

Phone fields use `components/booking/PhoneField.tsx` (libphonenumber-js): a country picker that defaults to US, formats as you type, writes `''` until the number is valid (which gates Book) and then the E.164 number (`+14048675309`).

Live test (Oct 20, 2026, Natural Glam, Oct 29 4:00 PM, "TEST - please ignore"): the booking was accepted and the app redirected to Ci's checkout at `https://www.loveyouci.com/__ecom/checkout` with Pay Now $42 / Pay Later $73. It was abandoned without paying, and "Continue Browsing" returned to `/book` (Wix appends `?wixMemberLoggedIn=true`, which is harmless). Second live test (Oct 20, 2026): Natural Glam with Bottom Lashes (+5 min) and Mink Lashes. Slots came back 50 minutes long, and the checkout showed $130.00 ($115 + $15 add-ons), Pay Now $42 / Pay Later $88. It was abandoned unpaid. The paid return path to `/book/thank-you` has not been tested, because that needs a real payment.

Checkout must redirect back to an origin on the OAuth app's allowed domains (Wix → Headless Settings): `http://localhost:5180` for dev, plus the production domain.

## Shop (feat/shop)

Built on Wix's verified storefront code (Catalog V3), vendored from the `wix-headless-templates` skill (`storefront/app`) into `src/wix/storefront/*`, `src/hooks/storefront/*` and `src/components/storefront/*` (CartButton, CartDrawer, OptionPicker, QuickAdd). **Catalog, cart and checkout only go through those exports** (`useShop`, `useProductDetail`, `useCart`, `fetchProducts`). Never hand-build cart lines, variant picks or checkout URLs, and never sort or filter a loaded page client-side.

Local changes to vendored files (re-apply if you ever re-copy them):
- `useShop` / `useProductDetail`: the store lives in lazy `useState` (React Compiler rule). `ProductPage` remounts `ProductView` with `key={slug}` to switch products.
- `cart.ts` `checkoutUrl`: `postFlowUrl` (abandoned checkout) is `/shop`, `thankYouPageUrl` is `/shop/thank-you`.
- Components restyled to the site tokens (ink/paper/stone/mist, `--hair`, rose-deep for errors, square corners, `.cta` buttons, Lucide icons). Behaviour unchanged. QuickAdd links go to `/shop/:slug` through the router.
- `eslint.config.js`: `preserve-caught-error` is off for `src/wix/**` (the vendored cart rethrows with buyer copy).
- FilterPanel and category pages are left out on purpose (2 products). Add them if the catalog grows.

Pages:
- `/shop`: no intro text, just an `h1` and taped product cards (alternating tilt, like the service cards) with ribbons, price (struck "was" price from the DTO), colour dots and QuickAdd ("Choose options" opens the shared OptionPicker over the card).
- `/shop/:slug` follows Ci's Wix product page: breadcrumb (Home / Shop Our Products / name) with Prev/Next in the shop's order, gallery with thumbnails and the description on the left (description moves under the info sections at ≤860px), then name, price, "Name *" swatches, "Quantity *" stepper, full-width Add to Cart and the info sections as `<details>` accordions (first open). Picking a shade swaps to its photo and writes **`?variantId=`** (history `replace`). Loading `?variantId=` picks that variant's choices once.
- Header: `CartButton` with a live count. `CartDrawer` is mounted once in `Layout` and opens after every add.
- `/shop/thank-you`: same wording pattern as the bookings one, never says "confirmed".

Ci's store (checked Oct 21, 2026): Butter Gloss ($14, was $15; shades Allure, Adore, Lovely, each with its own photo) and Butter Gloss Bundle ($36, was $45; out of stock, no notify-me). Shipping is set up ($3.99 delivery at checkout) and Wix estimates sales tax in the cart. Live test: added Lovely ×2, checkout opened at `https://www.loveyouci.com/__ecom/checkout` with the right line, and "Continue Browsing" returned to `/shop` (plus `?wixMemberLoggedIn=true`) with the cart intact. It was abandoned unpaid and the cart was emptied afterwards. The paid return to `/shop/thank-you` has not been tested.


## Contact form (feat/contact-page)

Built on Wix's verified forms code, vendored from the `wix-headless-templates` skill (`forms/app`) into `src/wix/forms/*` and `src/hooks/forms/useWixForm.ts`. **Values, validation and submit only go through `useWixForm`.** Never hand-build a submission, and never name a field in code: `ContactForm` renders `form.fields` from the live schema, so Ci can rename, add or reorder fields in her dashboard. Layout keys off `identifier` only (first/last name sit side by side).

Local change to vendored files (re-apply if you ever re-copy them): `useWixForm` keeps the store in lazy `useState` (React Compiler rule). Remount with `key={formId}` to switch forms.

Wix setup (Oct 21, 2026, approved by the user): Ci's existing contact form is on the **old** Wix Forms app, which headless can't reach, and it was left untouched. We installed the new Wix Forms app (`225dd912-7dea-4738-8688-4b8c6955ffc2`) and created a separate form **"Contact (new website)"**, `88150620-90c5-48a1-8aae-c49b6cfdb4d5` (`CONTACT_FORM_ID` in `src/content/contact.ts`), with the same fields as her Wix page: First Name, Last Name, Email (required), Message (required since Oct 21, 2026, so no empty enquiries), button "Send", thank-you "Thank you for reaching out! Your message has been sent." Wix auto-created an active automation, "New submission received for Contact (new website)", that emails the site owner (Reply-To is the visitor). Dashboard: `https://manage.wix.com/dashboard/21782089-2304-4c5f-b2de-dfdfba302da5/wix-forms/form/88150620-90c5-48a1-8aae-c49b6cfdb4d5`.

Page: two columns at >1080px (eyebrow "CONTACT CI", `h1` "Want to chat?", intro, then Phone (text only) / Email / Social Media with hairlines), with the form in a mist panel on the right. At ≤1080px it stacks and the details become a wrapping row, and at ≤560px they stack again. Social buttons are the shared `components/ui/SocialLinks` (also used in the footer). **Wording lives in `src/content/contact.ts`**, from Ci's Wix contact page ("Touch Base" left out on purpose). Each field's error line keeps its height even when empty, so an error appearing on blur never pushes Send down mid-click. The thank-you replaces the form in place, focuses its heading, and has "Send another message" (`reset`).

Live test (Oct 21, 2026): one submission ("TEST" / "please ignore") from `/contact` was stored as CONFIRMED with a CRM contact, and the thank-you showed. Whether the notification email reached Ci's inbox has not been confirmed.
