# NOVEX official brand assets

The logos in this folder are extracted from the native filled vector paths on page 3 of the user-supplied **NOVEX Brand Guidelines, Version 1.0, October 2026**. The letterforms, cut N, descriptor outlines, fill rules, proportions and source colours are preserved. No logo text has been retyped and no artwork was generated.

| File | Use |
| --- | --- |
| `novex-logo.svg` | Preferred full-colour logo on a light background. |
| `novex-logo-reverse.svg` | White logo and Taupe N on a Graphite background. |
| `novex-logo-black.svg` | One-colour black logo as shown in the guidelines. |
| `novex-logo-clearspace.svg` | Preferred logo with the required clear space already included in its viewBox. |
| `novex-logo-reverse-clearspace.svg` | Official reverse fills with the exact same native geometry and included margin as the preferred logo. |
| `novex-symbol.svg` | Full-colour symbol for compact uses. |
| `novex-symbol-reverse.svg` | White and Taupe symbol for dark backgrounds. |
| `novex-symbol-black.svg` | One-colour black symbol. |
| `novex-favicon.svg` | Native symbol with a small transparent margin for browser use. |
| `apple-touch-icon.png` | Native symbol centred on Stone, rasterized at 180 × 180 for Apple touch icons. |

The tight full logo aspect ratio is approximately **3.394:1**. Its visible width must be at least **120 CSS px**. The symbol must be at least **24 CSS px tall** outside browser icon conventions. Preserve the artwork's aspect ratio; do not distort, recolour, or omit its descriptor.

Clear space equals the height of the O on every side, approximately **16.413% of the tight full-logo width**. For a logo whose visible artwork is 150 px wide, reserve about 24.62 px of space on every side. The clearspace SVG contains this margin: visible artwork is 75.287% of its total SVG width, so the file must render at least 159.39 px wide to give its visible wordmark the minimum 120 px width. Do not add a second copy of this margin when using the clearspace SVG.

Palette: Graphite `#2B2B2D`, Charcoal `#3A3A3C`, Taupe `#A9A497`, Stone `#F5F4F0`, Slate `#6E6E70`. The reverse descriptor retains the precise lighter colour in the PDF artwork.

## Typography

The exact **Montserrat** variable Latin font is self-hosted at `../fonts/montserrat-latin-variable.woff2` (37,956 bytes). Normal style; weight range 400–700. Use weight 600 for headlines, 400 for body text, and 500 for labels. The font includes the Western Latin characters, standard punctuation, arrows, and symbols defined by the official Google Fonts Latin subset.

- Official family page: <https://fonts.google.com/specimen/Montserrat>
- Official Google Fonts CSS request: <https://fonts.googleapis.com/css2?family=Montserrat:wght@400..700&display=swap>
- Original font URL: <https://fonts.gstatic.com/s/montserrat/v31/JTUSjIg1_i6t8kCHKm459Wlhyw.woff2>
- SIL Open Font License: `../fonts/OFL-Montserrat.txt`, obtained from <https://raw.githubusercontent.com/google/fonts/main/ofl/montserrat/OFL.txt>.

```css
@font-face {
  font-family: "Montserrat";
  font-style: normal;
  font-weight: 400 700;
  font-display: swap;
  src: url("../fonts/montserrat-latin-variable.woff2") format("woff2");
}
```
