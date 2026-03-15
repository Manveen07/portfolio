"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import CountUp from "react-countup";
import { TrendingUp, Clock, Shield, Database, Activity } from "lucide-react";
import { corpus } from "@/data/corpus";

export default function Metrics() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const icons = [Shield, Clock, TrendingUp, Database];
  const colors = ["#00e5ff", "#a78bfa", "#ffb800", "#34d399"];

  const extractNumber = (value: string) => {
    const num = parseFloat(value.replace(/[^0-9.]/g, ""));
    return isNaN(num) ? 0 : num;
  };

  return (
    <section id="metrics" className="py-24 sm:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <div className="section-tag mb-5 w-fit">
            <Activity className="w-3.5 h-3.5 text-[#00e5ff]" />
            <span>metrics.dashboard</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-3">
            Production <span className="text-gradient-cyan">Output</span>
          </h2>
          <p className="text-white/35 font-light text-base sm:text-lg">
            Real numbers from real systems. No vanity metrics.
          </p>
          <div className="flex items-center gap-3 mt-4">
            <div className="flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-[#00ff88]" style={{ boxShadow: "0 0 4px #00ff88" }} />
              <span className="text-[9px] font-mono text-[#00ff88]/35 tracking-widest">LIVE</span>
            </div>
            <div className="h-3 w-px bg-white/[0.06]" />
            <span className="text-[9px] font-mono text-white/15 tracking-widest">AUTO-REFRESHING</span>
          </div>
        </motion.div>

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {corpus.metrics.map((metric, index) => {
            const Icon = icons[index] || TrendingUp;
            const color = colors[index];
            const numVal = extractNumber(metric.value);
            const suffix = metric.value.includes("%") ? "%" : metric.value.includes("+") ? "+" : "";

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="module-card rounded-2xl p-6 group relative overflow-hidden"
              >
                {/* Top accent gradient */}
                <div className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${color}45, transparent)` }} />

                {/* Background radial glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                  style={{ background: `radial-gradient(ellipse at 30% 30%, ${color}08 0%, transparent 65%)` }} />

                <div className="flex items-center justify-between mb-5 relative z-10">
                  <div className="p-2.5 rounded-xl transition-all duration-300 group-hover:shadow-[0_0_12px_var(--c)]"
                    style={{
                      background: `${color}09`,
                      border: `1px solid ${color}14`,
                      // @ts-ignore
                      "--c": `${color}40`,
                    }}>
                    <Icon className="transition-colors duration-300" style={{ color: `${color}70`, width: 18, height: 18 }} />
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full"
                    style={{ background: color, boxShadow: `0 0 8px ${color}, 0 0 16px ${color}50` }} />
                </div>

                <div className="text-4xl sm:text-5xl font-black text-white mb-2 tracking-tight font-mono relative z-10"
                  style={{ textShadow: isInView ? `0 0 30px ${color}30` : "none" }}>
                  {isInView ? (
                    <>
                      <CountUp start={0} end={numVal} duration={2.5} decimals={numVal % 1 !== 0 ? 1 : 0} />
                      <span style={{ color, textShadow: `0 0 15px ${color}60` }}>{suffix}</span>
                    </>
                  ) : metric.value}
                </div>
                <p className="text-white/28 text-xs font-mono tracking-wider leading-relaxed relative z-10">
                  {metric.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
