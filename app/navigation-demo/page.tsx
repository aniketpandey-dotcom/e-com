"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NavigationDemoPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-3xl py-16 px-8 bg-white dark:bg-black">
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
          >
            ← Home
          </Link>
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50 mb-2">
          Navigation Demo
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8">
          Test programmatic navigation using <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm font-mono dark:bg-zinc-800">useRouter()</code> hooks.
        </p>

        <div className="flex flex-col gap-6">
          {/* router.push — navigates to a new route (adds to history) */}
          <section className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
            <h2 className="text-lg font-medium text-black dark:text-zinc-50 mb-2">
              router.push() — Navigate forward
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
              Adds a new entry to the browser history stack. User can press Back to return.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => router.push("/products")}
                className="rounded-full border border-zinc-200 px-5 py-2 text-sm font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
              >
                Push → /products
              </button>
              <button
                onClick={() => router.push("/products/1")}
                className="rounded-full border border-zinc-200 px-5 py-2 text-sm font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
              >
                Push → /products/1
              </button>
              <button
                onClick={() => router.push("/login")}
                className="rounded-full border border-zinc-200 px-5 py-2 text-sm font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
              >
                Push → /login
              </button>
            </div>
          </section>

          {/* router.replace — navigates without adding history entry */}
          <section className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
            <h2 className="text-lg font-medium text-black dark:text-zinc-50 mb-2">
              router.replace() — Replace current route
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
              Replaces the current history entry. User cannot press Back to return to the previous page.
            </p>
            <button
              onClick={() => router.replace("/products")}
              className="rounded-full border border-zinc-200 px-5 py-2 text-sm font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
              Replace → /products
            </button>
          </section>

          {/* router.back — go back in history */}
          <section className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
            <h2 className="text-lg font-medium text-black dark:text-zinc-50 mb-2">
              router.back() — Go back
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
              Equivalent to pressing the browser Back button.
            </p>
            <button
              onClick={() => router.back()}
              className="rounded-full border border-zinc-200 px-5 py-2 text-sm font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
              ← Go Back
            </button>
          </section>

          {/* router.refresh — re-fetch server components */}
          <section className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
            <h2 className="text-lg font-medium text-black dark:text-zinc-50 mb-2">
              router.refresh() — Refresh server data
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
              Re-fetches Server Component data without a full page reload. Useful after mutations.
            </p>
            <button
              onClick={() => router.refresh()}
              className="rounded-full border border-zinc-200 px-5 py-2 text-sm font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
              ↻ Refresh
            </button>
          </section>

          {/* router.prefetch — preload a route */}
          <section className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
            <h2 className="text-lg font-medium text-black dark:text-zinc-50 mb-2">
              router.prefetch() — Preload a route
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
              Preloads the route in the background for faster navigation. The Link component does this automatically on hover.
            </p>
            <button
              onClick={() => router.prefetch("/about")}
              className="rounded-full border border-zinc-200 px-5 py-2 text-sm font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
              Prefetch /about
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}
