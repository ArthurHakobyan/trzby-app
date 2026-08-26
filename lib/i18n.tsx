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
  services: string;
  tip: string;
  tips: string;
  servicesTotal: string;
  todaysEntries: string;
  noEntriesYet: string;
  total: string;
  monthTotal: string;
  entriesCount: (n: number) => string;
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
  menu: string;
  help: string;
  helpPage: {
    title: string;
    subtitle: string;
    backToApp: string;
    sections: { title: string; body: string }[];
    aiTitle: string;
    aiIntro: string;
    aiSteps: string[];
    aiPromptLabel: string;
    aiPrompt: string;
    aiCopy: string;
    aiCopied: string;
  };
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
    services: "Services",
    tip: "Tip",
    tips: "Tips",
    servicesTotal: "Services total",
    todaysEntries: "Today's entries",
    noEntriesYet: "No entries yet — add your first haircut above.",
    total: "Total",
    monthTotal: "Month total",
    entriesCount: (n: number) => `${n} entr${n === 1 ? "y" : "ies"}`,
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
    feedbackSub: "Tell us what's missing, confusing, or what you'd love to see next.",
    feedbackPlaceholder: "Type your feedback here…",
    feedbackSend: "Send feedback",
    feedbackSending: "Sending…",
    feedbackSuccess: "Thanks! Your feedback was sent.",
    feedbackError: "Couldn't send that — try again.",
    close: "Close",
    menu: "Menu",
    help: "Help",
    helpPage: {
      title: "How Tržby works",
      subtitle: "A quick guide to logging income, reading your history, and getting more out of your data.",
      backToApp: "Back to app",
      sections: [
        {
          title: "Logging a payment",
          body: "Punch in the amount on the keypad, then tap Cash or Card. That's it — the entry is saved instantly under today's date.",
        },
        {
          title: "Services vs. Tips",
          body: "Before you tap Cash or Card, choose Services or Tip at the top of the keypad. Services are payments for your work; tips are extra money on top. Tips are tracked separately and never count toward your entries total, so your numbers stay accurate.",
        },
        {
          title: "Today and History",
          body: "The Today tab shows everything logged so far today, split into Cash, Card, Services total, Tips, and a grand Total. The History tab shows the same breakdown for any month, plus a day-by-day list — tap a day to see its individual entries.",
        },
        {
          title: "Exporting your data",
          body: "In History, tap \"CSV (this month)\" to download every entry for that month as a spreadsheet file — date, time, whether it was a service or a tip, payment type, and amount. Open it in Excel, Google Sheets, or hand it to your accountant.",
        },
      ],
      aiTitle: "Analyze your CSV with AI",
      aiIntro: "Your monthly CSV export is plain, structured data — perfect for asking an AI assistant like Claude or ChatGPT to spot patterns you might not notice yourself: which days bring in the most, how tips trend over time, or where your cash vs. card habits shift.",
      aiSteps: [
        "Export the month you want to analyze from the History tab.",
        "Open Claude, ChatGPT, or any AI chat tool.",
        "Upload or paste the CSV file, along with the prompt below.",
        "Ask follow-up questions — the AI can keep digging into the same data.",
      ],
      aiPromptLabel: "Copy-paste prompt",
      aiPrompt: "Here is my income data exported from my income-tracking app as a CSV file. Each row is one payment: date, time, category (services or tip), payment type (cash or card), and amount in CZK. Please analyze this data and tell me: 1) my busiest and slowest days of the week, 2) how cash vs. card usage trends over the period, 3) how tip income compares to service income and whether it's growing, and 4) any patterns or suggestions that could help me increase my revenue going forward.",
      aiCopy: "Copy prompt",
      aiCopied: "Copied!",
    },
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
    services: "Tržby",
    tip: "Spropitné",
    tips: "Spropitné",
    servicesTotal: "Tržby celkem",
    todaysEntries: "Dnešní záznamy",
    noEntriesYet: "Zatím žádné záznamy — přidejte první stříhání výše.",
    total: "Celkem",
    monthTotal: "Součet za měsíc",
    entriesCount: (n: number) => `${n} záznamů`,
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
    feedbackSub: "Napište nám, co chybí, co je matoucí, nebo co byste chtěli příště.",
    feedbackPlaceholder: "Napište svou zpětnou vazbu…",
    feedbackSend: "Odeslat",
    feedbackSending: "Odesílání…",
    feedbackSuccess: "Díky! Vaše zpětná vazba byla odeslána.",
    feedbackError: "Nepodařilo se odeslat — zkuste to znovu.",
    close: "Zavřít",
    menu: "Menu",
    help: "Nápověda",
    helpPage: {
      title: "Jak Tržby fungují",
      subtitle: "Stručný průvodce zápisem příjmů, čtením historie a tím, jak z dat vytěžit víc.",
      backToApp: "Zpět do aplikace",
      sections: [
        {
          title: "Zápis platby",
          body: "Zadejte částku na klávesnici a klepněte na Hotovost nebo Kartu. Hotovo — záznam se uloží okamžitě pod dnešní datum.",
        },
        {
          title: "Tržby vs. spropitné",
          body: "Než klepnete na Hotovost nebo Kartu, vyberte nahoře Tržby nebo Spropitné. Tržby jsou platby za vaši práci, spropitné je částka navíc. Spropitné se sleduje odděleně a nikdy se nepočítá do počtu záznamů, takže vaše čísla zůstanou přesná.",
        },
        {
          title: "Dnes a Historie",
          body: "Záložka Dnes ukazuje vše zapsané dnes, rozdělené na Hotovost, Kartu, Tržby celkem, Spropitné a celkový Součet. Historie ukazuje totéž za libovolný měsíc, plus přehled po dnech — klepnutím na den zobrazíte jednotlivé záznamy.",
        },
        {
          title: "Export dat",
          body: "V Historii klepněte na „CSV (tento měsíc)“ a stáhnete všechny záznamy daného měsíce jako soubor tabulky — datum, čas, zda šlo o tržbu nebo spropitné, způsob platby a částku. Otevřete jej v Excelu, Google Sheets, nebo předejte účetní.",
        },
      ],
      aiTitle: "Analyzujte své CSV pomocí AI",
      aiIntro: "Měsíční export CSV jsou přehledná strukturovaná data — ideální pro AI asistenta jako Claude nebo ChatGPT, který v nich najde vzorce, kterých byste si sami nemuseli všimnout: které dny vydělávají nejvíc, jak se vyvíjí spropitné, nebo kde se mění poměr hotovosti a karty.",
      aiSteps: [
        "V záložce Historie exportujte měsíc, který chcete analyzovat.",
        "Otevřete Claude, ChatGPT nebo jiný AI chat.",
        "Nahrajte nebo vložte CSV soubor spolu s promptem níže.",
        "Ptejte se dál — AI může ve stejných datech pokračovat v analýze.",
      ],
      aiPromptLabel: "Prompt ke zkopírování",
      aiPrompt: "Toto jsou moje příjmová data exportovaná z aplikace na sledování tržeb jako CSV soubor. Každý řádek je jedna platba: datum, čas, kategorie (tržba nebo spropitné), způsob platby (hotovost nebo karta) a částka v Kč. Prosím analyzuj tato data a řekni mi: 1) které dny v týdnu jsou nejsilnější a které nejslabší, 2) jak se v čase vyvíjí poměr hotovosti a karty, 3) jak si stojí spropitné vůči tržbám a jestli roste, a 4) jaké vzorce nebo doporučení by mi mohly pomoct do budoucna zvýšit příjmy.",
      aiCopy: "Kopírovat prompt",
      aiCopied: "Zkopírováno!",
    },
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
