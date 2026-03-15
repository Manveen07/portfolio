"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
  const [phase, setPhase] = useState(0); // 0=loading, 1=ready, 2=gone
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate boot sequence
    const start = Date.now();
    const duration = 1800;
    const tick = () => {
      const elapsed = Date.now() - start;
      const p = Math.min(elapsed / duration, 1);
      // Eased progress — fast start, slow middle, fast end
      const eased = p < 0.5
        ? 2 * p * p
        : 1 - Math.pow(-2 * p + 2, 2) / 2;
      setProgress(Math.round(eased * 100));
      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        setPhase(1);
        setTimeout(() => setPhase(2), 400);
      }
    };
    requestAnimationFrame(tick);
  }, []);

  if (phase === 2) return null;

  return (
    <AnimatePresence>
      {phase < 2 && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] bg-[#040810] flex flex-col items-center justify-center"
        >
          {/* Circuit grid background */}
          <div className="absolute inset-0 bg-circuit opacity-20" />

          {/* Center content */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 flex flex-col items-center"
          >
            {/* Logo mark */}
            <div className="w-14 h-14 rounded-2xl bg-[#00ff88]/[0.08] border border-[#00ff88]/20 flex items-center justify-center mb-8 relative">
              <span className="text-[#00ff88] font-mono font-bold text-xl">M</span>
              <div className="absolute inset-0 rounded-2xl border border-[#00ff88]/30 animate-ping opacity-20" />
            </div>

            {/* Boot text */}
            <div className="font-mono text-[11px] tracking-[0.2em] uppercase mb-6 text-center space-y-1">
              <p className="text-white/20">
                {progress < 30 && "initializing system..."}
                {progress >= 30 && progress < 60 && "loading modules..."}
                {progress >= 60 && progress < 90 && "connecting pipelines..."}
                {progress >= 90 && phase === 0 && "deploying interface..."}
                {phase === 1 && <span className="text-[#00ff88]">system ready</span>}
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-48 h-[2px] bg-white/[0.06] rounded-full overflow-hidden mb-3">
              <motion.div
                className="h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #00e5ff, #00ff88)",
                  boxShadow: "0 0 12px rgba(0,255,136,0.4)",
                }}
              />
            </div>

            <p className="font-mono text-[10px] text-white/15 tracking-widest">
              {progress}%
            </p>
          </motion.div>

          {/* Corner accents */}
          <div className="absolute top-6 left-6 w-8 h-8 border-l border-t border-[#00e5ff]/10" />
          <div className="absolute top-6 right-6 w-8 h-8 border-r border-t border-[#00e5ff]/10" />
          <div className="absolute bottom-6 left-6 w-8 h-8 border-l border-b border-[#00ff88]/10" />
          <div className="absolute bottom-6 right-6 w-8 h-8 border-r border-b border-[#00ff88]/10" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
