let cleanupPreviousInitialization: (() => void) | undefined;

export function initSiteExperience(): void {
  cleanupPreviousInitialization?.();

  const controller = new AbortController();
  const { signal } = controller;
  cleanupPreviousInitialization = () => controller.abort();

  const root = document.documentElement;
  const header = document.querySelector<HTMLElement>("[data-site-header]");
  const toggle = document.querySelector<HTMLButtonElement>("[data-menu-toggle]");
  const panel = document.querySelector<HTMLElement>("[data-menu-panel]");

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
