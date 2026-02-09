import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { wpGraphQL } from "@/lib/wpgraphql";
import { Q } from "@/lib/queries";
import type { MediaItem } from "@/lib/types";
import { stripHtml } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

async function getMedia(slug: string) {
  const data = await wpGraphQL<{ mediaItem: MediaItem | null }>(Q.MEDIA_BY_SLUG, { slug });
  return data.mediaItem;
}

function isImage(m: MediaItem) {
  return (m.mimeType || "").startsWith("image/");
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const m = await getMedia(slug);
  if (!m) return { title: "Media not found" };
  const title = stripHtml(m.title || "Media");
  return {
    title,
    openGraph: {
      title,
      images: m.sourceUrl ? [m.sourceUrl] : undefined,
    },
  };
}

export default async function MediaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = await getMedia(slug);
  if (!m) notFound();

  const title = stripHtml(m.title || "Media");
  const caption = stripHtml(m.caption || "");
  const desc = stripHtml(m.description || "");

  return (
    <article className="mx-auto max-w-3xl px-4 md:px-6">
      <header className="space-y-4">
        <h1 className="font-serif text-[34px] leading-[1.02] tracking-[-0.03em]">{title}</h1>
        {caption ? <p className="text-sm text-black/70">{caption}</p> : null}
      </header>

      <div className="mt-6 overflow-hidden rounded-3xl border hairline bg-slate-100 shadow-[0_18px_60px_rgba(0,0,0,0.10)]">
        {isImage(m) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={m.sourceUrl}
            alt={m.altText || title}
            className="w-full object-cover"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        ) : (
          <video controls playsInline className="w-full">
            <source src={m.sourceUrl} />
          </video>
        )}
      </div>

      {desc ? (
        <div className="prose prose-slate max-w-none mt-8 prose-headings:font-serif prose-a:underline prose-a:underline-offset-4">
          <p>{desc}</p>
        </div>
      ) : null}

      <div className="mt-10">
        <a href="/media" className="text-sm text-black/60 underline underline-offset-4">Back to Media</a>
      </div>
    </article>
  );
}
