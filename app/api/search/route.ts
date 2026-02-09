import { NextRequest, NextResponse } from "next/server";
import { wpGraphQL } from "@/lib/wpgraphql";

const AUTOCOMPLETE_QUERY = /* GraphQL */ `
  query Autocomplete($q: String!, $first: Int!) {
    posts(first: $first, where: { search: $q, orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        slug
        title
        excerpt
      }
    }
    categories(first: $first, where: { search: $q, orderby: COUNT, order: DESC }) {
      nodes {
        name
        slug
        count
      }
    }
    tags(first: $first, where: { search: $q, orderby: COUNT, order: DESC }) {
      nodes {
        name
        slug
        count
      }
    }
  }
`;

type AutocompleteResult = {
  posts: { nodes: { id: string; slug: string; title: string; excerpt?: string | null }[] };
  categories: { nodes: { name: string; slug: string; count?: number | null }[] };
  tags: { nodes: { name: string; slug: string; count?: number | null }[] };
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() || "";

  if (q.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  try {
    const data = await wpGraphQL<AutocompleteResult>(AUTOCOMPLETE_QUERY, { q, first: 5 });

    const suggestions: { type: "post" | "category" | "tag"; label: string; slug: string; excerpt?: string }[] = [];

    for (const post of data.posts.nodes) {
      suggestions.push({
        type: "post",
        label: stripHtml(post.title),
        slug: post.slug,
        excerpt: post.excerpt ? stripHtml(post.excerpt).slice(0, 80) : undefined,
      });
    }

    for (const cat of data.categories.nodes) {
      suggestions.push({
        type: "category",
        label: cat.name,
        slug: cat.slug,
      });
    }

    for (const tag of data.tags.nodes) {
      suggestions.push({
        type: "tag",
        label: tag.name,
        slug: tag.slug,
      });
    }

    return NextResponse.json({ suggestions: suggestions.slice(0, 10) });
  } catch (err: any) {
    console.error("Autocomplete error:", err?.message || err);
    return NextResponse.json({ suggestions: [], error: err?.message }, { status: 500 });
  }
}
