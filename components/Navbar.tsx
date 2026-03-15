"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";
import { Menu, X, Github, Linkedin, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { corpus } from "@/data/corpus";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  // Scroll progress
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);

      // Detect active section
      const sections = ["about", "experience", "case-studies", "skills"];
      let current = "";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom > 200) {
            current = `#${id}`;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#about", label: "System" },
    { href: "#experience", label: "Logs" },
    { href: "#case-studies", label: "Ops" },
    { href: "#skills", label: "Stack" },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
      isScrolled ? "py-3" : "py-4"
    )}>
      {/* Scroll progress bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[1px] origin-left z-50"
        style={{
          scaleX,
          background: "linear-gradient(90deg, #00e5ff, #00ff88, #a78bfa)",
          boxShadow: "0 0 8px rgba(0,229,255,0.4), 0 0 20px rgba(0,255,136,0.2)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={cn(
          "flex items-center justify-between transition-all duration-500 px-5 py-2.5 rounded-2xl",
          isScrolled
            ? "module-card shadow-[0_8px_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(0,229,255,0.07)]"
            : "bg-transparent"
        )}>
          {/* System identifier */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative flex items-center gap-2.5">
              {/* Glow ring */}
              <div className="w-8 h-8 rounded-lg flex items-center justify-center relative">
                <div className="absolute inset-0 rounded-lg bg-[#00e5ff]/10 border border-[#00e5ff]/30 group-hover:border-[#00e5ff]/60 group-hover:shadow-[0_0_15px_rgba(0,229,255,0.2)] transition-all duration-300" />
                <span className="relative text-[#00e5ff] font-mono font-bold text-sm">M</span>
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-[13px] font-semibold text-white/90 tracking-wide leading-none">
                  {corpus.personal.name}
                </span>
                <span className="text-[10px] font-mono text-[#00e5ff]/50 tracking-wider mt-0.5">
                  SYS.ENGINEER
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1" suppressHydrationWarning>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-3.5 py-2 text-[12px] font-mono tracking-widest uppercase transition-all duration-300 rounded-lg",
                  activeSection === link.href
                    ? "text-[#00ff88] bg-[#00ff88]/[0.06]"
                    : "text-white/40 hover:text-[#00e5ff] hover:bg-[#00e5ff]/[0.04]"
                )}
                suppressHydrationWarning
              >
                {link.label}
                {activeSection === link.href && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#00ff88]"
                    style={{ boxShadow: "0 0 6px #00ff88" }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </div>

          {/* Right: socials + CTA */}
          <div className="hidden md:flex items-center gap-2" suppressHydrationWarning>
            <a href={corpus.personal.github} target="_blank" rel="noopener noreferrer"
              className="p-2 text-white/30 hover:text-white hover:bg-white/[0.04] rounded-lg transition-all" aria-label="GitHub" suppressHydrationWarning>
              <Github className="w-4 h-4" />
            </a>
            <a href={corpus.personal.linkedin} target="_blank" rel="noopener noreferrer"
              className="p-2 text-white/30 hover:text-[#00e5ff] hover:bg-[#00e5ff]/[0.04] rounded-lg transition-all" aria-label="LinkedIn" suppressHydrationWarning>
              <Linkedin className="w-4 h-4" />
            </a>
            <div className="w-px h-5 bg-white/[0.06] mx-1" />
            <a
              href={`mailto:${corpus.personal.email}`}
              className="flex items-center gap-2 px-4 py-2 text-[11px] font-mono tracking-widest uppercase bg-[#00ff88]/10 border border-[#00ff88]/25 text-[#00ff88] rounded-lg hover:bg-[#00ff88]/15 hover:border-[#00ff88]/40 hover:shadow-[0_0_20px_rgba(0,255,136,0.15)] transition-all duration-300"
              suppressHydrationWarning
            >
              <Mail className="w-3.5 h-3.5" />
              <span>CONNECT</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-white/40 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-4 right-4 mt-2 module-card rounded-2xl overflow-hidden">
          <div className="px-4 py-5 space-y-1">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href}
                className={cn(
                  "block px-4 py-3 text-sm font-mono tracking-wider uppercase rounded-lg transition-all",
                  activeSection === link.href
                    ? "text-[#00ff88] bg-[#00ff88]/[0.06]"
                    : "text-white/50 hover:text-[#00e5ff] hover:bg-[#00e5ff]/[0.04]"
                )}
                onClick={() => setIsMenuOpen(false)}>
                {link.label}
              </a>
            ))}
            <div className="flex items-center justify-center gap-6 pt-4 mt-3 border-t border-white/[0.04]">
              <a href={corpus.personal.github} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white"><Github className="w-5 h-5" /></a>
              <a href={corpus.personal.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-[#00e5ff]"><Linkedin className="w-5 h-5" /></a>
              <a href={`mailto:${corpus.personal.email}`} className="text-[#00ff88]/60 hover:text-[#00ff88]"><Mail className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
