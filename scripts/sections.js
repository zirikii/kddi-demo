"use strict";

function esc(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function btn(href, label, variant = "primary") {
  return `<a href="${href}" class="btn btn--${variant}">${esc(label)}</a>`;
}

function renderHero(hero) {
  const image = hero.image || "assets/images/hero.jpg";
  const actions = (hero.actions || [])
    .map((a) => btn(a.href, a.label, a.variant || "primary"))
    .join("\n            ");
  const eyebrow = hero.eyebrow
    ? `<span class="hero__eyebrow">${esc(hero.eyebrow)}</span>`
    : "";
  const actionsBlock = actions
    ? `<div class="hero__actions">\n            ${actions}\n          </div>`
    : "";
  const compact = hero.compact ? " hero--compact" : "";

  return `
    <section class="hero${compact}" data-dl-component="masthead">
      <div class="hero__media">
        <img src="${image}" alt="" aria-hidden="true" />
      </div>
      <div class="container hero__inner">
        <div class="hero__card">
          ${eyebrow}
          <h1 class="hero__title">${esc(hero.title)}</h1>
          <p class="hero__text">${esc(hero.text)}</p>
          ${actionsBlock}
        </div>
      </div>
    </section>`;
}

function renderBreadcrumb(items) {
  if (!items || !items.length) return "";
  const crumbs = items
    .map((item, i) => {
      const isLast = i === items.length - 1;
      if (isLast || !item.href) {
        return `<li aria-current="page">${esc(item.label)}</li>`;
      }
      return `<li><a href="${item.href}">${esc(item.label)}</a></li>`;
    })
    .join("\n          ");
  return `
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <div class="container">
        <ol class="breadcrumb__list">
          ${crumbs}
        </ol>
      </div>
    </nav>`;
}

function renderSectionHead(head) {
  const eyebrow = head.eyebrow
    ? `<span class="section__eyebrow">${esc(head.eyebrow)}</span>`
    : "";
  const lede = head.lede ? `<p class="section__lede">${esc(head.lede)}</p>` : "";
  return `
        <header class="section__head">
          ${eyebrow}
          <h2 class="section__title">${esc(head.title)}</h2>
          ${lede}
        </header>`;
}

function renderLinkCards(cards) {
  return cards
    .map(
      (card) => `
          <article class="link-card">
            <h3 class="link-card__title">${esc(card.title)}</h3>
            ${
              card.text ? `<p>${esc(card.text)}</p>` : ""
            }
            ${
              card.links
                ? `<ul class="link-card__list">${card.links
                    .map((l) => `<li><a href="${l.href}">${esc(l.label)}</a></li>`)
                    .join("")}</ul>`
                : ""
            }
            ${
              card.more
                ? `<a href="${card.more.href}" class="link-card__more">${esc(card.more.label)}</a>`
                : ""
            }
          </article>`
    )
    .join("");
}

function renderGridSection(section) {
  const cols = section.cols || 3;
  const cards = renderLinkCards(section.cards);
  const cta = section.cta
    ? `<div class="section__cta">${btn(section.cta.href, section.cta.label, section.cta.variant || "secondary")}</div>`
    : "";
  const tint = section.tint ? " section--tint" : "";
  return `
    <section class="section${tint}" data-dl-component="${section.id || "grid"}">
      <div class="container">
        ${renderSectionHead(section.head)}
        <div class="grid grid--${cols}">
          ${cards}
        </div>
        ${cta}
      </div>
    </section>`;
}

function renderFeatureList(section) {
  const items = section.items
    .map((item) => `<li><a href="${item.href}">${esc(item.label)}</a></li>`)
    .join("\n            ");
  const tint = section.tint ? " section--tint" : "";
  const grid = section.cols === 2 ? `<div class="grid grid--2">${items
    .split("\n            ")
    .reduce((acc, _, i, arr) => {
      return acc;
    }, "")}</div>` : "";

  if (section.cols === 2) {
    const half = Math.ceil(section.items.length / 2);
    const col1 = section.items.slice(0, half);
    const col2 = section.items.slice(half);
    return `
    <section class="section${tint}" data-dl-component="${section.id || "features"}">
      <div class="container">
        ${section.head ? renderSectionHead(section.head) : ""}
        <div class="grid grid--2">
          <ul class="feature-list">${col1.map((i) => `<li><a href="${i.href}">${esc(i.label)}</a></li>`).join("")}</ul>
          <ul class="feature-list">${col2.map((i) => `<li><a href="${i.href}">${esc(i.label)}</a></li>`).join("")}</ul>
        </div>
        ${section.cta ? `<div class="section__cta">${btn(section.cta.href, section.cta.label, section.cta.variant || "secondary")}</div>` : ""}
      </div>
    </section>`;
  }

  return `
    <section class="section${tint}" data-dl-component="${section.id || "features"}">
      <div class="container">
        ${section.head ? renderSectionHead(section.head) : ""}
        <ul class="feature-list">
          ${items}
        </ul>
        ${section.cta ? `<div class="section__cta">${btn(section.cta.href, section.cta.label, section.cta.variant || "secondary")}</div>` : ""}
      </div>
    </section>`;
}

function renderPromoSplit(section) {
  const reverse = section.reverse ? " promo--reverse" : "";
  const eyebrow = section.eyebrow
    ? `<span class="promo__eyebrow">${esc(section.eyebrow)}</span>`
    : "";
  const actions = (section.actions || [])
    .map((a) => btn(a.href, a.label, a.variant || "primary"))
    .join("\n            ");
  return `
    <section class="promo promo--split${reverse}" data-dl-component="${section.id || "promo"}">
      <div class="container promo__inner">
        <div class="promo__media">
          <img src="${section.image}" alt="${esc(section.imageAlt || "")}" />
        </div>
        <div class="promo__body">
          ${eyebrow}
          <h2 class="promo__title">${esc(section.title)}</h2>
          <p class="promo__text">${esc(section.text)}</p>
          <div class="promo__actions">
            ${actions}
          </div>
        </div>
      </div>
    </section>`;
}

function renderPromoBanner(section) {
  const dark = section.dark ? " promo--dark" : "";
  return `
    <section class="promo promo--banner${dark}" data-dl-component="${section.id || "banner"}">
      <div class="promo__bg">
        <img src="${section.image}" alt="" aria-hidden="true" />
      </div>
      <div class="container promo__overlay">
        <div class="promo__card">
          <h2 class="promo__title">${esc(section.title)}</h2>
          <p class="promo__text">${esc(section.text)}</p>
          ${section.cta ? btn(section.cta.href, section.cta.label, section.cta.variant || "primary") : ""}
        </div>
      </div>
    </section>`;
}

function renderArticleCards(section) {
  const cards = section.cards
    .map(
      (card) => `
          <article class="article-card">
            <div class="article-card__media"><img src="${card.image}" alt="${esc(card.imageAlt || "")}" /></div>
            <div class="article-card__body">
              <h3 class="article-card__title">${esc(card.title)}</h3>
              <p>${esc(card.text)}</p>
              <a href="${card.href}" class="article-card__link">${esc(card.linkLabel || "Read more")}</a>
            </div>
          </article>`
    )
    .join("");
  return `
    <section class="section" data-dl-component="${section.id || "articles"}">
      <div class="container">
        ${renderSectionHead(section.head)}
        <div class="grid grid--3">
          ${cards}
        </div>
      </div>
    </section>`;
}

function renderContent(section) {
  const paragraphs = section.paragraphs
    .map((p) => `<p>${esc(p)}</p>`)
    .join("\n          ");
  const tint = section.tint ? " section--tint" : "";
  return `
    <section class="section${tint}" data-dl-component="${section.id || "content"}">
      <div class="container">
        ${section.head ? renderSectionHead(section.head) : ""}
        <div class="content-block">
          ${paragraphs}
        </div>
      </div>
    </section>`;
}

function renderWayCards(section) {
  const cards = section.cards
    .map(
      (card) => `
          <article class="way-card">
            ${card.logo ? `<img class="way-card__logo" src="${card.logo}" alt="${esc(card.logoAlt || "")}" width="56" height="56" />` : ""}
            <h3 class="way-card__title">${esc(card.title)}</h3>
            <p>${esc(card.text)}</p>
            <a href="${card.href}" class="article-card__link">${esc(card.linkLabel || "Learn more")}</a>
          </article>`
    )
    .join("");
  const tint = section.tint ? " section--tint" : "";
  return `
    <section class="section${tint}" data-dl-component="${section.id || "ways"}">
      <div class="container">
        ${renderSectionHead(section.head)}
        <div class="grid grid--3">
          ${cards}
        </div>
        ${section.cta ? `<div class="section__cta">${btn(section.cta.href, section.cta.label, section.cta.variant || "secondary")}</div>` : ""}
      </div>
    </section>`;
}

function renderAwards(section) {
  return `
    <section class="section section--awards" data-dl-component="awards">
      <div class="container awards__inner">
        <img class="awards__badge" src="assets/logos/bank-of-the-year.png" alt="WeMoney Bank of the Year 2025 award badge" width="160" height="160" />
        <div class="awards__body">
          <h2 class="section__title">${esc(section.title)}</h2>
          <p class="section__lede">${esc(section.text)}</p>
        </div>
      </div>
    </section>`;
}

function renderSitemap(section) {
  const groups = section.groups
    .map(
      (group) => `
          <div class="sitemap-group">
            <h3 class="sitemap-group__title"><a href="${group.href}">${esc(group.title)}</a></h3>
            <ul class="sitemap-group__list">
              ${group.links.map((l) => `<li><a href="${l.href}">${esc(l.label)}</a></li>`).join("")}
            </ul>
          </div>`
    )
    .join("");
  return `
    <section class="section section--tint" data-dl-component="sitemap">
      <div class="container">
        ${renderSectionHead(section.head)}
        <div class="sitemap-grid">
          ${groups}
        </div>
      </div>
    </section>`;
}

function renderSections(sections) {
  return (sections || [])
    .map((section) => {
      switch (section.type) {
        case "hero":
          return renderHero(section);
        case "breadcrumb":
          return renderBreadcrumb(section.items);
        case "grid":
          return renderGridSection(section);
        case "features":
          return renderFeatureList(section);
        case "promo-split":
          return renderPromoSplit(section);
        case "promo-banner":
          return renderPromoBanner(section);
        case "articles":
          return renderArticleCards(section);
        case "content":
          return renderContent(section);
        case "ways":
          return renderWayCards(section);
        case "awards":
          return renderAwards(section);
        case "sitemap":
          return renderSitemap(section);
        default:
          return "";
      }
    })
    .join("\n");
}

module.exports = { renderSections, esc, btn };
