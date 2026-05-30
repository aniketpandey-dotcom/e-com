"use client"; // error.tsx MUST be a Client Component

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-col items-center gap-6 text-center px-8">
        <div className="text-5xl">⚠️</div>
        <h2 className="text-2xl font-semibold text-black dark:text-zinc-100">
          Something went wrong!
        </h2>
        <p className="max-w-md text-lg text-zinc-600 dark:text-zinc-400">
          An unexpected error occurred. Please try again.
        </p>
        {error.message && (
          <pre className="max-w-md rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-300 overflow-auto">
            {error.message}
          </pre>
        )}
        <button
          onClick={() => reset()}
          className="mt-4 flex h-12 items-center justify-center rounded-full bg-foreground px-8 text-background font-medium transition-colors hover:bg-zinc-700 dark:hover:bg-zinc-300"
        >
          Try Again
        </button>
      </main>
    </div>
  );
}
