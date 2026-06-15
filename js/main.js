/* NAB landing rebuild - interactions
   Mega menu, mobile nav, search, login dropdown, accordions. */
(function () {
  "use strict";

  const header = document.getElementById("siteHeader");
  const mainNav = document.getElementById("mainNav");
  const overlay = document.getElementById("megaOverlay");
  const navItems = Array.from(document.querySelectorAll(".main-nav__item[data-menu]"));
  const isMobile = () => window.matchMedia("(max-width: 880px)").matches;

  function pushClick(id, label) {
    if (window.NabDataLayer) {
      window.NabDataLayer.pushClick(id, label);
    }
  }

  /* ---------- Mega menu ---------- */
  function closeAllMenus(except) {
    navItems.forEach((item) => {
      if (item === except) return;
      const btn = item.querySelector(".main-nav__btn");
      const panel = document.getElementById(btn.getAttribute("aria-controls"));
      item.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
      if (panel && !isMobile()) panel.hidden = true;
    });
    if (!except && overlay) overlay.hidden = true;
  }

  navItems.forEach((item) => {
    const btn = item.querySelector(".main-nav__btn");
    const panelId = btn.getAttribute("aria-controls");
    const panel = document.getElementById(panelId);

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const isOpen = item.classList.contains("is-open");
      closeAllMenus(isOpen ? null : item);
      if (isOpen) {
        item.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
        if (panel && !isMobile()) panel.hidden = true;
        if (overlay) overlay.hidden = true;
      } else {
        item.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
        if (panel) panel.hidden = false;
        if (overlay && !isMobile()) overlay.hidden = false;
        pushClick("nav-" + (panelId || "menu"), btn.textContent.trim());
      }
    });

    // Desktop hover open
    item.addEventListener("mouseenter", () => {
      if (isMobile()) return;
      closeAllMenus(item);
      item.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
      if (panel) panel.hidden = false;
      if (overlay) overlay.hidden = false;
    });
  });

  // Close mega menu when leaving the header region (desktop)
  header.addEventListener("mouseleave", () => {
    if (!isMobile()) closeAllMenus();
  });
  if (overlay) overlay.addEventListener("click", () => closeAllMenus());

  /* ---------- Mobile slide-in menu ---------- */
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileMenuClose = document.getElementById("mobileMenuClose");

  function setMobileMenu(open) {
    if (!mobileMenu) return;
    mobileMenu.classList.toggle("is-open", open);
    mobileMenu.setAttribute("aria-hidden", String(!open));
    if (hamburger) hamburger.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
    if (open) pushClick("mobile-menu-open", "Menu");
  }

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      setMobileMenu(!(mobileMenu && mobileMenu.classList.contains("is-open")));
    });
  }
  if (mobileMenuClose) {
    mobileMenuClose.addEventListener("click", () => setMobileMenu(false));
  }
  if (mobileMenu) {
    mobileMenu.addEventListener("click", (e) => {
      if (e.target === mobileMenu) setMobileMenu(false);
    });
  }

  document.querySelectorAll(".mobile-acc__btn").forEach((btn) => {
    const panel = btn.nextElementSibling;
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      if (panel) panel.hidden = open;
    });
  });

  /* ---------- Search panel ---------- */
  const searchToggle = document.getElementById("searchToggle");
  const searchPanel = document.getElementById("searchPanel");
  if (searchToggle && searchPanel) {
    searchToggle.addEventListener("click", () => {
      const open = searchPanel.hidden;
      searchPanel.hidden = !open;
      searchToggle.setAttribute("aria-expanded", String(open));
      if (open) {
        const input = searchPanel.querySelector("input");
        if (input) input.focus();
        pushClick("search-open", "Search");
      }
    });
  }

  /* ---------- Login dropdown ---------- */
  const loginToggle = document.getElementById("loginToggle");
  const loginPanel = document.getElementById("loginPanel");
  if (loginToggle && loginPanel) {
    loginToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = loginPanel.hidden;
      loginPanel.hidden = !open;
      loginToggle.setAttribute("aria-expanded", String(open));
      if (open) pushClick("login-open", "Login");
    });
    document.addEventListener("click", (e) => {
      if (!loginPanel.hidden && !loginPanel.contains(e.target) && e.target !== loginToggle) {
        loginPanel.hidden = true;
        loginToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Accordions ---------- */
  document.querySelectorAll(".accordion__btn").forEach((btn) => {
    const panel = document.getElementById(btn.getAttribute("aria-controls"));
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      if (panel) panel.hidden = open;
      if (!open) pushClick("accordion-open", btn.textContent.trim());
    });
  });

  /* ---------- Escape closes overlays ---------- */
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    closeAllMenus();
    if (mobileMenu && mobileMenu.classList.contains("is-open")) setMobileMenu(false);
    if (searchPanel && !searchPanel.hidden) {
      searchPanel.hidden = true;
      searchToggle.setAttribute("aria-expanded", "false");
    }
    if (loginPanel && !loginPanel.hidden) {
      loginPanel.hidden = true;
      loginToggle.setAttribute("aria-expanded", "false");
    }
  });

  /* ---------- Track CTA / link clicks for the data layer ---------- */
  document.querySelectorAll("[data-dl-id], .btn, .link-card__more, .article-card__link").forEach((el) => {
    el.addEventListener("click", () => {
      const id = el.getAttribute("data-dl-id") || el.className.split(" ")[0];
      pushClick(id, (el.textContent || "").trim().slice(0, 60));
    });
  });

  /* ---------- Reset nav state on resize across breakpoint ---------- */
  let wasMobile = isMobile();
  window.addEventListener("resize", () => {
    const nowMobile = isMobile();
    if (nowMobile !== wasMobile) {
      wasMobile = nowMobile;
      setMobileMenu(false);
      closeAllMenus();
    }
  });
})();
