"use client";
import { useLang } from "@/lib/i18n";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang();

  return (
    <div className="lang-switch" role="group" aria-label="Language">
      <button
        className={`lang-opt ${lang === "en" ? "active" : ""}`}
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
      >
        EN
      </button>
      <button
        className={`lang-opt ${lang === "cs" ? "active" : ""}`}
        onClick={() => setLang("cs")}
        aria-pressed={lang === "cs"}
      >
        CZ
      </button>
    </div>
  );
}
