import { wpGraphQL } from "@/lib/wpgraphql";
import type { PostCard } from "@/lib/types";
import { SectionHeader } from "@/components/content/SectionHeader";
import { ArticleRow } from "@/components/content/ArticlePieces";
import { EmptyState } from "@/components/content/EmptyState";
import { SearchBox } from "@/components/content/SearchBox";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const SEARCH_QUERY = /* GraphQL */ `
  query Search($q: String!, $first: Int!) {
    posts(first: $first, where: { search: $q, orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        slug
        title
        excerpt
        date
        author { node { name slug } }
        featuredImage { node { sourceUrl altText mediaDetails { width height } } }
        categories(first: 3) { nodes { name slug } }
      }
    }
  }
`;

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams;
  const q = (params.q || "").trim();

  if (!q) {
    return (
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="space-y-6">
          <SectionHeader title="Search" kicker="WordPress" />
          <SearchBox placeholder="Search posts…" />
          <EmptyState title="Type to search" message="Search runs directly against your WordPress content." />
        </div>
      </div>
    );
  }

  try {
    const data = await wpGraphQL<{ posts: { nodes: PostCard[] } }>(SEARCH_QUERY, { q, first: 30 });
    const posts = data.posts.nodes || [];

    return (
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="space-y-6">
          <SectionHeader title="Search" kicker={`Results for “${q}”`} />
          <SearchBox placeholder="Search posts…" />

          {posts.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {posts.map((p) => (
                <ArticleRow key={p.id} post={p} />
              ))}
            </div>
          ) : (
            <EmptyState title="No results" message="Try a different keyword." />
          )}
        </div>
      </div>
    );
  } catch (err: any) {
    return (
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <EmptyState title="Search failed" message="WPGraphQL search is unavailable." hint={String(err?.message || err)} />
      </div>
    );
  }
}
