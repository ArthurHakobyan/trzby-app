"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";

export type Lang = "en" | "cs";

const STORAGE_KEY = "trzby-lang";

type Translations = {
  weekday: string[];
  monthNames: string[];
  freeBadge: string;
  landingHeadline: string;
  landingSub: string;
  features: { title: string; desc: string }[];
  logOut: string;
  today: string;
  history: string;
  cash: string;
  cashHint: string;
  card: string;
  cardHint: string;
  todaysEntries: string;
  noEntriesYet: string;
  total: string;
  monthTotal: string;
  cuts: (n: number) => string;
  days: string;
  noData: string;
  dayTotal: string;
  backup: string;
  csvExport: string;
  backupNote: string;
  welcomeBack: string;
  loginSub: string;
  email: string;
  password: string;
  wrongCredentials: string;
  loggingIn: string;
  logIn: string;
  noAccountYet: string;
  createOne: string;
  createAccountTitle: string;
  registerSub: string;
  name: string;
  creating: string;
  createAccountBtn: string;
  somethingWrong: string;
  accountCreatedPleaseLogin: string;
  alreadyHaveAccount: string;
  feedback: string;
  feedbackTitle: string;
  feedbackSub: string;
  feedbackPlaceholder: string;
  feedbackSend: string;
  feedbackSending: string;
  feedbackSuccess: string;
  feedbackError: string;
  close: string;
};

const dict: Record<Lang, Translations> = {
  en: {
    weekday: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    monthNames: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ],
    freeBadge: "100% free, no catch",
    landingHeadline: "Know your daily take, at a glance.",
    landingSub: "Tržby is a dead-simple income ledger for cash-and-card businesses — log every payment in two taps, and see exactly how your day, week, and month add up.",
    features: [
      { title: "Two-tap logging", desc: "Punch in the amount, tap Cash or Card — done. No forms, no menus." },
      { title: "Day & month totals", desc: "See cash vs. card broken down by day, with running monthly totals." },
      { title: "Your data, exportable", desc: "Everything's saved to your account. Export CSV anytime for your books." },
    ],
    logOut: "Log out",
    today: "Today",
    history: "History",
    cash: "Cash",
    cashHint: "hotovost",
    card: "Card",
    cardHint: "karta",
    todaysEntries: "Today's entries",
    noEntriesYet: "No entries yet — add your first haircut above.",
    total: "Total",
    monthTotal: "Month total",
    cuts: (n: number) => `${n} cuts`,
    days: "Days",
    noData: "No income logged this month.",
    dayTotal: "Day total",
    backup: "Backup",
    csvExport: "⤓ CSV (this month)",
    backupNote: "Your data lives in the database, tied to your account — no manual backup needed to avoid losing it. Export CSV anytime for your own records.",
    welcomeBack: "Welcome back",
    loginSub: "Log in to your Tržby account.",
    email: "Email",
    password: "Password",
    wrongCredentials: "Wrong email or password.",
    loggingIn: "Logging in…",
    logIn: "Log in",
    noAccountYet: "No account yet? ",
    createOne: "Create one",
    createAccountTitle: "Create your account",
    registerSub: "Start tracking your own cash and card income.",
    name: "Name",
    creating: "Creating…",
    createAccountBtn: "Create account",
    somethingWrong: "Something went wrong.",
    accountCreatedPleaseLogin: "Account created — please log in.",
    alreadyHaveAccount: "Already have an account? ",
    feedback: "Feedback",
    feedbackTitle: "Got a suggestion?",
    feedbackSub: "Tell me what's missing, confusing, or what you'd love to see next.",
    feedbackPlaceholder: "Type your feedback here…",
    feedbackSend: "Send feedback",
    feedbackSending: "Sending…",
    feedbackSuccess: "Thanks! Your feedback was sent.",
    feedbackError: "Couldn't send that — try again.",
    close: "Close",
  },
  cs: {
    weekday: ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"],
    monthNames: [
      "Leden", "Únor", "Březen", "Duben", "Květen", "Červen",
      "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec",
    ],
    freeBadge: "100% zdarma, bez háčku",
    landingHeadline: "Vaše tržby na první pohled.",
    landingSub: "Tržby je jednoduchá evidence příjmů pro živnostníky, kteří přijímají hotovost i kartu — každou platbu zapíšete na dva klepnutí a hned vidíte, jak si stojí váš den, týden i měsíc.",
    features: [
      { title: "Zápis na dva klepnutí", desc: "Zadejte částku, klepněte na Hotovost nebo Kartu — hotovo. Žádné formuláře, žádná menu." },
      { title: "Denní i měsíční součty", desc: "Přehled hotovosti a karty po dnech, s průběžným součtem za měsíc." },
      { title: "Vaše data, exportovatelná", desc: "Vše se ukládá k vašemu účtu. CSV export si stáhnete kdykoli pro účetnictví." },
    ],
    logOut: "Odhlásit",
    today: "Dnes",
    history: "Historie",
    cash: "Hotovost",
    cashHint: "cash",
    card: "Karta",
    cardHint: "card",
    todaysEntries: "Dnešní záznamy",
    noEntriesYet: "Zatím žádné záznamy — přidejte první stříhání výše.",
    total: "Celkem",
    monthTotal: "Součet za měsíc",
    cuts: (n: number) => `${n} stříhání`,
    days: "Dny",
    noData: "Tento měsíc nejsou žádné záznamy.",
    dayTotal: "Denní součet",
    backup: "Zálohování",
    csvExport: "⤓ CSV (tento měsíc)",
    backupNote: "Vaše data jsou uložena v databázi a jsou svázaná s vaším účtem — ruční záloha není potřeba. Export CSV si můžete stáhnout kdykoli pro vlastní evidenci.",
    welcomeBack: "Vítejte zpět",
    loginSub: "Přihlaste se ke svému účtu Tržby.",
    email: "E-mail",
    password: "Heslo",
    wrongCredentials: "Špatný e-mail nebo heslo.",
    loggingIn: "Přihlašování…",
    logIn: "Přihlásit se",
    noAccountYet: "Ještě nemáte účet? ",
    createOne: "Vytvořit",
    createAccountTitle: "Vytvořte si účet",
    registerSub: "Začněte sledovat své příjmy v hotovosti a kartou.",
    name: "Jméno",
    creating: "Vytváření…",
    createAccountBtn: "Vytvořit účet",
    somethingWrong: "Něco se pokazilo.",
    accountCreatedPleaseLogin: "Účet vytvořen — přihlaste se prosím.",
    alreadyHaveAccount: "Už máte účet? ",
    feedback: "Zpětná vazba",
    feedbackTitle: "Máte nápad na vylepšení?",
    feedbackSub: "Napište mi, co chybí, co je matoucí, nebo co byste chtěli příště.",
    feedbackPlaceholder: "Napište svou zpětnou vazbu…",
    feedbackSend: "Odeslat",
    feedbackSending: "Odesílání…",
    feedbackSuccess: "Díky! Vaše zpětná vazba byla odeslána.",
    feedbackError: "Nepodařilo se odeslat — zkuste to znovu.",
    close: "Zavřít",
  },
};

type LangContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
};

const LangContext = createContext<LangContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("cs");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "cs") setLangState(stored);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    window.localStorage.setItem(STORAGE_KEY, l);
    document.documentElement.lang = l;
  }, []);

  return (
    <LangContext.Provider value={{ lang, setLang, t: dict[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within a LanguageProvider");
  return ctx;
}
