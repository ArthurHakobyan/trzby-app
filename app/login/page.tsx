"use client";
import { Suspense, useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { HeroIllustration, TapIcon, ChartIcon, ExportIcon } from "@/components/LandingArt";

const featureIcons = [TapIcon, ChartIcon, ExportIcon];

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageInner />
    </Suspense>
  );
}

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLang();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDeleted, setShowDeleted] = useState(searchParams.get("deleted") === "1");

  useEffect(() => {
    if (!showDeleted) return;
    const timer = setTimeout(() => setShowDeleted(false), 15000);
    return () => clearTimeout(timer);
  }, [showDeleted]);

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
    <div className="landing-shell">
      <div className="landing-topbar">
        <div className="landing-brand">
          Tržby<span className="dot">.</span>
        </div>
        <LanguageSwitcher />
      </div>

      <div className="landing-grid">
        <div className="landing-info">
          <div className="landing-art">
            <HeroIllustration />
          </div>
          <div className="free-badge">{t.freeBadge}</div>
          <div className="landing-headline">{t.landingHeadline}</div>
          <div className="landing-sub">{t.landingSub}</div>
          <div className="feature-list">
            {t.features.map((f, i) => {
              const Icon = featureIcons[i];
              return (
                <div className="feature-row" key={f.title}>
                  <div className="feature-icon">
                    <Icon />
                  </div>
                  <div>
                    <div className="feature-title">{f.title}</div>
                    <div className="feature-desc">{f.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="landing-auth">
          <div className="auth-card">
            <div className="auth-title">{t.welcomeBack}</div>
            <div className="auth-sub">{t.loginSub}</div>
            {showDeleted && <div className="info-banner success">{t.accountDeleted}</div>}
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
      </div>
    </div>
  );
}
