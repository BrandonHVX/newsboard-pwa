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

export async function GET() {
  const site = publicSiteUrl();

  const baseUrls = [
    `${site}/today`,
    `${site}/headlines`,
    `${site}/live`,
    `${site}/explore`,
    `${site}/media`,
  ];

  try {
    const data = await wpGraphQL<{
      posts: { nodes: { slug: string; modified?: string | null }[] };
      pages: { nodes: { slug: string; modified?: string | null }[] };
      categories: { nodes: { slug: string }[] };
      tags: { nodes: { slug: string }[] };
      mediaItems: { nodes: { slug: string; modified?: string | null }[] };
    }>(Q.SITEMAP_BATCH, { first: 200 });

    const urls: { loc: string; lastmod?: string }[] = [];

    for (const u of baseUrls) urls.push({ loc: u });

    for (const p of data.posts.nodes) {
      urls.push({ loc: `${site}/posts/${p.slug}`, lastmod: p.modified || undefined });
    }
    for (const p of data.pages.nodes) {
      urls.push({ loc: `${site}/p/${p.slug}`, lastmod: p.modified || undefined });
    }
    for (const c of data.categories.nodes) {
      urls.push({ loc: `${site}/category/${c.slug}` });
    }
    for (const t of data.tags.nodes) {
      urls.push({ loc: `${site}/tag/${t.slug}` });
    }

    for (const m of data.mediaItems.nodes) {
      urls.push({ loc: `${site}/media/${m.slug}`, lastmod: m.modified || undefined });
    }

    const xml =
      `<?xml version="1.0" encoding="UTF-8"?>` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
      urls
        .map((u) => {
          const lastmod = u.lastmod ? `<lastmod>${esc(u.lastmod)}</lastmod>` : "";
          return `<url><loc>${esc(u.loc)}</loc>${lastmod}</url>`;
        })
        .join("") +
      `</urlset>`;

    return new Response(xml, {
      headers: {
        "content-type": "application/xml; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  } catch {
    // Minimal sitemap if WP is not connected yet.
    const xml =
      `<?xml version="1.0" encoding="UTF-8"?>` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
      baseUrls.map((u) => `<url><loc>${esc(u)}</loc></url>`).join("") +
      `</urlset>`;

    return new Response(xml, {
      headers: {
        "content-type": "application/xml; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  }
}
