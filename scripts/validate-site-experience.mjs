import { readFile } from "node:fs/promises";

const sourceFiles = [
  "package.json",
  "src/components/Navbar.astro",
  "src/components/ThemeHeroPicture.astro",
  "src/components/ThemeSwitcher.astro",
  "src/layouts/BaseLayout.astro",
  "src/pages/index.astro",
  "src/pages/menu.astro",
  "src/scripts/site-experience.ts",
  "src/styles/global.css",
];

const sources = new Map(
  await Promise.all(sourceFiles.map(async (file) => [file, await readFile(file, "utf8")])),
);

const getSource = (file) => sources.get(file) ?? "";
const navbar = getSource("src/components/Navbar.astro");
const themeMedia = getSource("src/components/ThemeHeroPicture.astro");
const themeSwitcher = getSource("src/components/ThemeSwitcher.astro");
const layout = getSource("src/layouts/BaseLayout.astro");
const home = getSource("src/pages/index.astro");
const menu = getSource("src/pages/menu.astro");
const controller = getSource("src/scripts/site-experience.ts");
const css = getSource("src/styles/global.css");
const packageJson = JSON.parse(getSource("package.json"));
const overlayOpeningTag = navbar.match(/<[^>]+data-menu-overlay[^>]*>/s)?.[0] ?? "";

const count = (source, pattern) => [...source.matchAll(pattern)].length;
const block = (source, start, end) => source.slice(source.indexOf(start), source.indexOf(end, source.indexOf(start)));

const requirements = [
  ["mobile menu semantics", navbar.includes("data-menu-toggle") && navbar.includes('aria-controls="site-navigation"') && navbar.includes('aria-expanded="false"')],
  ["mobile menu close paths", navbar.includes("data-menu-close") && navbar.includes("data-menu-overlay")],
  ["unified menu close transaction", controller.includes("function closeMenu") && count(controller, /closeMenu\(true\)/g) >= 3 && controller.includes('overlay?.addEventListener(\n      "pointerdown"') && controller.includes("event.preventDefault()")],
  ["closed menu focus isolation", /panel\.inert\s*=\s*[^;]+/.test(controller) && /panel\.setAttribute\("aria-hidden",\s*String\([^)]+\)\)/.test(controller)],
  ["overlay is non-interactive", overlayOpeningTag.startsWith("<div") && overlayOpeningTag.includes('aria-hidden="true"') && !overlayOpeningTag.includes("role=") && !overlayOpeningTag.includes("tabindex=")],
  ["menu progressive enhancement capability gate", css.includes("html.site-experience-ready .nav-panel") && css.includes("html:not(.js) .nav-panel")],
  ["repeatable experience controller", controller.includes("cleanupPreviousInitialization?.()") && controller.includes("controller.abort()") && controller.includes('document.addEventListener("astro:page-load", initSiteExperience)')],
  ["custom Astro page transition", layout.includes("cinematicPageTransition") && layout.includes("transition:animate={cinematicPageTransition}")],
  ["page transition duration contract", /duration:\s*["'](?:4[5-9]\d|5\d\d|6[0-5]\d)ms["']/.test(layout)],
  ["page transition opacity and transform", css.includes("@keyframes site-page-enter") && css.includes("@keyframes site-page-exit") && block(css, "@keyframes site-page-enter", "@keyframes site-page-exit").includes("opacity") && block(css, "@keyframes site-page-enter", "@keyframes site-page-exit").includes("transform")],
  ["page transition reduced-motion fallback", css.includes("::view-transition-old(root)") && css.includes("::view-transition-new(root)") && css.includes("animation: none !important")],
  ["theme media cross-fade structure", themeMedia.includes("data-map-theme-picture") && css.includes(".hero-theme-picture") && css.includes("opacity: 0") && css.includes("opacity: 1")],
  ["theme media avoids display hard cut", !block(css, ".hero-theme-picture {", ".hero-theme-picture img").includes("display: none")],
  ["layered theme title and description", home.includes("data-theme-copy-layer") && home.includes("data-theme-title-layer") && css.includes(".hero-theme-copy-layer")],
  ["theme state persistence", themeSwitcher.includes('const themeKey = "naraka-restaurant-map-theme"') && themeSwitcher.includes("localStorage.setItem") && layout.includes("naraka-restaurant-map-theme")],
  ["single active theme accessibility state", controller.includes("syncThemeAccessibility") && controller.includes('aria-pressed')],
  ["declarative reveal targets", !controller.includes('setAttribute("data-reveal"') && controller.includes('querySelectorAll<HTMLElement>("[data-reveal]")')],
  ["menu has no nested reveal markers", count(menu, /data-reveal(?:\s|>|=)/g) === 2 && !menu.includes('class="filter-panel" aria-label="菜单主题切换" data-reveal')],
  ["hidden theme reveal support", controller.includes("revealThemeSection") && controller.includes("naraka-map-theme-change")],
  ["single reveal observer", count(controller, /new IntersectionObserver/g) === 1],
  ["reveal no-JavaScript fallback", css.includes("html:not(.js) [data-reveal]")],
  ["reveal reduced-motion fallback", css.includes("@media (prefers-reduced-motion: reduce)") && css.includes("[data-reveal].is-revealed")],
  ["explicit coarse pointer press state", controller.includes('"pointerdown"') && controller.includes('"pointerup"') && controller.includes('"pointercancel"') && controller.includes('"lostpointercapture"') && controller.includes('"blur"') && controller.includes('classList.add("is-pressed")')],
  ["coarse pointer press feedback", css.includes(".is-pressed") && css.includes("translate3d(0, 2px, 0)")],
  ["reduced-motion press displacement disabled", css.includes("@media (prefers-reduced-motion: reduce)") && css.includes(".is-pressed") && css.includes("transform: none !important")],
  ["replayable QA command", typeof packageJson.scripts?.["qa:experience"] === "string" && packageJson.scripts["qa:experience"].includes("qa-site-experience.mjs")],
];

const missingRequirements = requirements.filter(([, passed]) => !passed);

if (missingRequirements.length > 0) {
  for (const [name] of missingRequirements) console.error(`Missing requirement: ${name}`);
  process.exitCode = 1;
} else {
  console.log(`Site experience validation passed (${requirements.length} cross-file contracts).`);
}
