# Novex Exterior: design and validation

The former home page pinned a six-stage illustrated house assembly for 420 viewport-height units on phones (480 on desktop). Several image requests failed into decorative SVGs. The refresh makes product discovery immediate, replaces architectural illustrations with licensed photographs, and gives visitors a compact three-choice photo explorer they can use at their own pace.

## Design decisions

- Chalk, evergreen and bronze reference painted trim, landscape and enduring architectural details. Libre Caslon Display and Manrope separate editorial character from practical product information.
- The desktop hero presents the house without covering it with marketing copy. The mobile hero uses a complete photograph, concise proposition and two clear actions. Products start within one screen at the reviewed 390px width.
- Established projects across New England anchors the approved legacy message. No company age, project count, warranty, review score or certification was invented.
- Six licensed photographic families illustrate architecture. Captions and [photography credits](../photography.html) distinguish inspiration from documented Novex installations. [Source records](photo-sources.md) retain original photographer and license links.
- Native scroll and lightweight CSS/IntersectionObserver replace the pinned sequence, word splitting, board-stack animation and perpetual marquee. Mobile, reduced motion, data saver and slow connections disable decorative movement. Optional desktop photo drift is limited to 12px and active only while visible, with no idle animation loop.
- All navigation, product tabs, filters and gallery controls use semantic elements. Menus and the photo viewer isolate background content, trap focus, close on Escape and restore focus. Core navigation/specifications remain accessible without JavaScript.

## Research used

[AZEK](https://azekexteriors.com/), [James Hardie](https://www.jameshardie.com/) and [Kebony](https://us.kebony.com/) informed product discovery and inquiry paths. Installed and applied [Anthropic frontend-design](https://github.com/anthropics/skills/blob/683bc88e56f3e09ba94f7055977f3d3aa499f202/skills/frontend-design/SKILL.md) and [Vercel web-design-guidelines](https://github.com/vercel-labs/agent-skills/blob/063bee94c3f4df8453406c830b0a7df0f2860278/skills/web-design-guidelines/SKILL.md). GSAP, Motion and Lenis were evaluated; the static site uses native capabilities to avoid adding a runtime dependency. Image and animation decisions follow [Google responsive images](https://web.dev/articles/responsive-images), [LCP optimization](https://web.dev/articles/optimize-lcp), [animation guidance](https://web.dev/articles/animations-guide) and [MDN reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion).

## Verification on October 6, 2026

- Browser review: 11 pages at 320, 390, 768, 1024 and 1440px widths (55 combinations), with no horizontal overflow or observed broken images.
- Independent static audit: 11 pages, 945 local references and 63 responsive image elements. No missing files, broken local anchors, duplicate IDs, unnamed controls or invalid ARIA targets.
- Interaction tests: mobile menu/focus/Escape; detail selection and synchronized hotspots; gallery filter/viewer/next/Escape/focus return; product tabs and End-key navigation; invalid quote fields and first-error focus.
- JavaScript syntax and Git whitespace checks passed.
- All 24 responsive WebP files decode; 480/800px files are under 70KB and every WebP is under 220KB. The home family is approximately 38/69/144/210KB at 480/800/1200/1800px. Fonts are local WOFF2 files, approximately 49KB combined, with swap and preload.

Lighthouse 13.5.0 measured a local static server. Mobile used simulated 150ms/1.6Mbps networking and 4× CPU slowdown. These lab measurements diagnose this implementation; they do not establish real-user Core Web Vitals after deployment.

| Audit or metric | Mobile | Desktop |
| --- | ---: | ---: |
| Performance | 97 | 100 |
| Accessibility | 100 | 100 |
| Best practices | 100 | 100 |
| SEO | 100 | 100 |
| Largest contentful paint | 2.49s | 0.64s |
| Total blocking time | 0ms | 8.5ms |
| Cumulative layout shift | 0 | 0.004 |

The initial mobile audit scored 85. Removing interleaved layout reads/writes raised it to 95; preloading the display font raised it to 97. The final audit reports no warnings or failed accessibility checks.

## Existing operational details

Quote requests currently prepare an email draft; they are not delivered to a server until a receiving endpoint is configured. Confirm that the existing email destination is monitored. The inherited product-size tables were retained; verify actual stocked dimensions, finishes and availability before publishing. These operational items are documented in [README](../README.md).
