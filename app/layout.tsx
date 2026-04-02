import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CommandPalette from "@/components/CommandPalette";
import ParticleCanvas from "@/components/ParticleCanvas";
import PipelineSidebar from "@/components/PipelineSidebar";
import CursorGlow from "@/components/CursorGlow";
import LoadingScreen from "@/components/LoadingScreen";
import BackToTop from "@/components/BackToTop";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Manveen Singh | AI & Automation Engineer",
  description: "AI & Automation Engineer building intelligent workflow systems and scaling toward quant-level agent architectures. Specializing in GTM automation, LLM orchestration, and scalable data systems.",
  keywords: ["AI Engineer", "Automation Engineer", "GTM Engineer", "Python Developer", "Machine Learning", "Workflow Automation"],
  authors: [{ name: "Manveen Singh" }],
  metadataBase: new URL("https://manveen.vercel.app"),
  openGraph: {
    title: "Manveen Singh | AI & Automation Engineer",
    description: "I build production-ready AI & automation pipelines that eliminate manual workflows and accelerate product delivery.",
    type: "website",
    locale: "en_US",
    url: "https://manveen.vercel.app",
    siteName: "Manveen Singh Portfolio",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Manveen Singh - AI & Automation Engineer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Manveen Singh | AI & Automation Engineer",
    description: "I build production-ready AI & automation pipelines that eliminate manual workflows and accelerate product delivery.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased min-h-screen`}
        suppressHydrationWarning
      >
        {/* Boot sequence loading screen */}
        <LoadingScreen />

        {/* Full-page interactive particle background */}
        <ParticleCanvas />

        {/* Circuit board grid overlay */}
        <div className="fixed inset-0 z-[1] bg-circuit opacity-50 pointer-events-none" />

        {/* Cursor glow — follows mouse for immersive feel */}
        <CursorGlow />

        <div className="relative z-10 min-h-screen flex flex-col">
          <Navbar />

          {/* Pipeline sidebar — visible on xl+ screens */}
          <PipelineSidebar />

          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <CommandPalette />
          <BackToTop />
        </div>
      </body>
    </html>
  );
}
