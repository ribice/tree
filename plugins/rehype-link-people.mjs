// Rehype plugin: turns distinctive relative names in bios into profile links.
// Only links *unambiguous* full names and nicknames — never bare first names —
// so it never produces a wrong genealogical link.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";

const DIR = "src/content/people";

function buildTermMap() {
  const ids = new Map(); // term -> Set of ids
  const add = (term, id) => {
    if (!term || term.length < 3) return;
    const set = ids.get(term) ?? new Set();
    set.add(id);
    ids.set(term, set);
  };
  for (const f of readdirSync(DIR).filter((f) => f.endsWith(".md"))) {
    const id = f.replace(/\.md$/, "");
    const { data } = matter(readFileSync(join(DIR, f), "utf8"));
    const fullName = String(data.name ?? "").split("—")[0].trim();
    add(fullName, id); // e.g. "Avdo Ribić" (ambiguous → dropped below)
    if (data.nickname) add(String(data.nickname).trim(), id);
  }
  // Keep only terms that map to exactly one person.
  const term2id = new Map();
  for (const [term, set] of ids) if (set.size === 1) term2id.set(term, [...set][0]);
  return term2id;
}

const TERM2ID = buildTermMap();
const TERMS = [...TERM2ID.keys()].sort((a, b) => b.length - a.length);
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const RE = TERMS.length
  ? new RegExp(`(?<![\\p{L}\\p{N}])(${TERMS.map(escape).join("|")})(?![\\p{L}\\p{N}])`, "gu")
  : null;

export default function rehypeLinkPeople() {
  return (tree, file) => {
    if (!RE) return;
    const path = String(file?.path ?? file?.history?.[0] ?? "");
    const base = path.includes("/translations/") ? "/en/people/" : "/people/";
    const currentId = path.split("/").pop()?.replace(/\.md$/, "");

    const linkify = (value) => {
      const out = [];
      let last = 0;
      RE.lastIndex = 0;
      let m;
      while ((m = RE.exec(value))) {
        const id = TERM2ID.get(m[1]);
        if (!id || id === currentId) continue; // skip self-links
        if (m.index > last) out.push({ type: "text", value: value.slice(last, m.index) });
        out.push({
          type: "element",
          tagName: "a",
          properties: { href: base + id, className: ["person-link"] },
          children: [{ type: "text", value: m[1] }],
        });
        last = m.index + m[1].length;
      }
      if (!out.length) return null;
      if (last < value.length) out.push({ type: "text", value: value.slice(last) });
      return out;
    };

    const walk = (node, insideLink) => {
      if (!node.children) return;
      const next = [];
      for (const child of node.children) {
        if (child.type === "element") {
          walk(child, insideLink || child.tagName === "a");
          next.push(child);
        } else if (child.type === "text" && !insideLink) {
          next.push(...(linkify(child.value) ?? [child]));
        } else {
          next.push(child);
        }
      }
      node.children = next;
    };
    walk(tree, false);
  };
}
