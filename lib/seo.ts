import { publicSiteUrl } from "@/lib/env";
import type { PostFull } from "@/lib/types";
import { stripHtml } from "@/lib/utils";

const PUBLICATION_NAME = "Heavy Status";

export function articleJsonLd(post: PostFull) {
  const site = publicSiteUrl();
  const url = `${site}/posts/${post.slug}`;
  const headline = stripHtml(post.title);
  const description = stripHtml(post.excerpt || "");
  const image = post.featuredImage?.node?.sourceUrl ? [post.featuredImage.node.sourceUrl] : undefined;

  const categories = post.categories?.nodes?.map((c) => c.name) || [];
  const tags = post.tags?.nodes?.map((t) => t.name) || [];
  const keywords = [...categories, ...tags].filter(Boolean);

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    headline,
    datePublished: post.date,
    dateModified: post.modified || post.date,
    description,
    isAccessibleForFree: true,
    author: post.author?.node?.name
      ? { "@type": "Person", name: post.author.node.name, url: `${site}` }
      : { "@type": "Organization", name: PUBLICATION_NAME },
    publisher: {
      "@type": "Organization",
      name: PUBLICATION_NAME,
      logo: { "@type": "ImageObject", url: `${site}/icons/icon-512.png`, width: 512, height: 512 },
    },
  };

  if (image) data.image = image;
  if (categories.length) data.articleSection = categories[0];
  if (keywords.length) data.keywords = keywords.join(", ");
  return data;
}
