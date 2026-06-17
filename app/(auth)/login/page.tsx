"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    // Replace this with real auth call
    setTimeout(() => {
      setIsLoading(false);
      router.push("/products");
    }, 900);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md border border-zinc-100 rounded-2xl shadow-lg p-8">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-600 to-pink-500 flex items-center justify-center text-white font-semibold text-lg">
            S
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-zinc-900">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-zinc-600">
            Sign in to continue to the store
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-sm text-red-600">{error}</div>}

          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              className="w-full px-4 py-3 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              required
              className="w-full px-4 py-3 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-zinc-600">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-zinc-300"
              />
              Remember me
            </label>
            <Link href="#" className="text-indigo-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 disabled:opacity-60 transition-colors"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-zinc-500">
                or continue with
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 py-2 text-sm hover:bg-zinc-50"
              aria-label="Continue with Google"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M21.6 12.23c0-.72-.06-1.41-.18-2.08H12v3.94h5.6c-.24 1.3-.96 2.4-2.04 3.12v2.6h3.3c1.92-1.76 3.04-4.4 3.04-7.58z"
                  fill="#4285F4"
                />
                <path
                  d="M12 22c2.7 0 4.97-.9 6.63-2.44l-3.3-2.6c-.92.62-2.1.98-3.33.98-2.56 0-4.73-1.72-5.5-4.04H2.98v2.53C4.67 19.9 8.07 22 12 22z"
                  fill="#34A853"
                />
                <path
                  d="M6.5 13.9c-.2-.6-.32-1.24-.32-1.9s.12-1.3.32-1.9V7.47H2.98A9.999 9.999 0 0 0 2 12c0 1.6.36 3.12.98 4.53l3.52-2.63z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 6.5c1.47 0 2.8.5 3.85 1.48l2.88-2.88C16.95 3.6 14.7 2.5 12 2.5 8.07 2.5 4.67 4.6 2.98 7.47l3.52 2.63C7.27 8.22 9.44 6.5 12 6.5z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </button>

            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 py-2 text-sm hover:bg-zinc-50"
              aria-label="Continue with GitHub"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
                <path d="M12 .5a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58 0-.28-.01-1.02-.02-2-3.34.73-4.04-1.61-4.04-1.61-.55-1.4-1.34-1.77-1.34-1.77-1.1-.75.08-.74.08-.74 1.22.09 1.86 1.25 1.86 1.25 1.08 1.85 2.83 1.32 3.52 1.01.11-.78.42-1.32.76-1.62-2.67-.3-5.47-1.34-5.47-5.96 0-1.32.47-2.4 1.24-3.25-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.24a11.5 11.5 0 0 1 6 0c2.29-1.56 3.3-1.24 3.3-1.24.66 1.65.24 2.87.12 3.17.77.85 1.24 1.93 1.24 3.25 0 4.63-2.8 5.66-5.47 5.96.43.37.82 1.1.82 2.22 0 1.6-.02 2.89-.02 3.28 0 .32.22.7.83.58A12 12 0 0 0 12 .5z" />
              </svg>
              GitHub
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-zinc-600">
          Don’t have an account?{" "}
          <Link href="/register" className="text-indigo-600 hover:underline">
            Create account
          </Link>
        </p>

        <p className="mt-4 text-center text-xs text-zinc-400">
          By continuing, you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
