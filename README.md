# NAB Landing Page Rebuild

A pixel-faithful, static recreation of the [nab.com.au](https://www.nab.com.au/) homepage, built with plain HTML, CSS, and JavaScript. The original is rendered by Adobe Experience Manager (AEM) and instrumented with the Adobe Client Data Layer (ACDL); this rebuild mirrors the layout and wires up the genuine ACDL library for analytics-event parity.

> Educational / non-commercial recreation only. NAB, the NAB logo, and all imagery are trademarks and copyright of National Australia Bank Limited. This project is not affiliated with or endorsed by NAB and must not be deployed publicly.

## Run it

No build step required. Serve the folder with any static server:

```bash
npx serve .
# or
python3 -m http.server 8080
```

Then open the printed URL (e.g. http://localhost:8080).

## Structure

```
index.html                 Full page markup (header, hero, sections, footer)
css/styles.css             NAB red theme, typography, cards, responsive grid
js/main.js                 Mega-menu, mobile nav, search, login, accordions
js/datalayer.js            ACDL integration (page-load + click events)
js/vendor/                 Vendored @adobe/adobe-client-data-layer library
assets/logos/              NAB logo (SVG), app icon, award badge, interpreter icon
assets/images/             Hero / banner / article imagery
```

## Data layer

`window.adobeDataLayer` is initialised before the library loads. `NabDataLayer.pushPageLoad()`
fires a `cmp:show` page event, and UI interactions fire `cmp:click` component events. Open
the browser console to watch events as they are pushed.

## Notes

- Brand red gradient (`#ED0000` -> `#C80000`) is taken directly from the official NAB logo SVG.
- Typography uses the Helvetica Neue / Arial system stack matching NAB's brand fallback.
- Fully responsive: desktop mega-menu collapses into an off-canvas mobile menu under 880px.
