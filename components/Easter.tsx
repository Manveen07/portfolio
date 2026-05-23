"use client";

/* Easter eggs & power-user surface for the portfolio.
   - Cmd/Ctrl+K (or `/`) opens a command palette to navigate sections / run actions.
   - Vim-style chord: `g h`, `g a`, `g p`, `g w`, `g x`, `g s`, `g e`, `g c` for section jumps.
   - `?` opens the shortcuts help.
   - Konami code (↑↑↓↓←→←→ba) toggles "god mode" — a debug HUD.
   - 7 clicks on the logo (handled here via window event "pf-logo-click") fires a secret. */

import { useEffect, useMemo, useRef, useState } from "react";
import { T } from "@/lib/tokens";
import { ME, NAV_IDS, NAV_LABELS } from "@/data/portfolio";

type Cmd = {
  id: string;
  label: string;
  hint: string;
  kbd?: string;
  run: () => void;
};

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function useFps(active: boolean) {
  const [fps, setFps] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let last = performance.now();
    let frames = 0;
    const tick = (t: number) => {
      frames++;
      if (t - last >= 1000) {
        setFps(frames);
        frames = 0;
        last = t;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);
  return fps;
}

function GodModeHUD({ on }: { on: boolean }) {
  const fps = useFps(on);
  const [mem, setMem] = useState<string>("—");
  useEffect(() => {
    if (!on) return;
    const id = setInterval(() => {
      const p = (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory;
      if (p?.usedJSHeapSize) {
        setMem(`${(p.usedJSHeapSize / 1024 / 1024).toFixed(1)} MB`);
      }
    }, 800);
    return () => clearInterval(id);
  }, [on]);

  if (!on) return null;
  return (
    <div style={{
      position: "fixed", left: 16, bottom: 16, zIndex: 60,
      background: T.ink2, border: `1px solid ${T.accent}`,
      padding: "10px 14px", fontFamily: T.mono, fontSize: 11,
      color: T.accent, letterSpacing: "0.06em",
      boxShadow: `0 0 24px rgba(125,217,154,0.18)`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span className="pf-pulse" style={{ width: 6, height: 6, borderRadius: 9999, background: T.accent }} />
        <strong style={{ color: T.text, letterSpacing: "0.1em" }}>GOD MODE</strong>
      </div>
      <div style={{ marginTop: 8, color: T.dim, lineHeight: 1.65 }}>
        fps <span style={{ color: T.text }}>{fps}</span>{"  "}·{"  "}
        heap <span style={{ color: T.text }}>{mem}</span>
      </div>
      <div style={{ marginTop: 4, color: T.dim2, fontSize: 10 }}>
        ↑↑↓↓←→←→ba — to disable
      </div>
    </div>
  );
}

function Palette({
  open, onClose, commands,
}: {
  open: boolean; onClose: () => void; commands: Cmd[];
}) {
  const [q, setQ] = useState("");
  const [i, setI] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQ("");
      setI(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return commands;
    return commands.filter((c) =>
      (c.label + " " + c.hint).toLowerCase().includes(needle),
    );
  }, [q, commands]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowDown") { e.preventDefault(); setI((x) => Math.min(filtered.length - 1, x + 1)); return; }
      if (e.key === "ArrowUp")   { e.preventDefault(); setI((x) => Math.max(0, x - 1)); return; }
      if (e.key === "Enter") {
        e.preventDefault();
        const cmd = filtered[i];
        if (cmd) { cmd.run(); onClose(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered, i, onClose]);

  useEffect(() => { setI(0); }, [q]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 80,
        background: "rgba(10,13,12,0.72)", backdropFilter: "blur(6px)",
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        paddingTop: "12vh",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="pf-card"
        style={{ width: "min(640px, 92vw)", padding: 0, background: T.ink2 }}
      >
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "14px 18px", borderBottom: `1px solid ${T.line}`,
        }}>
          <span style={{ fontFamily: T.mono, fontSize: 12, color: T.accent }}>$</span>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="run a command — type a section, action, or 'open …'"
            spellCheck={false}
            style={{
              flex: 1, background: "transparent", border: 0, outline: "none",
              color: T.text, fontFamily: T.mono, fontSize: 14,
            }}
          />
          <span style={{
            fontFamily: T.mono, fontSize: 10, color: T.dim2,
            padding: "3px 7px", border: `1px solid ${T.line2}`,
          }}>
            esc
          </span>
        </div>

        <div style={{ maxHeight: 360, overflow: "auto", padding: "6px 0" }}>
          {filtered.length === 0 && (
            <div style={{
              padding: "20px 18px", fontFamily: T.mono, fontSize: 12, color: T.dim,
            }}>
              <span style={{ color: T.warn }}>404</span> no command matches{" "}
              <span style={{ color: T.text }}>{q}</span>
            </div>
          )}
          {filtered.map((c, idx) => (
            <div
              key={c.id}
              onMouseEnter={() => setI(idx)}
              onClick={() => { c.run(); onClose(); }}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 18px",
                background: idx === i ? "rgba(125,217,154,0.06)" : "transparent",
                borderLeft: `2px solid ${idx === i ? T.accent : "transparent"}`,
                cursor: "pointer",
              }}
            >
              <span style={{
                fontFamily: T.mono, fontSize: 11, color: idx === i ? T.accent : T.dim2,
                letterSpacing: "0.06em", minWidth: 22,
              }}>
                {idx === i ? "▸" : "·"}
              </span>
              <span style={{ fontFamily: T.sans, fontSize: 14, color: T.text }}>
                {c.label}
              </span>
              <span style={{ fontFamily: T.mono, fontSize: 11, color: T.dim, marginLeft: 8 }}>
                {c.hint}
              </span>
              {c.kbd && (
                <span style={{
                  marginLeft: "auto", fontFamily: T.mono, fontSize: 10, color: T.dim2,
                  padding: "3px 7px", border: `1px solid ${T.line2}`,
                }}>
                  {c.kbd}
                </span>
              )}
            </div>
          ))}
        </div>

        <div style={{
          padding: "10px 18px", borderTop: `1px solid ${T.line}`,
          display: "flex", justifyContent: "space-between",
          fontFamily: T.mono, fontSize: 10, color: T.dim2, letterSpacing: "0.08em",
        }}>
          <span>↑↓ navigate · ⏎ run · esc close</span>
          <span>{filtered.length} command{filtered.length === 1 ? "" : "s"}</span>
        </div>
      </div>
    </div>
  );
}

function HelpModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  const rows: [string, string][] = [
    ["⌘ K  /  Ctrl K  /  /", "command palette"],
    ["g h", "go to system (top)"],
    ["g a", "go to about"],
    ["g p", "go to pipeline"],
    ["g w", "go to work"],
    ["g x", "go to agents"],
    ["g s", "go to stack"],
    ["g e", "go to logs (experience)"],
    ["g c", "go to contact"],
    ["?", "this help"],
    ["↑↑↓↓←→←→ba", "god mode"],
  ];
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 80,
        background: "rgba(10,13,12,0.72)", backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="pf-card"
        style={{ width: "min(520px, 92vw)", padding: "28px 32px", background: T.ink2 }}
      >
        <div style={{
          fontFamily: T.mono, fontSize: 11, color: T.dim,
          letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14,
        }}>
          keyboard shortcuts
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {rows.map(([k, v]) => (
            <div key={k} style={{
              display: "flex", justifyContent: "space-between",
              fontFamily: T.mono, fontSize: 12,
            }}>
              <span style={{
                color: T.text, padding: "3px 8px", border: `1px solid ${T.line2}`,
                background: T.ink, fontSize: 11,
              }}>{k}</span>
              <span style={{ color: T.dim }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{
          marginTop: 18, paddingTop: 14, borderTop: `1px solid ${T.line}`,
          fontFamily: T.mono, fontSize: 10, color: T.dim2, textAlign: "right",
        }}>
          esc to close
        </div>
      </div>
    </div>
  );
}

function SecretToast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const id = setTimeout(onDone, 3800);
    return () => clearTimeout(id);
  }, [onDone]);
  return (
    <div style={{
      position: "fixed", right: 20, bottom: 20, zIndex: 70,
      background: T.ink2, border: `1px solid ${T.accent}`,
      padding: "14px 18px", fontFamily: T.mono, fontSize: 12,
      color: T.text, maxWidth: 320, boxShadow: `0 0 32px rgba(125,217,154,0.22)`,
      animation: "fade-up .35s cubic-bezier(.22,1,.36,1) both",
    }}>
      <div style={{
        fontSize: 10, color: T.accent, letterSpacing: "0.12em", marginBottom: 6,
      }}>
        EASTER_EGG_FOUND
      </div>
      {message}
    </div>
  );
}

