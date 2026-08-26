"use client";
import { useState } from "react";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function HelpPage() {
  const { t } = useLang();
  const [copied, setCopied] = useState(false);

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(t.helpPage.aiPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — ignore, the prompt is still selectable/readable
    }
  }

  return (
    <div className="help-shell">
      <div className="help-topbar">
        <Link href="/" className="brand">
          Tržby<span className="dot">.</span>
        </Link>
        <div className="topbar-actions">
          <LanguageSwitcher />
          <Link href="/" className="signout">
            {t.helpPage.backToApp}
          </Link>
        </div>
      </div>

      <div className="help-title">{t.helpPage.title}</div>
      <div className="help-subtitle">{t.helpPage.subtitle}</div>

      {t.helpPage.sections.map((s) => (
        <div className="help-section" key={s.title}>
          <div className="help-section-title">{s.title}</div>
          <div className="help-section-body">{s.body}</div>
        </div>
      ))}

      <div className="help-section">
        <div className="help-section-title">{t.helpPage.aiTitle}</div>
        <div className="help-section-body">{t.helpPage.aiIntro}</div>
        <ol className="help-steps">
          {t.helpPage.aiSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <div className="help-prompt-card">
          <div className="help-prompt-label">{t.helpPage.aiPromptLabel}</div>
          <div className="help-prompt-text">{t.helpPage.aiPrompt}</div>
          <button className="help-copy-btn" onClick={copyPrompt}>
            {copied ? t.helpPage.aiCopied : t.helpPage.aiCopy}
          </button>
        </div>
      </div>
    </div>
  );
}
