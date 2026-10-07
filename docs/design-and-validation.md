# Novex Building Materials: design and validation

The former home page pinned a six-stage illustrated house assembly for 420 viewport-height units on phones (480 on desktop). Several image requests failed into decorative SVGs. The refresh makes product discovery immediate, replaces architectural illustrations with licensed photographs, and gives visitors a compact three-choice photo explorer they can use at their own pace.

## Design decisions

- The supplied NOVEX Brand Guidelines v1.0 (October 2026) define the visual identity: Graphite #2B2B2D, Charcoal #3A3A3C, Stone #F5F4F0, Slate #6E6E70 and Taupe #A9A497 as the only decorative accent. Montserrat is used throughout: 600 for headlines, 400 for body and 500 for widely spaced uppercase labels. Taupe is reserved for logo details, small rules and dark-background accents; small light-background text and focus indicators use higher-contrast Slate or Charcoal.
- Header, footer and icons use the PDF's original filled vector paths, including the Building Materials descriptor. The logo has protected O-height margins built into its SVG viewBox. At 164px total mobile width, the visible artwork is approximately 123.5px, above the required 120px minimum. The mobile header is 80px high, accommodating its 77px protected footprint; desktop uses a 94px header and 184px footprint. The reverse footer logo loads lazily.
- The desktop hero presents the house without covering it with marketing copy. The mobile hero uses a complete photograph, concise proposition and two clear actions. Compact product rows pair photographs with useful descriptions and shorten the path to product information.
- Short, direct trade-focused copy follows the guide's quiet, confident tone. No company age, project history, project count, warranty, review score, stock guarantee or delivery promise was invented. The Team page names the user-provided partners Jonathan Deoliveira, Amanda Godoy and Gustavo Oliveira; their role is Partner. Contact details use the supplied +1 781 628 8896 phone number and HQ: Boston, MA. Placeholder contacts and domains in the guide were treated as examples.
- Fourteen licensed photographic families illustrate architecture, with six distinct photographs on the homepage. Captions and [photography credits](../photography.html) distinguish inspiration from documented Novex installations. [Source records](photo-sources.md) retain original photographer and license links.
- Native scroll and lightweight CSS/IntersectionObserver replace the pinned sequence, word splitting, board-stack animation and perpetual marquee. Short one-shot reveals work on phones and desktops; reduced motion, data saver and slow connections keep content static. Startup performs no synchronous geometry reads: the browser's observer entries initialize reveal states. Initially visible content stays readable. Optional desktop photo drift is limited to 12px and active only while visible, with no idle animation loop.
- All navigation, product tabs, filters and gallery controls use semantic elements. Menus and the photo viewer isolate background content, trap focus, close on Escape and restore focus. Core navigation/specifications remain accessible without JavaScript.

## Research used

[AZEK](https://azekexteriors.com/), [James Hardie](https://www.jameshardie.com/) and [Kebony](https://us.kebony.com/) informed product discovery and inquiry paths. Installed and applied [Anthropic frontend-design](https://github.com/anthropics/skills/blob/683bc88e56f3e09ba94f7055977f3d3aa499f202/skills/frontend-design/SKILL.md) and [Vercel web-design-guidelines](https://github.com/vercel-labs/agent-skills/blob/063bee94c3f4df8453406c830b0a7df0f2860278/skills/web-design-guidelines/SKILL.md). GSAP, Motion and Lenis were evaluated; the static site uses native capabilities to avoid adding a runtime dependency. Image and animation decisions follow [Google responsive images](https://web.dev/articles/responsive-images), [LCP optimization](https://web.dev/articles/optimize-lcp), [animation guidance](https://web.dev/articles/animations-guide) and [MDN reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion).

## Verification on October 7, 2026

- Browser review: 12 pages at 320, 390, 768, 1024 and 1440px widths (60 combinations), with no horizontal overflow or observed broken images.
- Independent static audit: 12 pages, 1,134 local references and 67 responsive image elements. No missing files, broken local anchors, duplicate IDs, unnamed controls or invalid ARIA targets.
- Interaction tests: mobile menu/focus/Escape; detail selection and synchronized hotspots; gallery filter/viewer/next/Escape/focus return; product tabs and End-key navigation; invalid quote fields and first-error focus.
- JavaScript syntax and Git whitespace checks passed.
- All 70 responsive WebP files decode. Each of the 14 families has 320, 480, 800, 1200 and 1800px variants. Every 320px file is below 22KB; the largest mobile rendition is 69,874 bytes, and the largest rendition overall is 249,954 bytes. The single active font is the 37,956-byte local Montserrat WOFF2, with swap and preload.

Lighthouse 13.5.0 measured a local static server. Mobile used simulated 150ms/1.6Mbps networking and 4× CPU slowdown. These lab measurements diagnose this implementation; they do not establish real-user Core Web Vitals after deployment.

| Audit or metric | Mobile | Desktop |
| --- | ---: | ---: |
| Performance | 94 | 100 |
| Accessibility | 100 | 100 |
| Best practices | 100 | 100 |
| SEO | 100 | 100 |
| First contentful paint | 1.37s | 0.37s |
| Largest contentful paint | 2.80s | 0.64s |
| Total blocking time | 43ms | 0ms |
| Cumulative layout shift | 0 | 0 |
| Initial transferred resources | 438KiB | 732KiB |

The final audits report no runtime errors, forced reflow or failed accessibility checks. The mobile audit carries a host CPU calibration warning, which persisted in a controlled repeat with other browser testing paused; desktop has no warnings. These are local lab measurements, not field results. Mobile product rows select the 320px photographs at roughly 21KB each, while the hero retains its 800px source. Lazy loading the reverse footer logo saved 16,163 bytes during initial loading. Reveal initialization uses observer-supplied rectangles rather than blocking the first render with geometry queries.

## Existing operational details

Quote requests currently prepare an email draft; they are not delivered to a server until a receiving endpoint is configured. Confirm that the existing email destination is monitored. The inherited product-size tables were retained; verify actual stocked dimensions, finishes and availability before publishing. These operational items are documented in [README](../README.md).

## Deployment

Published to [novexexterior.vercel.app](https://novexexterior.vercel.app) through the authenticated Vercel CLI. The short `novex.vercel.app` alias was unavailable. The project uses clean URLs, local responsive assets, cache headers, canonical page URLs and a real photographic sharing image. Changes are pushed to the `design/novex-premium-mobile` branch and remain reviewable in [PR #1](https://github.com/Gugatube3000/tampa-to-la-road-trip/pull/1).

The branded domain is configured as a project production domain and opens publicly without a Vercel login. Live verification returned 200 for all 11 public pages and sampled photo/font assets, with correct cache headers; an unknown route returned 404. Browser navigation to /team confirms all three Partner names and the supplied HQ/phone.
