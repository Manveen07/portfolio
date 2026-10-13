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

const DESCRIPTION =
  "I automate the work a business still does by hand between a customer's list and a confirmed order: quote intake, order parsing, document processing. Every build ships with its own error rate measured.";

export const metadata: Metadata = {
  title: "Manveen Singh | automation engineer",
  description: DESCRIPTION,
  keywords: [
    "automation engineer", "quote intake automation", "order parsing", "document processing",
    "lead enrichment", "outbound automation", "Clay", "n8n", "Python",
  ],
  authors: [{ name: "Manveen Singh" }],
  metadataBase: new URL("https://manveen.me"),
  openGraph: {
    title: "Manveen Singh | automation engineer",
    description: "Automating the boring. Scaling the interesting.",
    type: "website",
    locale: "en_US",
    url: "https://manveen.me",
    siteName: "Manveen Singh",
  },
  twitter: {
    card: "summary_large_image",
    title: "Manveen Singh | automation engineer",
    description: "Automating the boring. Scaling the interesting.",
  },
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
