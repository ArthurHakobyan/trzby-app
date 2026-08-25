import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

const title = "Tržby — evidence tržeb";
const description = "Sledujte hotovost i platby kartou. Jednoduchá evidence příjmů zdarma.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.barbertrzby.cz"),
  title,
  description,
  manifest: "/manifest.json",
  openGraph: {
    title,
    description,
    locale: "cs_CZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export const viewport = {
  themeColor: "#182019",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Tržby" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
