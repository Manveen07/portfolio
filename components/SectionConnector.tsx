"use client";

/**
 * Circuit board connector between sections.
 * Renders animated circuit traces with data packets flowing through.
 */
export default function SectionConnector({ variant = "default" }: { variant?: "default" | "glow" }) {
  const isGlow = variant === "glow";

  return (
    <div className="flex flex-col items-center py-1 relative" aria-hidden="true">
      <svg
        width="120"
        height="140"
        viewBox="0 0 120 140"
        fill="none"
        className="overflow-visible"
      >
        {/* Main vertical trace */}
        <line
          x1="60" y1="0" x2="60" y2="140"
          stroke={isGlow ? "url(#traceGradGlow)" : "url(#traceGrad)"}
          strokeWidth="1"
        />

        {/* Left branch trace */}
        <path
          d="M60 35 L60 40 L30 40 L30 55"
          stroke="rgba(0,229,255,0.12)"
          strokeWidth="1"
          fill="none"
        />
        {/* Left branch node */}
        <circle cx="30" cy="55" r="2.5" fill="rgba(0,229,255,0.25)">
          <animate attributeName="opacity" values="0.25;0.7;0.25" dur="3s" repeatCount="indefinite" />
        </circle>

        {/* Right branch trace */}
        <path
          d="M60 85 L60 90 L90 90 L90 105"
          stroke={isGlow ? "rgba(139,92,246,0.15)" : "rgba(0,229,255,0.1)"}
          strokeWidth="1"
          fill="none"
        />
        {/* Right branch node */}
        <circle cx="90" cy="105" r="2.5" fill={isGlow ? "rgba(139,92,246,0.3)" : "rgba(0,229,255,0.2)"}>
          <animate attributeName="opacity" values="0.2;0.6;0.2" dur="3.5s" repeatCount="indefinite" begin="1s" />
        </circle>

        {/* Top junction node */}
        <circle cx="60" cy="10" r="3" fill="rgba(0,229,255,0.35)">
          <animate attributeName="r" values="3;4;3" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.35;0.7;0.35" dur="2.5s" repeatCount="indefinite" />
        </circle>

        {/* Center junction node */}
        <circle cx="60" cy="70" r="4" fill="rgba(0,255,136,0.3)">
          <animate attributeName="r" values="3.5;5;3.5" dur="3s" repeatCount="indefinite" begin="0.5s" />
          <animate attributeName="opacity" values="0.3;0.65;0.3" dur="3s" repeatCount="indefinite" begin="0.5s" />
        </circle>
        {/* Center glow ring */}
        <circle cx="60" cy="70" r="8" stroke="rgba(0,255,136,0.1)" strokeWidth="1" fill="none">
          <animate attributeName="r" values="6;12;6" dur="3s" repeatCount="indefinite" begin="0.5s" />
          <animate attributeName="opacity" values="0.15;0;0.15" dur="3s" repeatCount="indefinite" begin="0.5s" />
        </circle>

        {/* Bottom junction node */}
        <circle cx="60" cy="130" r="3" fill="rgba(0,229,255,0.25)">
          <animate attributeName="opacity" values="0.25;0.6;0.25" dur="2.8s" repeatCount="indefinite" begin="1.2s" />
        </circle>

        {/* Data packet — flows down the main trace */}
        <circle r="2" fill="#00ff88">
          <animateMotion dur="2.5s" repeatCount="indefinite" path="M60,0 L60,140" />
          <animate attributeName="opacity" values="0;1;1;0" dur="2.5s" repeatCount="indefinite" />
        </circle>

        {/* Second data packet — staggered */}
        <circle r="1.5" fill="#00e5ff">
          <animateMotion dur="3.2s" repeatCount="indefinite" begin="1.5s" path="M60,0 L60,140" />
          <animate attributeName="opacity" values="0;0.8;0.8;0" dur="3.2s" repeatCount="indefinite" begin="1.5s" />
        </circle>

        {/* Gradients */}
        <defs>
          <linearGradient id="traceGrad" x1="60" y1="0" x2="60" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="rgba(0,229,255,0.08)" />
            <stop offset="30%" stopColor="rgba(0,255,136,0.15)" />
            <stop offset="70%" stopColor="rgba(0,255,136,0.15)" />
            <stop offset="100%" stopColor="rgba(0,229,255,0.08)" />
          </linearGradient>
          <linearGradient id="traceGradGlow" x1="60" y1="0" x2="60" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="rgba(0,229,255,0.12)" />
            <stop offset="30%" stopColor="rgba(139,92,246,0.18)" />
            <stop offset="70%" stopColor="rgba(0,255,136,0.18)" />
            <stop offset="100%" stopColor="rgba(0,229,255,0.12)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
