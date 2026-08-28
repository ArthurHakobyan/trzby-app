"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLang } from "@/lib/i18n";

export default function ChangeNameModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLang();
  const { data: session, update } = useSession();
  const router = useRouter();
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");

  useEffect(() => {
    if (open) setName(session?.user?.name || "");
  }, [open, session?.user?.name]);

  function close() {
    onClose();
    setStatus("idle");
  }

  async function submit() {
    setStatus("saving");
    const res = await fetch("/api/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (res.ok) {
      const data = await res.json();
      await update({ name: data.name });
      router.refresh();
      close();
    } else {
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
            <div className="modal-title">{t.changeNameTitle}</div>
            <div className="modal-sub">{t.changeNameSub}</div>
            <div className="field">
              <label>{t.name}</label>
              <input
                type="text"
                autoFocus
                maxLength={60}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
              />
            </div>
            {status === "error" && <div className="auth-error">{t.somethingWrong}</div>}
            <button className="auth-btn" disabled={status === "saving"} onClick={submit}>
              {status === "saving" ? t.saving : t.saveChanges}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
