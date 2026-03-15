"use client";

import { motion } from "framer-motion";
import { Code2, Brain, Database, Cog, Server, Wrench, Layers } from "lucide-react";
import { corpus } from "@/data/corpus";
import TextReveal from "@/components/TextReveal";

export default function Skills() {
  const categories = [
    { title: "Core Languages", icon: Code2, skills: corpus.skills.coreLanguages, color: "#00e5ff" },
    { title: "Frameworks", icon: Wrench, skills: corpus.skills.frameworks, color: "#a78bfa" },
    { title: "AI & ML", icon: Brain, skills: corpus.skills.aiAndMl, color: "#00e5ff" },
    { title: "Data & Libraries", icon: Database, skills: corpus.skills.dataAndLibraries, color: "#ffb800" },
    { title: "Automation & DB", icon: Cog, skills: corpus.skills.automationAndDatabases, color: "#34d399" },
    { title: "Tools", icon: Server, skills: corpus.skills.tools, color: "#a78bfa" },
  ];

  return (
    <section id="skills" className="py-24 sm:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-14"
        >
          <div className="section-tag mb-5 w-fit">
            <Layers className="w-3.5 h-3.5 text-[#00e5ff]" />
            <span>stack.dependencies</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-3">
            Technical <span className="text-gradient-cyan">Stack</span>
          </h2>
          <p className="text-white/35 font-light text-base sm:text-lg">
            <TextReveal>The tools I use to automate everything that moves.</TextReveal>
          </p>
          <div className="flex items-center gap-3 mt-4">
            <span className="text-[9px] font-mono text-white/15 tracking-widest">{categories.reduce((acc, c) => acc + c.skills.length, 0)} MODULES LOADED</span>
            <div className="h-3 w-px bg-white/[0.06]" />
            <span className="text-[9px] font-mono text-[#00e5ff]/25 tracking-widest">ALL DEPENDENCIES RESOLVED</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                viewport={{ once: true }}
                className="module-card rounded-2xl p-6 group flex flex-col relative overflow-hidden"
              >
                {/* Top accent */}
                <div className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${cat.color}30, transparent)` }} />

                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 rounded-lg transition-all duration-300"
                    style={{ background: `${cat.color}06`, border: `1px solid ${cat.color}10` }}>
                    <Icon className="w-4 h-4" style={{ color: `${cat.color}80` }} />
                  </div>
                  <h3 className="text-[11px] font-mono uppercase tracking-[0.12em] font-semibold text-white/60">
                    {cat.title}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2 mt-auto">
                  {cat.skills.map((skill, si) => (
                    <motion.span
                      key={si}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: index * 0.04 + si * 0.02 }}
                      viewport={{ once: true }}
                      className="tech-chip"
                      style={{
                        // @ts-ignore
                        '--hover-color': cat.color,
                      }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Architecture panel */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          viewport={{ once: true }}
          className="mt-8"
        >
          <div className="module-card rounded-2xl p-8 md:p-10" style={{ borderColor: "rgba(167,139,250,0.12)" }}>
            <div className="flex items-center justify-center gap-3 mb-8">
              <Brain className="w-5 h-5 text-[#a78bfa]" />
              <h3 className="text-[11px] font-mono text-white/40 uppercase tracking-[0.2em] font-bold">
                Model Architecture & Intelligence
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-white/[0.04]">
              {[
                { label: "Model Architecture", items: "Transformer Models, Multi-Head Attention, Feedforward Neural Networks", color: "#00e5ff" },
                { label: "Computer Vision", items: "Vision Transformers, MediaPipe, OpenCV, Real-time Processing", color: "#a78bfa" },
                { label: "NLP & Gen AI", items: "LLM Integration, Prompt Engineering, Embeddings, Vector Search", color: "#ffb800" },
              ].map((item, i) => (
                <div key={i} className="py-6 md:py-0 px-4 first:pt-0 last:pb-0">
                  <h4 className="font-mono text-[11px] uppercase tracking-[0.12em] font-semibold mb-3" style={{ color: item.color }}>
                    {item.label}
                  </h4>
                  <p className="text-sm text-white/30 font-light leading-relaxed">{item.items}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}