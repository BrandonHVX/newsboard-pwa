import Link from "next/link";
import type { PostCard } from "@/lib/types";
import { formatDate, stripHtml } from "@/lib/utils";

function img(post: PostCard) {
  return post.featuredImage?.node?.sourceUrl || null;
}

function alt(post: PostCard) {
  return post.featuredImage?.node?.altText || stripHtml(post.title);
}

export function HeroCard({ post }: { post: PostCard }) {
  const src = img(post);
  const cat = post.categories?.nodes?.[0];

  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group relative block overflow-hidden rounded bg-black img-hover-scale"
      aria-label={stripHtml(post.title)}
    >
      <div className="relative aspect-[16/10]">
        {src ? (
          <img
            src={src}
            alt={alt(post)}
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-600" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-5">
          {cat ? (
            <span className="category-badge mb-3 inline-block">
              {cat.name}
            </span>
          ) : null}

          <h2 className="post-title text-2xl md:text-3xl text-white group-hover:text-accent transition-colors">
            {stripHtml(post.title)}
          </h2>

          <p className="mt-2 text-limit-2 text-sm text-white/80">
            {stripHtml(post.excerpt || "")}
          </p>

          <div className="entry-meta mt-3 flex items-center gap-2 text-white/70">
            <span>{formatDate(post.date)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function ArticleCard({ post, variant = "square" }: { post: PostCard; variant?: "square" | "tall" | "wide" }) {
  const src = img(post);
  const cat = post.categories?.nodes?.[0];

  const aspect =
    variant === "tall" ? "aspect-[4/5]" : variant === "wide" ? "aspect-[16/9]" : "aspect-[1/1]";

  return (
    <article className="group overflow-hidden rounded bg-white border border-border-light shadow-card hover:shadow-dropdown transition-shadow">
      <Link
        href={`/posts/${post.slug}`}
        className="block img-hover-scale"
        aria-label={stripHtml(post.title)}
      >
        <div className={`relative ${aspect} overflow-hidden`}>
          {src ? (
            <img
              src={src}
              alt={alt(post)}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />
          )}
          {cat ? (
            <div className="absolute left-3 bottom-3">
              <span className="category-badge">{cat.name}</span>
            </div>
          ) : null}
        </div>
      </Link>

      <div className="p-4">
        <div className="entry-meta mb-2 flex items-center gap-2">
          <span className="text-muted">{formatDate(post.date)}</span>
        </div>

        <h3 className="post-title text-lg text-limit-2">
          <Link href={`/posts/${post.slug}`} className="hover:text-accent transition-colors">
            {stripHtml(post.title)}
          </Link>
        </h3>

        <p className="mt-2 text-limit-2 text-sm text-secondary">
          {stripHtml(post.excerpt || "")}
        </p>
      </div>
    </article>
  );
}

export function ArticleRow({ post }: { post: PostCard }) {
  const src = img(post);
  const cat = post.categories?.nodes?.[0];

  return (
    <article className="group flex gap-4 py-4 border-b border-border-light last:border-0">
      <Link
        href={`/posts/${post.slug}`}
        className="flex-shrink-0 img-hover-scale rounded overflow-hidden"
        aria-label={stripHtml(post.title)}
      >
        <div className="relative w-[100px] h-[100px] md:w-[120px] md:h-[120px]">
          {src ? (
            <img
              src={src}
              alt={alt(post)}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />
          )}
        </div>
      </Link>

      <div className="flex-1 min-w-0">
        {cat ? (
          <Link
            href={`/category/${cat.slug}`}
            className="text-2xs font-semibold uppercase tracking-wider text-accent hover:text-accent-hover transition-colors"
          >
            {cat.name}
          </Link>
        ) : null}

        <h3 className="post-title text-base md:text-lg text-limit-2 mt-1">
          <Link href={`/posts/${post.slug}`} className="hover:text-accent transition-colors">
            {stripHtml(post.title)}
          </Link>
        </h3>

        <p className="mt-1 text-limit-2 text-sm text-secondary hidden md:block">
          {stripHtml(post.excerpt || "")}
        </p>

        <div className="entry-meta mt-2 flex items-center gap-2">
          <span className="text-muted">{formatDate(post.date)}</span>
        </div>
      </div>
    </article>
  );
}
