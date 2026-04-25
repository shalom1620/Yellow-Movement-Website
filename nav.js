(() => {
  const OPEN_CLASS = "is-open";

  function initHeader(header) {
    const toggle = header.querySelector(".nav");
    const menu = header.querySelector(".header-words");
    if (!toggle || !menu) return;

    if (!menu.id) menu.id = "site-nav";
    toggle.setAttribute("aria-controls", menu.id);
    toggle.setAttribute("aria-expanded", "false");

    const close = () => {
      menu.classList.remove(OPEN_CLASS);
      toggle.setAttribute("aria-expanded", "false");
    };

    const open = () => {
      menu.classList.add(OPEN_CLASS);
      toggle.setAttribute("aria-expanded", "true");
    };

    const isOpen = () => menu.classList.contains(OPEN_CLASS);

    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (isOpen()) close();
      else open();
    });

    document.addEventListener("click", (e) => {
      if (!isOpen()) return;
      if (header.contains(e.target)) {
        if (menu.contains(e.target) || toggle.contains(e.target)) return;
      }
      close();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });

    menu.addEventListener("click", (e) => {
      const link = e.target.closest("a");
      if (link) close();
    });

    window.addEventListener("resize", () => {
      if (window.matchMedia("(min-width: 1024px)").matches) close();
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".header").forEach(initHeader);
  });
})();

(() => {
  const OPEN_CLASS = "is-open";

  function initHeader(header) {
    const toggle = header.querySelector(".nav");
    const menu = header.querySelector(".header-words");
    if (!toggle || !menu) return;

    if (!menu.id) menu.id = "site-nav";
    toggle.setAttribute("aria-controls", menu.id);
    toggle.setAttribute("aria-expanded", "false");

    const close = () => {
      menu.classList.remove(OPEN_CLASS);
      toggle.setAttribute("aria-expanded", "false");
    };

    const open = () => {
      menu.classList.add(OPEN_CLASS);
      toggle.setAttribute("aria-expanded", "true");
    };

    const isOpen = () => menu.classList.contains(OPEN_CLASS);

    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (isOpen()) close();
      else open();
    });

    document.addEventListener("click", (e) => {
      if (!isOpen()) return;
      if (header.contains(e.target)) {
        if (menu.contains(e.target) || toggle.contains(e.target)) return;
      }
      close();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });

    menu.addEventListener("click", (e) => {
      const link = e.target.closest("a");
      if (link) close();
    });

    window.addEventListener("resize", () => {
      if (window.matchMedia("(min-width: 1024px)").matches) close();
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".header").forEach(initHeader);
  });
})();

