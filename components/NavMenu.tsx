"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import FeedbackModal from "@/components/FeedbackModal";
import DeleteAccountModal from "@/components/DeleteAccountModal";
import ChangeNameModal from "@/components/ChangeNameModal";

export default function NavMenu() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [changeNameOpen, setChangeNameOpen] = useState(false);
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
          <button
            className="nav-dropdown-item"
            onClick={() => {
              setChangeNameOpen(true);
              setOpen(false);
            }}
          >
            {t.changeName}
          </button>
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
          <Link href="/privacy" className="nav-dropdown-item" onClick={() => setOpen(false)}>
            {t.privacyLink}
          </Link>
          <button
            className="nav-dropdown-item danger-text"
            onClick={() => {
              setDeleteOpen(true);
              setOpen(false);
            }}
          >
            {t.deleteAccount}
          </button>
        </div>
      )}

      <FeedbackModal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
      <DeleteAccountModal open={deleteOpen} onClose={() => setDeleteOpen(false)} />
      <ChangeNameModal open={changeNameOpen} onClose={() => setChangeNameOpen(false)} />
    </div>
  );
}
