import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import Breadcrumb from "@/components/Breadcrumb";
import CartIndicator from "@/components/CartIndicator";
import { CartProvider } from "@/contexts/CartContext";

// next/font/google — downloads fonts at build time and self-hosts them.
// Benefits: no external requests, no layout shift (FOUT), privacy-friendly.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap", // Show fallback font immediately, swap when Inter loads
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// Static metadata — applies to ALL pages unless overridden by nested pages.
// This is the Metadata API — type-safe, composable, and SEO-friendly.
export const metadata: Metadata = {
  // Title template: %s is replaced by child page titles
  title: {
    default: "Ecommerce App — Next.js Store",
    template: "%s | Ecommerce App",
  },
  description:
    "A modern e-commerce store built with Next.js, React Server Components, TypeScript, and Tailwind CSS. Learn App Router, data fetching, and SEO best practices.",
  keywords: ["ecommerce", "next.js", "react", "typescript", "tailwind css"],
  authors: [{ name: "React Training" }],
  creator: "React Training",

  // Open Graph metadata — used by Facebook, LinkedIn, Discord, etc.
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Ecommerce App",
    title: "Ecommerce App — Next.js Store",
    description:
      "A modern e-commerce store built with Next.js and React Server Components.",
    url: "https://ecommerce-app.example.com",
  },

  // Twitter Card metadata — used by Twitter/X
  twitter: {
    card: "summary_large_image",
    title: "Ecommerce App — Next.js Store",
    description:
      "A modern e-commerce store built with Next.js and React Server Components.",
    creator: "@reacttraining",
  },

  // Favicon and app icons
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },

  // Web manifest for PWA support
  manifest: "/manifest.json",

  // Robots metadata
  robots: {
    index: true,
    follow: true,
  },
};

// RootLayout is a Server Component, but it wraps children in CartProvider (Client Component).
// This is the "server wraps client" composition pattern.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <CartProvider>
          <header className="w-full border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
            <div className="max-w-5xl mx-auto px-8 py-3 flex items-center justify-between">
              <Breadcrumb />
              <CartIndicator />
            </div>
          </header>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
