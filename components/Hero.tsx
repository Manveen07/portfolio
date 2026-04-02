"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import { ArrowRight, Calendar, Play, Cpu, Zap } from "lucide-react";
import { corpus } from "@/data/corpus";

/** Typewriter hook — types out text character by character */
function useTypewriter(text: string, speed = 35) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(timer);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return { displayed, done };
}

/** Magnetic button — pulls toward cursor on hover */
function MagneticButton({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    x.set(dx * 0.25);
    y.set(dy * 0.25);
  }, [x, y]);

  const onMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.button
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={className}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
}

/** Magnetic link — same effect for anchor tags */
function MagneticLink({ children, className, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    x.set(dx * 0.2);
    y.set(dy * 0.2);
  }, [x, y]);

  const onMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.a
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={className}
      {...(props as any)}
    >
      {children}
    </motion.a>
  );
}

/** Mini neural-net SVG behind the headline — looks like data flowing through layers */
function NeuralNetBg() {
  const layers = [
    { x: 80, nodes: [90, 200, 310, 420] },
    { x: 240, nodes: [140, 260, 370] },
    { x: 400, nodes: [100, 220, 340, 440] },
    { x: 560, nodes: [170, 300, 410] },
    { x: 720, nodes: [130, 250, 380] },
  ];

  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 800 500"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      {/* Inter-layer connections */}
      {layers.map((layer, li) => {
        if (li >= layers.length - 1) return null;
        const next = layers[li + 1];
        return layer.nodes.map((y1, ni) =>
          next.nodes.map((y2, nj) => (
            <line
              key={`${li}-${ni}-${nj}`}
              x1={layer.x} y1={y1}
              x2={next.x} y2={y2}
              stroke="rgba(0,229,255,0.04)"
              strokeWidth="0.8"
            />
          ))
        );
      })}

      {/* Nodes */}
      {layers.map((layer, li) =>
        layer.nodes.map((y, ni) => (
          <g key={`n-${li}-${ni}`}>
            <circle cx={layer.x} cy={y} r="3"
              fill={li % 2 === 0 ? "rgba(0,229,255,0.15)" : "rgba(0,255,136,0.12)"}>
              <animate attributeName="opacity" values="0.12;0.3;0.12" dur={`${2.5 + ni * 0.3}s`} repeatCount="indefinite" />
            </circle>
            <circle cx={layer.x} cy={y} r="8"
              stroke={li % 2 === 0 ? "rgba(0,229,255,0.06)" : "rgba(0,255,136,0.04)"}
              strokeWidth="0.5" fill="none">
              <animate attributeName="r" values="6;12;6" dur={`${3 + li * 0.5}s`} repeatCount="indefinite" begin={`${ni * 0.2}s`} />
              <animate attributeName="opacity" values="0.08;0;0.08" dur={`${3 + li * 0.5}s`} repeatCount="indefinite" begin={`${ni * 0.2}s`} />
            </circle>
          </g>
        ))
      )}

      {/* Data packets flowing through the network */}
      {[0, 1, 2].map((idx) => {
        const srcLayer = idx % 4;
        const src = layers[srcLayer];
        const dst = layers[srcLayer + 1];
        const srcY = src.nodes[idx % src.nodes.length];
        const dstY = dst.nodes[idx % dst.nodes.length];
        return (
          <circle key={`pkt-${idx}`} r="2.5"
            fill={idx === 1 ? "#00ff88" : "#00e5ff"}>
            <animateMotion
              dur={`${2 + idx * 0.8}s`}
              repeatCount="indefinite"
              begin={`${idx * 1.2}s`}
              path={`M${src.x},${srcY} L${dst.x},${dstY}`}
            />
            <animate attributeName="opacity" values="0;1;1;0" dur={`${2 + idx * 0.8}s`} repeatCount="indefinite" begin={`${idx * 1.2}s`} />
          </circle>
        );
      })}
    </svg>
  );
}

