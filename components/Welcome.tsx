"use client";

import { translations, useLanguage } from "@/contexts/LanguageContext";

export default function WelcomeMessage() {
  const { language } = useLanguage();

  return (
    <div className="rounded-lg border p-6">
      <p className="text-xl">{translations[language].welcome}</p>
    </div>
  );
}
