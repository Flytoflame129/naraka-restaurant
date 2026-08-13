import { readFile } from "node:fs/promises";

const requirements = [
  {
    file: "src/components/Navbar.astro",
    marker: "data-menu-toggle",
    name: "mobile menu button",
  },
  {
    file: "src/components/Navbar.astro",
    marker: 'id="site-navigation"',
    name: "site navigation",
  },
  {
    file: "src/components/Navbar.astro",
    marker: 'aria-expanded="false"',
    name: "closed mobile menu state",
  },
  {
    file: "src/components/Navbar.astro",
    marker: "data-menu-close",
    name: "mobile menu close control",
  },
  {
    file: "src/layouts/BaseLayout.astro",
    marker: "site-experience",
    name: "experience controller",
  },
  {
    file: "src/styles/global.css",
    marker: "[data-reveal]",
    name: "reveal animation styles",
  },
  {
    file: "src/styles/global.css",
    marker: "@media (prefers-reduced-motion: reduce)",
    name: "reduced-motion support",
  },
  {
    file: "src/styles/global.css",
    marker: "html:not(.js)",
    name: "no-JavaScript fallback",
  },
];

const sources = await Promise.all(
  [...new Set(requirements.map(({ file }) => file))].map(async (file) => [file, await readFile(file, "utf8")]),
);
const sourceByFile = new Map(sources);
const missingRequirements = requirements.filter(({ file, marker }) => !sourceByFile.get(file).includes(marker));

if (missingRequirements.length > 0) {
  for (const { name } of missingRequirements) {
    console.error(`Missing requirement: ${name}`);
  }

  process.exitCode = 1;
} else {
  console.log("Site experience validation passed.");
}
