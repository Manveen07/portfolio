"use client";

import { useState, useEffect, useRef } from 'react';
import { Terminal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [output, setOutput] = useState<{ text: string, type: 'info' | 'success' | 'warning' | 'error' }[]>([
        { text: 'ManveenOS v2.4.1 — Mission Control active.', type: 'info' },
        { text: 'Type "help" for available commands.', type: 'info' }
    ]);
    const inputRef = useRef<HTMLInputElement>(null);
    const outputEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => { if (isOpen && inputRef.current) inputRef.current.focus(); }, [isOpen]);
    useEffect(() => { outputEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [output]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'm') { e.preventDefault(); setIsOpen(prev => !prev); }
            if (e.key === 'Escape' && isOpen) setIsOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    const handleCommand = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const cmd = input.trim().toLowerCase();
        let text = '';
        let type: 'info' | 'success' | 'warning' | 'error' = 'info';

        switch (cmd) {
            case 'help':
                text = 'Commands: brew coffee, restart agent, fix mcp, run prod, ship it, whoami, clear';
                break;
            case 'brew coffee':
                text = '[SYS] Caffeine module loaded. Administering 150mg. Productivity boost: imminent.';
                type = 'success';
                break;
            case 'restart agent':
                text = 'Re-aligning sub-agents... ego.dll reduced successfully. Context window: cleared.';
                type = 'warning';
                break;
            case 'fix mcp':
                text = 'Reconnecting MCP... [FAILED] — Have you tried rewriting it in Python? That usually works.';
                type = 'error';
                break;
            case 'run prod':
                text = '[WARN] Test suite not found. Deploying anyway. YOLO mode: engaged.';
                type = 'warning';
                break;
            case 'ship it':
                text = '[OK] Pipeline deployed. If it breaks, blame the intern. (There is no intern.)';
                type = 'success';
                document.body.style.filter = 'hue-rotate(90deg)';
                setTimeout(() => document.body.style.filter = '', 1000);
                break;
            case 'whoami':
                text = 'Manveen Singh — AI/ML Engineer, Automation Architect, Professional Coffee Consumer.';
                type = 'info';
                break;
            case 'clear':
                setOutput([]); setInput(''); return;
            case 'sudo rm -rf /':
                text = 'Nice try. My automation defenses have been active since 2021.';
                type = 'error';
                break;
            default:
                text = `Command not found: ${input}. Type "help" for available commands.`;
                type = 'error';
        }

        setOutput(prev => [...prev, { text: `> ${input}`, type: 'info' }, { text, type }]);
        setInput('');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    onClick={() => setIsOpen(false)}
                >
                    <motion.div
                        initial={{ scale: 0.95, y: 15 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 15 }}
                        className="w-full max-w-2xl overflow-hidden rounded-2xl flex flex-col"
                        style={{
                            background: '#060a14',
                            border: '1px solid rgba(0, 229, 255, 0.12)',
                            boxShadow: '0 0 60px rgba(0, 229, 255, 0.06)',
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.04] bg-white/[0.01]">
                            <div className="flex items-center gap-2 text-[#00e5ff]">
                                <Terminal className="w-4 h-4" />
                                <span className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase">Engineer Mode</span>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-white/20 hover:text-white transition-colors p-1 rounded hover:bg-white/[0.04]">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="h-64 md:h-80 overflow-y-auto p-4 font-mono text-sm space-y-2">
                            {output.map((line, i) => (
                                <div key={i} className={
                                    line.type === 'success' ? 'text-[#00e5ff]' :
                                        line.type === 'warning' ? 'text-[#ffb800]' :
                                            line.type === 'error' ? 'text-rose-400' :
                                                'text-white/35'
                                }>{line.text}</div>
                            ))}
                            <div ref={outputEndRef} />
                        </div>

                        <form onSubmit={handleCommand} className="border-t border-white/[0.04] bg-[#050910] p-2 flex items-center">
                            <span className="text-[#00e5ff] font-mono font-bold px-3">{'>'}</span>
                            <input ref={inputRef} type="text" value={input} onChange={e => setInput(e.target.value)}
                                className="flex-1 bg-transparent border-none outline-none text-white/70 font-mono text-sm py-2 px-1 placeholder:text-white/10"
                                placeholder="Enter command..." autoComplete="off" spellCheck="false" />
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
