"use client";

import { motion } from "framer-motion";
import { Terminal, Cpu, GitBranch, Zap, Target, Crosshair, Sparkles, Boxes, User } from "lucide-react";
import { corpus } from "@/data/corpus";
import TextReveal from "@/components/TextReveal";

export default function About() {
  const features = [
    { icon: Terminal, label: "Automation First", desc: "Every manual task is a bug" },
    { icon: Cpu, label: "Systems Thinking", desc: "Architecture > scripts" },
    { icon: GitBranch, label: "Scalable Impact", desc: "Build once, run forever" },
    { icon: Zap, label: "AI-Native", desc: "LLMs as primitives" },
  ];

  return (
    <section id="about" className="py-24 sm:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-14"
        >
          <div className="section-tag mb-5 w-fit">
            <User className="w-3.5 h-3.5 text-[#00e5ff]" />
            <span>system.operator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-3">
            About the <span className="text-gradient-cyan">Engineer</span>
          </h2>
          <p className="text-white/35 text-base sm:text-lg font-light max-w-xl">
            <TextReveal>Building the infrastructure for autonomous operations.</TextReveal>
          </p>
          <div className="flex items-center gap-2 mt-4">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00e5ff]" style={{ boxShadow: "0 0 6px #00e5ff" }} />
            <span className="text-[10px] font-mono text-[#00e5ff]/30 tracking-widest uppercase">sys.profile loaded</span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left — pitch + code block */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, margin: "-50px" }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Pitch panel */}
            <div className="module-card rounded-2xl p-7 group">
              <p className="text-[15px] text-white/70 leading-[1.8] font-light">
                {corpus.about.pitch}
              </p>
              <div className="h-px w-full bg-gradient-to-r from-[#00e5ff]/10 to-transparent my-5" />
              <p className="text-sm text-[#ffb800]/50 font-mono italic">
                &quot;{corpus.about.flavor}&quot;
              </p>
            </div>

            {/* Code block — engineer.py */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-br from-[#00e5ff]/10 via-transparent to-[#7c3aed]/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative code-surface rounded-xl p-5 overflow-x-auto">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/[0.04]">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/60" />
                  <span className="ml-2 text-[10px] text-white/20 font-mono tracking-wider">engineer.py</span>
                </div>
                <pre className="text-[13px] font-mono leading-[1.7] whitespace-pre overflow-x-auto">
                  <code>
                    <span className="text-[#c678dd]">class</span> <span className="text-[#00e5ff]">Manveen</span>:{"\n"}
                    {"    "}role = <span className="text-[#ffb800]">&quot;AI/ML Engineer&quot;</span>{"\n"}
                    {"    "}focus = [{"\n"}
                    {"        "}<span className="text-[#ffb800]">&quot;Multi-agent systems&quot;</span>,{"\n"}
                    {"        "}<span className="text-[#ffb800]">&quot;Automation&quot;</span>,{"\n"}
                    {"        "}<span className="text-[#ffb800]">&quot;Production tooling&quot;</span>{"\n"}
                    {"    "}]{"\n"}
                    {"    "}hates = [{"\n"}
                    {"        "}<span className="text-[#ffb800]">&quot;manual workflows&quot;</span>,{"\n"}
                    {"        "}<span className="text-[#ffb800]">&quot;unclear logs&quot;</span>{"\n"}
                    {"    "}]{"\n"}
                    {"\n"}
                    {"    "}<span className="text-[#c678dd]">def</span> <span className="text-[#00e5ff]">philosophy</span>(self):{"\n"}
                    {"        "}<span className="text-[#c678dd]">return</span> <span className="text-[#ffb800]">&quot;If it breaks twice, automate it.&quot;</span>{"\n"}
                    {"\n"}
                    {"    "}<span className="text-[#c678dd]">def</span> <span className="text-[#00e5ff]">status</span>(self):{"\n"}
                    {"        "}<span className="text-[#c678dd]">return</span> <span className="text-[#ffb800]">&quot;Building. Always building.&quot;</span>{"\n"}
                  </code>
                </pre>
              </div>
            </div>
          </motion.div>

          {/* Right — trajectory + features + stack */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, margin: "-50px" }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Trajectory */}
            <div className="module-card rounded-2xl p-7">
              <h3 className="text-[11px] font-mono text-[#00e5ff]/60 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Target className="w-3.5 h-3.5" /> Current Trajectory
              </h3>
              <div className="space-y-5">
                {[
                  { icon: Crosshair, title: "GTM Automation", desc: "Lead discovery & data enrichment execution pipelines.", color: "#00e5ff" },
                  { icon: Sparkles, title: "Autonomous Agents", desc: "Self-correcting workflow orchestration systems.", color: "#a78bfa" },
                  { icon: Cpu, title: "Quant Engineering", desc: "Standard logic → algorithmic infrastructure.", color: "#ffb800" },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-start gap-4 group/item">
                      <div className="p-2 rounded-lg mt-0.5 transition-all duration-300"
                        style={{ background: `${item.color}08`, border: `1px solid ${item.color}15` }}>
                        <Icon className="w-4 h-4" style={{ color: item.color }} />
                      </div>
                      <div>
                        <span className="text-white text-sm font-semibold tracking-wide">{item.title}</span>
                        <p className="text-white/35 text-sm mt-0.5 font-light">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Feature cards — 2x2 grid */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div key={i} className="module-card rounded-xl p-5 group">
                    <Icon className="w-4.5 h-4.5 text-white/20 group-hover:text-[#00e5ff] mb-3 transition-colors duration-300" style={{ width: 18, height: 18 }} />
                    <h4 className="text-white text-sm font-semibold mb-1">{f.label}</h4>
                    <p className="text-white/30 text-xs font-light">{f.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Specializations */}
            <div className="module-card rounded-2xl p-7">
              <h3 className="text-[11px] font-mono text-white/30 uppercase tracking-[0.2em] mb-4">Technical Arsenal</h3>
              <div className="flex flex-wrap gap-2">
                {corpus.about.specializations.map((spec, i) => (
                  <span key={i} className="tech-chip">{spec}</span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}