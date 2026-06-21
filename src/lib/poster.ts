import { computeLayout, BOX_W, BOX_H } from "./tree-layout";
import type { TreeNodePerson } from "./people";

// Standalone SVG can't use CSS variables, so colors are inlined here.
const C = {
  paper: "#fafafb",
  surface: "#ffffff",
  ink: "#23272f",
  muted: "#6b7280",
  line: "#e5e7eb",
  branch: "#cbd2dc",
  accent: "#4f6bd0",
  accentSoft: "#eef1fb",
};

const esc = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
const trunc = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1) + "…" : s);

function elbow(x1: number, y1: number, x2: number, y2: number): string {
  const my = (y1 + y2) / 2;
  if (Math.abs(x1 - x2) < 1) return `M${x1},${y1} V${y2}`;
  const r = Math.min(14, Math.abs(x2 - x1) / 2, Math.abs(my - y1));
  const d = x2 > x1 ? 1 : -1;
  return `M${x1},${y1} V${my - r} Q${x1},${my} ${x1 + d * r},${my} H${x2 - d * r} Q${x2},${my} ${x2},${my + r} V${y2}`;
}

/** Render the full (expanded) tree as a standalone, printable SVG document. */
export function renderPosterSVG(
  people: TreeNodePerson[],
  opts: { title: string; subtitle: string },
): string {
  const lay = computeLayout(people); // full tree, nothing collapsed
  const headH = 110;
  const W = Math.max(Math.round(lay.width), 900);
  const H = Math.round(lay.height) + headH;

  const parts: string[] = [];
  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Inter, Helvetica, Arial, sans-serif">`,
  );
  parts.push(`<rect width="${W}" height="${H}" fill="${C.paper}"/>`);
  parts.push(
    `<text x="48" y="56" font-size="30" font-weight="700" fill="${C.ink}">${esc(opts.title)}</text>`,
  );
  parts.push(`<text x="48" y="86" font-size="16" fill="${C.muted}">${esc(opts.subtitle)}</text>`);

  parts.push(`<g transform="translate(0,${headH})">`);

  for (const l of lay.links) {
    parts.push(
      `<path d="${elbow(l.parentX, l.parentY, l.childX, l.childY)}" fill="none" stroke="${C.branch}" stroke-width="2"/>`,
    );
  }
  for (const m of lay.marriages) {
    const dash = m.divorced ? ` stroke-dasharray="5 5"` : "";
    parts.push(
      `<line x1="${m.x1}" y1="${m.y}" x2="${m.x2}" y2="${m.y}" stroke="${C.branch}" stroke-width="2.5"${dash}/>`,
    );
  }
  for (const n of lay.nodes) {
    const p = n.person;
    const cx = n.x + 34;
    const cy = n.y + BOX_H / 2;
    const tx = n.x + 64;
    const dotFill = p.living ? "#10b981" : C.accent;
    const avBg = p.living ? "#ecfdf5" : C.accentSoft;
    const avFg = p.living ? "#047857" : C.accent;
    parts.push(
      `<rect x="${n.x}" y="${n.y}" width="${BOX_W}" height="${BOX_H}" rx="16" fill="${C.surface}" stroke="${C.line}"/>`,
      `<circle cx="${cx}" cy="${cy}" r="22" fill="${avBg}"/>`,
      `<text x="${cx}" y="${cy + 5}" font-size="14" font-weight="600" fill="${avFg}" text-anchor="middle">${esc(p.initials)}</text>`,
      `<text x="${tx}" y="${n.y + 38}" font-size="14.5" font-weight="600" fill="${C.ink}">${esc(trunc(p.name, 20))}</text>`,
    );
    if (p.living)
      parts.push(`<circle cx="${n.x + BOX_W - 14}" cy="${n.y + 14}" r="4" fill="${dotFill}"/>`);
    if (p.lifespan)
      parts.push(
        `<text x="${tx}" y="${n.y + 58}" font-size="12" fill="${C.muted}">${esc(trunc(p.lifespan, 24))}</text>`,
      );
    if (p.tagline)
      parts.push(
        `<text x="${tx}" y="${n.y + 76}" font-size="11" fill="${C.muted}">${esc(trunc(p.tagline, 26))}</text>`,
      );
  }

  parts.push(`</g></svg>`);
  return parts.join("\n");
}
