#!/usr/bin/env node
// Validates every person file before the site builds.
// Run locally with `npm run validate`; also runs automatically on every PR.
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";

const PEOPLE_DIR = "src/content/people";
const PUBLIC_DIR = "public";

const errors = [];
const warnings = [];

const files = readdirSync(PEOPLE_DIR).filter((f) => f.endsWith(".md"));

// First pass: load everyone and collect ids.
const people = new Map();
for (const file of files) {
  const id = file.replace(/\.md$/, "");
  const raw = readFileSync(join(PEOPLE_DIR, file), "utf8");
  let data;
  try {
    ({ data } = matter(raw));
  } catch (e) {
    errors.push(`${file}: could not parse frontmatter — ${e.message}`);
    continue;
  }
  if (people.has(id)) errors.push(`${file}: duplicate id "${id}"`);
  people.set(id, { file, data });
}

const has = (id) => people.has(id);

// Second pass: validate fields and relationships.
for (const [id, { file, data }] of people) {
  if (!data.name || typeof data.name !== "string") {
    errors.push(`${file}: missing required "name"`);
  }

  const refList = (key) => (Array.isArray(data[key]) ? data[key] : []);

  for (const pid of refList("parents")) {
    if (pid === id) errors.push(`${file}: "${id}" is listed as their own parent`);
    else if (!has(pid))
      errors.push(`${file}: parent "${pid}" does not exist (no ${pid}.md)`);
  }
  if (refList("parents").length > 2) {
    warnings.push(`${file}: has more than 2 parents — is that intended?`);
  }

  // Spouses may be a plain id or { id, married?, divorced? }.
  const spouseId = (s) => (typeof s === "string" ? s : s && s.id);
  for (const entry of refList("spouses")) {
    const sid = spouseId(entry);
    if (!sid) {
      errors.push(`${file}: a spouse entry is missing an "id"`);
      continue;
    }
    for (const yr of ["married", "divorced"]) {
      if (entry && typeof entry === "object" && entry[yr] != null && !/\d{4}/.test(String(entry[yr]))) {
        warnings.push(`${file}: spouse "${sid}" ${yr} "${entry[yr]}" has no recognizable year`);
      }
    }
    if (sid === id) {
      errors.push(`${file}: "${id}" is listed as their own spouse`);
    } else if (!has(sid)) {
      errors.push(`${file}: spouse "${sid}" does not exist (no ${sid}.md)`);
    } else {
      // reciprocity is a soft check
      const partner = people.get(sid).data;
      const partnerSpouses = (
        Array.isArray(partner.spouses) ? partner.spouses : []
      ).map(spouseId);
      if (!partnerSpouses.includes(id)) {
        warnings.push(
          `${file}: lists spouse "${sid}", but ${sid}.md does not list "${id}" back`,
        );
      }
    }
  }

  if (data.photo) {
    if (!data.photo.startsWith("/")) {
      errors.push(`${file}: photo "${data.photo}" must start with "/" (e.g. /photos/${id}.jpg)`);
    } else if (!existsSync(join(PUBLIC_DIR, data.photo))) {
      errors.push(`${file}: photo file "${data.photo}" not found in ${PUBLIC_DIR}`);
    }
  }

  // Dates should contain a recognizable 4-digit year.
  for (const key of ["born", "died"]) {
    const v = data[key];
    if (v != null && !/\d{4}/.test(String(v))) {
      warnings.push(`${file}: ${key} "${v}" has no recognizable year`);
    }
  }
}

// Detect cycles in the parent graph (would otherwise break the tree layout).
const WHITE = 0,
  GRAY = 1,
  BLACK = 2;
const color = new Map([...people.keys()].map((k) => [k, WHITE]));
let cycleFound = false;
function dfs(u) {
  color.set(u, GRAY);
  const parents = people.get(u)?.data.parents;
  for (const par of Array.isArray(parents) ? parents : []) {
    if (!people.has(par)) continue;
    if (color.get(par) === GRAY) {
      errors.push(`parent cycle detected (e.g. "${u}" → "${par}")`);
      cycleFound = true;
      return;
    }
    if (color.get(par) === WHITE) {
      dfs(par);
      if (cycleFound) return;
    }
  }
  color.set(u, BLACK);
}
for (const id of people.keys()) {
  if (color.get(id) === WHITE && !cycleFound) dfs(id);
}

// Warn about translation files with no matching person.
const TRANS_DIR = "src/content/translations";
if (existsSync(TRANS_DIR)) {
  for (const f of readdirSync(TRANS_DIR).filter((f) => f.endsWith(".md"))) {
    const id = f.replace(/\.md$/, "");
    if (!people.has(id)) {
      warnings.push(`translations/${f}: no matching person "${id}.md"`);
    }
  }
}

for (const w of warnings) console.warn(`⚠️  ${w}`);
for (const e of errors) console.error(`❌  ${e}`);

if (errors.length) {
  console.error(`\n${errors.length} error(s) found. Please fix them and try again.`);
  process.exit(1);
}
console.log(`✅  ${people.size} people checked, all good${warnings.length ? ` (${warnings.length} warning(s))` : ""}.`);
