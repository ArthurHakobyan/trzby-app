"use client";
import { useState } from "react";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function RegisterPage() {
  const { t, lang } = useLang();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, lang }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || t.somethingWrong);
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="auth-shell">
        <div className="auth-top">
          <LanguageSwitcher />
        </div>
        <div className="auth-card">
          <div className="auth-title">{t.createAccountTitle}</div>
          <div className="info-banner success">{t.verifyEmailSent}</div>
          <div className="auth-switch">
            <Link href="/login">{t.backToLogin}</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-top">
          <LanguageSwitcher />
        </div>
        <div className="auth-title">{t.createAccountTitle}</div>
        <div className="auth-sub">{t.registerSub}</div>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>{t.name}</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="field">
            <label>{t.email}</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="field">
            <label>{t.password}</label>
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <div className="auth-error">{error}</div>}
          <button className="auth-btn" disabled={loading} type="submit">
            {loading ? t.creating : t.createAccountBtn}
          </button>
        </form>
        <div className="auth-switch">
          {t.alreadyHaveAccount}<Link href="/login">{t.logIn}</Link>
        </div>
        <div className="auth-switch">
          <Link href="/privacy">{t.privacyLink}</Link>
        </div>
      </div>
    </div>
  );
}
