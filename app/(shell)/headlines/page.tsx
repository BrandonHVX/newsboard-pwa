import { wpGraphQL } from "@/lib/wpgraphql";
import { Q } from "@/lib/queries";
import type { PostCard } from "@/lib/types";
import { SectionHeader } from "@/components/content/SectionHeader";
import { HeroCard, ArticleRow } from "@/components/content/ArticlePieces";
import { EmptyState } from "@/components/content/EmptyState";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function HeadlinesPage() {
  try {
    const data = await wpGraphQL<{ posts: { nodes: PostCard[] } }>(Q.HEADLINES, { first: 20 });
    const posts = data.posts.nodes || [];
    const hero = posts[0];
    const rest = posts.slice(1);

    return (
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="space-y-6">
          <SectionHeader title="Headlines" kicker="Breaking + top stories" />

          {hero ? <HeroCard post={hero} /> : null}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rest.map((p) => (
              <ArticleRow key={p.id} post={p} />
            ))}
          </div>

          {!posts.length ? (
            <EmptyState title="No posts yet" message="Publish your first story in WordPress to populate this feed." />
          ) : null}
        </div>
      </div>
    );
  } catch (err: any) {
    return (
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <EmptyState
          title="Unable to load headlines"
          message="Check your WPGRAPHQL_URL environment variable and WPGraphQL availability."
          hint={String(err?.message || err)}
        />
      </div>
    );
  }
}
