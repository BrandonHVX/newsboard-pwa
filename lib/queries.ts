export const Q = {
  LATEST_POSTS: /* GraphQL */ `
    query LatestPosts($first: Int!, $after: DateInput) {
      posts(first: $first, where: {orderby: {field: DATE, order: DESC}, dateQuery: {after: $after}}) {
        nodes {
          id
          slug
          title
          excerpt
          date
          author { node { name slug } }
          featuredImage {
            node {
              sourceUrl
              altText
              mediaDetails { width height }
            }
          }
          categories(first: 3) { nodes { name slug } }
          tags(first: 3) { nodes { name slug } }
        }
      }
    }
  `,
  HEADLINES: /* GraphQL */ `
    query Headlines($first: Int!) {
      posts(first: $first, where: {orderby: {field: DATE, order: DESC}}) {
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
    }
  `,
  POST_BY_SLUG: /* GraphQL */ `
    query PostBySlug($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        id
        slug
        title
        excerpt
        content
        date
        modified
        author { node { name slug } }
        featuredImage { node { sourceUrl altText mediaDetails { width height } } }
        categories(first: 10) { nodes { name slug } }
        tags(first: 10) { nodes { name slug } }
      }
    }
  `,
  PAGE_BY_SLUG: /* GraphQL */ `
    query PageBySlug($slug: ID!) {
      page(id: $slug, idType: URI) {
        id
        slug
        title
        excerpt
        content
        date
        modified
      }
    }
  `,
  CATEGORY_PAGE: /* GraphQL */ `
    query CategoryPage($slug: ID!, $first: Int!) {
      category(id: $slug, idType: SLUG) {
        name
        slug
        description
        posts(first: $first, where: {orderby: {field: DATE, order: DESC}}) {
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
      }
    }
  `,
  TAG_PAGE: /* GraphQL */ `
    query TagPage($slug: ID!, $first: Int!) {
      tag(id: $slug, idType: SLUG) {
        name
        slug
        description
        posts(first: $first, where: {orderby: {field: DATE, order: DESC}}) {
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
      }
    }
  `,
  CATEGORIES: /* GraphQL */ `
    query Categories($first: Int!) {
      categories(first: $first, where: {orderby: COUNT, order: DESC, hideEmpty: true}) {
        nodes { name slug count }
      }
    }
  `,
  TAGS: /* GraphQL */ `
    query Tags($first: Int!) {
      tags(first: $first, where: {orderby: COUNT, order: DESC, hideEmpty: true}) {
        nodes { name slug count }
      }
    }
  `,
  LIVE_BY_TAG: /* GraphQL */ `
    query LiveByTag($slug: ID!, $first: Int!) {
      tag(id: $slug, idType: SLUG) {
        name
        slug
        posts(first: $first, where: {orderby: {field: DATE, order: DESC}}) {
          nodes {
            id
            slug
            title
            excerpt
            content
            date
            author { node { name slug } }
            featuredImage { node { sourceUrl altText mediaDetails { width height } } }
            categories(first: 10) { nodes { name slug } }
            tags(first: 10) { nodes { name slug } }
          }
        }
      }
    }
  `,
  SITEMAP_BATCH: /* GraphQL */ `
    query SitemapBatch($first: Int!) {
      posts(first: $first, where: {orderby: {field: DATE, order: DESC}}) { nodes { slug modified } }
      pages(first: $first, where: {orderby: {field: DATE, order: DESC}}) { nodes { slug modified } }
      categories(first: $first, where: {orderby: COUNT, order: DESC, hideEmpty: true}) { nodes { slug } }
      tags(first: $first, where: {orderby: COUNT, order: DESC, hideEmpty: true}) { nodes { slug } }
      mediaItems(first: $first, where: {orderby: {field: DATE, order: DESC}}) { nodes { slug modified } }
    }
  `,
  NEWS_SITEMAP: /* GraphQL */ `
    query NewsSitemap($first: Int!, $after: DateInput) {
      posts(first: $first, where: {orderby: {field: DATE, order: DESC}, dateQuery: {after: $after}}) {
        nodes {
          slug
          title
          date
        }
      }
    }
  `,
  MEDIA_LATEST: /* GraphQL */ `
    query MediaLatest($first: Int!) {
      mediaItems(first: $first, where: {orderby: {field: DATE, order: DESC}}) {
        nodes {
          id
          slug
          title
          caption
          description
          mediaType
          mimeType
          sourceUrl
          altText
          mediaDetails { width height }
        }
      }
    }
  `,
  MEDIA_BY_SLUG: /* GraphQL */ `
    query MediaBySlug($slug: ID!) {
      mediaItem(id: $slug, idType: SLUG) {
        id
        slug
        title
        caption
        description
        mediaType
        mimeType
        sourceUrl
        altText
        mediaDetails { width height }
      }
    }
  `,
  AUTHORS: /* GraphQL */ `
    query Authors {
      users(first: 50, where: {orderby: {field: REGISTERED, order: ASC}}) {
        nodes {
          name
          slug
          description
          avatar { url }
        }
      }
    }
  `,
};
