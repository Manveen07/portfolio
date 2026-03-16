"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { FolderGit2, ArrowRight, ExternalLink, Workflow } from "lucide-react";
import { corpus } from "@/data/corpus";
import TextReveal from "@/components/TextReveal";

interface TiltState { x: number; y: number; }

function TiltCard({ children, className, style }: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<TiltState>({ x: 0, y: 0 });
  const [glow, setGlow] = useState({ x: 50, y: 50 });

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const rotX = ((e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)) * 6;
    const rotY = -(((e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)) * 6);
    setTilt({ x: rotX, y: rotY });
    setGlow({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const onMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setGlow({ x: 50, y: 50 });
  };

  return (
    <div ref={ref} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} style={{ perspective: "900px" }} className="h-full">
      <motion.div
        animate={{ rotateX: tilt.x, rotateY: tilt.y }}
        transition={{ type: "spring", stiffness: 180, damping: 18 }}
        className={className}
        style={{ ...style, transformStyle: "preserve-3d", willChange: "transform" }}
      >
        {/* Dynamic spotlight */}
        <div
          className="absolute inset-0 pointer-events-none z-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400"
          style={{ background: `radial-gradient(circle at ${glow.x}% ${glow.y}%, rgba(0,229,255,0.07) 0%, transparent 65%)` }}
        />
        {children}
      </motion.div>
    </div>
  );
}

export default function CaseStudies() {
  const cardColors = ["#00e5ff", "#a78bfa", "#ffb800", "#34d399"];

  return (
    <section id="case-studies" className="py-24 sm:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-80px" }}
          className="mb-14"
        >
          <div className="section-tag mb-5 w-fit">
            <Workflow className="w-3.5 h-3.5 text-[#00e5ff]" />
            <span>ops.deployments</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-3">
            Mission <span className="text-gradient-cyan">Reports</span>
          </h2>
          <p className="text-white/35 font-light text-base sm:text-lg max-w-xl">
            <TextReveal>Systems I built, problems I solved, pipelines I shipped.</TextReveal>
          </p>
          <div className="flex items-center gap-3 mt-4">
            <div className="flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-[#00e5ff]" style={{ boxShadow: "0 0 4px #00e5ff" }} />
              <span className="text-[9px] font-mono text-[#00e5ff]/30 tracking-widest">{corpus.caseStudies.length} OPS COMPLETED</span>
            </div>
            <div className="h-3 w-px bg-white/[0.06]" />
            <span className="text-[9px] font-mono text-white/15 tracking-widest">100% DELIVERY RATE</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {corpus.caseStudies.map((study, index) => {
            const color = cardColors[index % cardColors.length];
            return (
              <motion.div
                key={study.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true, margin: "-50px" }}
                className="h-full"
              >
                <TiltCard
                  className="module-card rounded-2xl overflow-hidden group flex flex-col relative h-full"
                  style={{ borderColor: `${color}12` }}
                >
                  {/* Left accent bar */}
                  <div className="absolute top-0 left-0 w-[2px] h-full rounded-l-2xl z-10"
                    style={{ background: `linear-gradient(to bottom, ${color}, ${color}40, transparent)` }} />

                  {/* Top shimmer accent */}
                  <div className="absolute top-0 left-0 right-0 h-px z-10"
                    style={{ background: `linear-gradient(90deg, transparent, ${color}28, transparent)` }} />

                  <div className="p-7 sm:p-8 flex-grow relative z-10">
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg"
                          style={{ background: `${color}08`, border: `1px solid ${color}15` }}>
                          <FolderGit2 className="w-4 h-4" style={{ color }} />
                        </div>
                        <span className="text-[11px] font-mono uppercase tracking-[0.12em] font-semibold"
                          style={{ color: `${color}90` }}>
                          {study.role}
                        </span>
                      </div>
                      {study.link && (
                        <a href={study.link} target="_blank" rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-[#00e5ff]/20 text-white/20 hover:text-[#00e5ff] transition-all">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#00e5ff] transition-colors duration-300">
                      {study.title}
                    </h3>
                    <p className="text-white/35 text-sm mb-5 font-light leading-relaxed">{study.tagline}</p>

                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {study.techStack.map((tech, i) => (
                        <span key={i} className="tech-chip text-[10px]">{tech}</span>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <div className="p-4 rounded-xl bg-white/[0.015] border border-white/[0.03]">
                        <h4 className="text-[10px] font-mono text-white/25 uppercase tracking-[0.15em] mb-1.5 font-semibold">Challenge</h4>
                        <p className="text-sm text-white/40 font-light leading-relaxed">{study.problem}</p>
                      </div>
                      <div className="p-4 rounded-xl border"
                        style={{ background: `${color}03`, borderColor: `${color}08` }}>
                        <h4 className="text-[10px] font-mono uppercase tracking-[0.15em] mb-1.5 font-semibold"
                          style={{ color: `${color}70` }}>Solution</h4>
                        <p className="text-sm text-white/50 font-light leading-relaxed">{study.solution}</p>
                      </div>
                    </div>
                  </div>

                  <div className="px-7 sm:px-8 py-5 border-t border-white/[0.03] relative z-10"
                    style={{ background: `${color}04` }}>
                    <h4 className="text-[10px] font-mono uppercase tracking-[0.15em] mb-3 font-semibold flex items-center gap-2"
                      style={{ color: `${color}80` }}>
                      <ArrowRight className="w-3 h-3" /> Impact
                    </h4>
                    <ul className="space-y-1.5">
                      {study.results.map((result, i) => (
                        <li key={i} className="text-sm text-white/45 flex items-start font-light leading-relaxed">
                          <span className="mr-2 mt-0.5 text-[10px]" style={{ color: `${color}60` }}>◆</span>
                          <span>{result}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
