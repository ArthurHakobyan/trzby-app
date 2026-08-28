"use client";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function PrivacyPage() {
  const { t } = useLang();

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

      <div className="help-title">{t.privacyPage.title}</div>
      <div className="help-subtitle">{t.privacyPage.updated}</div>

      {t.privacyPage.sections.map((s) => (
        <div className="help-section" key={s.title}>
          <div className="help-section-title">{s.title}</div>
          <div className="help-section-body">{s.body}</div>
        </div>
      ))}
    </div>
  );
}
