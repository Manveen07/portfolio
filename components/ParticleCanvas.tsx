"use client";

import { useRef, useEffect, useCallback } from "react";

/**
 * Neural-network-style particle canvas.
 * Nodes are loosely arranged in vertical layers.
 * Connections flow left→right with animated data packets.
 * Maintains free-floating particles for organic feel.
 */

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  color: [number, number, number]; // rgb
  layer: number; // 0-4 for neural net layers
  baseX: number; // home position for layer structure
  baseY: number;
}

interface DataPacket {
  fromIdx: number;
  toIdx: number;
  progress: number; // 0 → 1
  speed: number;
  color: [number, number, number];
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  angle: number;
  speed: number;
  opacity: number;
  life: number;
  maxLife: number;
}

const CYAN: [number, number, number] = [0, 229, 255];
const GREEN: [number, number, number] = [0, 255, 136];
const PURPLE: [number, number, number] = [139, 92, 246];
const AMBER: [number, number, number] = [255, 184, 0];

function pickColor(): [number, number, number] {
  const r = Math.random();
  if (r < 0.45) return CYAN;
  if (r < 0.7) return GREEN;
  if (r < 0.88) return PURPLE;
  return AMBER;
}

function rgba(c: [number, number, number], a: number) {
  return `rgba(${c[0]},${c[1]},${c[2]},${a})`;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const nodesRef = useRef<Node[]>([]);
  const packetsRef = useRef<DataPacket[]>([]);
  const starsRef = useRef<ShootingStar[]>([]);
  const animRef = useRef<number>(0);
  const starTimer = useRef(0);
  const packetTimer = useRef(0);

  const initNodes = useCallback((w: number, h: number) => {
    const layers = 5;
    const nodesPerLayer = Math.max(6, Math.min(Math.floor(h / 120), 12));
    const nodes: Node[] = [];

    // Structured neural-net nodes (loosely positioned in layers)
    for (let l = 0; l < layers; l++) {
      const layerX = (w / (layers + 1)) * (l + 1);
      for (let n = 0; n < nodesPerLayer; n++) {
        const layerY = (h / (nodesPerLayer + 1)) * (n + 1);
        nodes.push({
          x: layerX + (Math.random() - 0.5) * 60,
          y: layerY + (Math.random() - 0.5) * 40,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          radius: 1.2 + Math.random() * 1.0,
          opacity: 0.25 + Math.random() * 0.3,
          color: pickColor(),
          layer: l,
          baseX: layerX,
          baseY: layerY,
        });
      }
    }

    // Add some free-floating particles for organic feel
    const freeCount = Math.min(Math.floor((w * h) / 30000), 30);
    for (let i = 0; i < freeCount; i++) {
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: 0.5 + Math.random() * 1.0,
        opacity: 0.1 + Math.random() * 0.2,
        color: pickColor(),
        layer: -1, // free
        baseX: -1,
        baseY: -1,
      });
    }

    nodesRef.current = nodes;
    packetsRef.current = [];
  }, []);

  const spawnStar = useCallback((w: number, h: number) => {
    const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.5;
    const life = 70 + Math.random() * 50;
    starsRef.current.push({
      x: Math.random() * w * 0.6,
      y: Math.random() * h * 0.35,
      length: 80 + Math.random() * 100,
      angle,
      speed: 14 + Math.random() * 8,
      opacity: 0.85,
      life,
      maxLife: life,
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
      initNodes(window.innerWidth, window.innerHeight);
    };

    const handleMouse = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    const handleMouseLeave = () => { mouseRef.current = { x: -1000, y: -1000 }; };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouse);
    window.addEventListener("mouseleave", handleMouseLeave);

    const animate = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      const nodes = nodesRef.current;
      const mouse = mouseRef.current;
      const mouseDist = 200;

      // ── Update positions ──
      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;

        if (node.layer >= 0) {
          // Structured nodes: gently pulled back to base position
          node.vx += (node.baseX - node.x) * 0.001;
          node.vy += (node.baseY - node.y) * 0.001;
        } else {
          // Free nodes: bounce off edges
          if (node.x < 0 || node.x > w) node.vx *= -1;
          if (node.y < 0 || node.y > h) node.vy *= -1;
        }

        // Mouse interaction
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouseDist && dist > 0) {
          const force = (mouseDist - dist) / mouseDist * 0.006;
          node.vx += (dx / dist) * force;
          node.vy += (dy / dist) * force;
        }

        node.vx *= 0.992;
        node.vy *= 0.992;
      }

      // ── Draw inter-layer connections (neural net style) ──
      const layerNodes: Node[][] = [[], [], [], [], []];
      for (const n of nodes) {
        if (n.layer >= 0) layerNodes[n.layer].push(n);
      }

      for (let l = 0; l < 4; l++) {
        const from = layerNodes[l];
        const to = layerNodes[l + 1];
        for (const a of from) {
          for (const b of to) {
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 350) continue;

            const alpha = Math.max(0, (1 - dist / 350) * 0.06);

            const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
            grad.addColorStop(0, rgba(a.color, alpha));
            grad.addColorStop(1, rgba(b.color, alpha));

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // ── Draw free particle connections ──
      const freeNodes = nodes.filter(n => n.layer === -1);
      for (let i = 0; i < freeNodes.length; i++) {
        for (let j = i + 1; j < freeNodes.length; j++) {
          const dx = freeNodes[i].x - freeNodes[j].x;
          const dy = freeNodes[i].y - freeNodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            const alpha = (1 - dist / 140) * 0.08;
            ctx.beginPath();
            ctx.moveTo(freeNodes[i].x, freeNodes[i].y);
            ctx.lineTo(freeNodes[j].x, freeNodes[j].y);
            ctx.strokeStyle = rgba(freeNodes[i].color, alpha);
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // ── Draw nodes ──
      for (const node of nodes) {
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const near = dist < mouseDist;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * (near ? 2.2 : 1), 0, Math.PI * 2);
        ctx.fillStyle = rgba(node.color, near ? node.opacity + 0.35 : node.opacity * 0.7);
        ctx.fill();

        if (near) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius * 5, 0, Math.PI * 2);
          ctx.fillStyle = rgba(node.color, 0.04);
          ctx.fill();
        }
      }

      // ── Data packets flowing through the network ──
      packetTimer.current++;
      if (packetTimer.current > 30 + Math.random() * 20) {
        packetTimer.current = 0;
        // Pick a random connection between adjacent layers
        const srcLayer = Math.floor(Math.random() * 4);
        const from = layerNodes[srcLayer];
        const to = layerNodes[srcLayer + 1];
        if (from.length && to.length) {
          const fi = Math.floor(Math.random() * from.length);
          const ti = Math.floor(Math.random() * to.length);
          const fromGlobal = nodes.indexOf(from[fi]);
          const toGlobal = nodes.indexOf(to[ti]);
          if (fromGlobal >= 0 && toGlobal >= 0) {
            packetsRef.current.push({
              fromIdx: fromGlobal,
              toIdx: toGlobal,
              progress: 0,
              speed: 0.02 + Math.random() * 0.02,
              color: Math.random() > 0.5 ? GREEN : CYAN,
            });
          }
        }
      }

      // Draw and update packets
      for (let i = packetsRef.current.length - 1; i >= 0; i--) {
        const p = packetsRef.current[i];
        p.progress += p.speed;
        if (p.progress >= 1) {
          packetsRef.current.splice(i, 1);
          continue;
        }

        const fromN = nodes[p.fromIdx];
        const toN = nodes[p.toIdx];
        if (!fromN || !toN) { packetsRef.current.splice(i, 1); continue; }

        const px = lerp(fromN.x, toN.x, p.progress);
        const py = lerp(fromN.y, toN.y, p.progress);
        const packetAlpha = p.progress < 0.1 ? p.progress / 0.1 : p.progress > 0.9 ? (1 - p.progress) / 0.1 : 1;

        // Glow
        const grd = ctx.createRadialGradient(px, py, 0, px, py, 8);
        grd.addColorStop(0, rgba(p.color, 0.5 * packetAlpha));
        grd.addColorStop(1, rgba(p.color, 0));
        ctx.beginPath();
        ctx.arc(px, py, 8, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = rgba(p.color, 0.9 * packetAlpha);
        ctx.fill();
      }

      // ── Shooting stars ──
      starTimer.current++;
      if (starTimer.current > 350 + Math.random() * 250) {
        starTimer.current = 0;
        spawnStar(w, h);
      }

      for (let i = starsRef.current.length - 1; i >= 0; i--) {
        const s = starsRef.current[i];
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.life--;
        s.opacity = (s.life / s.maxLife) * 0.8;

        if (s.life <= 0 || s.x > w + 200 || s.y > h + 200) {
          starsRef.current.splice(i, 1);
          continue;
        }

        const tailX = s.x - Math.cos(s.angle) * s.length;
        const tailY = s.y - Math.sin(s.angle) * s.length;
        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0, `rgba(255,255,255,0)`);
        grad.addColorStop(0.7, rgba(GREEN, s.opacity * 0.5));
        grad.addColorStop(1, `rgba(255,255,255,${s.opacity})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.lineCap = "round";
        ctx.stroke();

        const hg = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 5);
        hg.addColorStop(0, `rgba(255,255,255,${s.opacity})`);
        hg.addColorStop(1, rgba(GREEN, 0));
        ctx.beginPath();
        ctx.arc(s.x, s.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = hg;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [initNodes, spawnStar]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}
