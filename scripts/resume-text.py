# Writes data/resume-pdf.txt: the text of public/resume.pdf, line by line, with the PDF's sha256 and its links.
# tests/ai.test.mjs checks the hash against the PDF, then every line and link against data/resume.ts, so a new
# PDF fails the tests until this has been rerun and data/resume.ts updated to match.
#
# Run after replacing the PDF:  uv run --with pymupdf python scripts/resume-text.py
import hashlib
import pathlib

import pymupdf

root = pathlib.Path(__file__).resolve().parent.parent
pdf = root / "public" / "resume.pdf"
doc = pymupdf.open(pdf)

lines = [line.rstrip() for page in doc for line in page.get_text("text").splitlines()]
links = [link["uri"] for page in doc for link in page.get_links() if link.get("uri")]
created = doc.metadata.get("creationDate", "")

out = [
    "sha256: " + hashlib.sha256(pdf.read_bytes()).hexdigest(),
    "created: " + created,
    "--- text",
    *[line for line in lines if line.strip()],
    "--- links",
    *links,
]
(root / "data" / "resume-pdf.txt").write_text("\n".join(out) + "\n", encoding="utf-8", newline="\n")
print(f"{len(lines)} lines, {len(links)} links, created {created}")