export default function Easter() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [god, setGod] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const konamiRef = useRef<string[]>([]);
  const KONAMI = useMemo(
    () => ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"],
    [],
  );

  const chordRef = useRef<{ pending: boolean; t: number }>({ pending: false, t: 0 });
  const logoClicksRef = useRef<{ n: number; t: number }>({ n: 0, t: 0 });

  // Console banner — fires once on mount.
  useEffect(() => {
    const banner = [
      `%c
   __  __
  |  \\/  | __ _ _ ____   _____  ___ _ __
  | |\\/| |/ _\` | '_ \\ \\ / / _ \\/ _ \\ '_ \\
  | |  | | (_| | | | \\ V /  __/  __/ | | |
  |_|  |_|\\__,_|_| |_|\\_/ \\___|\\___|_| |_|

`,
      `color:${T.accent};font-family:monospace;font-size:11px;line-height:1`,
    ];
    // eslint-disable-next-line no-console
    console.log(...banner);
    // eslint-disable-next-line no-console
    console.log(
      `%cif you're reading this, you found the source.%c\n  hiring? → ${ME.email}\n  resume? → ${ME.calendly}\n  curious? → press ? on the page for shortcuts.`,
      `color:${T.text};font-family:monospace;font-size:12px;font-weight:600`,
      `color:${T.dim};font-family:monospace;font-size:11px;line-height:1.6`,
    );
  }, []);

  // Logo click counter — listens for window event dispatched by the Nav logo.
  useEffect(() => {
    const onClick = () => {
      const now = Date.now();
      const ref = logoClicksRef.current;
      if (now - ref.t > 1400) ref.n = 0;
      ref.n += 1;
      ref.t = now;
      if (ref.n >= 7) {
        ref.n = 0;
        setToast("manual mode disengaged. you've earned the keys to the pipeline.");
      }
    };
    window.addEventListener("pf-logo-click", onClick);
    return () => window.removeEventListener("pf-logo-click", onClick);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const inField = target && /^(input|textarea|select)$/i.test(target.tagName);

      // Cmd/Ctrl + K → palette
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        setPaletteOpen((v) => !v);
        return;
      }

      if (inField) return;

      // `/` → palette
      if (e.key === "/" && !paletteOpen) {
        e.preventDefault();
        setPaletteOpen(true);
        return;
      }
      // `?` → help
      if (e.key === "?") {
        e.preventDefault();
        setHelpOpen((v) => !v);
        return;
      }
      // Esc closes overlays
      if (e.key === "Escape") {
        setPaletteOpen(false);
        setHelpOpen(false);
        return;
      }

      // Konami
      konamiRef.current.push(e.key);
      if (konamiRef.current.length > KONAMI.length) konamiRef.current.shift();
      if (konamiRef.current.length === KONAMI.length &&
          konamiRef.current.every((k, idx) => k.toLowerCase() === KONAMI[idx].toLowerCase())) {
        konamiRef.current = [];
        setGod((v) => {
          const next = !v;
          setToast(next ? "god mode engaged. all sensors hot." : "god mode disengaged.");
          return next;
        });
        return;
      }

      // Vim-style chord: g + <letter>
      const chord = chordRef.current;
      const now = Date.now();
      if (e.key === "g" && !chord.pending) {
        chord.pending = true;
        chord.t = now;
        setTimeout(() => {
          if (chordRef.current.pending && Date.now() - chordRef.current.t >= 700) {
            chordRef.current.pending = false;
          }
        }, 750);
        return;
      }
      if (chord.pending && now - chord.t < 700) {
        chord.pending = false;
        const map: Record<string, (typeof NAV_IDS)[number]> = {
          h: "top",
          a: "about",
          p: "pipeline",
          w: "ops",
          x: "agents",
          s: "stack",
          e: "experience",
          c: "contact",
        };
        const id = map[e.key.toLowerCase()];
        if (id) {
          e.preventDefault();
          scrollTo(id);
        }
        return;
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [KONAMI, paletteOpen]);

  const commands: Cmd[] = useMemo(() => {
    const chordOf = (id: (typeof NAV_IDS)[number]) =>
      id === "top" ? "h" : id === "agents" ? "x" : id === "ops" ? "w" : id[0];
    const navCmds: Cmd[] = NAV_IDS.map((id) => ({
      id: `nav-${id}`,
      label: `goto.${NAV_LABELS[id]}`,
      hint: `scroll to #${id}`,
      kbd: `g ${chordOf(id)}`,
      run: () => scrollTo(id),
    }));
    const action: Cmd[] = [
      {
        id: "act-email",
        label: "exec.email",
        hint: `mailto:${ME.email}`,
        run: () => { window.location.href = `mailto:${ME.email}`; },
      },
      {
        id: "act-calendly",
        label: "exec.schedule",
        hint: "open calendly · 30min",
        run: () => window.open(ME.calendly, "_blank", "noopener"),
      },
      {
        id: "act-resume",
        label: "exec.resume",
        hint: "open resume.pdf",
        run: () => window.open(ME.resume, "_blank", "noopener"),
      },
      {
        id: "act-github",
        label: "open.github",
        hint: "github.com/Manveen07",
        run: () => window.open(ME.github, "_blank", "noopener"),
      },
      {
        id: "act-linkedin",
        label: "open.linkedin",
        hint: "linkedin",
        run: () => window.open(ME.linkedin, "_blank", "noopener"),
      },
      {
        id: "act-god",
        label: "sys.god_mode --toggle",
        hint: "fps + heap HUD",
        kbd: "↑↑↓↓…",
        run: () => setGod((v) => {
          const next = !v;
          setToast(next ? "god mode engaged. all sensors hot." : "god mode disengaged.");
          return next;
        }),
      },
      {
        id: "act-help",
        label: "help.shortcuts",
        hint: "list keyboard chords",
        kbd: "?",
        run: () => setHelpOpen(true),
      },
      {
        id: "act-copy-email",
        label: "clipboard.copy_email",
        hint: ME.email,
        run: async () => {
          try { await navigator.clipboard.writeText(ME.email); setToast(`copied → ${ME.email}`); }
          catch { setToast("clipboard blocked by browser"); }
        },
      },
    ];
    return [...navCmds, ...action];
  }, []);

  return (
    <>
      <Palette open={paletteOpen} onClose={() => setPaletteOpen(false)} commands={commands} />
      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
      <GodModeHUD on={god} />
      {toast && <SecretToast message={toast} onDone={() => setToast(null)} />}
    </>
  );
}
