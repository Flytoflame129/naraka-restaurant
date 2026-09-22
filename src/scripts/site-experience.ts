let cleanupPreviousInitialization: ((preserveNavigation?: boolean) => void) | undefined;

export function initSiteExperience(): void {
  cleanupPreviousInitialization?.(true);

  const root = document.documentElement;
  // ClientRouter replaces root attributes, but deduplicates the inline bootstrap.
  // Restore this before no-JS fallback styles can expand the mobile navigation.
  root.classList.add("js");
  const controller = new AbortController();
  const { signal } = controller;
  let revealObserver: IntersectionObserver | undefined;

  const header = document.querySelector<HTMLElement>("[data-site-header]");
  const toggle = document.querySelector<HTMLButtonElement>("[data-menu-toggle]");
  const panel = document.querySelector<HTMLElement>("[data-menu-panel]");
  const overlay = document.querySelector<HTMLElement>("[data-menu-overlay]");
  cleanupPreviousInitialization = (preserveNavigation = false) => {
    controller.abort();
    revealObserver?.disconnect();
    for (const target of document.querySelectorAll<HTMLElement>(".is-pressed")) {
      target.classList.remove("is-pressed");
    }
    // Removing the navigation gate during a healthy reinitialization forces
    // fallback layout and animates the new drawer out of the viewport.
    if (!preserveNavigation) root.classList.remove("site-experience-ready");
    root.classList.remove("reveal-ready", "menu-open");
    header?.removeAttribute("data-menu-open");
    toggle?.setAttribute("aria-expanded", "false");
    panel?.removeAttribute("aria-hidden");
    if (panel) panel.inert = false;
  };

  try {
    const syncHeaderState = (): void => {
      header?.classList.toggle("has-scrolled", window.scrollY > 24);
    };

    window.addEventListener("scroll", syncHeaderState, { passive: true, signal });
    syncHeaderState();

    const revealTargets = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const revealImmediately = (): void => {
      for (const target of revealTargets) target.classList.add("is-revealed");
    };
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)");

    const clearPressedState = (target: HTMLElement): void => {
      target.classList.remove("is-pressed");
    };

    for (const control of document.querySelectorAll<HTMLElement>(
      ".button, .nav-menu-toggle, .nav-menu-close, .theme-switcher button, .filter-button, .dish-card a, .menu-item-card a, .daily-special-link, .info-card a, .source-card a, .stat-card a",
    )) {
      const feedbackTarget = control.closest<HTMLElement>(
        ".dish-card, .menu-item-card, .daily-special-card, .info-card, .source-card, .stat-card",
      ) ?? control;

      control.addEventListener(
        "pointerdown",
        (event) => {
          if (event.pointerType !== "touch" && !coarsePointer.matches) return;
          feedbackTarget.classList.add("is-pressed");
        },
        { signal },
      );

      for (const eventName of ["pointerup", "pointercancel", "lostpointercapture", "blur"] as const) {
        control.addEventListener(eventName, () => clearPressedState(feedbackTarget), { signal });
      }
    }

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

      for (const target of revealTargets) {
        if (!target.classList.contains("is-hidden")) revealObserver.observe(target);
      }
    }
    root.classList.add("reveal-ready");

    const revealThemeSection = (theme: string): void => {
      window.requestAnimationFrame(() => {
        const target = document.querySelector<HTMLElement>(`[data-theme-section="${theme}"]`);
        if (!target || target.classList.contains("is-hidden")) return;

        if (prefersReducedMotion || !revealObserver) {
          target.classList.add("is-revealed");
        } else {
          revealObserver.observe(target);
        }
      });
    };

    const syncThemeSections = (theme: string): void => {
      for (const section of document.querySelectorAll<HTMLElement>("[data-theme-section]")) {
        section.classList.toggle("is-hidden", section.dataset.themeSection !== theme);
      }
    };

    const syncThemeAccessibility = (theme = root.dataset.mapTheme || "juku"): void => {
      for (const group of document.querySelectorAll<HTMLElement>(
        '[aria-label="地图主题切换"], [aria-label="菜单主题切换"]',
      )) {
        for (const button of group.querySelectorAll<HTMLElement>("[data-map-theme-target]")) {
          button.setAttribute("aria-pressed", String(button.dataset.mapThemeTarget === theme));
        }
      }

      for (const layer of document.querySelectorAll<HTMLElement>("[data-theme-copy-layer]")) {
        layer.setAttribute("aria-hidden", String(layer.dataset.themeCopyLayer !== theme));
      }
    };

    window.addEventListener(
      "naraka-map-theme-change",
      (event) => {
        if (!(event instanceof CustomEvent) || typeof event.detail?.theme !== "string") return;
        syncThemeSections(event.detail.theme);
        syncThemeAccessibility(event.detail.theme);
        revealThemeSection(event.detail.theme);
      },
      { signal },
    );
    syncThemeSections(root.dataset.mapTheme || "juku");
    syncThemeAccessibility();

    if (!header || !toggle || !panel) {
      cleanupPreviousInitialization();
      return;
    }

    const toggleLabel = toggle.querySelector<HTMLElement>("[data-menu-toggle-label]");
    const mobileMenu = window.matchMedia("(max-width: 900px)");

    function setOpen(open: boolean): void {
      const menuIsOpen = mobileMenu.matches && open;
      header.toggleAttribute("data-menu-open", menuIsOpen);
      toggle.setAttribute("aria-expanded", String(menuIsOpen));
      if (toggleLabel) toggleLabel.textContent = menuIsOpen ? "关闭主导航" : "打开主导航";
      root.classList.toggle("menu-open", menuIsOpen);
      panel.inert = mobileMenu.matches && !menuIsOpen;

      if (mobileMenu.matches) {
        panel.setAttribute("aria-hidden", String(!menuIsOpen));
      } else {
        panel.removeAttribute("aria-hidden");
      }

      if (menuIsOpen) {
        panel.querySelector<HTMLElement>("a, button")?.focus();
      }
    }

    function closeMenu(restoreFocus = false): void {
      setOpen(false);
      if (restoreFocus && mobileMenu.matches && toggle.isConnected) {
        toggle.focus({ preventScroll: true });
      }
    }

    toggle.addEventListener(
      "click",
      () => {
        const wasOpen = toggle.getAttribute("aria-expanded") === "true";
        if (wasOpen) closeMenu(true);
        else setOpen(true);
      },
      { signal },
    );

    panel.querySelector<HTMLElement>("[data-menu-close]")?.addEventListener(
      "click",
      () => closeMenu(true),
      { signal },
    );

    overlay?.addEventListener(
      "pointerdown",
      (event) => {
        event.preventDefault();
        closeMenu(true);
      },
      { signal },
    );

    for (const link of panel.querySelectorAll<HTMLAnchorElement>("a")) {
      link.addEventListener("click", () => closeMenu(false), { signal });
    }

    document.addEventListener(
      "keydown",
      (event) => {
        if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
          closeMenu(true);
        }
      },
      { signal },
    );

    mobileMenu.addEventListener("change", () => closeMenu(false), { signal });
    setOpen(false);
    root.classList.add("site-experience-ready");
  } catch (error) {
    cleanupPreviousInitialization();
    console.error("Failed to initialize site experience.", error);
  }
}

// The router may force layout while swapping/focusing the new body, before
// after-swap fires. Carry only proven navigation capability into the incoming
// document, always with the new drawer closed, to avoid a fallback-layout flash.
document.addEventListener("astro:before-swap", (event) => {
  const incomingRoot = event.newDocument.documentElement;
  incomingRoot.classList.add("js");
  if (!document.documentElement.classList.contains("site-experience-ready")) return;

  incomingRoot.classList.add("site-experience-ready");
  incomingRoot.classList.remove("menu-open");
  const panel = event.newDocument.querySelector<HTMLElement>("[data-menu-panel]");
  if (panel && window.matchMedia("(max-width: 900px)").matches) {
    panel.inert = true;
    panel.setAttribute("aria-hidden", "true");
  }
});

// Initialize the swapped DOM before the transition captures its first frame.
document.addEventListener("astro:after-swap", initSiteExperience);
document.addEventListener("astro:page-load", initSiteExperience);
