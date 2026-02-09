'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, Newspaper, Radio, Compass } from "lucide-react";

const items = [
  { href: "/today", label: "Today", icon: Flame },
  { href: "/headlines", label: "Headlines", icon: Newspaper },
  { href: "/live", label: "Live", icon: Radio },
  { href: "/explore", label: "Explore", icon: Compass },
];

export function MobileBottomNav() {
  const pathname = usePathname() || "/";

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border-light pb-[env(safe-area-inset-bottom)]">
      <div className="h-14 px-2 flex items-stretch justify-around">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 mx-1 my-1 rounded transition-colors ${
                active 
                  ? "text-accent" 
                  : "text-secondary hover:text-accent"
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? "stroke-[2.5]" : ""}`} />
              <span className="text-2xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
