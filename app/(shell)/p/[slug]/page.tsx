import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { wpGraphQL } from "@/lib/wpgraphql";
import { Q } from "@/lib/queries";
import { stripHtml } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

type PageNode = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  content?: string | null;
  date: string;
  modified?: string | null;
};

async function getPage(slug: string) {
  // WPGraphQL page(idType: URI) expects something like "/about/".
  const uri = slug.startsWith("/") ? slug : `/${slug}/`;
  const data = await wpGraphQL<{ page: PageNode | null }>(Q.PAGE_BY_SLUG, { slug: uri });
  return data.page;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) return { title: "Page not found" };
  return {
    title: stripHtml(page.title),
    description: stripHtml(page.excerpt || ""),
  };
}

export default async function WPPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 md:px-6">
      <h1 className="font-serif text-[34px] leading-[1.02] tracking-[-0.03em]">{stripHtml(page.title)}</h1>
      <div
        className="prose prose-slate max-w-none mt-6 prose-headings:font-serif prose-a:underline prose-a:underline-offset-4"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: page.content || "" }}
      />
    </article>
  );
}
