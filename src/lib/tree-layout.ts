import { hierarchy, tree } from "d3-hierarchy";
import type { TreeNodePerson } from "./people";

// Box / spacing geometry (in SVG units). Shared with the renderer.
export const BOX_W = 216;
export const BOX_H = 104;
export const COUPLE_GAP = 22; // gap between two spouses in a couple
export const GEN_GAP = 196; // vertical distance between generations
const SIBLING_MARGIN = 32; // extra space between adjacent units

/** A couple (or single parent) plus the units descending from them. */
interface Unit {
  anchor: TreeNodePerson;
  spouse?: TreeNodePerson;
  divorced: boolean;
  children: Unit[];
  /** has children in the full data (even when currently collapsed) */
  hasChildren: boolean;
  collapsed: boolean;
  /** number of hidden descendants when collapsed */
  hiddenCount: number;
}

export interface Toggle {
  /** center x of the unit, bottom y of its box row */
  x: number;
  y: number;
  anchorId: string;
  collapsed: boolean;
  count: number;
}

export interface PositionedPerson {
  person: TreeNodePerson;
  /** top-left corner of the box */
  x: number;
  y: number;
}

export interface MarriageLink {
  x1: number;
  x2: number;
  y: number;
  divorced: boolean;
  aId: string;
  bId: string;
}

export interface ParentChildLink {
  parentX: number;
  parentY: number;
  childX: number;
  childY: number;
  fromId: string;
  toId: string;
}

export interface Layout {
  nodes: PositionedPerson[];
  marriages: MarriageLink[];
  links: ParentChildLink[];
  toggles: Toggle[];
  width: number;
  height: number;
}

function yearOf(p: TreeNodePerson): number {
  const m = p.lifespan.match(/\d{4}/);
  return m ? Number(m[0]) : Infinity;
}

/**
 * Build a forest of descendant units. Each person is placed once: the oldest
 * parentless people become anchors, their spouses are pulled in beside them,
 * and children descend from the couple. Married-in spouses appear beside their
 * partner rather than as separate roots.
 */
function buildForest(people: TreeNodePerson[], collapsed: Set<string>): Unit[] {
  const byId = new Map(people.map((p) => [p.id, p]));
  const visited = new Set<string>();
  const childrenOf = (id: string) =>
    people
      .filter((p) => p.parents.includes(id))
      .sort((a, b) => yearOf(a) - yearOf(b));

  const pickSpouse = (person: TreeNodePerson): TreeNodePerson | undefined => {
    for (const sid of person.spouses) {
      const s = byId.get(sid);
      if (s && !visited.has(s.id)) {
        visited.add(s.id);
        return s;
      }
    }
    return undefined;
  };

  const collectKids = (
    person: TreeNodePerson,
    spouse: TreeNodePerson | undefined,
  ): TreeNodePerson[] => {
    const seen = new Set<string>();
    const kids: TreeNodePerson[] = [];
    for (const pid of [person.id, spouse?.id].filter(Boolean) as string[]) {
      for (const c of childrenOf(pid)) {
        if (!visited.has(c.id) && !seen.has(c.id)) {
          seen.add(c.id);
          kids.push(c);
        }
      }
    }
    return kids;
  };

  // Mark a hidden subtree visited (so it is not re-rooted elsewhere) and count
  // the blood descendants in it.
  const swallow = (person: TreeNodePerson): number => {
    visited.add(person.id);
    const spouse = pickSpouse(person);
    let n = 1;
    for (const c of collectKids(person, spouse)) n += swallow(c);
    return n;
  };

  const isDivorced = (a: TreeNodePerson, s: TreeNodePerson): boolean =>
    Boolean(
      a.spouseLinks.find((l) => l.id === s.id)?.divorced ||
        s.spouseLinks.find((l) => l.id === a.id)?.divorced,
    );

  function build(person: TreeNodePerson): Unit {
    visited.add(person.id);
    const spouse = pickSpouse(person);
    const divorced = spouse ? isDivorced(person, spouse) : false;
    const kids = collectKids(person, spouse);
    const hasChildren = kids.length > 0;

    if (hasChildren && collapsed.has(person.id)) {
      let hiddenCount = 0;
      for (const c of kids) hiddenCount += swallow(c);
      return {
        anchor: person,
        spouse,
        divorced,
        children: [],
        hasChildren,
        collapsed: true,
        hiddenCount,
      };
    }

    return {
      anchor: person,
      spouse,
      divorced,
      children: kids.map(build),
      hasChildren,
      collapsed: false,
      hiddenCount: 0,
    };
  }

  // Count transitive descendants so the deepest bloodline becomes the primary
  // root and pulls married-in spouses in beside their partner (rather than a
  // spouse being picked as a competing root).
  const descendantCount = (id: string, seen = new Set<string>()): number => {
    let n = 0;
    for (const c of childrenOf(id)) {
      if (seen.has(c.id)) continue;
      seen.add(c.id);
      n += 1 + descendantCount(c.id, seen);
    }
    return n;
  };

  const roots: Unit[] = [];
  const parentless = people
    .filter((p) => p.parents.length === 0)
    .map((p) => ({ p, count: descendantCount(p.id) }))
    .sort((a, b) => b.count - a.count || yearOf(a.p) - yearOf(b.p))
    .map((x) => x.p);

  for (const p of parentless) {
    if (!visited.has(p.id)) roots.push(build(p));
  }
  // Any remaining (e.g. parents referenced but absent) become extra roots.
  for (const p of people) {
    if (!visited.has(p.id)) roots.push(build(p));
  }
  return roots;
}

