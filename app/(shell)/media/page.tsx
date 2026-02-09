import { wpGraphQL } from "@/lib/wpgraphql";
import { Q } from "@/lib/queries";
import type { MediaItem } from "@/lib/types";
import { SectionHeader } from "@/components/content/SectionHeader";
import { EmptyState } from "@/components/content/EmptyState";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

function isImage(m: MediaItem) {
  return (m.mimeType || "").startsWith("image/");
}

export default async function MediaIndex() {
  try {
    const data = await wpGraphQL<{ mediaItems: { nodes: MediaItem[] } }>(Q.MEDIA_LATEST, { first: 30 });
    const items = data.mediaItems.nodes || [];

    return (
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="space-y-6">
          <SectionHeader title="Media" kicker="From WordPress" />

          {items.length ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map((m) => (
                <a
                  key={m.id}
                  href={`/media/${m.slug}`}
                  className="group overflow-hidden rounded-3xl border hairline bg-white shadow-[0_18px_60px_rgba(0,0,0,0.08)]"
                >
                  <div className="aspect-[1/1] bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={m.sourceUrl}
                      alt={m.altText || m.title || "Media"}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="p-3">
                    <div className="line-clamp-2 font-semibold text-[13px] text-black/85">
                      {m.title || (isImage(m) ? "Image" : "Media")}
                    </div>
                    <div className="mt-1 text-[11px] tracking-[0.22em] uppercase text-black/40">
                      {m.mimeType || m.mediaType || "media"}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No media yet"
              message="Upload images or videos in WordPress to see them here."
            />
          )}
        </div>
      </div>
    );
  } catch (err: any) {
    return (
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <EmptyState
          title="Unable to load media"
          message="Check WPGraphQL connectivity."
          hint={String(err?.message || err)}
        />
      </div>
    );
  }
}
