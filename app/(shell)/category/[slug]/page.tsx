import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { wpGraphQL } from "@/lib/wpgraphql";
import { Q } from "@/lib/queries";
import type { PostCard } from "@/lib/types";
import { SectionHeader } from "@/components/content/SectionHeader";
import { ArticleRow } from "@/components/content/ArticlePieces";
import { stripHtml } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

type CatData = {
  category: {
    name: string;
    slug: string;
    description?: string | null;
    posts: { nodes: PostCard[] };
  } | null;
};

async function getCategory(slug: string) {
  const data = await wpGraphQL<CatData>(Q.CATEGORY_PAGE, { slug, first: 30 });
  return data.category;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = await getCategory(slug);
  if (!cat) return { title: "Category not found" };
  return {
    title: cat.name,
    description: stripHtml(cat.description || ""),
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = await getCategory(slug);
  if (!cat) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 md:px-6">
      <div className="space-y-6">
        <SectionHeader title={cat.name} kicker="Category" />
        {cat.description ? <p className="text-sm text-black/70">{stripHtml(cat.description)}</p> : null}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cat.posts.nodes.map((p) => (
            <ArticleRow key={p.id} post={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
