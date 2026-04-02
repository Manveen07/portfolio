"use client";

import { motion } from "framer-motion";
import { Mail, Calendar, ArrowRight, Send } from "lucide-react";
import { corpus } from "@/data/corpus";

export default function Contact() {
  return (
    <section id="contact" className="py-24 sm:py-32 relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="absolute w-[500px] h-[500px] top-[10%] -left-[200px] rounded-full aurora-orb-2 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,255,136,0.06) 0%, transparent 70%)", filter: "blur(100px)" }} />
      <div className="absolute w-[400px] h-[400px] bottom-[10%] -right-[150px] rounded-full aurora-orb-1 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,229,255,0.05) 0%, transparent 70%)", filter: "blur(100px)" }} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-80px" }}
          className="text-center mb-14"
        >
          <div className="section-tag mb-5 w-fit mx-auto">
            <Send className="w-3.5 h-3.5 text-[#00ff88]" />
            <span>initiate.connection</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
            Let&apos;s Build <span className="text-gradient-cyan">Something</span>
          </h2>
          <p className="text-white/30 text-base sm:text-lg font-light max-w-lg mx-auto">
            Got a workflow that needs automating or a system that needs building? Let&apos;s talk.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-60px" }}
          className="grid sm:grid-cols-2 gap-6"
        >
          {/* Email card */}
          <a
            href={`mailto:${corpus.personal.email}?subject=${encodeURIComponent(corpus.contact.emailSubject)}`}
            className="group module-card rounded-2xl p-8 flex flex-col items-center text-center hover:border-[#00e5ff]/25 transition-all duration-500"
          >
            <div className="p-4 rounded-2xl bg-[#00e5ff]/[0.06] border border-[#00e5ff]/[0.12] mb-6 group-hover:bg-[#00e5ff]/[0.1] group-hover:border-[#00e5ff]/[0.25] group-hover:shadow-[0_0_24px_rgba(0,229,255,0.12)] transition-all duration-500">
              <Mail className="w-7 h-7 text-[#00e5ff]" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Send an Email</h3>
            <p className="text-white/25 text-sm font-light mb-5">For projects, collaborations, or just to say hey.</p>
            <span className="text-[12px] font-mono text-[#00e5ff]/50 tracking-wider group-hover:text-[#00e5ff] transition-colors flex items-center gap-2">
              {corpus.personal.email}
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </span>
          </a>

          {/* Calendly card */}
          <a
            href={corpus.contact.calendlyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group module-card rounded-2xl p-8 flex flex-col items-center text-center hover:border-[#00ff88]/25 transition-all duration-500"
          >
            <div className="p-4 rounded-2xl bg-[#00ff88]/[0.06] border border-[#00ff88]/[0.12] mb-6 group-hover:bg-[#00ff88]/[0.1] group-hover:border-[#00ff88]/[0.25] group-hover:shadow-[0_0_24px_rgba(0,255,136,0.12)] transition-all duration-500">
              <Calendar className="w-7 h-7 text-[#00ff88]" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Schedule a Call</h3>
            <p className="text-white/25 text-sm font-light mb-5">30-min pipeline audit. No fluff, just systems.</p>
            <span className="text-[12px] font-mono text-[#00ff88]/50 tracking-wider group-hover:text-[#00ff88] transition-colors flex items-center gap-2">
              Book on Calendly
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </span>
          </a>
        </motion.div>

        {/* Availability badge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <span className="inline-flex items-center gap-2 text-[11px] font-mono text-white/20 tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88]" style={{ boxShadow: "0 0 6px #00ff88" }} />
            {corpus.contact.availability}
          </span>
        </motion.div>
      </div>
    </section>
  );
}
