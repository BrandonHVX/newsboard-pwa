import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Inter, Playfair_Display } from "next/font/google";
import { PWAComponents } from "@/components/pwa/PWAComponents";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fontSerif = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

function siteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL;
  try {
    return new URL(raw || "https://heavy-status.com");
  } catch {
    return new URL("https://heavy-status.com");
  }
}

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: {
    default: "Heavy Status",
    template: "%s — Heavy Status",
  },
  description: "Heavy Status — a Forbes-inspired, mobile-first news blog.",
  applicationName: "Heavy Status",
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
  openGraph: {
    type: "website",
    title: "Heavy Status",
    description: "Heavy Status — a Forbes-inspired, mobile-first news blog.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Heavy Status",
    description: "Heavy Status — a Forbes-inspired, mobile-first news blog.",
  },
  icons: {
    icon: [
      { url: "/icons/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Heavy Status",
    startupImage: [
      {
        url: "/splash/apple-splash-1170x2532.png",
        media: "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)",
      },
      {
        url: "/splash/apple-splash-1284x2778.png",
        media: "(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3)",
      },
      {
        url: "/splash/apple-splash-1125x2436.png",
        media: "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)",
      },
    ],
  },
  other: {
    "application-name": "Heavy Status",
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fontSans.variable} ${fontSerif.variable}`}>
      <body className="font-sans">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:z-[100] focus:top-3 focus:left-3 focus:rounded-xl focus:bg-white focus:px-4 focus:py-2 focus:shadow-glass"
        >
          Skip to content
        </a>
        {children}
        <PWAComponents oneSignalAppId={process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID} />
      </body>
    </html>
  );
}
