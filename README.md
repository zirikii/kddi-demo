# NAB Landing Page Rebuild

A pixel-faithful, static recreation of the [nab.com.au](https://www.nab.com.au/) homepage and public-facing site pages, built with plain HTML, CSS, and JavaScript. The original is rendered by Adobe Experience Manager (AEM) and instrumented with the Adobe Client Data Layer (ACDL); this rebuild mirrors the layout and wires up the genuine ACDL library for analytics-event parity.

> Educational / non-commercial recreation only. NAB, the NAB logo, and all imagery are trademarks and copyright of National Australia Bank Limited. This project is not affiliated with or endorsed by NAB and must not be deployed publicly.

## Run it

```bash
npm install
npm run build
npx serve .
# or
python3 -m http.server 8080
```

Then open the printed URL (e.g. http://localhost:8080).

## Structure

```
index.html                 Personal banking home page
*.html                     70+ public-facing pages (bank, borrow, cards, insurance, business, corporate, help, legal)
templates/                 Shared header, footer and page shell
scripts/
  pages.js                 Page content definitions
  sections.js              Section renderers (hero, promos, grids, etc.)
  build.js                 Static site generator
  walkthrough.js           Playwright navigation demo (records video)
css/styles.css             NAB red theme, typography, cards, responsive grid
js/main.js                 Mega-menu, mobile nav, search, login, accordions
js/datalayer.js            ACDL integration (page-load + click events)
assets/logos/              NAB logo (SVG), app icon, award badge, interpreter icon
assets/images/             Hero / banner / article imagery
shots/                     Screenshots and walkthrough demo video
```

## Build

Pages are generated from `scripts/pages.js` using shared header/footer templates:

```bash
npm run build
```

Edit page content in `scripts/pages.js`, then rebuild. The home page (`index.html`) is also generated — do not edit it directly.

## Data layer

`window.adobeDataLayer` is initialised before the library loads. `NabDataLayer.pushPageLoad()`
fires a `cmp:show` page event, and UI interactions fire `cmp:click` component events. Open
the browser console to watch events as they are pushed.

## Walkthrough demo

Record a Playwright walkthrough video of the site:

```bash
npm run test:walkthrough
```

Output: `shots/walkthrough-demo.webm` (and `.mp4` if ffmpeg is available).

## Notes

- Brand red gradient (`#ED0000` -> `#C80000`) is taken directly from the official NAB logo SVG.
- Typography uses the Helvetica Neue / Arial system stack matching NAB's brand fallback.
- Fully responsive: desktop mega-menu collapses into an off-canvas mobile menu under 880px.
- All navigation links route to static public pages — no backend functionality.
