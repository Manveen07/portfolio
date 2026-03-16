"use client";

import { motion } from "framer-motion";
import { Rocket, Target, Zap, Compass } from "lucide-react";
import { corpus } from "@/data/corpus";
import TextReveal from "@/components/TextReveal";

export default function FutureVision() {
    return (
        <section id="vision" className="py-24 sm:py-32 relative overflow-hidden">
            {/* Ambient glow — upgraded aurora orbs */}
            <div className="absolute w-[600px] h-[600px] top-[5%] -right-[220px] rounded-full aurora-orb-2"
              style={{ background: "radial-gradient(circle, rgba(139,92,246,0.09) 0%, transparent 70%)", filter: "blur(100px)" }} />
            <div className="absolute w-[380px] h-[380px] bottom-[15%] -left-[120px] rounded-full aurora-orb-1"
              style={{ background: "radial-gradient(circle, rgba(0,229,255,0.07) 0%, transparent 70%)", filter: "blur(80px)" }} />
            <div className="absolute w-[280px] h-[280px] top-[40%] left-[40%] rounded-full aurora-orb-5"
              style={{ background: "radial-gradient(circle, rgba(255,184,0,0.04) 0%, transparent 70%)", filter: "blur(90px)" }} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    viewport={{ once: true, margin: "-80px" }}
                    className="mb-14"
                >
                    <div className="section-tag mb-5 w-fit">
                        <Compass className="w-3.5 h-3.5 text-[#a78bfa]" />
                        <span>roadmap.next</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-3">
                        What&apos;s <span className="text-gradient-cyan">Next</span>
                    </h2>
                    <p className="text-white/35 font-light text-base sm:text-lg">
                        <TextReveal>The trajectory I'm optimizing for.</TextReveal>
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-6 max-w-5xl">
                    {/* Build */}
                    <motion.div
                        initial={{ opacity: 0, x: -15 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                        viewport={{ once: true }}
                        className="module-card rounded-2xl p-8 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #00e5ff30, transparent)" }} />

                        <div className="flex items-center gap-3 mb-7">
                            <div className="p-3 rounded-xl bg-[#00e5ff]/[0.06] border border-[#00e5ff]/[0.1]">
                                <Rocket className="w-6 h-6 text-[#00e5ff]" />
                            </div>
                            <h3 className="text-xl font-bold text-white">What I Build</h3>
                        </div>

                        <ul className="space-y-3">
                            {corpus.futureVision.build.map((item, i) => (
                                <li key={i} className="flex items-start p-4 rounded-xl bg-white/[0.015] border border-white/[0.03] group-hover:border-white/[0.06] transition-colors">
                                    <Zap className="w-3.5 h-3.5 text-[#00e5ff]/60 mr-3 mt-0.5 flex-shrink-0" />
                                    <span className="text-white/45 text-sm font-light leading-relaxed">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Become */}
                    <motion.div
                        initial={{ opacity: 0, x: 15 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        viewport={{ once: true }}
                        className="module-card rounded-2xl p-8 flex flex-col justify-center items-center text-center relative overflow-hidden group"
                    >
                        {/* Background radial */}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(167,139,250,0.04)_0%,transparent_70%)]" />

                        <div className="p-4 rounded-2xl bg-[#a78bfa]/[0.06] border border-[#a78bfa]/[0.12] mb-8 relative z-10">
                            <Target className="w-8 h-8 text-[#a78bfa]" />
                        </div>

                        <h3 className="text-[11px] font-mono text-[#a78bfa]/60 uppercase tracking-[0.2em] mb-6 relative z-10">
                            The End State
                        </h3>

                        <div className="relative z-10 px-4">
                            <span className="text-4xl text-[#a78bfa]/10 absolute -top-4 -left-2 font-serif select-none">&ldquo;</span>
                            <p className="text-2xl sm:text-3xl font-extrabold leading-snug text-white">
                                {corpus.futureVision.become}
                            </p>
                            <span className="text-4xl text-[#a78bfa]/10 absolute -bottom-8 -right-2 font-serif select-none">&rdquo;</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
