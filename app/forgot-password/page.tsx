"use client";
import { useState } from "react";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function ForgotPasswordPage() {
  const { t, lang } = useLang();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, lang }),
    });
    setStatus("sent");
  }

  return (
    <div className="auth-shell">
      <div className="auth-top">
        <LanguageSwitcher />
      </div>
      <div className="auth-card">
        <div className="auth-title">{t.forgotPasswordTitle}</div>
        <div className="auth-sub">{t.forgotPasswordSub}</div>
        {status === "sent" ? (
          <div className="info-banner success">{t.forgotPasswordSent}</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>{t.email}</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <button className="auth-btn" disabled={status === "sending"} type="submit">
              {status === "sending" ? t.sending : t.sendResetLink}
            </button>
          </form>
        )}
        <div className="auth-switch">
          <Link href="/login">{t.backToLogin}</Link>
        </div>
      </div>
    </div>
  );
}
