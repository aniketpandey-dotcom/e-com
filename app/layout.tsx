import type { Metadata } from "next";
import { Inter, Geist_Mono, Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";

const geistSans = Geist({
  variable: "--font-geist-sans",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="z-10">
          <Header></Header>
        </header>
        <div className="mt-[60]">
          {" "}
          <Breadcrumb></Breadcrumb>
        </div>

        <main>{children}</main>
      </body>
    </html>
  );
}
