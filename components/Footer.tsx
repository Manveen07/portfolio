import { ME } from "@/data/portfolio";

export default function Footer() {
  return (
    <>
      <div className="belt" style={{ margin: "0 var(--gutter)" }} />
      <footer
        style={{
          padding: "16px clamp(28px, 3vw, 64px) 28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <span className="engr">
          {ME.location} · {ME.hours}
        </span>
        {/* The serial plate hint. Typing the word anywhere on the page pays off. */}
        <span className="egg">
          S/N 0075-0342-07 · you read the serial plate. type the word unattended and I will know.
          the panel also works nights, if you ask it by name.
        </span>
        <span className="engr">© 2026 {ME.name}</span>
      </footer>
    </>
  );
}
