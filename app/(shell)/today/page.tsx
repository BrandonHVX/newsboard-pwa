import { wpGraphQL } from "@/lib/wpgraphql";
import { Q } from "@/lib/queries";
import type { PostCard, CategoryNode } from "@/lib/types";
import { SectionHeader } from "@/components/content/SectionHeader";
import { HeroCard, ArticleCard, ArticleRow } from "@/components/content/ArticlePieces";
import { Chip } from "@/components/content/Chip";
import { SearchBox } from "@/components/content/SearchBox";
import { EmptyState } from "@/components/content/EmptyState";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

function dateInputToday() {
  const tz = process.env.NEXT_PUBLIC_TIMEZONE || "America/New_York";
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const year = Number(parts.find((p) => p.type === "year")?.value);
  const month = Number(parts.find((p) => p.type === "month")?.value);
  const day = Number(parts.find((p) => p.type === "day")?.value);

  return { year, month, day };
}

export default async function TodayPage() {
  try {
    const after = dateInputToday();

    const data = await wpGraphQL<{
      posts: { nodes: PostCard[] };
      categories: { nodes: CategoryNode[] };
    }>(
      /* GraphQL */ `
        query Today($first: Int!, $after: DateInput, $catFirst: Int!) {
          posts(first: $first, where: {orderby: {field: DATE, order: DESC}, dateQuery: {after: $after, inclusive: true}}) {
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
          categories(first: $catFirst, where: {orderby: COUNT, order: DESC, hideEmpty: true}) {
            nodes { name slug count }
          }
        }
      `,
      { first: 16, after, catFirst: 12 }
    );

    const posts = data.posts.nodes || [];
    const cats = data.categories.nodes || [];
    const hero = posts[0];
    const rest = posts.slice(1);

    return (
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="space-y-6">
          <SectionHeader
            title="Today"
            kicker="Forbes-style brief"
            right={<a href="/rss.xml" className="hidden md:inline text-sm underline underline-offset-4 text-black/70">RSS</a>}
          />

          <SearchBox placeholder="Search articles..." />

          <div className="flex flex-wrap gap-2">
            {cats.slice(0, 10).map((c) => (
              <Chip key={c.slug} href={`/category/${c.slug}`} label={c.name} />
            ))}
          </div>

          {hero ? (
            <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-6">
              <HeroCard post={hero} />

              <div className="grid grid-cols-2 gap-4">
                {rest.slice(0, 2).map((p, i) => (
                  <ArticleCard
                    key={p.id}
                    post={p}
                    variant={i === 0 ? "tall" : "square"}
                  />
                ))}
              </div>
            </div>
          ) : (
            <EmptyState
              title="No posts found for today"
              message="Publish a post in WordPress to see it here instantly."
              hint="Tip: ensure WPGraphQL is enabled and your WPGRAPHQL_URL environment variable is set."
            />
          )}

          {rest.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rest.slice(2, 10).map((p) => (
                <ArticleRow key={p.id} post={p} />
              ))}
            </div>
          ) : null}

          {rest.length > 10 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {rest.slice(10, 14).map((p, idx) => (
                <ArticleCard key={p.id} post={p} variant={idx % 2 === 0 ? "square" : "tall"} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    );
  } catch (err: any) {
    return (
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <EmptyState
          title="Connect your WordPress backend"
          message="This page renders in real time from WPGraphQL. Configure the required environment variable and redeploy once."
          hint={`Missing/invalid WPGRAPHQL_URL or WPGraphQL error:\n\n${String(err?.message || err)}`}
        />
      </div>
    );
  }
}
