export type Media = {
  sourceUrl: string;
  altText?: string | null;
  mediaDetails?: { width?: number | null; height?: number | null } | null;
};

export type Tax = { name: string; slug: string };

export type PostCard = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  date: string;
  author?: { node?: { name: string; slug: string } | null } | null;
  featuredImage?: { node?: Media | null } | null;
  categories?: { nodes: Tax[] } | null;
  tags?: { nodes: Tax[] } | null;
};

export type PostFull = PostCard & {
  content?: string | null;
  modified?: string | null;
  categories?: { nodes: Tax[] } | null;
  tags?: { nodes: Tax[] } | null;
};

export type CategoryNode = { name: string; slug: string; count?: number | null };
export type TagNode = { name: string; slug: string; count?: number | null };

export type MediaItem = {
  id: string;
  slug: string;
  title?: string | null;
  caption?: string | null;
  description?: string | null;
  mediaType?: string | null;
  mimeType?: string | null;
  sourceUrl: string;
  altText?: string | null;
  mediaDetails?: { width?: number | null; height?: number | null } | null;
};
