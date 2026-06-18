"use strict";

const fs = require("fs");
const path = require("path");
const { pages } = require("./pages");
const { renderSections } = require("./sections");

const root = path.join(__dirname, "..");
const templatesDir = path.join(root, "templates");

const pageTemplate = fs.readFileSync(path.join(templatesDir, "page.html"), "utf8");
const headerTemplate = fs.readFileSync(path.join(templatesDir, "header.html"), "utf8");
const footerTemplate = fs.readFileSync(path.join(templatesDir, "footer.html"), "utf8");

const accessibilitySection = `
    <!-- ===================== ACCESSIBILITY: INTERPRETERS / NRS (ACCORDION) ===================== -->
    <section class="section" data-dl-component="accessibility">
      <div class="container">
        <div class="accordion" id="accessAccordion">
          <div class="accordion__item">
            <h2 class="accordion__header">
              <button class="accordion__btn" aria-expanded="false" aria-controls="acc-1">
                <img class="accordion__icon" src="assets/logos/national-interpreter-icon.png" alt="" aria-hidden="true" width="28" height="28" />
                Interpreters available
                <svg class="chev" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 6l4 4 4-4"/></svg>
              </button>
            </h2>
            <div class="accordion__panel" id="acc-1" hidden>
              <p>Do you have limited English or prefer to speak in a language other than English? When you call us, just say "I need an interpreter" and we'll arrange for someone to help with your enquiry.</p>
              <p>If you don't see your language listed, please ask us for help to find someone who speaks your language to help with your banking.</p>
            </div>
          </div>
          <div class="accordion__item">
            <h2 class="accordion__header">
              <button class="accordion__btn" aria-expanded="false" aria-controls="acc-2">
                National Relay Service
                <svg class="chev" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 6l4 4 4-4"/></svg>
              </button>
            </h2>
            <div class="accordion__panel" id="acc-2" hidden>
              <p>If you're d/Deaf or find it hard to hear or speak to hearing people on the phone, the National Relay Service can help. To contact NAB give our phone number 13 22 65 to the National Relay Service operator when asked.</p>
              <ul class="feature-list">
                <li><a href="accessibility-inclusion.html">National Relay Service phone numbers and links</a></li>
                <li><a href="accessibility-inclusion.html">National Relay Service options</a></li>
                <li><a href="accessibility.html">Learn more about accessibility at NAB</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>`;

function renderHeader(audience) {
  return headerTemplate
    .replace("{{AUDIENCE_PERSONAL}}", audience === "personal" ? " is-active" : "")
    .replace("{{AUDIENCE_BUSINESS}}", audience === "business" ? " is-active" : "")
    .replace("{{AUDIENCE_CORPORATE}}", audience === "corporate" ? " is-active" : "")
    .replace("{{MOBILE_PERSONAL_ACTIVE}}", audience === "personal" ? " mobile-acc__item--active" : "")
    .replace("{{MOBILE_BUSINESS_ACTIVE}}", audience === "business" ? " mobile-acc__item--active" : "")
    .replace("{{MOBILE_CORPORATE_ACTIVE}}", audience === "corporate" ? " mobile-acc__item--active" : "");
}

function buildPage(page) {
  const isHome = page.file === "index.html";
  const content = renderSections(page.sections);
  const accessibility = isHome ? accessibilitySection : "";

  return pageTemplate
    .replace("{{TITLE}}", page.title)
    .replace("{{DESCRIPTION}}", page.description)
    .replace("{{HEADER}}", renderHeader(page.audience || "personal"))
    .replace("{{CONTENT}}", content)
    .replace("{{ACCESSIBILITY}}", accessibility)
    .replace("{{FOOTER}}", footerTemplate);
}

let count = 0;
for (const page of pages) {
  const outPath = path.join(root, page.file);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, buildPage(page), "utf8");
  count++;
  console.log("Built:", page.file);
}

console.log(`\nGenerated ${count} pages.`);
