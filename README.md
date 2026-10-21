# Love You, Ci

A custom website for Love You, Ci, the makeup artistry business of Ciara Latrice.

## Overview

Love You, Ci is a React + TypeScript frontend built on top of an existing Wix site through Wix Headless. Clients can read Ci's story, browse her portfolio, book an appointment or class, send her a message, and buy her products. Everything runs on the services Ci already uses: bookings, products, forms and portfolio photos all live in her Wix dashboard, so she can update services, prices, photos and copy herself without touching any code, and the site picks up the changes right away.

## Key Features

- **Appointment booking:** clients choose a service, pick optional add-ons (which lengthen the time slot and add to the price), choose a day on a month calendar and a time grouped by Morning, Afternoon and Evening, then fill in Ci's booking form and pay the deposit through Wix's hosted checkout.
- **Booking policy:** Ci's policies, hours, studio details and add-on prices appear on `/book` above the services, word for word from her policy graphic.
- **Online shop:** a product grid with sale prices and ribbons, product pages with shade swatches that swap the photo and update the URL (`?variantId=`), a quantity stepper, and a slide-out cart that opens after every add and sends clients to Wix's hosted checkout.
- **Schema-driven contact form:** the form is drawn from the live Wix Forms schema, so Ci can rename, add or reorder fields in her dashboard and the site follows. Errors show on blur without moving the Send button, and a thank-you message replaces the form in place.
- **Portfolio mosaic:** photos and the intro text come from Wix Portfolio. The grid uses a repeating 3:4 layout with large feature tiles, and a full-screen lightbox supports arrow keys, swipe, wrap-around and focus return.
- **About page:** an editorial layout with Ci's portrait fading into ink, an animated script "Ci" signature, and her story set in labelled chapters.
- **Responsive navigation:** a desktop nav with a rose-gold underline on the current page, and a mobile menu at 1080px and below that closes on Escape or on link click and returns focus to the menu button.
- **Motion with restraint:** scroll-driven parallax (with an IntersectionObserver fallback), a hero that rises and "tapes" into place, a marquee and a looks carousel, all turned off when the visitor prefers reduced motion.
- **Consistent design system:** one set of color, type and spacing tokens across every page, with the Italiana, Barlow and Mrs Saint Delafield typefaces.

## Tech Stack

- **Frontend:** React 19 with React Compiler, TypeScript, Vite 8
- **Styling:** Tailwind CSS v4 with design tokens in `@theme` and a small layer of component classes
- **Routing:** React Router (`createBrowserRouter`) with scroll restoration and native React 19 `<title>` tags
- **Backend:** Wix Headless through `@wix/sdk`, using Wix Bookings, Wix Stores (Catalog V3), eCommerce, Wix Forms and Wix Portfolio
- **Auth:** a single Wix OAuth visitor client, with tokens kept in localStorage
- **Icons:** Lucide React, plus inline SVG brand icons for Instagram and YouTube
- **Forms:** libphonenumber-js for international phone input with live formatting
- **Testing:** Vitest and React Testing Library (jsdom)
- **Tooling:** npm, ESLint

## Technical Highlights

- Building a custom frontend on top of a business's existing Wix site so the owner keeps managing content, bookings and orders in the dashboard she already knows.
- Routing every Wix call through one auth layer (`src/wix/sdk.ts`) and using Wix's verified headless code for bookings, carts and checkout instead of building those requests by hand.
- Extending the booking flow to support paid add-ons end to end: time slots come back already lengthened by the add-on minutes, and the add-ons are booked and charged at checkout.
- Rendering forms from the live Wix schema, so content changes in the dashboard need no deploy.
- Keeping the interface accessible: native `<dialog>` modals, `aria-current` and `aria-expanded` states, focus management on close, keyboard control for the carousel and lightbox, and reduced-motion support throughout.
- Writing every page against a shared token system, with custom max-width breakpoint variants (`bp-1080:`, `bp-860:`, `bp-560:`) for exact breakpoint behavior.

## Getting Started

This is a [Vite](https://vite.dev) + React + TypeScript project.

### Environment variables

The app talks to Wix through a Wix Headless OAuth client. Copy `.env.example` to `.env.local` and set the client ID (Wix dashboard > Settings > Headless Settings):

```bash
VITE_WIX_CLIENT_ID=your-wix-headless-client-id
```

`.env.local` is gitignored. Never commit it.

### Run the development server

Install dependencies, then start the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) with your browser to see the result.

Wix checkout can only redirect back to domains allowed in the OAuth app's Headless Settings. To test booking or shop checkout locally, run the dev server on the allowed port:

```bash
npm run dev -- --port 5180
```

### Other scripts

```bash
npm run build    # type-check and build for production
npm run preview  # preview the production build
npm run lint     # run ESLint
npm test         # run the Vitest suite
```

## Learn More

- [Wix Headless documentation](https://dev.wix.com/docs/go-headless) - learn how to use Wix business services from your own frontend.
- [Wix JavaScript SDK](https://dev.wix.com/docs/sdk) - API reference for Bookings, Stores, eCommerce, Forms and Portfolio.
- [Vite documentation](https://vite.dev/guide/) - learn about the build tool and dev server.
- [React Router documentation](https://reactrouter.com) - learn about routing in React.
- [Tailwind CSS documentation](https://tailwindcss.com/docs) - learn about the utility-first CSS framework.

## Deploy

`npm run build` outputs a static site to `dist/` that can be hosted anywhere that serves single-page apps. Point all routes to `index.html` so client-side routes like `/book` and `/shop/:slug` load directly. Set `VITE_WIX_CLIENT_ID` in your host's build environment, and add your production domain to the allowed domains in Wix Headless Settings so checkout can redirect back to the site.
