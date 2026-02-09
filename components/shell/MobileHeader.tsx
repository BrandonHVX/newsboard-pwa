'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, Menu, Search, Share2 } from "lucide-react";

function isDetail(pathname: string) {
  return (
    pathname.startsWith("/posts/") ||
    pathname.startsWith("/p/") ||
    pathname.startsWith("/category/") ||
    pathname.startsWith("/tag/")
  );
}

export function MobileHeader() {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const detail = isDetail(pathname);

  return (
    <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-border-light pt-[env(safe-area-inset-top)]">
      <div className="h-14 px-4 flex items-center justify-between">
        <button
          aria-label={detail ? "Back" : "Menu"}
          onClick={() => (detail ? router.back() : undefined)}
          className="h-10 w-10 grid place-items-center rounded hover:bg-bg-secondary transition-colors"
        >
          {detail ? <ArrowLeft className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link href="/today" className="select-none">
          <span className="font-serif text-2xl font-medium">NewsBoard</span>
        </Link>

        <div className="flex items-center gap-1">
          {detail ? (
            <button
              aria-label="Share"
              onClick={async () => {
                try {
                  const url = window.location.href;
                  if (navigator.share) await navigator.share({ url });
                  else await navigator.clipboard.writeText(url);
                } catch {}
              }}
              className="h-10 w-10 grid place-items-center rounded hover:bg-bg-secondary transition-colors"
            >
              <Share2 className="h-5 w-5" />
            </button>
          ) : (
            <Link
              aria-label="Search"
              href="/search"
              className="h-10 w-10 grid place-items-center rounded hover:bg-bg-secondary transition-colors"
            >
              <Search className="h-5 w-5" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
