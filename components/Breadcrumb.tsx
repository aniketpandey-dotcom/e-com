"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumb() {
  const pathname = usePathname();

  // Split the pathname into segments and filter out empty strings
  const segments = pathname.split("/").filter(Boolean);

  // Don't render breadcrumb on the home page
  if (segments.length === 0) return null;

  // Build cumulative paths for each breadcrumb link
  const breadcrumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const isLast = index === segments.length - 1;
    // Capitalize and clean up segment names (e.g., "about" → "About")
    const label = decodeURIComponent(segment)
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    return { href, label, isLast };
  });

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400"
    >
      <Link
        href="/"
        className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
      >
        Home
      </Link>
      {breadcrumbs.map(({ href, label, isLast }) => (
        <span key={href} className="flex items-center gap-2">
          <span className="text-zinc-300 dark:text-zinc-600">/</span>
          {isLast ? (
            <span className="text-zinc-900 dark:text-zinc-100 font-medium">
              {label}
            </span>
          ) : (
            <Link
              href={href}
              className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
            >
              {label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
