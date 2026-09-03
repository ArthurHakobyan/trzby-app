"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailPageInner />
    </Suspense>
  );
}

function VerifyEmailPageInner() {
  const searchParams = useSearchParams();
  const { t } = useLang();
  const token = searchParams.get("token") || "";
  const [status, setStatus] = useState<"verifying" | "success" | "error">(token ? "verifying" : "error");

  useEffect(() => {
    if (!token) return;
    fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => setStatus(res.ok ? "success" : "error"))
      .catch(() => setStatus("error"));
  }, [token]);

  return (
    <div className="auth-shell">
      <div className="auth-top">
        <LanguageSwitcher />
      </div>
      <div className="auth-card">
        <div className="auth-title">{t.verifyEmailTitle}</div>
        {status === "verifying" && <div className="auth-sub">{t.verifying}</div>}
        {status === "success" && <div className="info-banner success">{t.verifiedSuccess}</div>}
        {status === "error" && <div className="auth-error">{t.verifyLinkInvalid}</div>}
        <div className="auth-switch">
          <Link href="/login">{t.backToLogin}</Link>
        </div>
      </div>
    </div>
  );
}
