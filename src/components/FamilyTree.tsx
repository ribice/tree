import { useEffect, useMemo, useRef, useState } from "react";
import type { TreeNodePerson } from "../lib/people";
import {
  computeLayout,
  BOX_W,
  BOX_H,
  type PositionedPerson,
} from "../lib/tree-layout";

export interface TreeLabels {
  hint: string;
  zoomIn: string;
  zoomOut: string;
  reset: string;
  expandAll: string;
  collapseAll: string;
  living: string;
  deceased: string;
  /** "+{n} more" / "još {n}" — {n} is replaced */
  showMore: string;
}

interface Props {
  people: TreeNodePerson[];
  labels: TreeLabels;
  basePath: string; // "/people" (bs) or "/en/people" (en)
}

// Side branches collapsed by default to keep the main lineage readable.
const DEFAULT_COLLAPSED = ["izo-stariji", "resid", "himzo", "pasa"];

/** All transitive ancestors of a person (to expand a path to a focused node). */
function ancestorsOf(id: string, people: TreeNodePerson[]): string[] {
  const byId = new Map(people.map((p) => [p.id, p]));
  const out = new Set<string>();
  const walk = (pid: string) => {
    const p = byId.get(pid);
    if (!p) return;
    for (const parent of p.parents) {
      if (!out.has(parent)) {
        out.add(parent);
        walk(parent);
      }
    }
  };
  walk(id);
  return [...out];
}

interface Transform {
  x: number;
  y: number;
  k: number;
}

const MIN_K = 0.25;
const MAX_K = 2.5;
const MAX_FIT_K = 1.05;
const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

