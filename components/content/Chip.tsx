import Link from "next/link";

export function Chip({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="category-badge-outline"
    >
      {label}
    </Link>
  );
}
