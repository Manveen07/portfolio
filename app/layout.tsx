import type { Metadata } from "next";
import { Barlow, Barlow_Condensed, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import BootOverlay from "@/components/BootOverlay";
import Easter from "@/components/Easter";

const sans = Barlow({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const cond = Barlow_Condensed({
  variable: "--font-cond",
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  display: "swap",
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const DESCRIPTION =
  "I build automation for sales and marketing teams: the systems that find leads, check them, add the missing data, and put them in your CRM. Then I keep them running.";

export const metadata: Metadata = {
  title: "Manveen Singh | GTM automation engineer",
  description: DESCRIPTION,
  keywords: [
    "GTM engineer", "GTM automation", "automation engineer",
    "lead enrichment", "outbound automation", "Clay", "n8n", "Python",
  ],
  authors: [{ name: "Manveen Singh" }],
  metadataBase: new URL("https://manveen.me"),
  openGraph: {
    title: "Manveen Singh | GTM automation engineer",
    description: "Automating the boring. Scaling the interesting.",
    type: "website",
    locale: "en_US",
    url: "https://manveen.me",
    siteName: "Manveen Singh",
  },
  twitter: {
    card: "summary_large_image",
    title: "Manveen Singh | GTM automation engineer",
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
      <body className={`${sans.variable} ${cond.variable} ${mono.variable} antialiased`} suppressHydrationWarning>
        <div className="pf-grain" />
        <div className="pf-vignette" />
        <BootOverlay />
        <div className="pf-page">
          <Nav />
          <main>{children}</main>
          <Footer />
        </div>
        <Easter />
      </body>
    </html>
  );
}
