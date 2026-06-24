"use client";

import LanguageHeader from "@/components/LanguageHeader";
import Welcome from "@/components/Welcome";
import LanguageFooter from "@/components/LanguageFooter";

import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";

function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value as "en" | "es" | "fr")}
      className="rounded border p-2"
    >
      <option value="en">English</option>
      <option value="es">Spanish</option>
      <option value="fr">French</option>
    </select>
  );
}

function Content() {
  return (
    <div className="space-y-6">
      <LanguageSelector />

      <LanguageHeader />

      <Welcome />
      <LanguageFooter />
    </div>
  );
}

export default function LanguagePage() {
  return (
    <LanguageProvider>
      <div className="mx-auto max-w-4xl p-8">
        <h1 className="mb-8 text-4xl font-bold">Language Switcher</h1>

        <Content />
      </div>
    </LanguageProvider>
  );
}