export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  // Parallax — orbs move at different speeds as user scrolls
  const { scrollY } = useScroll();
  const orbY1 = useTransform(scrollY, [0, 800], [0, -120]);
  const orbY2 = useTransform(scrollY, [0, 800], [0, -80]);
  const orbY3 = useTransform(scrollY, [0, 800], [0, -50]);
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0.3]);

  const [statusIndex, setStatusIndex] = useState(0);
  const currentStatus = corpus.hero.terminalStatuses[statusIndex];
  const { displayed, done } = useTypewriter(currentStatus, 30);

  useEffect(() => {
    if (!done) return;
    const timeout = setTimeout(() => {
      setStatusIndex((prev) => (prev + 1) % corpus.hero.terminalStatuses.length);
    }, 2200);
    return () => clearTimeout(timeout);
  }, [done]);

  return (
    <section id="hero" className="relative min-h-[100svh] flex items-center justify-center pt-16 overflow-hidden">

      {/* ── Background layers ── */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        {/* Neural network visualization */}
        <NeuralNetBg />

        {/* Ambient aurora orbs — parallax depth */}
        <motion.div className="absolute -top-[200px] -left-[100px] w-[600px] h-[600px] rounded-full aurora-orb-1"
          style={{ y: orbY1, background: "radial-gradient(circle, rgba(0,229,255,0.08) 0%, transparent 65%)", filter: "blur(100px)" }} />
        <motion.div className="absolute top-[20%] right-[-5%] w-[500px] h-[500px] rounded-full aurora-orb-2"
          style={{ y: orbY2, background: "radial-gradient(circle, rgba(0,255,136,0.06) 0%, transparent 65%)", filter: "blur(100px)" }} />
        <motion.div className="absolute bottom-[10%] left-[15%] w-[350px] h-[350px] rounded-full aurora-orb-3"
          style={{ y: orbY3, background: "radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 65%)", filter: "blur(90px)" }} />

        {/* Radial vignette */}
        <div className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 50% 40%, transparent 40%, rgba(4,8,16,0.75) 100%)" }} />
      </div>

      <motion.div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12" style={{ opacity: heroOpacity }}>

        {/* ── Status bar ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-between mb-11 module-card px-5 py-3 rounded-xl"
        >
          <div className="flex items-center gap-3">
            <div className="status-dot-live" />
            <span className="text-[11px] font-mono tracking-widest uppercase text-white/40">
              {corpus.personal.role} | {corpus.personal.location}
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[10px] font-mono text-electric tracking-wider" style={{ textShadow: "0 0 8px rgba(0,255,136,0.4)" }}>
              <Zap className="w-2.5 h-2.5" />
              ONLINE
            </span>
            <span className="text-[10px] font-mono text-white/15 tracking-wider">v2.4.1</span>
          </div>
        </motion.div>

        <div className="flex flex-col items-start text-left">

          {/* ── Name ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="mb-5"
          >
            <span className="text-sm font-mono text-[#00ff88]/45 tracking-widest uppercase glitch-text" data-text={`// ${corpus.personal.name}`}>
              // {corpus.personal.name}
            </span>
          </motion.div>

          {/* ── Headline ── */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-6xl md:text-[5.2rem] font-black tracking-tight leading-[1.02] mb-7 max-w-4xl"
          >
            <span className="text-white" style={{ textShadow: "0 0 60px rgba(255,255,255,0.04)" }}>
              {corpus.hero.headline}
            </span>
            <br />
            <span className="text-gradient-flow text-glow-cyan-pulse inline-block">
              Agentic Workflows.
            </span>
          </motion.h1>

          {/* ── Subtitle ── */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg text-white/38 max-w-xl font-light leading-relaxed mb-4"
          >
            {corpus.hero.subHeadline}
          </motion.p>

          {/* ── Terminal status — typewriter ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.58 }}
            className="h-8 flex items-center mb-11"
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={statusIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -7 }}
                transition={{ duration: 0.35 }}
                className="text-[13px] font-mono text-[#00ff88]/55"
              >
                <span className="text-[#00ff88]/25">$ </span>
                {displayed}
                <span className={`ml-0.5 text-[#00ff88]/35 ${done ? 'animate-pulse' : ''}`}>▌</span>
              </motion.p>
            </AnimatePresence>
          </motion.div>

          {/* ── CTA Buttons ── */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
          >
            <MagneticButton
              onClick={() => scrollToSection("case-studies")}
              className="btn-glow group flex items-center justify-center gap-2.5 px-8 py-3.5 text-[12px] font-mono tracking-widest uppercase font-bold text-[#040810] bg-[#00ff88] rounded-xl cursor-pointer"
              style={{
                boxShadow: "0 0 28px rgba(0,255,136,0.35), 0 0 60px rgba(0,255,136,0.12), inset 0 1px 0 rgba(255,255,255,0.35)",
              }}
            >
              <Play className="w-3.5 h-3.5" />
              Execute Pipeline
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </MagneticButton>

            <MagneticLink
              href={corpus.contact.calendlyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-2.5 px-8 py-3.5 text-[12px] font-mono tracking-widest uppercase text-white/40 border border-white/[0.07] rounded-xl hover:text-[#00ff88] hover:border-[#00ff88]/22 hover:bg-[#00ff88]/[0.035] hover:shadow-[0_0_24px_rgba(0,255,136,0.1)] transition-all duration-300"
            >
              <Calendar className="w-3.5 h-3.5" />
              Schedule Call
            </MagneticLink>
          </motion.div>
        </div>

        {/* ── Metrics dashboard ── */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16"
        >
          <div className="gradient-border-wrap">
          <div className="module-card rounded-2xl p-6 sm:p-8"
            style={{
              borderColor: "transparent",
            }}
          >
            <div className="flex items-center justify-between mb-5 relative z-10">
              <div className="flex items-center gap-2.5 text-[11px] font-mono text-white/25 tracking-widest uppercase">
                <Cpu className="w-3.5 h-3.5 text-[#00ff88]/40" />
                <span>pipeline.metrics</span>
              </div>
              <div className="status-live" style={{ borderColor: "rgba(0,255,136,0.2)", background: "rgba(0,255,136,0.06)", color: "#00ff88" }}>
                <div className="w-1.5 h-1.5 rounded-full bg-[#00ff88]" style={{ boxShadow: "0 0 6px #00ff88" }} />
                <span>LIVE</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 relative z-10">
              {corpus.metrics.map((metric, index) => {
                const colors = ["#00e5ff", "#00ff88", "#a78bfa", "#ffb800"];
                const c = colors[index];
                return (
                  <div key={index} className="group">
                    <div className="text-2xl sm:text-3xl font-black text-white mb-1 tracking-tight flex items-baseline gap-1 font-mono">
                      {metric.value}
                      <span className="text-xs" style={{ color: c, textShadow: `0 0 8px ${c}` }}>↗</span>
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-white/28 font-mono tracking-wider leading-relaxed">
                      {metric.label}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom trace accent */}
            <div className="relative z-10 mt-6 pt-5 border-t border-white/[0.03] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00ff88]" style={{ boxShadow: "0 0 4px #00ff88" }} />
                <span className="text-[10px] font-mono text-white/15 tracking-widest">PRODUCTION SYSTEMS</span>
              </div>
              <span className="text-[10px] font-mono text-[#00ff88]/20 tracking-wider">ALL PIPELINES NOMINAL</span>
            </div>
          </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
