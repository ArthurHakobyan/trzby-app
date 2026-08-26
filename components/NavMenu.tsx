"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import FeedbackModal from "@/components/FeedbackModal";

export default function NavMenu() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="nav-menu" ref={menuRef}>
      <button
        className="hamburger-btn"
        onClick={() => setOpen((o) => !o)}
        aria-label={t.menu}
        aria-expanded={open}
      >
        <span className={`hamburger-bars ${open ? "open" : ""}`}>
          <span />
          <span />
          <span />
        </span>
      </button>

      {open && (
        <div className="nav-dropdown">
          <Link href="/help" className="nav-dropdown-item" onClick={() => setOpen(false)}>
            {t.help}
          </Link>
          <button
            className="nav-dropdown-item"
            onClick={() => {
              setFeedbackOpen(true);
              setOpen(false);
            }}
          >
            {t.feedback}
          </button>
        </div>
      )}

      <FeedbackModal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </div>
  );
}
