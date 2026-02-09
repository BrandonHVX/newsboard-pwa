import { wpGraphQL } from "@/lib/wpgraphql";
import { Q } from "@/lib/queries";
import { publicSiteUrl } from "@/lib/env";
import { stripHtml } from "@/lib/utils";

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

type RssPost = {
  slug: string;
  title: string;
  excerpt?: string | null;
  date: string;
  author?: { node?: { name?: string } } | null;
  categories?: { nodes?: { name: string }[] } | null;
};

export async function GET() {
  const site = publicSiteUrl();

  const data = await wpGraphQL<{ posts: { nodes: RssPost[] } }>(Q.HEADLINES, { first: 30 });

  const items = data.posts.nodes;

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">` +
    `<channel>` +
    `<title>${esc("Heavy Status")}</title>` +
    `<link>${esc(site)}</link>` +
    `<language>en</language>` +
    `<description>${esc("Heavy Status — Breaking news, live coverage, and in-depth reporting.")}</description>` +
    `<atom:link href="${esc(`${site}/rss.xml`)}" rel="self" type="application/rss+xml"/>` +
    items
      .map((p) => {
        const link = `${site}/posts/${p.slug}`;
        const desc = esc(stripHtml(p.excerpt || ""));
        const author = p.author?.node?.name || "Heavy Status";
        const cats = (p.categories?.nodes || [])
          .map((c) => `<category>${esc(c.name)}</category>`)
          .join("");
        return (
          `<item>` +
          `<title>${esc(stripHtml(p.title))}</title>` +
          `<link>${esc(link)}</link>` +
          `<guid>${esc(link)}</guid>` +
          `<dc:creator>${esc(author)}</dc:creator>` +
          `<pubDate>${esc(new Date(p.date).toUTCString())}</pubDate>` +
          `<description>${desc}</description>` +
          cats +
          `</item>`
        );
      })
      .join("") +
    `</channel>` +
    `</rss>`;

  return new Response(xml, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
