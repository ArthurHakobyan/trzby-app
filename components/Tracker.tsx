"use client";
import { useEffect, useMemo, useState, useCallback } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLang } from "@/lib/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import FeedbackModal from "@/components/FeedbackModal";

type Entry = {
  id: string;
  amount: number;
  type: "cash" | "card";
  date: string; // YYYY-MM-DD
  createdAt: string;
};

const pad2 = (n: number) => String(n).padStart(2, "0");
const dateKey = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const monthKey = (y: number, m: number) => `${y}-${pad2(m + 1)}`;
const fmt = (n: number) => n.toLocaleString("cs-CZ") + " Kč";

export default function Tracker({ userName }: { userName: string }) {
  const { t } = useLang();
  const weekday = t.weekday;
  const monthNames = t.monthNames;
  const router = useRouter();
  const [tab, setTab] = useState<"today" | "history">("today");
  const [amount, setAmount] = useState("");
  const [todayEntries, setTodayEntries] = useState<Entry[]>([]);
  const [monthEntries, setMonthEntries] = useState<Entry[]>([]);
  const [selMonth, setSelMonth] = useState(new Date().getMonth());
  const [selYear, setSelYear] = useState(new Date().getFullYear());
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const today = useMemo(() => dateKey(new Date()), []);

  const loadMonth = useCallback(async (y: number, m: number) => {
    const res = await fetch(`/api/entries?month=${monthKey(y, m)}`);
    if (res.ok) {
      const data: Entry[] = await res.json();
      setMonthEntries(data);
      if (monthKey(y, m) === monthKey(new Date().getFullYear(), new Date().getMonth())) {
        setTodayEntries(data.filter((e) => e.date === today));
      }
    }
  }, [today]);

  useEffect(() => {
    loadMonth(selYear, selMonth);
  }, [selYear, selMonth, loadMonth]);

  async function commit(type: "cash" | "card") {
    const amt = parseInt(amount || "0", 10);
    if (!amt) return;
    setLoading(true);
    const res = await fetch("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: amt, type, date: today }),
    });
    setLoading(false);
    if (res.ok) {
      setAmount("");
      loadMonth(selYear, selMonth);
    }
  }

  async function removeEntry(id: string) {
    await fetch(`/api/entries/${id}`, { method: "DELETE" });
    loadMonth(selYear, selMonth);
  }

  function pressKey(k: string) {
    if (k === "C") setAmount("");
    else if (k === "⌫") setAmount((a) => a.slice(0, -1));
    else setAmount((a) => (a.length < 6 ? a + k : a));
  }

  const cashToday = todayEntries.filter((e) => e.type === "cash").reduce((s, e) => s + e.amount, 0);
  const cardToday = todayEntries.filter((e) => e.type === "card").reduce((s, e) => s + e.amount, 0);

  const cashMonth = monthEntries.filter((e) => e.type === "cash").reduce((s, e) => s + e.amount, 0);
  const cardMonth = monthEntries.filter((e) => e.type === "card").reduce((s, e) => s + e.amount, 0);

  const byDay = useMemo(() => {
    const map: Record<string, { cash: number; card: number; list: Entry[] }> = {};
    monthEntries.forEach((e) => {
      if (!map[e.date]) map[e.date] = { cash: 0, card: 0, list: [] };
      map[e.date][e.type] += e.amount;
      map[e.date].list.push(e);
    });
    return map;
  }, [monthEntries]);

  const days = Object.keys(byDay).sort((a, b) => b.localeCompare(a));
  const maxTotal = Math.max(1, ...days.map((d) => byDay[d].cash + byDay[d].card));

  function exportCSV() {
    const rows = [["date", "time", "type", "amount_czk"]];
    monthEntries
      .slice()
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      .forEach((e) => {
        const dt = new Date(e.createdAt);
        rows.push([e.date, `${pad2(dt.getHours())}:${pad2(dt.getMinutes())}`, e.type, String(e.amount)]);
      });
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trzby-${monthKey(selYear, selMonth)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const now = new Date();

  return (
    <div className="app-shell">
      <div className="topbar">
        <div>
          <div className="brand">
            Tržby<span className="dot">.</span>
          </div>
          <div className="subdate">
            {weekday[now.getDay()]} {now.getDate()} {monthNames[now.getMonth()]} {now.getFullYear()}
            {userName ? ` · ${userName}` : ""}
          </div>
        </div>
        <div className="topbar-actions">
          <LanguageSwitcher />
          <FeedbackModal />
          <button
            className="signout"
            onClick={async () => {
              await signOut({ redirect: false });
              router.push("/login");
              router.refresh();
            }}
          >
            {t.logOut}
          </button>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab ${tab === "today" ? "active" : ""}`} onClick={() => setTab("today")}>
          {t.today}
        </button>
        <button className={`tab ${tab === "history" ? "active" : ""}`} onClick={() => setTab("history")}>
          {t.history}
        </button>
      </div>

      <div className={`view ${tab === "today" ? "active" : ""}`}>
        <div className="pad-card">
          <div className="amount-display">
            {amount === "" ? "0" : parseInt(amount, 10)}
            <span className="cur">Kč</span>
          </div>
          <div className="keypad">
            {["1","2","3","4","5","6","7","8","9","C","0","⌫"].map((k) => (
              <button key={k} className={`key ${k === "C" || k === "⌫" ? "func" : ""}`} onClick={() => pressKey(k)}>
                {k}
              </button>
            ))}
          </div>
          <div className="commit-row">
            <button className="commit-btn cash" disabled={!amount || loading} onClick={() => commit("cash")}>
              {t.cash}<small>{t.cashHint}</small>
            </button>
            <button className="commit-btn card" disabled={!amount || loading} onClick={() => commit("card")}>
              {t.card}<small>{t.cardHint}</small>
            </button>
          </div>
        </div>

        <div className="receipt">
          <div className="receipt-inner">
            <div className="receipt-title">
              <span>{t.todaysEntries}</span>
              <span>{todayEntries.length}</span>
            </div>
            {todayEntries.length === 0 ? (
              <div className="empty-note">{t.noEntriesYet}</div>
            ) : (
              todayEntries
                .slice()
                .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
                .map((e) => {
                  const dt = new Date(e.createdAt);
                  return (
                    <div className="entry-row" key={e.id}>
                      <div className="entry-left">
                        <span className={`tag ${e.type}`}>{e.type}</span>
                        <span className="entry-time">{pad2(dt.getHours())}:{pad2(dt.getMinutes())}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span className="entry-amt">{fmt(e.amount)}</span>
                        <button className="entry-del" onClick={() => removeEntry(e.id)}>✕</button>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
          <div className="zigzag" />
          <div className="totals">
            <div className="totals-row"><span className="lbl"><span className="swatch cash" />{t.cash}</span><span>{fmt(cashToday)}</span></div>
            <div className="totals-row"><span className="lbl"><span className="swatch card" />{t.card}</span><span>{fmt(cardToday)}</span></div>
            <div className="totals-row grand"><span>{t.total}</span><span>{fmt(cashToday + cardToday)}</span></div>
          </div>
        </div>
      </div>

      <div className={`view ${tab === "history" ? "active" : ""}`}>
        <div className="month-nav">
          <button
            className="nav-btn"
            onClick={() => {
              setExpandedDay(null);
              if (selMonth === 0) { setSelMonth(11); setSelYear((y) => y - 1); } else setSelMonth((m) => m - 1);
            }}
          >‹</button>
          <div className="month-label">{monthNames[selMonth]} {selYear}</div>
          <button
            className="nav-btn"
            onClick={() => {
              setExpandedDay(null);
              if (selMonth === 11) { setSelMonth(0); setSelYear((y) => y + 1); } else setSelMonth((m) => m + 1);
            }}
          >›</button>
        </div>

        <div className="receipt">
          <div className="receipt-inner">
            <div className="receipt-title"><span>{t.monthTotal}</span><span>{t.cuts(monthEntries.length)}</span></div>
          </div>
          <div className="totals" style={{ paddingTop: 0 }}>
            <div className="totals-row"><span className="lbl"><span className="swatch cash" />{t.cash}</span><span>{fmt(cashMonth)}</span></div>
            <div className="totals-row"><span className="lbl"><span className="swatch card" />{t.card}</span><span>{fmt(cardMonth)}</span></div>
            <div className="totals-row grand"><span>{t.total}</span><span>{fmt(cashMonth + cardMonth)}</span></div>
          </div>
        </div>

        <div className="list-card">
          <div className="section-label">{t.days}</div>
          {days.length === 0 ? (
            <div className="no-data">{t.noData}</div>
          ) : (
            days.map((d) => {
              const rec = byDay[d];
              const total = rec.cash + rec.card;
              const dt = new Date(d + "T00:00:00");
              return (
                <div className="day-row" key={d} onClick={() => setExpandedDay(expandedDay === d ? null : d)}>
                  <div className="day-date">{weekday[dt.getDay()]} {pad2(dt.getDate())}</div>
                  <div className="day-bars">
                    <div className="bar-cash" style={{ width: `${(rec.cash / maxTotal) * 100}%` }} />
                    <div className="bar-card" style={{ width: `${(rec.card / maxTotal) * 100}%` }} />
                  </div>
                  <div className="day-total">{fmt(total)}</div>
                </div>
              );
            })
          )}
        </div>

        

        {expandedDay && byDay[expandedDay] && (
  <div className="list-card">
    <div className="section-label">
      {(() => {
        const dt = new Date(expandedDay + "T00:00:00");
        return `${weekday[dt.getDay()]} ${dt.getDate()} ${monthNames[dt.getMonth()]}`;
      })()}
    </div>
    <div className="day-detail">
      {byDay[expandedDay].list
        .slice()
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
        .map((e) => {
          const dt = new Date(e.createdAt);
          return (
            <div className="entry-row" key={e.id}>
              <div className="entry-left">
                <span className={`tag ${e.type}`}>{e.type}</span>
                <span className="entry-time">{pad2(dt.getHours())}:{pad2(dt.getMinutes())}</span>
              </div>
              <span className="entry-amt">{fmt(e.amount)}</span>
            </div>
          );
        })}
    </div>
    <div className="totals" style={{ background: "transparent", padding: "10px 4px 4px" }}>
      <div className="totals-row" style={{ color: "var(--ink-dim)" }}><span className="lbl"><span className="swatch cash" />{t.cash}</span><span>{fmt(byDay[expandedDay].cash)}</span></div>
      <div className="totals-row" style={{ color: "var(--ink-dim)" }}><span className="lbl"><span className="swatch card" />{t.card}</span><span>{fmt(byDay[expandedDay].card)}</span></div>
      <div className="totals-row grand" style={{ borderTopColor: "var(--line)", color: "var(--ink)" }}><span>{t.dayTotal}</span><span>{fmt(byDay[expandedDay].cash + byDay[expandedDay].card)}</span></div>
    </div>
  </div>
)}



        <div className="list-card">
          <div className="section-label">{t.backup}</div>
          <div className="backup-row">
            <button className="backup-btn" onClick={exportCSV}>{t.csvExport}</button>
          </div>
          <div className="backup-note">
            {t.backupNote}
          </div>
        </div>
      </div>
    </div>
  );
}
