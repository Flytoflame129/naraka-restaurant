let cleanupPreviousInitialization: (() => void) | undefined;

export function initSiteExperience(): void {
  cleanupPreviousInitialization?.();

  const controller = new AbortController();
  const { signal } = controller;
  let revealObserver: IntersectionObserver | undefined;
  cleanupPreviousInitialization = () => {
    controller.abort();
    revealObserver?.disconnect();
  };

  const root = document.documentElement;
  const header = document.querySelector<HTMLElement>("[data-site-header]");
  const toggle = document.querySelector<HTMLButtonElement>("[data-menu-toggle]");
  const panel = document.querySelector<HTMLElement>("[data-menu-panel]");

  const syncHeaderState = (): void => {
    header?.classList.toggle("has-scrolled", window.scrollY > 24);
  };

  window.addEventListener("scroll", syncHeaderState, { passive: true, signal });
  syncHeaderState();

  for (const section of document.querySelectorAll<HTMLElement>(
    ".section > .container, .section-tight > .container",
  )) {
    section.setAttribute("data-reveal", "");
  }

  const revealTargets = document.querySelectorAll<HTMLElement>("[data-reveal]");
  const revealImmediately = (): void => {
    for (const target of revealTargets) target.classList.add("is-revealed");
  };
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealImmediately();
  } else {
    revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-revealed");
          revealObserver?.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8%", threshold: 0.12 },
    );

    for (const target of revealTargets) revealObserver.observe(target);
  }

  if (!header || !toggle || !panel) {
    root.classList.remove("menu-open");
    return;
  }

  const toggleLabel = toggle.querySelector<HTMLElement>("[data-menu-toggle-label]");

  function setOpen(open: boolean, restoreFocus = false): void {
    header.toggleAttribute("data-menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    if (toggleLabel) toggleLabel.textContent = open ? "关闭主导航" : "打开主导航";
    root.classList.toggle("menu-open", open);

    if (open) {
      panel.querySelector<HTMLElement>("a, button")?.focus();
    } else if (restoreFocus) {
      toggle.focus();
    }
  }

  toggle.addEventListener(
    "click",
    () => setOpen(toggle.getAttribute("aria-expanded") !== "true"),
    { signal },
  );

  for (const closeControl of header.querySelectorAll<HTMLElement>("[data-menu-close], [data-menu-overlay]")) {
    closeControl.addEventListener("click", () => setOpen(false), { signal });
  }

  for (const link of panel.querySelectorAll<HTMLAnchorElement>("a")) {
    link.addEventListener("click", () => setOpen(false), { signal });
  }

  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false, true);
      }
    },
    { signal },
  );

  setOpen(false);
}

document.addEventListener("astro:page-load", initSiteExperience);
