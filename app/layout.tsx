import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import BootOverlay from "@/components/BootOverlay";
import Easter from "@/components/Easter";
import FX from "@/components/FX";

const sans = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Manveen Singh | AI & Automation Engineer",
  description:
    "AI & Automation Engineer building intelligent workflow systems and scaling toward quant-level agent architectures. Specializing in GTM automation, LLM orchestration, and scalable data systems.",
  keywords: [
    "AI Engineer", "Automation Engineer", "GTM Engineer",
    "Python Developer", "Machine Learning", "Workflow Automation",
  ],
  authors: [{ name: "Manveen Singh" }],
  metadataBase: new URL("https://manveen.vercel.app"),
  openGraph: {
    title: "Manveen Singh | AI & Automation Engineer",
    description:
      "I build production-ready AI & automation pipelines that eliminate manual workflows and accelerate product delivery.",
    type: "website",
    locale: "en_US",
    url: "https://manveen.vercel.app",
    siteName: "Manveen Singh Portfolio",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Manveen Singh — AI & Automation Engineer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Manveen Singh | AI & Automation Engineer",
    description:
      "I build production-ready AI & automation pipelines that eliminate manual workflows and accelerate product delivery.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${sans.variable} ${mono.variable} font-sans antialiased min-h-screen`}
        suppressHydrationWarning
      >
        <div className="pf-bg" />
        <BootOverlay />
        <div className="pf-page">
          <Nav />
          <main>{children}</main>
          <Footer />
        </div>
        <FX />
        <Easter />
      </body>
    </html>
  );
}
