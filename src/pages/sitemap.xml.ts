import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { isPublicDishStatus, sitePath } from "../lib/site";

const staticRoutes = ["/", "/menu/", "/gallery/", "/submit/", "/about/"];

function escapeXml(value: string) {
  return value.replace(/[<>&'\"]/g, (character) => {
    const entities: Record<string, string> = {
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      "'": "&apos;",
      '"': "&quot;",
    };
    return entities[character];
  });
}

export const GET: APIRoute = async ({ site }) => {
  const origin = site ?? new URL("https://flytoflame129.github.io");
  const dishes = await getCollection("dishes", ({ data }) =>
    isPublicDishStatus(data.status, data.publishStatus),
  );
  const routes = [
    ...staticRoutes,
    ...dishes.map((dish) => `/dishes/${dish.data.slug}/`),
  ];
  const urls = routes
    .map((route) => `  <url><loc>${escapeXml(new URL(sitePath(route), origin).href)}</loc></url>`)
    .join("\n");

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
