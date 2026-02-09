import Link from "next/link";
import { wpGraphQL } from "@/lib/wpgraphql";
import { Q } from "@/lib/queries";
import type { PostCard } from "@/lib/types";
import { formatDate, stripHtml } from "@/lib/utils";
import { SectionHeader } from "@/components/content/SectionHeader";
import { EmptyState } from "@/components/content/EmptyState";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

type LivePost = PostCard & { content?: string | null };

function getLiveTagSlug() {
  return process.env.LIVE_TAG_SLUG || process.env.NEXT_PUBLIC_LIVE_TAG_SLUG || "";
}

function buildHref(base: string, params: Record<string, string | undefined>) {
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v) usp.set(k, v);
  }
  const qs = usp.toString();
  return qs ? `${base}?${qs}` : base;
}

function extractVideoSrc(html?: string | null): { kind: "youtube" | "vimeo" | "mp4"; src: string } | null {
  if (!html) return null;

  // 1) iframe src
  const iframe = html.match(/<iframe[^>]+src=["']([^"']+)["'][^>]*>/i);
  if (iframe?.[1]) {
    const src = iframe[1];
    if (src.includes("youtube.com") || src.includes("youtube-nocookie.com")) return { kind: "youtube", src };
    if (src.includes("vimeo.com")) return { kind: "vimeo", src };
  }

  // 2) youtube links
  const yt = html.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/i);
  if (yt?.[1]) {
    const id = yt[1];
    return { kind: "youtube", src: `https://www.youtube-nocookie.com/embed/${id}` };
  }

  // 3) vimeo links
  const vm = html.match(/vimeo\.com\/(\d{6,})/i);
  if (vm?.[1]) {
    const id = vm[1];
    return { kind: "vimeo", src: `https://player.vimeo.com/video/${id}` };
  }

  // 4) mp4 sources
  const mp4 = html.match(/https?:\/\/[^"'\s>]+\.mp4[^"'\s>]*/i);
  if (mp4?.[0]) return { kind: "mp4", src: mp4[0] };

  return null;
}

function collectCategories(posts: LivePost[]) {
  const map = new Map<string, { slug: string; name: string; count: number }>();
  for (const p of posts) {
    for (const c of (p.categories?.nodes || [])) {
      const prev = map.get(c.slug);
      map.set(c.slug, { slug: c.slug, name: c.name, count: (prev?.count || 0) + 1 });
    }
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count).slice(0, 14);
}

function CategoryPills({
  items,
  active,
  currentVideo,
}: {
  items: { slug: string; name: string; count: number }[];
  active?: string;
  currentVideo?: string;
}) {
  const pillBase =
    "shrink-0 rounded-full border hairline px-3 py-1.5 text-[12px] font-semibold shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition";
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
      <Link
        href={buildHref("/live", { v: currentVideo })}
        className={`${pillBase} ${!active ? "bg-black text-white" : "bg-white text-black/80 hover:bg-black hover:text-white"}`}
      >
        All
      </Link>
      {items.map((c) => (
        <Link
          key={c.slug}
          href={buildHref("/live", { c: c.slug, v: currentVideo })}
          className={`${pillBase} ${active === c.slug ? "bg-black text-white" : "bg-white text-black/80 hover:bg-black hover:text-white"}`}
        >
          {c.name}
        </Link>
      ))}
    </div>
  );
}

function VideoCard({
  post,
  active,
  href,
}: {
  post: LivePost;
  active?: boolean;
  href: string;
}) {
  const title = stripHtml(post.title);
  const thumb = post.featuredImage?.node?.sourceUrl;
  const author = post.author?.node?.name || "Heavy Status";

  return (
    <Link
      href={href}
      className={`group flex gap-3 rounded-2xl p-2 transition ${active ? "bg-black/[0.04]" : "hover:bg-black/[0.03]"}`}
    >
      <div className="relative aspect-video w-[46%] min-w-[160px] overflow-hidden rounded-xl bg-black/90">
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumb}
            alt={post.featuredImage?.node?.altText || title}
            className="h-full w-full object-cover opacity-95 group-hover:opacity-100 transition"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-white/60 text-sm">Video</div>
        )}

        <div className="absolute inset-0 grid place-items-center">
          <div className="rounded-full bg-black/55 px-3 py-2 text-[12px] font-semibold text-white shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur">
            ▶ Play
          </div>
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <div className="text-[14px] font-semibold leading-snug text-black/90 group-hover:text-black">
          <div className="[display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] overflow-hidden">
            {title}
          </div>
        </div>

        <div className="mt-1 text-[12px] text-black/55">
          <div className="truncate">{author}</div>
          <div className="mt-0.5 flex items-center gap-2">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            {(post.categories?.nodes || [])[0]?.name ? (
              <>
                <span className="text-black/25">•</span>
                <span className="truncate">{(post.categories?.nodes || [])[0]?.name}</span>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  );
}

