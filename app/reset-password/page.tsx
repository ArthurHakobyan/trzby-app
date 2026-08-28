"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordPageInner />
    </Suspense>
  );
}

function ResetPasswordPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLang();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError(t.passwordsDontMatch);
      return;
    }

    setLoading(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    setLoading(false);

    if (res.ok) {
      router.push("/login?reset=1");
      router.refresh();
    } else {
      setError(res.status === 400 ? t.resetLinkInvalid : t.somethingWrong);
    }
  }

  if (!token) {
    return (
      <div className="auth-shell">
        <div className="auth-top">
          <LanguageSwitcher />
        </div>
        <div className="auth-card">
          <div className="auth-title">{t.resetPasswordTitle}</div>
          <div className="auth-error">{t.resetLinkInvalid}</div>
          <div className="auth-switch">
            <Link href="/forgot-password">{t.requestNewLink}</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-shell">
      <div className="auth-top">
        <LanguageSwitcher />
      </div>
      <div className="auth-card">
        <div className="auth-title">{t.resetPasswordTitle}</div>
        <div className="auth-sub">{t.resetPasswordSub}</div>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>{t.newPassword}</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="field">
            <label>{t.confirmNewPassword}</label>
            <input
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {error && <div className="auth-error">{error}</div>}
          <button className="auth-btn" disabled={loading} type="submit">
            {loading ? t.resetting : t.resetPasswordBtn}
          </button>
        </form>
        <div className="auth-switch">
          <Link href="/login">{t.backToLogin}</Link>
        </div>
      </div>
    </div>
  );
}
