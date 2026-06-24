"use client";

import { translations, useLanguage } from "@/contexts/LanguageContext";

export default function LanguageFooter() {
  const { language } = useLanguage();

  return (
    <footer className="rounded-lg bg-gray-200 p-4">
      {translations[language].goodbye}
    </footer>
  );
}
