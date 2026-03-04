"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const header = document.getElementById("siteHeader");

  const menuBtn = document.getElementById("menuBtn");
  const mobileNav = document.getElementById("mobileNav");
  const themeToggle = document.getElementById("themeToggle");

  const navLinks = Array.from(document.querySelectorAll('a[href^="#"]'));
  const sectionIds = ["home", "about", "projects", "skills", "timeline", "services", "contact"];
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

  /* ===============================
     HEADER BLUR ON SCROLL (theme safe)
  =============================== */
  function setHeaderState() {
    if (!header) return;
    header.classList.toggle("header-scrolled", window.scrollY > 60);
  }
  window.addEventListener("scroll", setHeaderState);
  setHeaderState();

  /* ===============================
     MOBILE MENU
  =============================== */
  menuBtn?.addEventListener("click", () => {
    mobileNav?.classList.toggle("hidden");
  });

  function closeMobileNav() {
    if (mobileNav && !mobileNav.classList.contains("hidden")) {
      mobileNav.classList.add("hidden");
    }
  }

  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      closeMobileNav();
    });
  });

  /* ===============================
     THEME TOGGLE (CSS variables handle colors)
  =============================== */
  function applyTheme(theme) {
    const t = theme === "light" ? "light" : "dark";
    root.setAttribute("data-theme", t);
    localStorage.setItem("theme", t);
    themeToggle?.setAttribute("aria-checked", String(t === "dark"));
  }

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light" || savedTheme === "dark") {
    applyTheme(savedTheme);
  } else {
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    applyTheme(prefersLight ? "light" : "dark");
  }

  themeToggle?.addEventListener("click", () => {
    const current = root.getAttribute("data-theme");
    applyTheme(current === "dark" ? "light" : "dark");
    setHeaderState(); // keep header correct after theme change
  });

  /* ===============================
     REVEAL ANIMATION
  =============================== */
  const reveals = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      });
    },
    { threshold: 0.14 }
  );
  reveals.forEach(el => io.observe(el));

  /* ===============================
     ACTIVE NAV ON SCROLL
  =============================== */
  function setActiveNav() {
    const y = window.scrollY + 120;
    let currentId = "home";

    for (const sec of sections) {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (y >= top && y < top + height) {
        currentId = sec.id;
        break;
      }
    }

    document.querySelectorAll(".navlink").forEach(link => {
      const href = link.getAttribute("href");
      link.classList.toggle("active", href === `#${currentId}`);
    });
  }

  window.addEventListener("scroll", setActiveNav);
  setActiveNav();

  /* ===============================
     PROJECTS SLIDER
  =============================== */
  const track = document.getElementById("projectsTrack");
  const prevBtn = document.getElementById("projPrev");
  const nextBtn = document.getElementById("projNext");

  if (track) {
    function getCardStep() {
      const firstCard = track.querySelector(".project-card");
      if (!firstCard) return 340;

      const style = window.getComputedStyle(track);
      const gap = parseInt(style.columnGap || style.gap || "14", 10);
      return firstCard.offsetWidth + gap;
    }

    function scrollProjects(direction = 1) {
      track.scrollBy({ left: getCardStep() * direction, behavior: "smooth" });
    }

    prevBtn?.addEventListener("click", () => scrollProjects(-1));
    nextBtn?.addEventListener("click", () => scrollProjects(1));

    track.addEventListener(
      "wheel",
      (e) => {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          e.preventDefault();
          track.scrollLeft += e.deltaY;
        }
      },
      { passive: false }
    );

    track.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") scrollProjects(1);
      if (e.key === "ArrowLeft") scrollProjects(-1);
    });
  }
});

const contactForm = document.getElementById("contactForm");
const formMsg = document.getElementById("formMsg");

contactForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  formMsg?.classList.remove("hidden");
  contactForm.reset();
  setTimeout(() => {
    formMsg?.classList.add("hidden");
  }, 6000);
});

