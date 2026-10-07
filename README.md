# Novex Exterior — Website

The marketing website for **Novex Exterior**, a Boston, MA supplier of premium cellular PVC trim boards, sheets and one-piece cornerboards.

It's a static site: plain HTML, CSS and JavaScript with no build step. That means it runs on GitHub Pages, Netlify or any web host.

## Pages

| Page | File |
| --- | --- |
| Home | `index.html` |
| Products overview | `products.html` |
| Trim Boards | `trim.html` |
| Sheets | `sheets.html` |
| Cornerboards | `cornerboards.html` |
| Inspiration gallery | `inspiration.html` |
| Professionals / trade program | `professionals.html` |
| About | `about.html` |
| Contact & quote request | `contact.html` |
| Not found | `404.html` |

Shared files live in `assets/`:

- `assets/css/styles.css`: all styles (colors and fonts are set at the top in `:root`)
- `assets/js/main.js`: menu, scroll effects, interactive "anatomy" diagram, gallery lightbox and quote form
- `assets/art/`: the architectural illustrations used throughout the site
- `assets/images/`: where your photos go (see below)

## Publish on GitHub Pages

1. On GitHub, open the repository's **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**, then select `main` and `/ (root)`.
3. Save. The site is published at `https://<your-username>.github.io/<repository-name>/` within a minute or two.
4. Optional: under **Custom domain**, add your own domain (for example `novexexterior.com`).

## Photos

Real photos live in `assets/images/`. To swap one, upload a new file with the **same filename**; it updates everywhere it's used.

| Filename | Where it appears |
| --- | --- |
| `photo-coastal-home.jpg` | Home page header, Sheets page header, gallery |
| `photo-balustrade.jpg` | Trim Boards page header, Home photo band, Products page, gallery |
| `photo-porch.jpg` | Cornerboards page header, Home "Performance", Products page, gallery |
| `photo-sheet.jpg` | Sheets product card and overview |
| `photo-cornerboard.jpg` | Cornerboards product card and overview |
| `swatch-smooth.jpg`, `swatch-woodgrain.jpg` | Finish swatch chips |

Some spots still show an illustration. Upload a `.jpg` with one of these names and it replaces the illustration automatically:

| Filename | Where it appears | Suggested size |
| --- | --- | --- |
| `collection-trim.jpg` | Trim Boards card and overview (a studio shot of boards works best) | 1500 × 1000 |
| `pros-detail.jpg` | Home "For Professionals" and the Professionals page | 1600 × 1600 |
| `about-boston.jpg` | About page banner | 2400 × 1030 |
| `gallery-entry.jpg`, `gallery-gable.jpg`, `gallery-window.jpg`, `gallery-column.jpg`, `gallery-corner.jpg`, `gallery-eave.jpg`, `gallery-boston.jpg`, `gallery-colonial.jpg` | Inspiration gallery | 1800 × 1200 |

Compress photos before uploading (for example with [squoosh.app](https://squoosh.app)), aiming for under 400 KB each. Gallery captions are in `inspiration.html`.

## Motion

The home page uses scroll-driven animation:

- the header photo drifts as you scroll
- a pinned "Built piece by piece" scene where each trim part flies onto the house
- a stack of boards that separates to show each thickness
- a scrolling product-name ticker
- parallax photos

All of it is switched off automatically for visitors who have "reduce motion" turned on in their device settings.

## Before going live

Please check and replace these placeholders:

- **Phone:** `(617) 555-0142`. Search all `.html` files for `555-0142` and `+16175550142`.
- **Email:** `hello@novexexterior.com`. Search all `.html` files and `assets/js/main.js`.
- **Hours:** `Mon–Fri 7:00 am – 4:30 pm`, in the footer and on the contact page.
- **Product sizes and availability tables:** these follow the size charts from the AZEK pages you provided. Match them to what you actually stock.
- **Product claims:** for example protective film, ground-contact rating and UV protection. Keep only what applies to the products you sell. The site deliberately makes no warranty promises.
- **Service claims:** for example delivery area, trade pricing and samples. Make sure they reflect what you offer.

## Quote form

The form on `contact.html` works with no setup. When someone submits it, their email app opens with a pre-filled request addressed to you.

To receive submissions directly instead, create a free form endpoint, for example at [Formspree](https://formspree.io). Then paste its URL into the form's `data-endpoint` attribute in `contact.html`:

```html
<form class="form" data-quote-form data-endpoint="https://formspree.io/f/yourFormId" novalidate>
```
