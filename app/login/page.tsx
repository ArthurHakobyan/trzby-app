"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLang();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError(t.wrongCredentials);
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-top">
          <LanguageSwitcher />
        </div>
        <div className="auth-title">{t.welcomeBack}</div>
        <div className="auth-sub">{t.loginSub}</div>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>{t.email}</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="field">
            <label>{t.password}</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <div className="auth-error">{error}</div>}
          <button className="auth-btn" disabled={loading} type="submit">
            {loading ? t.loggingIn : t.logIn}
          </button>
        </form>
        <div className="auth-switch">
          {t.noAccountYet}<Link href="/register">{t.createOne}</Link>
        </div>
      </div>
    </div>
  );
}