function VideoPlayer({ post }: { post: LivePost }) {
  const title = stripHtml(post.title);
  const video = extractVideoSrc(post.content);
  const thumb = post.featuredImage?.node?.sourceUrl;

  return (
    <div className="rounded-3xl border hairline bg-white shadow-[0_18px_60px_rgba(0,0,0,0.10)] overflow-hidden">
      <div className="relative aspect-video bg-black">
        {video ? (
          video.kind === "mp4" ? (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video className="absolute inset-0 h-full w-full object-cover" controls playsInline preload="metadata">
              <source src={video.src} />
            </video>
          ) : (
            <iframe
              className="absolute inset-0 h-full w-full"
              src={video.src}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          )
        ) : thumb ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumb}
              alt={post.featuredImage?.node?.altText || title}
              className="absolute inset-0 h-full w-full object-cover opacity-90"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
            <div className="absolute inset-0 grid place-items-center">
              <div className="rounded-full bg-white/10 px-5 py-4 text-white text-sm font-semibold backdrop-blur border border-white/20 shadow-[0_18px_70px_rgba(0,0,0,0.45)]">
                ▶ Watch
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 grid place-items-center text-white/70">No video</div>
        )}
      </div>

      <div className="p-4 md:p-5">
        <h1 className="font-serif text-[22px] md:text-[26px] leading-[1.05] tracking-[-0.02em]">
          {title}
        </h1>

        <div className="mt-2 flex flex-wrap items-center gap-2 text-[13px] text-black/60">
          <span className="font-semibold text-black/80">{post.author?.node?.name || "Heavy Status"}</span>
          <span className="text-black/30">•</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span className="text-black/30">•</span>
          <Link className="underline underline-offset-4" href={`/posts/${post.slug}`}>
            Open story
          </Link>
        </div>

        {(post.categories?.nodes || []).length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {(post.categories?.nodes || []).slice(0, 5).map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className="rounded-full bg-black/[0.04] px-3 py-1.5 text-[12px] font-semibold text-black/75 hover:bg-black hover:text-white transition"
              >
                {c.name}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default async function LivePage({
  searchParams,
}: {
  searchParams: Promise<{ v?: string; c?: string }>;
}) {
  const resolvedParams = await searchParams;
  const liveTagSlug = getLiveTagSlug();

  if (!liveTagSlug) {
    return (
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <EmptyState
          title="Live is not configured"
          message="Set the LIVE_TAG_SLUG environment variable in Amplify to the WordPress tag slug you want to treat as Live."
          hint="Example: LIVE_TAG_SLUG=live"
        />
      </div>
    );
  }

  try {
    const data = await wpGraphQL<{ tag: { name: string; slug: string; posts: { nodes: LivePost[] } } | null }>(
      Q.LIVE_BY_TAG,
      { slug: liveTagSlug, first: 40 }
    );

    const all = data.tag?.posts?.nodes || [];
    const categories = collectCategories(all);

    const categoryFilter = resolvedParams.c;
    const filtered = categoryFilter
      ? all.filter((p) => (p.categories?.nodes || []).some((c) => c.slug === categoryFilter))
      : all;

    const activeSlug = resolvedParams.v || filtered[0]?.slug;
    const active = filtered.find((p) => p.slug === activeSlug) || filtered[0];

    if (!active) {
      return (
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <EmptyState
            title="No Live videos yet"
            message="Tag posts in WordPress with your Live tag to have them appear here immediately."
          />
        </div>
      );
    }

    return (
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="space-y-4">
          <SectionHeader title="Live" kicker="Streaming-style feed" />

          <CategoryPills items={categories} active={categoryFilter} currentVideo={activeSlug} />

          {/* YouTube-like layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 lg:gap-8">
            <div className="min-w-0">
              <VideoPlayer post={active} />
            </div>

            <aside className="space-y-3">
              <div className="text-[12px] font-semibold tracking-[0.26em] uppercase text-black/45">
                Up next
              </div>

              <div className="space-y-2">
                {filtered
                  .filter((p) => p.slug !== active.slug)
                  .slice(0, 14)
                  .map((p) => (
                    <VideoCard
                      key={p.id}
                      post={p}
                      href={buildHref("/live", { v: p.slug, c: categoryFilter })}
                    />
                  ))}
              </div>
            </aside>
          </div>

          {/* Mobile: more like YouTube home feed */}
          <div className="lg:hidden pt-2">
            <div className="text-[12px] font-semibold tracking-[0.26em] uppercase text-black/45">
              More live videos
            </div>
            <div className="mt-2 space-y-2">
              {filtered
                .filter((p) => p.slug !== active.slug)
                .slice(0, 12)
                .map((p) => (
                  <VideoCard
                    key={p.id}
                    post={p}
                    href={buildHref("/live", { v: p.slug, c: categoryFilter })}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (err: any) {
    return (
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <EmptyState title="Unable to load Live" message="Check WPGraphQL connectivity." hint={String(err?.message || err)} />
      </div>
    );
  }
}
