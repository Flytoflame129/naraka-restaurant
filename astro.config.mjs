import { defineConfig } from "astro/config";

function normalizeBase(value) {
  if (!value || value === "/") {
    return "/";
  }

  const trimmed = value.replace(/^\/+|\/+$/g, "");
  return `/${trimmed}/`;
}

export default defineConfig({
  output: "static",
  site: process.env.SITE ?? "https://example.github.io",
  base: normalizeBase(process.env.BASE_PATH),
});
