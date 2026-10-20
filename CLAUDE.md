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
    AboutPage.tsx BookPage.tsx PortfolioPage.tsx ContactPage.tsx ShopPage.tsx
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

- Unknown URLs redirect to `/` (`<Navigate to="/" replace />`). There is no 404 page.
- Both "Book Now" CTAs go to `/book`. The Meet Ci "Portfolio" text link goes to `/portfolio`. Footer links mirror the nav.
- Scroll resets to the top on every route change (React Router `<ScrollRestoration />` in Layout).
- Titles use React 19's native `<title>` inside each page component.
- **Active nav link**: the rose-gold underline stays visible on the current route's link, with `aria-current="page"` (`NavLink`).
- **Log In** (desktop and mobile menu) is a `<button type="button">` that does nothing yet and looks exactly like the template's link. TODO: wire it to Wix Members hosted login.
- Social links: Instagram `https://www.instagram.com/loveyouci`, YouTube `https://www.youtube.com/c/CiaraLatrice/featured` (open in a new tab with `rel="noopener noreferrer"`).
- Stub pages (About, Book, Portfolio, Contact, Shop) are bare for now: header, a plain `h1` on the paper background, footer.

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

**Accepted differences:** icon glyph shapes (Lucide vs Phosphor; size, position, color and stroke weight must match), the active-link underline on non-home pages, and Log In being a `<button>`.

Keep scratch screenshots and scripts in the session scratchpad, not the repo.

## Wix Headless

- Packages: `@wix/sdk`, `@wix/bookings`, `@wix/stores`.
- **One auth seam:** `src/wix/sdk.ts` (`wixModule(module)`, `wixFetch(path)`) builds the single OAuth visitor client from `src/wix/config.ts` (`VITE_WIX_CLIENT_ID`) and persists tokens in localStorage. Every Wix call goes through it; never create another client. `src/lib/wix.ts` only holds the dev smoke test.
- `VITE_WIX_CLIENT_ID` is typed in `src/vite-env.d.ts`.
- Ci's Wix site belongs to **her** Wix account. The Wix MCP tools are currently logged into a different account (it only shows "My Site 1", an unrelated Free/Draft site), so **don't trust MCP site context** for her site until the MCP is re-authenticated with her credentials. Query her site through `VITE_WIX_CLIENT_ID` instead (a visitor client in a throwaway node script with `node --env-file=.env.local`).
- Stores catalog version on her site is **unconfirmed**: both `productsV3` and V1 `products` queries answer. Settle this before the Shop phase.
- In dev, when `VITE_WIX_CLIENT_ID` is set, `main.tsx` runs `wixSmokeTest()`, which logs the counts of booking services and products to the console.
- Planned phases after the landing page: ~~Bookings flow on `/book`~~ (done, see below) (services, availability, booking, checkout), Stores on `/shop` (products, cart, hosted checkout), Members login, then real content for About, Portfolio and Contact. Ask the user for content and requirements for each page before building it.

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

Booking policy: `/book` shows `components/booking/BookingPolicy.tsx` between the page header and the services: key notes, hours/studio/add-on prices, the 7 policy rules with Lucide icons, and a "Tag us in your Selfies" panel using `assets/selfie-phone.jpg` (cropped from Ci's graphic; `mix-blend-lighten` blends its black into the ink band). **All wording lives in `src/content/bookingPolicy.ts`**, transcribed word-for-word from her policy graphic. Only the short rule titles are ours. The booking summary's Location now shows the studio address plus a suite-number note.

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
