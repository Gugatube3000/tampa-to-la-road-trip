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

## Adding photos

Every image on the site has a **photo slot**. Upload a `.jpg` with the exact filename below into `assets/images/` and it appears automatically, covering the illustration in that spot. If a photo is missing, the illustration shows instead, so the site never looks broken.

| Filename | Where it appears | Suggested size |
| --- | --- | --- |
| `hero-home.jpg` | Home page, full-screen header (keep the house on the right; text sits on the left) | 2400 × 1400 |
| `collection-trim.jpg` | Trim card on Home and About, the Products menu, the Products page | 1600 × 2000 (portrait) |
| `collection-sheets.jpg` | Sheets card (same places) | 1600 × 2000 |
| `collection-cornerboards.jpg` | Cornerboards card (same places) | 1600 × 2000 |
| `hero-trim.jpg` | Trim Boards page header | 1600 × 1400 |
| `hero-sheets.jpg` | Sheets page header | 1600 × 1400 |
| `hero-cornerboards.jpg` | Cornerboards page header | 1600 × 1400 |
| `feature-performance.jpg` | Home, "Engineered for the Northeast" | 1600 × 2000 |
| `finish-smooth.jpg` | Smooth finish close-up | 1500 × 1000 |
| `finish-woodgrain.jpg` | Woodgrain finish close-up | 1500 × 1000 |
| `pros-detail.jpg` | Home "For Professionals" and the Professionals page | 1600 × 1600 |
| `about-boston.jpg` | About page, wide banner | 2400 × 1030 |
| `gallery-01.jpg` … `gallery-09.jpg` | Inspiration gallery; 01, 06 and 09 are the wide tiles. Home uses 02, 03, 05, 06, 09 | 1800 × 1200 (wide: 2400 × 1200) |

Tips:

- Compress photos before uploading (for example with [squoosh.app](https://squoosh.app)). Aim for under 400 KB each.
- Gallery captions are in `inspiration.html`. Update them to describe your photos.

## Before going live

Please check and replace these placeholders:

- **Phone:** `(617) 555-0142`. Search all `.html` files for `555-0142` and `+16175550142`.
- **Email:** `hello@novexexterior.com`. Search all `.html` files and `assets/js/main.js`.
- **Hours:** `Mon–Fri 7:00 am – 4:30 pm`, in the footer and on the contact page.
- **Product sizes and availability tables:** these show typical industry sizes for PVC trim, sheets and cornerboards. Match them to what you actually stock.
- **Service claims:** for example delivery area, trade pricing and samples. Make sure they reflect what you offer.

## Quote form

The form on `contact.html` works with no setup. When someone submits it, their email app opens with a pre-filled request addressed to you.

To receive submissions directly instead, create a free form endpoint, for example at [Formspree](https://formspree.io). Then paste its URL into the form's `data-endpoint` attribute in `contact.html`:

```html
<form class="form" data-quote-form data-endpoint="https://formspree.io/f/yourFormId" novalidate>
```
