<div align="center">

# ⚡ Manveen Singh — Portfolio

**Automation-themed developer portfolio built with Next.js 16, Framer Motion & Tailwind CSS**

[![Live Site](https://img.shields.io/badge/🌐_Live-manveen.vercel.app-00e5ff?style=for-the-badge&labelColor=080c16)](https://manveen.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

<br />

<img src="https://raw.githubusercontent.com/Manveen07/portfolio/master/public/og-image.png" alt="Portfolio Preview" width="800" />

</div>

---

## 🧬 Overview

A high-performance, automation-themed personal portfolio showcasing AI/ML engineering work, case studies, and technical capabilities. Designed with a **circuit board / neural network** aesthetic — every element reflects the automation-first philosophy.

### ✨ Signature Features

| Feature | Description |
|---|---|
| 🧠 **Neural Net Particle Canvas** | Interactive canvas with nodes, connections & mouse-reactive particles |
| ⌨️ **Typewriter Terminal** | Character-by-character status messages in the hero terminal |
| 🔤 **Glitch Text Effect** | CSS-powered glitch animation on key text elements |
| 🧲 **Magnetic Buttons** | Spring-physics buttons that attract toward cursor on hover |
| 🔦 **Cursor Glow** | Ambient cyan/green radial glow that follows the mouse |
| 📜 **Scroll Progress Bar** | Gradient progress indicator synced to page scroll |
| 🚀 **Boot Sequence** | Animated loading screen with phased system initialization |
| 🔡 **Word-by-Word Text Reveal** | Blur-fade text animation triggered on scroll into view |
| 🌊 **Parallax Depth** | Scroll-linked parallax on aurora orbs and hero content |
| 🔲 **Circuit Board Grid** | Subtle animated grid background with intersection nodes |
| 📡 **Section Connectors** | Animated circuit traces connecting page sections |
| 🎨 **Gradient Border Wrap** | Rotating gradient borders using CSS `@property` |

---

## 🏗️ Tech Stack

```
Framework       → Next.js 16 (App Router)
UI              → React 19 + TypeScript 5
Styling         → Tailwind CSS 3.4
Animations      → Framer Motion 12
Icons           → Lucide React
Deployment      → Vercel
```

---

## 📁 Project Structure

```
portfolio-site/
├── app/
│   ├── globals.css          # Design system — circuit board theme, animations
│   ├── layout.tsx           # Root layout with CursorGlow & LoadingScreen
│   └── page.tsx             # Main page composition
├── components/
│   ├── Hero.tsx             # Hero section with terminal, parallax, magnetic CTAs
│   ├── About.tsx            # About section with code block & trajectory
│   ├── Experience.tsx       # Work experience timeline
│   ├── CaseStudies.tsx      # Project case studies grid
│   ├── Skills.tsx           # Technical skills with animated bars
│   ├── FutureVision.tsx     # Future goals section
│   ├── Navbar.tsx           # Sticky navbar with scroll progress & active section
│   ├── Footer.tsx           # Footer with circuit trace decorations
│   ├── ParticleCanvas.tsx   # Neural network particle system (Canvas API)
│   ├── SectionConnector.tsx # Animated circuit connectors between sections
│   ├── LoadingScreen.tsx    # Boot sequence loading animation
│   ├── CursorGlow.tsx       # Mouse-following ambient glow
│   └── TextReveal.tsx       # Word-by-word scroll reveal component
├── data/
│   └── corpus.ts            # Centralized content & data source
├── lib/
│   └── utils.ts             # Utility functions (cn helper)
└── tailwind.config.ts       # Tailwind configuration with custom theme
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/Manveen07/portfolio.git
cd portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it locally.

### Build

```bash
npm run build
npm start
```

---

## 🎨 Design System

The portfolio uses a custom **automation-inspired** design language:

| Token | Value | Usage |
|---|---|---|
| `--cyan` | `#00e5ff` | Primary accent, links, highlights |
| `--green` | `#00ff88` | Success states, active indicators, CTAs |
| `--purple` | `#a78bfa` | Secondary accent, decorative elements |
| `--amber` | `#ffb800` | Warnings, code strings, flavor text |
| `--bg` | `#080c16` | Base background |

Key CSS classes: `module-card`, `tech-chip`, `section-tag`, `code-surface`, `glitch-text`, `gradient-border-wrap`

---

## 📬 Contact

- **Email**: manveen9650@gmail.com
- **LinkedIn**: [linkedin.com/in/Manveen](https://linkedin.com/in/Manveen)
- **GitHub**: [github.com/Manveen07](https://github.com/Manveen07)
- **Book a Call**: [calendly.com/manveen9650](https://calendly.com/manveen9650/30min)

---

<div align="center">

**Built with precision. Deployed with intent.**

</div>
