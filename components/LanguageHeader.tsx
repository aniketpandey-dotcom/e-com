"use client";

import { translations, useLanguage } from "@/contexts/LanguageContext";

export default function LanguageHeader() {
  const { language } = useLanguage();

  return (
    <header className="rounded-lg bg-blue-500 p-4 text-white">
      <h1 className="text-3xl font-bold">{translations[language].greeting}</h1>
    </header>
  );
}
