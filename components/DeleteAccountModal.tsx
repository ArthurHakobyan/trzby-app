"use client";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLang } from "@/lib/i18n";

export default function DeleteAccountModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLang();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState("");

  function close() {
    onClose();
    setPassword("");
    setStatus("idle");
    setError("");
  }

  async function submit() {
    if (!password) return;
    setStatus("sending");
    setError("");
    const res = await fetch("/api/account", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      await signOut({ redirect: false });
      router.push("/login?deleted=1");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error === "Wrong password." ? t.wrongPassword : t.somethingWrong);
      setStatus("error");
    }
  }

  return (
    <>
      {open && (
        <div className="modal-overlay" onClick={close}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={close} aria-label={t.close}>
              ✕
            </button>
            <div className="modal-title">{t.deleteAccountTitle}</div>
            <div className="modal-sub">{t.deleteAccountWarning}</div>
            <div className="field">
              <label>{t.confirmPassword}</label>
              <input
                type="password"
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
              />
            </div>
            {status === "error" && <div className="auth-error">{error}</div>}
            <button
              className="auth-btn danger"
              disabled={!password || status === "sending"}
              onClick={submit}
            >
              {status === "sending" ? t.deleting : t.deleteAccountBtn}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
