"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Language = "en" | "es" | "fr";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const translations = {
  en: {
    greeting: "Hello",
    welcome: "Welcome to our application",
    goodbye: "Goodbye",
  },

  es: {
    greeting: "Hola",
    welcome: "Bienvenido a nuestra aplicación",
    goodbye: "Adiós",
  },

  fr: {
    greeting: "Bonjour",
    welcome: "Bienvenue dans notre application",
    goodbye: "Au revoir",
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("language");

      if (stored === "en" || stored === "es" || stored === "fr") {
        return stored;
      }
    }

    return "en";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}
