import { publicSiteUrl } from "@/lib/env";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const site = publicSiteUrl();
  const txt = [
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${site}/sitemap.xml`,
    `Sitemap: ${site}/news-sitemap.xml`,
    "",
  ].join("\n");

  return new Response(txt, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
