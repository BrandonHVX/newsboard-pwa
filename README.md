# Next.js 15 iOS-styled PWA (Forbes-inspired) + WordPress (WPGraphQL) — Amplify-ready

## What this starter provides
- Next.js 15 **App Router**
- Real-time content updates via **SSR everywhere** (no SSG/ISR)
- WPGraphQL data layer (posts/pages/categories/tags)
- PWA: manifest + service worker (app shell caching only; HTML stays network-first)
- SEO: Open Graph/Twitter, canonical URLs, JSON-LD for NewsArticle, sitemap, Google News sitemap, robots, RSS
- Mobile-only fixed top header + bottom tab bar (Today, Headlines, Live, Explore)

## Requirements
- WordPress with the **WPGraphQL** plugin enabled.
- Amplify Hosting Compute (connect this repo).

## Environment variables (Amplify Console → App settings → Environment variables)
- `WPGRAPHQL_URL` = `https://heavy-status.com/graphql`
- `NEXT_PUBLIC_SITE_URL` = `https://YOUR_PUBLIC_DOMAIN` (your Amplify domain or a custom domain)

## Local development
```bash
npm install
cp .env.example .env.local
npm run dev
```

## Notes on “real-time”
This app disables caching for HTML/data (`Cache-Control: no-store` + `fetch(..., { cache: 'no-store' })`)
so WordPress changes appear on the next request without redeploys.

Amplify custom headers are provided in `customHttp.yml` (repo root) for security headers and PWA files.

## Google News / Yahoo News
Technical setup is included (NewsArticle schema + Google News sitemap), but inclusion requires submitting
your publication to the relevant publisher programs and meeting editorial policies.
