import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { SITE } from "@/lib/site";

// The fonts live in app/fonts (Google's own Latin files, OFL; see app/fonts/README.md), so a build never
// depends on Google's font server. On 15 Oct a Vercel build failed when that server did not deliver Archivo.
// next/font/local names each family after its variable, hence these names. The Arial fallbacks (for
// characters the fonts lack, like →) use Google's exact scaling, declared in globals.css, so nothing moves.
// One variable file serves every weight. It is declared at exactly the four weights Google's own CSS declared
// (400, 600, 800, 900), not as a 400 to 900 range: <b> asks for 700, and with these four the browser rounds
// it to 800, as it always has. A range would draw a true, thinner 700. (Font loader values must be literals.)
const Archivo = localFont({
  src: [
    { path: "./fonts/archivo-latin.woff2", weight: "400", style: "normal" },
    { path: "./fonts/archivo-latin.woff2", weight: "600", style: "normal" },
    { path: "./fonts/archivo-latin.woff2", weight: "800", style: "normal" },
    { path: "./fonts/archivo-latin.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
  adjustFontFallback: false,
  fallback: ["Archivo Fallback"],
});

const IBMPlexMono = localFont({
  src: [
    { path: "./fonts/plex-mono-400-latin.woff2", weight: "400", style: "normal" },
    { path: "./fonts/plex-mono-500-latin.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-mono",
  display: "swap",
  adjustFontFallback: false,
  fallback: ["IBM Plex Mono Fallback"],
});

const TITLE = "Manveen Singh | automation engineer";
// The hero's own two sentences (version A, approved 15 Oct).
const DESCRIPTION = "Every week has a job that's the same clicks, in the same order. I make it run by itself, the same way every time.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["automation engineer", "workflow automation", "data entry automation", "Python", "Manveen Singh"],
  authors: [{ name: "Manveen Singh" }],
  metadataBase: new URL(SITE),
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    locale: "en_US",
    url: "https://manveen.me",
    siteName: "Manveen Singh",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  icons: { icon: "/favicon.svg", apple: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Lets CSS hide pen marks until they scroll into view. Without JS they stay drawn. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('pen-js')" }} />
        {/* For AI agents (llmstxt.org): the file that describes this site. Each page links its own markdown copy. */}
        <link rel="describedby" href="/llms.txt" type="text/plain" />
      </head>
      <body className={`${Archivo.variable} ${IBMPlexMono.variable}`}>
        <Nav />
        <main>{children}</main>
        <Footer />
        {/* Vercel Web Analytics (28 Oct): page views, referrers and countries, no cookies. Hobby plan: 50,000
            views a month, the last month kept. It loads its script after the page, so first paint is unchanged. */}
        <Analytics />
      </body>
    </html>
  );
}
