import { MobileHeader } from "@/components/shell/MobileHeader";
import { MobileBottomNav } from "@/components/shell/MobileBottomNav";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-white">
      <div className="hidden md:block border-b-[3px] border-double border-black bg-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="py-4 text-center border-b border-border-light">
            <a href="/today" className="font-serif text-4xl font-medium tracking-tight">
              NewsBoard
            </a>
          </div>
          
          <nav className="h-12 flex items-center justify-center gap-8 text-sm font-medium uppercase tracking-wider">
            <a className="hover:text-accent transition-colors" href="/today">Today</a>
            <a className="hover:text-accent transition-colors" href="/headlines">Headlines</a>
            <a className="hover:text-accent transition-colors" href="/live">Live</a>
            <a className="hover:text-accent transition-colors" href="/explore">Explore</a>
            <a className="hover:text-accent transition-colors" href="/media">Media</a>
            <a 
              className="px-4 py-1.5 bg-accent text-white rounded-sm hover:bg-accent-hover transition-colors" 
              href="/rss.xml"
            >
              RSS
            </a>
          </nav>
        </div>
      </div>

      <MobileHeader />
      <MobileBottomNav />

      <main
        id="content"
        className="pt-[calc(56px+env(safe-area-inset-top))] pb-[calc(56px+env(safe-area-inset-bottom))] md:pt-8 md:pb-16"
      >
        {children}
      </main>

      <footer className="border-t border-border-light bg-bg-secondary py-10">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="font-serif text-2xl mb-4">Heavy Status</p>
          <nav className="flex justify-center gap-6 text-sm text-muted mb-4">
            <a href="/about" className="hover:text-black transition-colors">About</a>
            <a href="/privacy-policy" className="hover:text-black transition-colors">Privacy Policy</a>
            <a href="/rss.xml" className="hover:text-black transition-colors">RSS</a>
          </nav>
          <p className="text-xs text-muted">&copy; {new Date().getFullYear()} Heavy Status. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
