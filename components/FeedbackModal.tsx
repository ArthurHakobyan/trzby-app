"use client";
import { useState } from "react";
import { useLang } from "@/lib/i18n";

export default function FeedbackModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLang();
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  function close() {
    onClose();
    setMessage("");
    setStatus("idle");
  }

  async function submit() {
    if (!message.trim()) return;
    setStatus("sending");
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    setStatus(res.ok ? "success" : "error");
  }

  return (
    <>
      {open && (
        <div className="modal-overlay" onClick={close}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={close} aria-label={t.close}>
              ✕
            </button>
            {status === "success" ? (
              <div className="feedback-success">{t.feedbackSuccess}</div>
            ) : (
              <>
                <div className="modal-title">{t.feedbackTitle}</div>
                <div className="modal-sub">{t.feedbackSub}</div>
                <textarea
                  className="modal-textarea"
                  placeholder={t.feedbackPlaceholder}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  maxLength={2000}
                />
                {status === "error" && <div className="auth-error">{t.feedbackError}</div>}
                <button
                  className="auth-btn"
                  disabled={!message.trim() || status === "sending"}
                  onClick={submit}
                >
                  {status === "sending" ? t.feedbackSending : t.feedbackSend}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
