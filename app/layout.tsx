import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const sans = Archivo({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "600", "800", "900"],
  display: "swap",
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const TITLE = "Manveen Singh | automation engineer";
// The hero's own two sentences (version A, approved 15 Oct).
const DESCRIPTION = "Every week has a job that's the same clicks, in the same order. I make it run by itself, the same way every time.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["automation engineer", "workflow automation", "data entry automation", "Python", "Manveen Singh"],
  authors: [{ name: "Manveen Singh" }],
  metadataBase: new URL("https://manveen.me"),
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
      </head>
      <body className={`${sans.variable} ${mono.variable}`}>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
