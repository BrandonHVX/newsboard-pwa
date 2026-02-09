import { wpGraphQL } from "@/lib/wpgraphql";
import { Q } from "@/lib/queries";
import type { CategoryNode, TagNode } from "@/lib/types";
import { SectionHeader } from "@/components/content/SectionHeader";
import { Chip } from "@/components/content/Chip";
import { SearchBox } from "@/components/content/SearchBox";
import { EmptyState } from "@/components/content/EmptyState";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function ExplorePage() {
  try {
    const data = await wpGraphQL<{
      categories: { nodes: CategoryNode[] };
      tags: { nodes: TagNode[] };
    }>(
      /* GraphQL */ `
        query Explore($first: Int!) {
          categories(first: $first, where: {orderby: COUNT, order: DESC, hideEmpty: true}) {
            nodes { name slug count }
          }
          tags(first: $first, where: {orderby: COUNT, order: DESC, hideEmpty: true}) {
            nodes { name slug count }
          }
        }
      `,
      { first: 30 }
    );

    const categories = data.categories.nodes || [];
    const tags = data.tags.nodes || [];

    return (
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="space-y-6">
          <SectionHeader title="Explore" kicker="Find topics fast" />
          <SearchBox placeholder="Search (opens Google)..." />

          <section className="space-y-3">
            <div className="text-[11px] tracking-[0.32em] uppercase font-semibold text-black/45">
              Categories
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <Chip key={c.slug} href={`/category/${c.slug}`} label={c.name} />
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <div className="text-[11px] tracking-[0.32em] uppercase font-semibold text-black/45">
              Tags
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <Chip key={t.slug} href={`/tag/${t.slug}`} label={t.name} />
              ))}
            </div>
          </section>

          {!categories.length && !tags.length ? (
            <EmptyState title="No taxonomy found" message="Create categories and tags in WordPress to populate Explore." />
          ) : null}
        </div>
      </div>
    );
  } catch (err: any) {
    return (
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <EmptyState title="Unable to load Explore" message="Check WPGraphQL connectivity." hint={String(err?.message || err)} />
      </div>
    );
  }
}
