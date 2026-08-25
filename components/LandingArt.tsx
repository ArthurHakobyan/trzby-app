export function HeroIllustration() {
  return (
    <svg viewBox="0 0 240 200" width="100%" height="100%" fill="none" aria-hidden="true">
      <path
        d="M50 20 H130 V150 L122 142 L114 150 L106 142 L98 150 L90 142 L82 150 L74 142 L66 150 L58 142 L50 150 Z"
        stroke="var(--gold)"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="var(--surface)"
      />
      <line x1="62" y1="45" x2="118" y2="45" stroke="var(--ink-dim)" strokeWidth="2" strokeLinecap="round" />
      <line x1="62" y1="62" x2="118" y2="62" stroke="var(--ink-dim)" strokeWidth="2" strokeLinecap="round" />
      <line x1="62" y1="79" x2="100" y2="79" stroke="var(--ink-dim)" strokeWidth="2" strokeLinecap="round" />

      <g transform="translate(140 84) rotate(-10)">
        <rect x="0" y="0" width="72" height="46" rx="7" stroke="var(--card)" strokeWidth="2" fill="var(--surface)" />
        <rect x="0" y="12" width="72" height="8" fill="var(--card)" opacity="0.55" />
        <circle cx="15" cy="33" r="5" stroke="var(--gold)" strokeWidth="2" fill="none" />
      </g>

      <circle cx="42" cy="168" r="15" stroke="var(--cash)" strokeWidth="2" fill="var(--surface)" />
      <circle cx="42" cy="168" r="8" stroke="var(--cash)" strokeWidth="1.4" opacity="0.6" />
    </svg>
  );
}

export function TapIcon() {
  return (
    <svg viewBox="0 0 32 32" width="20" height="20" fill="none" aria-hidden="true">
      <rect x="5" y="5" width="7" height="7" rx="1.5" stroke="var(--gold)" strokeWidth="1.8" />
      <rect x="14.5" y="5" width="7" height="7" rx="1.5" stroke="var(--gold)" strokeWidth="1.8" opacity="0.55" />
      <rect x="5" y="14.5" width="7" height="7" rx="1.5" stroke="var(--gold)" strokeWidth="1.8" opacity="0.55" />
      <rect x="14.5" y="14.5" width="7" height="7" rx="1.5" stroke="var(--gold)" strokeWidth="1.8" />
      <path d="M25 15.5 Q25 12 22 11" stroke="var(--gold)" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
      <path d="M27.5 17 Q27.5 11 22 9" stroke="var(--gold)" strokeWidth="1.6" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}

export function ChartIcon() {
  return (
    <svg viewBox="0 0 32 32" width="20" height="20" fill="none" aria-hidden="true">
      <line x1="4" y1="27" x2="28" y2="27" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="7" y="16" width="5" height="11" rx="1" stroke="var(--gold)" strokeWidth="1.8" />
      <rect x="14.5" y="9" width="5" height="18" rx="1" stroke="var(--gold)" strokeWidth="1.8" />
      <rect x="22" y="13" width="5" height="14" rx="1" stroke="var(--gold)" strokeWidth="1.8" />
    </svg>
  );
}

export function ExportIcon() {
  return (
    <svg viewBox="0 0 32 32" width="20" height="20" fill="none" aria-hidden="true">
      <path d="M16 4 V19" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M10 13 L16 19 L22 13" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 23 V26 A2 2 0 0 0 8 28 H24 A2 2 0 0 0 26 26 V23" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
