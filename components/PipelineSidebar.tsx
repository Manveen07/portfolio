"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Boxes, Briefcase, FolderGit2, Layers, Compass, User, Activity } from "lucide-react";

const sections = [
    { id: "hero", label: "INIT", icon: Activity },
    { id: "about", label: "SYS", icon: User },
    { id: "metrics", label: "KPI", icon: Boxes },
    { id: "experience", label: "LOG", icon: Briefcase },
    { id: "skills", label: "STK", icon: Layers },
    { id: "case-studies", label: "OPS", icon: FolderGit2 },
    { id: "vision", label: "MAP", icon: Compass },
];

export default function PipelineSidebar() {
    const [activeSection, setActiveSection] = useState("hero");

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                // Find the most visible section
                let maxRatio = 0;
                let maxId = activeSection;
                entries.forEach((entry) => {
                    if (entry.intersectionRatio > maxRatio) {
                        maxRatio = entry.intersectionRatio;
                        maxId = entry.target.id || "hero";
                    }
                });
                if (maxRatio > 0.15) {
                    setActiveSection(maxId);
                }
            },
            {
                threshold: [0, 0.15, 0.3, 0.5, 0.7, 1],
                rootMargin: "-80px 0px -20% 0px",
            }
        );

        // Observe hero as the main page wrapper
        const heroEl = document.querySelector("section:first-of-type");
        if (heroEl) {
            heroEl.id = heroEl.id || "hero";
            observer.observe(heroEl);
        }

        sections.slice(1).forEach((section) => {
            const el = document.getElementById(section.id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [activeSection]);

    const activeIndex = sections.findIndex((s) => s.id === activeSection);

    return (
        <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-0">
            {sections.map((section, index) => {
                const Icon = section.icon;
                const isActive = section.id === activeSection;
                const isPast = index < activeIndex;

                return (
                    <div key={section.id} className="flex flex-col items-center">
                        {/* Connector line (above node) */}
                        {index > 0 && (
                            <div
                                className="w-px h-6 transition-colors duration-500"
                                style={{
                                    background: isPast || isActive
                                        ? "linear-gradient(to bottom, #00e5ff, #00e5ff80)"
                                        : "rgba(255,255,255,0.06)",
                                }}
                            />
                        )}

                        {/* Node */}
                        <a
                            href={`#${section.id}`}
                            className="group relative flex items-center"
                            title={section.label}
                        >
                            <motion.div
                                className="relative z-10 flex items-center justify-center transition-all duration-300"
                                style={{
                                    width: isActive ? 36 : 28,
                                    height: isActive ? 36 : 28,
                                }}
                            >
                                {/* Background */}
                                <div
                                    className="absolute inset-0 rounded-lg transition-all duration-500"
                                    style={{
                                        background: isActive
                                            ? "rgba(0, 229, 255, 0.12)"
                                            : isPast
                                                ? "rgba(0, 229, 255, 0.05)"
                                                : "rgba(255, 255, 255, 0.02)",
                                        border: `1px solid ${isActive
                                                ? "rgba(0, 229, 255, 0.4)"
                                                : isPast
                                                    ? "rgba(0, 229, 255, 0.1)"
                                                    : "rgba(255, 255, 255, 0.06)"
                                            }`,
                                        boxShadow: isActive
                                            ? "0 0 20px rgba(0, 229, 255, 0.15)"
                                            : "none",
                                    }}
                                />
                                <Icon
                                    className="relative z-10 transition-colors duration-300"
                                    style={{
                                        width: isActive ? 16 : 12,
                                        height: isActive ? 16 : 12,
                                        color: isActive
                                            ? "#00e5ff"
                                            : isPast
                                                ? "rgba(0, 229, 255, 0.5)"
                                                : "rgba(255, 255, 255, 0.2)",
                                    }}
                                />
                            </motion.div>

                            {/* Label tooltip */}
                            <div
                                className="absolute left-full ml-3 px-2.5 py-1 rounded-md text-[10px] font-mono tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                                style={{
                                    background: "rgba(13, 18, 32, 0.95)",
                                    border: "1px solid rgba(0, 229, 255, 0.1)",
                                    color: isActive ? "#00e5ff" : "#64748b",
                                }}
                            >
                                {section.label}
                            </div>
                        </a>
                    </div>
                );
            })}
        </div>
    );
}
