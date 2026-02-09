import { wpGraphQL } from "@/lib/wpgraphql";
import { Q } from "@/lib/queries";
import { publicSiteUrl } from "@/lib/env";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function dateInputDaysAgo(days: number) {
  const d = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() };
}


export async function GET() {
  const site = publicSiteUrl();
  const after = dateInputDaysAgo(2); // DateInput (UTC) — recent URLs only.

  const data = await wpGraphQL<{
    posts: { nodes: { slug: string; title: string; date: string }[] };
  }>(Q.NEWS_SITEMAP, { first: 100, after });

  const urls = data.posts.nodes;

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">` +
    urls
      .map((p) => {
        return (
          `<url>` +
          `<loc>${esc(`${site}/posts/${p.slug}`)}</loc>` +
          `<news:news>` +
          `<news:publication>` +
          `<news:name>${esc("Heavy Status")}</news:name>` +
          `<news:language>en</news:language>` +
          `</news:publication>` +
          `<news:publication_date>${esc(p.date)}</news:publication_date>` +
          `<news:title>${esc(p.title)}</news:title>` +
          `</news:news>` +
          `</url>`
        );
      })
      .join("") +
    `</urlset>`;

  return new Response(xml, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
