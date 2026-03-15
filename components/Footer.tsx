"use client";

import { useState, useRef } from "react";
import { Github, Linkedin, Mail, MapPin, Headphones, Music2 } from "lucide-react";
import { corpus } from "@/data/corpus";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [showSpotify, setShowSpotify] = useState(false);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);

  const startPress = () => {
    pressTimer.current = setTimeout(() => setShowSpotify(true), 1500);
  };
  const cancelPress = () => {
    if (pressTimer.current) { clearTimeout(pressTimer.current); pressTimer.current = null; }
  };

  return (
    <footer className="relative border-t border-white/[0.03] bg-[#040810]">
      {/* Top glow line — circuit trace accent */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#00e5ff]/30 to-transparent" />
      <div className="absolute top-0 inset-x-[20%] h-[2px] blur-sm bg-gradient-to-r from-transparent via-[#00ff88]/15 to-transparent" />

      {/* Circuit trace SVG decoration */}
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03]" preserveAspectRatio="none">
        <line x1="10%" y1="0" x2="10%" y2="100%" stroke="#00e5ff" strokeWidth="0.5" strokeDasharray="4 8" />
        <line x1="90%" y1="0" x2="90%" y2="100%" stroke="#00ff88" strokeWidth="0.5" strokeDasharray="4 8" />
        <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#00e5ff" strokeWidth="0.3" strokeDasharray="2 12" />
      </svg>

      {/* Footer ambient orbs */}
      <div className="absolute bottom-0 left-[10%] w-[350px] h-[200px] rounded-full aurora-orb-1 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,255,136,0.04) 0%, transparent 70%)", filter: "blur(80px)" }} />
      <div className="absolute bottom-0 right-[10%] w-[300px] h-[180px] rounded-full aurora-orb-3 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,229,255,0.04) 0%, transparent 70%)", filter: "blur(80px)" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-[#00e5ff]/10 border border-[#00e5ff]/20 flex items-center justify-center">
                <span className="text-[#00e5ff] font-mono font-bold text-sm">M</span>
              </div>
              <span className="text-base font-semibold text-white">{corpus.personal.name}</span>
            </div>
            <p className="text-white/25 text-sm leading-relaxed mb-5 max-w-sm font-light">
              Building intelligent execution pipelines. Replacing manual workflows with reliable automation.
            </p>
            <div className="status-live text-[10px]" style={{ borderColor: "rgba(0,255,136,0.15)", background: "rgba(0,255,136,0.04)", color: "#00ff88" }}>
              <div className="status-dot-live" style={{ width: 6, height: 6, background: "#00ff88", boxShadow: "0 0 6px #00ff88" }} />
              <span>All pipelines operational</span>
            </div>
          </div>

          {/* Nav */}
          <div className="md:col-span-3 md:col-start-7">
            <h3 className="text-[11px] font-mono text-white/30 uppercase tracking-[0.2em] mb-5">Navigate</h3>
            <ul className="space-y-3">
              {[
                { label: "System", href: "#about" },
                { label: "Logs", href: "#experience" },
                { label: "Ops", href: "#case-studies" },
                { label: "Stack", href: "#skills" },
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-sm text-white/20 hover:text-[#00e5ff] transition-colors flex items-center group">
                    <span className="w-1 h-1 rounded-full bg-white/10 group-hover:bg-[#00e5ff] mr-2.5 transition-colors" />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-3 md:col-start-10">
            <h3 className="text-[11px] font-mono text-white/30 uppercase tracking-[0.2em] mb-5">Comms</h3>
            <div className="space-y-3">
              <a href={`mailto:${corpus.personal.email}`}
                className="flex items-center gap-2.5 text-sm text-white/25 hover:text-[#00e5ff] transition-colors group">
                <div className="p-1.5 rounded bg-white/[0.02] border border-white/[0.04] group-hover:border-[#00e5ff]/15">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <span className="font-mono text-[12px]">{corpus.personal.email}</span>
              </a>
              <div className="flex items-center gap-2.5 text-sm text-white/15">
                <div className="p-1.5 rounded bg-white/[0.02] border border-white/[0.04]">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <span className="font-mono text-[12px]">{corpus.personal.location}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-7 pt-6 border-t border-white/[0.03]">
              <a href={corpus.personal.github} target="_blank" rel="noopener noreferrer" className="text-white/15 hover:text-white transition-colors" aria-label="GitHub">
                <Github className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
              </a>
              <a href={corpus.personal.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/15 hover:text-[#00e5ff] transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
              </a>

              {/* Easter egg */}
              <div className="relative cursor-pointer text-white/10 hover:text-white/25 transition-colors group ml-auto"
                onMouseDown={startPress} onMouseUp={cancelPress} onMouseLeave={cancelPress}
                onTouchStart={startPress} onTouchEnd={cancelPress} title="Hold for 1.5s">
                <Headphones className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
                <span className="absolute -top-9 left-1/2 -translate-x-1/2 module-card text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap text-white/30 font-mono">
                  hold click
                </span>
                {showSpotify && (
                  <a href="https://spotify.com" target="_blank" rel="noopener noreferrer"
                    className="absolute bottom-full mb-3 -right-2 flex items-center gap-2 bg-[#1DB954] text-black font-bold text-[11px] px-3 py-1.5 rounded-full whitespace-nowrap shadow-[0_0_15px_rgba(29,185,84,0.3)]"
                    onMouseUp={(e) => e.stopPropagation()}>
                    <Music2 className="w-3 h-3" />
                    Focus Mix
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-7 border-t border-white/[0.03] flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-[11px] text-white/15 font-mono tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88]/40" style={{ boxShadow: "0 0 4px rgba(0,255,136,0.3)" }} />
            © {currentYear} {corpus.personal.name}. All systems operational.
          </p>
          <p className="text-[11px] text-white/10 font-mono tracking-wider">
            <span className="text-[#00e5ff]/15">sys.uptime</span> = <span className="text-[#00ff88]/20">∞</span> · Deployed with caffeine and questionable sleep schedules.
          </p>
        </div>
      </div>
    </footer>
  );
}