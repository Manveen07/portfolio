"use client";

/* Renders a Post body (Block[]) in the terminal aesthetic.
   Inline syntax: **bold**, *italic*, `code`, [text](url). */

import { T } from "@/lib/tokens";
import type { Block } from "@/data/posts";

type Token = { type: "text" | "bold" | "italic" | "code" | "link"; value: string; href?: string };

function tokenize(s: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < s.length) {
    // link [text](url)
    const link = /^\[([^\]]+)\]\(([^)]+)\)/.exec(s.slice(i));
    if (link) {
      tokens.push({ type: "link", value: link[1], href: link[2] });
      i += link[0].length;
      continue;
    }
    if (s.startsWith("**", i)) {
      const end = s.indexOf("**", i + 2);
      if (end !== -1) {
        tokens.push({ type: "bold", value: s.slice(i + 2, end) });
        i = end + 2;
        continue;
      }
    }
    if (s[i] === "`") {
      const end = s.indexOf("`", i + 1);
      if (end !== -1) {
        tokens.push({ type: "code", value: s.slice(i + 1, end) });
        i = end + 1;
        continue;
      }
    }
    if (s[i] === "*") {
      const end = s.indexOf("*", i + 1);
      if (end !== -1) {
        tokens.push({ type: "italic", value: s.slice(i + 1, end) });
        i = end + 1;
        continue;
      }
    }
    // plain text — accumulate until next special char
    let j = i;
    while (j < s.length && !["*", "`", "["].includes(s[j]) && !s.startsWith("**", j)) j++;
    if (j === i) j = i + 1; // avoid stall on a lone special char
    tokens.push({ type: "text", value: s.slice(i, j) });
    i = j;
  }
  return tokens;
}

function Inline({ s }: { s: string }) {
  const tokens = tokenize(s);
  return (
    <>
      {tokens.map((tk, k) => {
        if (tk.type === "bold")
          return <strong key={k} style={{ color: T.text, fontWeight: 600 }}>{tk.value}</strong>;
        if (tk.type === "italic")
          return <em key={k} style={{ color: T.dim, fontStyle: "italic" }}>{tk.value}</em>;
        if (tk.type === "code")
          return (
            <code key={k} style={{
              fontFamily: T.mono, fontSize: "0.88em", color: T.yellow,
              background: "rgba(255,214,10,0.07)", padding: "1px 6px",
              border: `1px solid ${T.bevel}`, borderRadius: 3,
            }}>{tk.value}</code>
          );
        if (tk.type === "link")
          return (
            <a key={k} href={tk.href} target="_blank" rel="noopener" className="prose-link">
              {tk.value}
            </a>
          );
        return <span key={k}>{tk.value}</span>;
      })}
    </>
  );
}

export default function Prose({ body }: { body: Block[] }) {
  return (
    <div style={{ maxWidth: 720 }}>
      {body.map((b, i) => {
        if (b.t === "h2")
          return (
            <h2 key={i} style={{
              fontFamily: T.sans, fontSize: 26, fontWeight: 500, color: T.text,
              letterSpacing: "-0.02em", marginTop: 48, marginBottom: 18,
              display: "flex", alignItems: "baseline", gap: 12,
            }}>
              <span style={{ fontFamily: T.mono, fontSize: 13, color: T.yellow }}>##</span>
              {b.s}
            </h2>
          );
        if (b.t === "p")
          return (
            <p key={i} style={{
              fontFamily: T.sans, fontSize: 16, lineHeight: 1.72, color: T.dim,
              margin: "0 0 18px",
            }}>
              <Inline s={b.s} />
            </p>
          );
        if (b.t === "code")
          return (
            <div key={i} className="panel" style={{ margin: "0 0 22px", overflow: "hidden" }}>
              <div style={{
                padding: "8px 14px", borderBottom: `1px solid ${T.bevel}`,
                fontFamily: T.mono, fontSize: 10, color: T.dim2,
                letterSpacing: "0.1em", textTransform: "uppercase",
              }}>{b.lang}</div>
              <pre style={{
                margin: 0, padding: "16px 18px", overflow: "auto",
                fontFamily: T.mono, fontSize: 13, lineHeight: 1.6, color: T.text,
              }}>{b.s}</pre>
            </div>
          );
        if (b.t === "quote")
          return (
            <blockquote key={i} style={{
              margin: "0 0 22px", padding: "16px 20px",
              borderLeft: `2px solid ${T.yellow}`, background: "rgba(255,214,10,0.03)",
              fontFamily: T.sans, fontSize: 15.5, fontStyle: "italic",
              color: T.text, lineHeight: 1.6,
            }}>
              <Inline s={b.s} />
            </blockquote>
          );
        if (b.t === "ul")
          return (
            <ul key={i} style={{ margin: "0 0 22px", padding: 0, listStyle: "none" }}>
              {b.items.map((it, j) => (
                <li key={j} style={{
                  fontFamily: T.sans, fontSize: 16, lineHeight: 1.65, color: T.dim,
                  marginBottom: 10, position: "relative", paddingLeft: 20,
                }}>
                  <span style={{ position: "absolute", left: 0, top: 11, width: 10, height: 1, background: T.yellow }} />
                  <Inline s={it} />
                </li>
              ))}
            </ul>
          );
        if (b.t === "table")
          return (
            <div key={i} className="panel" style={{ margin: "0 0 22px", overflow: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: T.mono, fontSize: 13 }}>
                <thead>
                  <tr>
                    {b.head.map((h, k) => (
                      <th key={k} style={{
                        textAlign: "left", padding: "12px 16px",
                        borderBottom: `1px solid ${T.bevelHi}`,
                        color: T.dim, fontWeight: 500, fontSize: 10,
                        letterSpacing: "0.1em", textTransform: "uppercase",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {b.rows.map((row, r) => (
                    <tr key={r}>
                      {row.map((cell, c) => (
                        <td key={c} style={{
                          padding: "12px 16px",
                          borderBottom: r === b.rows.length - 1 ? "none" : `1px solid ${T.bevel}`,
                          color: c === 0 ? T.yellow : T.text,
                        }}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        return null;
      })}
    </div>
  );
}
