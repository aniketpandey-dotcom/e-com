import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-col items-center gap-6 text-center px-8">
        <h1 className="text-6xl font-bold text-black dark:text-zinc-50">404</h1>
        <h2 className="text-2xl font-semibold text-black dark:text-zinc-100">
          Page Not Found
        </h2>
        <p className="max-w-md text-lg text-zinc-600 dark:text-zinc-400">
          Sorry, the page you&apos;re looking for doesn&apos;t exist or has been
          moved.
        </p>
        <Link
          href="/"
          className="mt-4 flex h-12 items-center justify-center rounded-full bg-foreground px-8 text-background font-medium transition-colors hover:bg-zinc-700 dark:hover:bg-zinc-300"
        >
          Go Back Home
        </Link>
      </main>
    </div>
  );
}
