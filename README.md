# Novex Exterior

A static website for Novex Exterior's cellular PVC trim boards, sheets and one-piece cornerboards. Plain HTML, CSS and JavaScript; no build step, package install or client framework. Serve the repository root with a static web host, including GitHub Pages.

For a local preview, run `python -m http.server 8000` from the repository root and open [localhost:8000](http://localhost:8000).

## Project structure

| Pages | Files |
| --- | --- |
| Home and product comparison | `index.html`, `products.html` |
| Product specifications | `trim.html`, `sheets.html`, `cornerboards.html` |
| Inspiration and professional resources | `inspiration.html`, `professionals.html` |
| Story and contact | `about.html`, `contact.html` |
| Photography credits and not found | `photography.html`, `404.html` |

- `assets/css/styles.css`: shared layout/components and local fonts. `assets/css/premium.css`: architectural presentation, responsive refinements and motion preferences.
- `assets/js/main.js`: menu, specification tabs, photographic detail explorer, gallery, scroll effects and quote form.
- `assets/images/`: six real-photo families with 480, 800, 1200 and 1800px WebP variants. HTML provides `srcset`, `sizes` and dimensions, prioritizes the hero and lazy-loads later images. See [image sources and maintenance](assets/images/README.md).
- `assets/fonts/`: self-hosted **Libre Caslon Display** and **Manrope**, with `font-display: swap` and license files.

## Experience

Native scrolling brings visitors directly to products. The home detail explorer has three named buttons and photo hotspots for trim, sheets and cornerboard applications. The pinned assembly sequence and continuous marquee were removed. Decorative desktop effects respect reduced motion, coarse-pointer devices and slow-network/data-saving preferences, with no permanent animation loop.

Semantic navigation, tables, tabs, gallery and forms support keyboard use and visible focus. Menu/gallery provide Escape, focus return and background isolation; tabs support arrow keys, Home and End. A no-JavaScript navigation fallback, visible specifications and direct product/image links keep core content available.

Photography is labeled **architectural inspiration** and credited on [photography.html](photography.html). It does not establish that the pictured buildings use Novex products. Finish illustrations are labeled illustrative. The approved legacy message is **“Established projects across New England”**; no founding dates, company-age metrics or warranty promises are invented.

## Quotes and production setup

The current empty `data-endpoint` makes the contact form validate name/email and open an email draft to `hello@novexexterior.com`. The visitor reviews and sends it in their email app. The page explains this and offers direct email access.

A future `data-endpoint` must accept a `FormData` POST and return a successful HTTP response. Only then does the script show a sent confirmation; errors preserve entered details and offer an email draft.

Before production, confirm the email is correct and monitored. Check the original project's inherited catalog dimensions, finishes and availability against Novex's actual products; those tables were originally adapted from AZEK references. Confirm pricing, sample and delivery offerings. Placeholder phone numbers and business hours have been removed.

## Research and skills

[AZEK](https://azekexteriors.com/), [James Hardie](https://www.jameshardie.com/) and [Kebony](https://us.kebony.com/) informed product discovery, inquiry paths and professional resources. Novex uses real architecture, plain application language and a shorter route to products.

The refresh installed and used [Anthropic frontend-design](https://github.com/anthropics/skills/blob/683bc88e56f3e09ba94f7055977f3d3aa499f202/skills/frontend-design/SKILL.md) for intentional visual design and [Vercel web-design-guidelines](https://github.com/vercel-labs/agent-skills/blob/063bee94c3f4df8453406c830b0a7df0f2860278/skills/web-design-guidelines/SKILL.md) for interface review. GSAP, Lenis and Motion were reviewed; native CSS/IntersectionObserver provides the required behavior without another runtime dependency. Performance decisions follow [Google animation](https://web.dev/articles/animations-guide), [LCP](https://web.dev/articles/optimize-lcp) and [MDN reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) guidance.

## Manual checks after changes

- At 360px/390px phone widths: clear hero actions, useful photo crops, comfortable controls and no sideways page scrolling.
- Keyboard: skip link, menu/Escape/focus return, specification tabs, filters and gallery controls.
- Reduced motion and JavaScript disabled: core navigation, content and specifications remain available.
- Slow network/CPU: hero loading, chosen image variants, layout stability and scroll responsiveness.
- Quote form: invalid-field feedback and valid email draft contents; test acknowledged delivery separately if a POST endpoint is configured.
- Changed imagery: captions match, credits remain correct and gallery/full-image links work. Re-measure performance after material asset or interaction changes.
