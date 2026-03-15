"use client";

import { motion } from "framer-motion";
import { Briefcase, Target, Rocket, Trophy, MapPin, Calendar, GraduationCap } from "lucide-react";
import { corpus } from "@/data/corpus";
import TextReveal from "@/components/TextReveal";

export default function Experience() {
  return (
    <section id="experience" className="py-24 sm:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <div className="section-tag mb-5 w-fit">
            <Briefcase className="w-3.5 h-3.5 text-[#00e5ff]" />
            <span>execution.log</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-3">
            Deployment <span className="text-gradient-cyan">History</span>
          </h2>
          <p className="text-white/35 font-light text-base sm:text-lg">
            <TextReveal>Where I've shipped systems and left things better than I found them.</TextReveal>
          </p>
          <div className="flex items-center gap-2 mt-4">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00ff88]" style={{ boxShadow: "0 0 6px #00ff88" }} />
            <span className="text-[10px] font-mono text-[#00ff88]/40 tracking-widest uppercase">pipeline active · {corpus.experience.length} deployments logged</span>
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Pipeline line */}
          <div className="absolute left-5 top-0 bottom-0 w-px hidden lg:block"
            style={{ background: "linear-gradient(to bottom, #00e5ff30, #00e5ff10, transparent)" }} />

          <div className="space-y-8">
            {corpus.experience.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Pipeline node */}
                <div className="absolute left-[14px] hidden lg:flex items-center justify-center" style={{ top: 28 }}>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#00e5ff] relative" style={{ boxShadow: "0 0 8px #00e5ff40" }}>
                    {index === 0 && (
                      <div className="absolute inset-0 rounded-full bg-[#00e5ff] animate-ping opacity-20" />
                    )}
                  </div>
                </div>

                <div className="lg:ml-14">
                  <div className="module-card rounded-2xl p-6 sm:p-8 relative overflow-hidden">
                    {/* Left accent */}
                    <div className="absolute top-0 left-0 w-[2px] h-full rounded-l-2xl"
                      style={{ background: "linear-gradient(to bottom, #00e5ff, #00e5ff40, transparent)" }} />

                    <div className="pl-4">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-5">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-0.5">{exp.role}</h3>
                          <p className="text-[#00e5ff]/70 font-medium">{exp.company}</p>
                          <div className="flex flex-wrap items-center gap-3 mt-2">
                            <span className="flex items-center text-[11px] font-mono text-white/25 tracking-wider">
                              <MapPin className="w-3 h-3 mr-1.5" />{exp.location}
                            </span>
                            <span className="flex items-center text-[11px] font-mono text-white/25 tracking-wider">
                              <Calendar className="w-3 h-3 mr-1.5" />{exp.date}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Mission / Execution / Impact */}
                      <div className="space-y-5">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="w-3.5 h-3.5 text-[#00e5ff]" />
                            <h4 className="text-[11px] font-mono text-[#00e5ff] uppercase tracking-[0.15em] font-semibold">Mission</h4>
                          </div>
                          <p className="text-white/40 text-sm ml-6 leading-relaxed font-light">{exp.mission}</p>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Rocket className="w-3.5 h-3.5 text-[#a78bfa]" />
                            <h4 className="text-[11px] font-mono text-[#a78bfa] uppercase tracking-[0.15em] font-semibold">Execution</h4>
                          </div>
                          <ul className="space-y-1.5 ml-6">
                            {exp.execution.map((item, i) => (
                              <li key={i} className="text-sm text-white/40 flex items-start leading-relaxed font-light">
                                <span className="text-[#a78bfa]/50 mr-2.5 mt-0.5 text-xs">▸</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Trophy className="w-3.5 h-3.5 text-[#ffb800]" />
                            <h4 className="text-[11px] font-mono text-[#ffb800] uppercase tracking-[0.15em] font-semibold">Impact</h4>
                          </div>
                          <ul className="space-y-1.5 ml-6">
                            {exp.impact.map((item, i) => (
                              <li key={i} className="text-sm text-white/50 flex items-start leading-relaxed">
                                <span className="text-[#ffb800]/50 mr-2.5 mt-0.5 text-xs">✓</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Education */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-14 max-w-4xl mx-auto"
        >
          <div className="section-tag mb-5 w-fit">
            <GraduationCap className="w-3.5 h-3.5 text-[#00e5ff]" />
            <span>credentials</span>
          </div>
          <div className="module-card rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h4 className="text-lg font-semibold text-white">{corpus.education.degree}</h4>
              <p className="text-white/40">{corpus.education.institution}</p>
              <p className="text-[11px] text-white/20 font-mono mt-1 tracking-wider">{corpus.education.duration}</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-gradient-cyan">GPA {corpus.education.gpa}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}