const unitHalfWidth = (u: Unit) =>
  u.spouse ? BOX_W + COUPLE_GAP / 2 : BOX_W / 2;

/** Compute positioned boxes and links for the whole forest. */
export function computeLayout(
  people: TreeNodePerson[],
  collapsed: Set<string> = new Set(),
): Layout {
  const forest = buildForest(people, collapsed);

  // A synthetic root lets d3 lay out multiple family roots in one pass.
  const synthetic: Unit = {
    anchor: { id: "__root__" } as TreeNodePerson,
    divorced: false,
    children: forest,
    hasChildren: true,
    collapsed: false,
    hiddenCount: 0,
  };

  const root = hierarchy<Unit>(synthetic, (d) => d.children);
  tree<Unit>()
    .nodeSize([BOX_W, GEN_GAP])
    .separation((a, b) => {
      const dist =
        unitHalfWidth(a.data) + unitHalfWidth(b.data) + SIBLING_MARGIN;
      return dist / BOX_W;
    })(root);

  const nodes: PositionedPerson[] = [];
  const marriages: MarriageLink[] = [];
  const links: ParentChildLink[] = [];
  const toggles: Toggle[] = [];

  // Center of a unit and the row's top y.
  const centerX = (n: { x?: number }) => n.x ?? 0;
  const rowY = (depth: number) => (depth - 1) * GEN_GAP;

  for (const node of root.descendants()) {
    if (node.data.anchor.id === "__root__") continue;
    const ux = centerX(node);
    const y = rowY(node.depth);
    const { anchor, spouse } = node.data;

    if (node.data.hasChildren) {
      toggles.push({
        x: ux,
        y: y + BOX_H,
        anchorId: anchor.id,
        collapsed: node.data.collapsed,
        count: node.data.hiddenCount,
      });
    }

    if (spouse) {
      const anchorCx = ux - (BOX_W + COUPLE_GAP) / 2;
      const spouseCx = ux + (BOX_W + COUPLE_GAP) / 2;
      nodes.push({ person: anchor, x: anchorCx - BOX_W / 2, y });
      nodes.push({ person: spouse, x: spouseCx - BOX_W / 2, y });
      marriages.push({
        x1: anchorCx + BOX_W / 2,
        x2: spouseCx - BOX_W / 2,
        y: y + BOX_H / 2,
        divorced: node.data.divorced,
        aId: anchor.id,
        bId: spouse.id,
      });
    } else {
      nodes.push({ person: anchor, x: ux - BOX_W / 2, y });
    }

    for (const child of node.children ?? []) {
      links.push({
        parentX: ux,
        parentY: y + BOX_H,
        childX: centerX(child),
        childY: rowY(child.depth),
        fromId: anchor.id,
        toId: child.data.anchor.id,
      });
    }
  }

  // Normalize coordinates to a positive origin and measure the canvas.
  const xs = nodes.flatMap((n) => [n.x, n.x + BOX_W]);
  const ys = nodes.flatMap((n) => [n.y, n.y + BOX_H]);
  const minX = Math.min(...xs, 0);
  const minY = Math.min(...ys, 0);
  const pad = 48;

  const shiftX = -minX + pad;
  const shiftY = -minY + pad;

  for (const n of nodes) {
    n.x += shiftX;
    n.y += shiftY;
  }
  for (const m of marriages) {
    m.x1 += shiftX;
    m.x2 += shiftX;
    m.y += shiftY;
  }
  for (const l of links) {
    l.parentX += shiftX;
    l.childX += shiftX;
    l.parentY += shiftY;
    l.childY += shiftY;
  }
  for (const tg of toggles) {
    tg.x += shiftX;
    tg.y += shiftY;
  }

  const width = Math.max(...xs) - minX + pad * 2;
  const height = Math.max(...ys) - minY + pad * 2;

  return { nodes, marriages, links, toggles, width, height };
}