export default function FamilyTree({ people, labels, basePath }: Props) {
  const [collapsed, setCollapsed] = useState<Set<string>>(
    () => new Set(DEFAULT_COLLAPSED),
  );
  const layout = useMemo(
    () => computeLayout(people, collapsed),
    [people, collapsed],
  );
  const layoutRef = useRef(layout);
  layoutRef.current = layout;

  // anchor ids that can be collapsed (used by "collapse all")
  const allCollapsible = useMemo(
    () => computeLayout(people, new Set()).toggles.map((t) => t.anchorId),
    [people],
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<Transform>({ x: 0, y: 0, k: 1 });
  const tRef = useRef(transform);
  tRef.current = transform;

  const [ready, setReady] = useState(false);
  const [highlight, setHighlight] = useState<string | null>(null);
  const [focusTarget, setFocusTarget] = useState<string | null>(null);

  const fit = () => {
    const el = containerRef.current;
    if (!el) return;
    const lay = layoutRef.current;
    const vw = el.clientWidth;
    const vh = el.clientHeight;
    const k = clamp(
      Math.min(vw / lay.width, vh / lay.height) * 0.98,
      MIN_K,
      MAX_FIT_K,
    );
    setTransform({
      k,
      x: (vw - lay.width * k) / 2,
      y: Math.max(24, (vh - lay.height * k) / 2),
    });
  };

  // Fit on mount and on container resize only (not on collapse changes, so the
  // view stays put when the user opens/closes a branch).
  useEffect(() => {
    fit();
    setReady(true);
    // Deep-link: ?focus=<id> reveals, centers and highlights a person.
    try {
      const id = new URLSearchParams(window.location.search).get("focus");
      if (id && people.some((p) => p.id === id)) {
        const anc = ancestorsOf(id, people);
        setCollapsed((prev) => {
          const next = new Set(prev);
          for (const a of anc) next.delete(a);
          return next;
        });
        setFocusTarget(id);
      }
    } catch {}
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => fit());
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Center + highlight the focused node once the layout has revealed it.
  useEffect(() => {
    if (!focusTarget) return;
    const el = containerRef.current;
    if (!el) return;
    const n = layout.nodes.find((nd) => nd.person.id === focusTarget);
    if (!n) return; // path still expanding — re-runs when layout updates
    const k = 0.95;
    const cx = n.x + BOX_W / 2;
    const cy = n.y + BOX_H / 2;
    setTransform({ k, x: el.clientWidth / 2 - cx * k, y: el.clientHeight / 2 - cy * k });
    setHighlight(focusTarget);
    setFocusTarget(null);
    const tmr = setTimeout(() => setHighlight(null), 3000);
    return () => clearTimeout(tmr);
  }, [focusTarget, layout]);

  const toggle = (id: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  const collapseAll = () => setCollapsed(new Set(allCollapsible));
  const expandAll = () => setCollapsed(new Set());

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const el = containerRef.current!;
    const rect = el.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const { x, y, k } = tRef.current;
    const factor = Math.exp(-e.deltaY * 0.0012);
    const nk = clamp(k * factor, MIN_K, MAX_K);
    setTransform({ k: nk, x: px - ((px - x) / k) * nk, y: py - ((py - y) / k) * nk });
  };

  const drag = useRef({ active: false, sx: 0, sy: 0, ox: 0, oy: 0, moved: 0 });
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{
    dist: number;
    k: number;
    x: number;
    y: number;
    mx: number;
    my: number;
  } | null>(null);

  const localPoint = (clientX: number, clientY: number) => {
    const r = containerRef.current!.getBoundingClientRect();
    return { x: clientX - r.left, y: clientY - r.top };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) {
      drag.current = {
        active: true,
        sx: e.clientX,
        sy: e.clientY,
        ox: tRef.current.x,
        oy: tRef.current.y,
        moved: 0,
      };
    } else if (pointers.current.size === 2) {
      drag.current.active = false;
      startPinch();
    }
  };

  const startPinch = () => {
    const [p1, p2] = [...pointers.current.values()];
    const mid = localPoint((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
    pinch.current = {
      dist: Math.hypot(p2.x - p1.x, p2.y - p1.y),
      k: tRef.current.k,
      x: tRef.current.x,
      y: tRef.current.y,
      mx: mid.x,
      my: mid.y,
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (pointers.current.has(e.pointerId))
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size >= 2 && pinch.current) {
      const [p1, p2] = [...pointers.current.values()];
      const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      const mid = localPoint((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
      const s = pinch.current;
      const nk = clamp((s.k * dist) / s.dist, MIN_K, MAX_K);
      const wx = (s.mx - s.x) / s.k;
      const wy = (s.my - s.y) / s.k;
      setTransform({ k: nk, x: mid.x - wx * nk, y: mid.y - wy * nk });
      return;
    }

    const d = drag.current;
    if (!d.active) return;
    const dx = e.clientX - d.sx;
    const dy = e.clientY - d.sy;
    d.moved = Math.max(d.moved, Math.abs(dx) + Math.abs(dy));
    setTransform((t) => ({ ...t, x: d.ox + dx, y: d.oy + dy }));
  };

  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    pinch.current = null;
    if (pointers.current.size === 1) {
      // resume single-finger pan from the remaining pointer
      const [p] = [...pointers.current.values()];
      drag.current = {
        active: true,
        sx: p.x,
        sy: p.y,
        ox: tRef.current.x,
        oy: tRef.current.y,
        moved: 999,
      };
    } else if (pointers.current.size === 0) {
      drag.current.active = false;
    }
  };
  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved > 6) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const zoomBy = (factor: number) => {
    const el = containerRef.current!;
    const px = el.clientWidth / 2;
    const py = el.clientHeight / 2;
    const { x, y, k } = tRef.current;
    const nk = clamp(k * factor, MIN_K, MAX_K);
    setTransform({ k: nk, x: px - ((px - x) / k) * nk, y: py - ((py - y) / k) * nk });
  };

  const showMore = (n: number) => labels.showMore.replace("{n}", String(n));

  return (
    <div
      ref={containerRef}
      className="relative h-[84vh] min-h-[600px] w-full overflow-hidden rounded-2xl border border-line bg-paper"
      style={{
        backgroundImage:
          "radial-gradient(var(--color-line) 1.2px, transparent 1.2px)",
        backgroundSize: "26px 26px",
      }}
    >
      <svg
        className="h-full w-full touch-none select-none"
        style={{
          cursor: drag.current.active ? "grabbing" : "grab",
          opacity: ready ? 1 : 0,
          transition: "opacity 0.25s ease",
        }}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={onClickCapture}
      >
        <g
          transform={`translate(${transform.x},${transform.y}) scale(${transform.k})`}
        >
          {layout.links.map((l, i) => (
            <path
              key={`l${i}`}
              d={elbow(l.parentX, l.parentY, l.childX, l.childY)}
              fill="none"
              stroke="var(--color-branch)"
              strokeWidth={2}
              strokeLinejoin="round"
            />
          ))}
          {layout.marriages.map((m, i) => (
            <line
              key={`m${i}`}
              x1={m.x1}
              y1={m.y}
              x2={m.x2}
              y2={m.y}
              stroke="var(--color-branch)"
              strokeWidth={2.5}
              strokeDasharray={m.divorced ? "5 5" : undefined}
            />
          ))}
          {layout.nodes.map((n) => (
            <PersonCard
              key={n.person.id}
              node={n}
              basePath={basePath}
              livingLabel={labels.living}
              highlighted={highlight === n.person.id}
            />
          ))}
          {layout.toggles.map((tg) => (
            <foreignObject
              key={`t${tg.anchorId}`}
              x={tg.x - 30}
              y={tg.y - 11}
              width={60}
              height={24}
            >
              <div className="flex h-full w-full items-center justify-center">
                <button
                  type="button"
                  aria-label={tg.collapsed ? showMore(tg.count) : labels.collapseAll}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => toggle(tg.anchorId)}
                  className="pointer-events-auto flex items-center gap-0.5 rounded-full border border-line bg-surface px-2 py-0.5 text-[11px] font-semibold text-muted shadow-sm transition hover:border-accent hover:text-accent"
                >
                  {tg.collapsed ? showMore(tg.count) : "–"}
                </button>
              </div>
            </foreignObject>
          ))}
        </g>
      </svg>

      {/* Legend */}
      <div className="pointer-events-none absolute top-4 left-4 flex flex-col gap-1.5 rounded-xl border border-line bg-surface/90 px-3 py-2 text-xs text-muted shadow-sm backdrop-blur">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          {labels.living}
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          {labels.deceased}
        </span>
      </div>

      {/* Expand / collapse */}
      <div className="absolute top-4 right-4 flex gap-1.5">
        <PillButton onClick={expandAll}>{labels.expandAll}</PillButton>
        <PillButton onClick={collapseAll}>{labels.collapseAll}</PillButton>
      </div>

      {/* Zoom */}
      <div className="absolute right-4 bottom-4 flex flex-col gap-1.5">
        <ControlButton label={labels.zoomIn} onClick={() => zoomBy(1.25)}>
          +
        </ControlButton>
        <ControlButton label={labels.zoomOut} onClick={() => zoomBy(0.8)}>
          −
        </ControlButton>
        <ControlButton label={labels.reset} onClick={fit}>
          ⤢
        </ControlButton>
      </div>

      <p className="pointer-events-none absolute bottom-4 left-4 text-xs text-muted">
        {labels.hint}
      </p>
    </div>
  );
}

function PillButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-medium text-muted shadow-sm transition hover:border-accent hover:text-accent"
    >
      {children}
    </button>
  );
}

function ControlButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface text-lg text-ink shadow-sm transition hover:border-accent hover:text-accent"
    >
      {children}
    </button>
  );
}

function PersonCard({
  node,
  basePath,
  livingLabel,
  highlighted,
}: {
  node: PositionedPerson;
  basePath: string;
  livingLabel: string;
  highlighted: boolean;
}) {
  const p = node.person;
  const living = p.living;
  return (
    <foreignObject x={node.x} y={node.y} width={BOX_W} height={BOX_H}>
      <a
        href={`${basePath}/${p.id}`}
        className={`group relative flex h-full w-full items-center gap-3 rounded-2xl border bg-surface px-3 py-2.5 shadow-sm transition duration-150 hover:-translate-y-0.5 hover:border-accent hover:shadow-lg ${
          highlighted
            ? "border-accent ring-2 ring-accent ring-offset-2 ring-offset-paper"
            : "border-line"
        }`}
      >
        {living && (
          <span
            className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-surface"
            title={livingLabel}
          />
        )}
        <span
          className={`flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full text-base font-semibold ring-1 transition ${
            living
              ? "bg-emerald-50 text-emerald-700 ring-emerald-500/25 group-hover:ring-emerald-500/50"
              : "bg-accent-soft text-accent ring-accent/15 group-hover:ring-accent/40"
          }`}
        >
          {p.photo ? (
            <img
              src={p.photo}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            p.initials
          )}
        </span>
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block truncate pr-2 text-[15px] font-semibold text-ink group-hover:text-accent">
            {p.name}
          </span>
          {p.lifespan && (
            <span className="mt-0.5 block truncate text-xs font-medium text-muted">
              {p.lifespan}
            </span>
          )}
          {p.tagline && (
            <span className="mt-0.5 block truncate text-[11px] text-muted">
              {p.tagline}
            </span>
          )}
        </span>
      </a>
    </foreignObject>
  );
}

/** Orthogonal parent→child connector with softly rounded corners. */
function elbow(x1: number, y1: number, x2: number, y2: number): string {
  const my = (y1 + y2) / 2;
  if (Math.abs(x1 - x2) < 1) return `M${x1},${y1} V${y2}`;
  const r = Math.min(14, Math.abs(x2 - x1) / 2, Math.abs(my - y1));
  const dir = x2 > x1 ? 1 : -1;
  return [
    `M${x1},${y1}`,
    `V${my - r}`,
    `Q${x1},${my} ${x1 + dir * r},${my}`,
    `H${x2 - dir * r}`,
    `Q${x2},${my} ${x2},${my + r}`,
    `V${y2}`,
  ].join(" ");
}
