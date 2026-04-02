import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 relative">
      {/* Ambient glow */}
      <div className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 70%)", filter: "blur(100px)" }} />

      <div className="relative z-10 text-center">
        {/* Error code */}
        <div className="text-[120px] sm:text-[160px] font-black text-white/[0.03] leading-none select-none">
          404
        </div>

        {/* Terminal message */}
        <div className="code-surface rounded-xl p-6 max-w-md mx-auto -mt-10 mb-8">
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/[0.04]">
            <div className="w-2 h-2 rounded-full bg-[#ff5f56]/60" />
            <div className="w-2 h-2 rounded-full bg-[#ffbd2e]/60" />
            <div className="w-2 h-2 rounded-full bg-[#27c93f]/60" />
            <span className="ml-2 text-[10px] text-white/20 font-mono tracking-wider">error.log</span>
          </div>
          <pre className="text-sm font-mono text-left">
            <span className="text-[#00ff88]/50">$</span> <span className="text-white/40">locate page</span>{"\n"}
            <span className="text-[#ff5f56]/70">ERROR</span> <span className="text-white/30">Route not found in pipeline.</span>{"\n"}
            <span className="text-white/20">The requested resource has been</span>{"\n"}
            <span className="text-white/20">decommissioned or never existed.</span>{"\n\n"}
            <span className="text-[#ffb800]/50">hint:</span> <span className="text-white/25">try navigating back to /</span>
          </pre>
        </div>

        {/* CTA */}
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 px-6 py-3 text-[12px] font-mono tracking-widest uppercase font-bold text-[#040810] bg-[#00ff88] rounded-xl hover:shadow-[0_0_28px_rgba(0,255,136,0.35)] transition-all duration-300"
        >
          Return to Base
        </Link>

        <p className="text-[11px] font-mono text-white/15 mt-6 tracking-wider">
          sys.status: pipeline rerouted
        </p>
      </div>
    </div>
  );
}
