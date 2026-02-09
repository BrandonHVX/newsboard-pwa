import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { wpGraphQL } from "@/lib/wpgraphql";
import { Q } from "@/lib/queries";
import type { PostFull, PostCard } from "@/lib/types";
import { formatDate, readingTimeMinutes, stripHtml } from "@/lib/utils";
import { articleJsonLd } from "@/lib/seo";
import { Chip } from "@/components/content/Chip";
import { ArticleRow } from "@/components/content/ArticlePieces";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

async function getPost(slug: string) {
  const data = await wpGraphQL<{ post: PostFull | null }>(Q.POST_BY_SLUG, { slug });
  return data.post;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Story not found" };

  const title = stripHtml(post.title);
  const description = stripHtml(post.excerpt || "");
  const image = post.featuredImage?.node?.sourceUrl;

  return {
    title,
    description,
    alternates: {
      canonical: `/posts/${slug}`,
    },
    openGraph: {
      type: "article",
      title,
      description,
      images: image ? [image] : undefined,
      publishedTime: post.date,
      modifiedTime: post.modified || post.date,
      authors: post.author?.node?.name ? [post.author.node.name] : undefined,
      section: post.categories?.nodes?.[0]?.name,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const cleanTitle = stripHtml(post.title);
  const author = post.author?.node?.name || "Newsroom";
  const minutes = readingTimeMinutes(stripHtml(post.content || ""));

  // Related: fetch a few latest posts (simple + fast).
  const related = await wpGraphQL<{ posts: { nodes: PostCard[] } }>(
    Q.HEADLINES,
    { first: 6 }
  ).then((d) => d.posts.nodes.filter((p) => p.slug !== post.slug).slice(0, 4))
    .catch(() => []);

  const ld = articleJsonLd(post);

  return (
    <article className="mx-auto max-w-3xl px-4 md:px-6">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />

      <header className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {(post.categories?.nodes || []).slice(0, 4).map((c) => (
            <Chip key={c.slug} href={`/category/${c.slug}`} label={c.name} />
          ))}
        </div>

        <h1 className="font-serif text-[34px] leading-[1.02] tracking-[-0.03em]">
          {cleanTitle}
        </h1>

        <div className="flex flex-wrap items-center gap-2 text-[13px] text-black/60">
          <span className="font-medium text-black/80">{author}</span>
          <span className="text-black/35">•</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span className="text-black/35">•</span>
          <span>{minutes} min read</span>
        </div>

        {post.featuredImage?.node?.sourceUrl ? (
          <figure className="overflow-hidden rounded-3xl border hairline bg-slate-100 shadow-[0_18px_60px_rgba(0,0,0,0.10)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.featuredImage.node.sourceUrl}
              alt={post.featuredImage.node.altText || cleanTitle}
              className="w-full object-cover"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          </figure>
        ) : null}
      </header>

      <div
        className="prose prose-slate max-w-none mt-8 prose-headings:font-serif prose-a:underline prose-a:underline-offset-4 prose-img:rounded-2xl"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: post.content || "" }}
      />

      {post.tags?.nodes?.length ? (
        <section className="mt-10">
          <div className="text-[11px] tracking-[0.32em] uppercase font-semibold text-black/45">
            Tags
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {post.tags.nodes.slice(0, 12).map((t) => (
              <Chip key={t.slug} href={`/tag/${t.slug}`} label={t.name} />
            ))}
          </div>
        </section>
      ) : null}

      {related.length ? (
        <section className="mt-12 space-y-4">
          <div className="flex items-end justify-between">
            <h2 className="font-serif text-2xl">Related</h2>
            <a href="/headlines" className="text-sm text-black/60 underline underline-offset-4">
              More
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {related.map((p) => (
              <ArticleRow key={p.id} post={p} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
