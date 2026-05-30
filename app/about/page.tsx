export default function AboutPage() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-start gap-8 py-32 px-16 bg-white dark:bg-black">
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          About Us
        </h1>
        <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Welcome to <strong>ecommerce-app</strong> — a Next.js-powered online
          store built with TypeScript and Tailwind CSS.
        </p>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-medium text-black dark:text-zinc-100">
            Our Tech Stack
          </h2>
          <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-2">
            <li>
              <strong>Next.js 16</strong> — React framework with App Router, SSR
              &amp; SSG
            </li>
            <li>
              <strong>React 19</strong> — UI library with Server Components
            </li>
            <li>
              <strong>TypeScript</strong> — Type-safe JavaScript
            </li>
            <li>
              <strong>Tailwind CSS 4</strong> — Utility-first CSS framework
            </li>
          </ul>
        </section>

        <a
          href="/"
          className="inline-flex h-12 items-center justify-center rounded-full border border-black/[.08] px-5 text-base font-medium transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
        >
          ← Back to Home
        </a>
      </main>
    </div>
  );
}
