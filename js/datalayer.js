/* NAB landing rebuild - Adobe Client Data Layer (ACDL) integration.
   The real nab.com.au is instrumented with the Adobe Client Data Layer
   (core.wcm.components.commons.datalayer). We mirror that here using the
   genuine @adobe/adobe-client-data-layer library vendored in js/vendor.

   Exposes window.NabDataLayer with helpers used by main.js. */
(function () {
  "use strict";

  // ACDL reads any pre-existing array on window.adobeDataLayer, then augments
  // it with push/getState/addEventListener APIs once the library script runs.
  window.adobeDataLayer = window.adobeDataLayer || [];

  function nowIso() {
    return new Date().toISOString();
  }

  // Page-load event mirroring the AEM page component data structure.
  function pushPageLoad() {
    window.adobeDataLayer.push({
      event: "cmp:show",
      eventInfo: { path: "page" },
      page: {
        "@type": "nab/components/page",
        "dc:title": document.title,
        "xdm:language": document.documentElement.lang || "en-AU",
        "repo:path": window.location.pathname,
        url: window.location.href,
        referrer: document.referrer || "",
        timestamp: nowIso()
      }
    });
  }

  // Component click event mirroring cmp:click.
  function pushClick(id, label) {
    window.adobeDataLayer.push({
      event: "cmp:click",
      eventInfo: { path: "component." + id },
      component: {
        id: id,
        title: label || "",
        timestamp: nowIso()
      }
    });
  }

  window.NabDataLayer = { pushPageLoad: pushPageLoad, pushClick: pushClick };

  // Fire the page-load event once the DOM is ready.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", pushPageLoad);
  } else {
    pushPageLoad();
  }

  // Dev aid: log every data layer event so you can verify parity in console.
  document.addEventListener("DOMContentLoaded", function () {
    if (window.adobeDataLayer && typeof window.adobeDataLayer.addEventListener === "function") {
      window.adobeDataLayer.addEventListener("adobeDataLayer:event", function (e) {
        // eslint-disable-next-line no-console
        console.debug("[adobeDataLayer]", e.eventInfo && e.eventInfo.path, e);
      });
    }
  });
})();
