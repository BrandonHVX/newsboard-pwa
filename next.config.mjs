/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,

  allowedDevOrigins: ['*.replit.dev', '*.repl.co', '*.janeway.replit.dev'],

  // Amplify Hosting Compute does not support Next.js Image Optimization.
  // Use unoptimized images (or move media to a CDN).
  images: { unoptimized: true },

  // Security & caching headers. Keep HTML/data uncached to ensure WordPress updates are reflected immediately.
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/icons/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/sw.js',
        headers: [{ key: 'Cache-Control', value: 'no-store' }],
      },
      {
        source: '/:path*',
        headers: [
          // Real-time SSR: prevent caching of HTML and data at the CDN.
          { key: 'Cache-Control', value: 'no-store' },

          // Baseline security headers
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
