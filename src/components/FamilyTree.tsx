import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { TreeNodePerson } from "../lib/people";
import { foldSearchText } from "../lib/search";
import {
  computeLayout,
  BOX_W,
  BOX_H,
  type Layout,
} from "../lib/tree-layout";
import { TreeControls, TreeZoomControls } from "./tree/TreeControls";
import { TreePersonCard } from "./tree/TreePersonCard";
import { TreeSearch } from "./tree/TreeSearch";
import { ancestorsOf, descendantsOf, revealPathOf } from "./tree/relationships";
import { useBranchMode } from "./tree/useBranchMode";
import { useTreeData } from "./tree/useTreeData";
import { useTreeViewport } from "./tree/useTreeViewport";

export interface TreeLabels {
  hint: string;
  zoomIn: string;
  zoomOut: string;
  reset: string;
  fullscreen: string;
  exitFullscreen: string;
  expandAll: string;
  collapseAll: string;
  living: string;
  deceased: string;
  born: string;
  died: string;
  birthplace: string;
  female: string;
  male: string;
  search: string;
  searchPlaceholder: string;
  searchEmpty: string;
  center: string;
  loading: string;
  branchMode: string;
  showAll: string;
  /** "+{n} more" / "još {n}" — {n} is replaced */
  showMore: string;
  otherSurname: string;
  loadError: string;
  treeRegion: string;
  keyboardHelp: string;
}

interface Props {
  people?: TreeNodePerson[];
  dataUrl?: string;
  labels: TreeLabels;
  basePath: string; // "/people" (bs) or "/en/people" (en)
}

// Side branches collapsed by default to keep the main lineage readable.
const DEFAULT_COLLAPSED = ["izo-stariji", "resid", "himzo", "pasa"];

const EMPTY_LAYOUT: Layout = {
  nodes: [],
  marriages: [],
  links: [],
  toggles: [],
  width: 1,
  height: 1,
};

export default function FamilyTree({
  people: initialPeople = [],
  dataUrl,
  labels,
  basePath,
}: Props) {
  const { people, loading, failed } = useTreeData(initialPeople, dataUrl);
  const { branchTarget, branchSet, treePeople, branchPerson, clearBranch: clearBranchMode } =
    useBranchMode(people);
  const [collapsed, setCollapsed] = useState<Set<string>>(
    () => new Set(DEFAULT_COLLAPSED),
  );
  const layout = useMemo(
    () => (treePeople.length ? computeLayout(treePeople, collapsed) : EMPTY_LAYOUT),
    [treePeople, collapsed],
  );

  // anchor ids that can be collapsed (used by "collapse all")
  const allCollapsible = useMemo(
    () =>
      treePeople.length
        ? computeLayout(treePeople, new Set()).toggles.map((t) => t.anchorId)
        : [],
    [treePeople],
  );

  // Bumped by "expand all" / "collapse all", which change the whole picture.
  const [fitRequest, setFitRequest] = useState(0);
  const viewportFitKey = `${
    branchSet ? `${branchTarget}:${branchSet.size}` : `all:${treePeople.length}`
  }:${fitRequest}`;
  const {
    containerRef,
    transform,
    setTransform,
    ready,
    isDragging,
    fit,
    zoomBy,
    onKeyDown,
    revealElement,
    wheelTargetRef,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onClickCapture,
  } = useTreeViewport(layout, viewportFitKey);
  const [highlight, setHighlight] = useState<string | null>(null);
  const [focusTarget, setFocusTarget] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [hoverEnabled, setHoverEnabled] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [canFullscreen, setCanFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const urlFocusHandled = useRef(false);
  const layoutRef = useRef(layout);
  layoutRef.current = layout;
  const moveDomFocus = useRef(false);
  const toggleAnchor = useRef<{ id: string; x: number; y: number } | null>(null);

  // The hovered person's bloodline (ancestors + descendants + self), or null.
  const lineage = useMemo(() => {
    if (!hoverEnabled || !hovered) return null;
    return new Set([
      hovered,
      ...ancestorsOf(hovered, people),
      ...descendantsOf(hovered, people),
    ]);
  }, [hoverEnabled, hovered, people]);

  const nodeDim = (id: string) => (lineage && !lineage.has(id) ? 0.22 : 1);
  const detailLabels = useMemo(
    () => ({
      born: labels.born,
      died: labels.died,
      birthplace: labels.birthplace,
    }),
    [labels],
  );
  const onCardHover = useCallback(
    (id: string, on: boolean) => {
      if (hoverEnabled) setHovered(on ? id : null);
    },
    [hoverEnabled],
  );

  useEffect(() => {
    if (urlFocusHandled.current || !people.length) return;
    urlFocusHandled.current = true;
    // Deep-link: ?focus=<id> reveals, centers and highlights a person.
    try {
      const id = new URLSearchParams(window.location.search).get("focus");
      if (id && people.some((p) => p.id === id)) {
        const path = revealPathOf(id, people);
        setCollapsed((prev) => {
          const next = new Set(prev);
          for (const a of path) next.delete(a);
          return next;
        });
        setFocusTarget(id);
      }
    } catch {}
  }, [people]);

  useEffect(() => {
    const syncFullscreen = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    };
    document.addEventListener("fullscreenchange", syncFullscreen);
    syncFullscreen();
    // iPhone Safari has no element fullscreen, so the button would do nothing.
    setCanFullscreen(document.fullscreenEnabled);
    return () =>
      document.removeEventListener("fullscreenchange", syncFullscreen);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const syncHover = () => {
      setHoverEnabled(media.matches);
      if (!media.matches) setHovered(null);
    };
    syncHover();
    media.addEventListener("change", syncHover);
    return () => media.removeEventListener("change", syncHover);
  }, []);

  const focusPerson = (id: string) => {
    const path = revealPathOf(id, people);
    setCollapsed((prev) => {
      const next = new Set(prev);
      for (const a of path) next.delete(a);
      return next;
    });
    moveDomFocus.current = true;
    setFocusTarget(id);
    setSearchQuery("");
  };

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
    if (moveDomFocus.current) {
      moveDomFocus.current = false;
      // The search result that held focus disappears with the results list.
      const target = focusTarget;
      requestAnimationFrame(() => {
        el.querySelector<HTMLElement>(`a[href$="/${target}"]`)?.focus({ preventScroll: true });
      });
    }
    const tmr = setTimeout(() => setHighlight(null), 3000);
    return () => clearTimeout(tmr);
  }, [focusTarget, layout]);

  const toggle = useCallback((id: string) => {
    const node = layoutRef.current.nodes.find((n) => n.person.id === id);
    toggleAnchor.current = node ? { id, x: node.x, y: node.y } : null;
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  // Re-laying out moves every card; keep the toggled person under the pointer.
  useLayoutEffect(() => {
    const anchor = toggleAnchor.current;
    if (!anchor) return;
    toggleAnchor.current = null;
    const node = layout.nodes.find((n) => n.person.id === anchor.id);
    if (!node) return;
    const dx = node.x - anchor.x;
    const dy = node.y - anchor.y;
    if (dx || dy) {
      setTransform((t) => ({ ...t, x: t.x - dx * t.k, y: t.y - dy * t.k }));
    }
  }, [layout, setTransform]);

  const collapseAll = () => {
    setCollapsed(new Set(allCollapsible));
    setFitRequest((n) => n + 1);
  };
  const expandAll = () => {
    setCollapsed(new Set());
    setFitRequest((n) => n + 1);
  };

  const toggleFullscreen = async () => {
    const el = containerRef.current;
    if (!el || !document.fullscreenEnabled) return;
    try {
      if (document.fullscreenElement === el) await document.exitFullscreen();
      else await el.requestFullscreen();
    } catch {
      // Some browsers reject fullscreen without a direct user gesture.
    }
  };

  const normalizedSearch = foldSearchText(searchQuery.trim());
  const searchResults = normalizedSearch
    ? treePeople
        .filter((p) =>
          [p.name, p.treeName, p.nickname, p.tagline, p.lifespan, p.birthplace]
            .filter(Boolean)
            .some((value) => foldSearchText(value!).includes(normalizedSearch)),
        )
        .slice(0, 20)
    : [];
  const selectFirstSearchResult = () => {
    if (searchResults[0]) focusPerson(searchResults[0].id);
  };
  const branchLabel = branchPerson
    ? labels.branchMode.replace("{name}", branchPerson.name)
    : "";
  const clearBranch = () => {
    clearBranchMode();
    setSearchQuery("");
  };

  return (
    <div
      ref={containerRef}
      role="group"
      tabIndex={0}
      aria-label={labels.treeRegion}
      aria-describedby="tree-keyboard-help"
      onKeyDown={onKeyDown}
      onFocusCapture={(event) => {
        const card = event.target as Element;
        if (card.matches("a.tree-person-card:focus-visible")) revealElement(card);
      }}
      className="tree-shell relative w-full overflow-hidden rounded-lg border border-line bg-surface shadow-sm"
      style={{
        backgroundImage:
          "linear-gradient(var(--color-line) 1px, transparent 1px), linear-gradient(90deg, var(--color-line) 1px, transparent 1px), radial-gradient(circle at 50% 0%, color-mix(in oklch, var(--color-accent-soft), transparent 28%), transparent 34%)",
        backgroundSize: "42px 42px, 42px 42px, 100% 100%",
      }}
    >
      <p id="tree-keyboard-help" className="sr-only">
        {labels.keyboardHelp}
      </p>

      {loading && (
        <div className="tree-loading" role="status">
          {labels.loading}
        </div>
      )}

      {failed && (
        <div className="tree-loading" role="alert">
          {labels.loadError}
        </div>
      )}

      <svg
        ref={wheelTargetRef}
        className="h-full w-full touch-none select-none"
        style={{
          cursor: isDragging ? "grabbing" : "grab",
          opacity: ready ? 1 : 0,
          transition: "opacity 0.25s ease",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={onClickCapture}
      >
        <g
          transform={`translate(${transform.x},${transform.y}) scale(${transform.k})`}
        >
          <TreeEdges layout={layout} lineage={lineage} />
          {layout.nodes.map((n) => (
            <TreePersonCard
              key={n.person.id}
              node={n}
              basePath={basePath}
              livingLabel={labels.living}
              detailLabels={detailLabels}
              highlighted={highlight === n.person.id}
              dim={nodeDim(n.person.id)}
              onHoverChange={onCardHover}
            />
          ))}
          <TreeToggles
            toggles={layout.toggles}
            showMoreLabel={labels.showMore}
            collapseLabel={labels.collapseAll}
            onToggle={toggle}
          />
        </g>
      </svg>

      <TreeSearch
        labels={labels}
        query={searchQuery}
        normalizedQuery={normalizedSearch}
        results={searchResults}
        onQueryChange={setSearchQuery}
        onFocusPerson={focusPerson}
        onSelectFirst={selectFirstSearchResult}
      />

      {branchPerson && (
        <div className="tree-branch-banner">
          <span>{branchLabel}</span>
          <button type="button" onClick={clearBranch}>
            {labels.showAll}
          </button>
        </div>
      )}

      {/* Legend */}
      <div className="tree-legend pointer-events-none absolute top-[7.35rem] left-4 flex flex-col gap-1.5 rounded-lg border border-line bg-surface/90 px-3 py-2 text-xs text-muted shadow-sm backdrop-blur">
        <span className="flex items-center gap-2">
          <span className="tree-legend-dot tree-legend-dot-female" />
          {labels.female}
        </span>
        <span className="flex items-center gap-2">
          <span className="tree-legend-dot tree-legend-dot-male" />
          {labels.male}
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          {labels.living}
        </span>
        <span className="flex items-center gap-2">
          <span className="tree-legend-dot tree-legend-dot-other" />
          {labels.otherSurname}
        </span>
      </div>

      <TreeControls
        labels={labels}
        isFullscreen={isFullscreen}
        canFullscreen={canFullscreen}
        onExpandAll={expandAll}
        onCollapseAll={collapseAll}
        onToggleFullscreen={toggleFullscreen}
      />

      <TreeZoomControls
        labels={labels}
        onZoomIn={() => zoomBy(1.25)}
        onZoomOut={() => zoomBy(0.8)}
        onReset={fit}
      />

      <p className="tree-hint pointer-events-none absolute bottom-4 left-4 text-xs text-muted">
        {labels.hint}
      </p>
    </div>
  );
}

const marriageLabel = (married?: string, divorced?: string) => {
  if (married && divorced) return `${married} - ${divorced}`;
  return married || divorced || "";
};

/** Connectors only change with the layout or the hovered lineage, not on pan. */
const TreeEdges = memo(function TreeEdges({
  layout,
  lineage,
}: {
  layout: Layout;
  lineage: Set<string> | null;
}) {
  const linkDim = (a: string, b: string) =>
    lineage && !(lineage.has(a) && lineage.has(b)) ? 0.12 : 1;
  const marriageDim = (a: string, b: string) =>
    lineage && !(lineage.has(a) || lineage.has(b)) ? 0.12 : 1;

  return (
    <>
      {layout.links.map((l, i) => (
        <path
          key={`l${i}`}
          d={elbow(l.parentX, l.parentY, l.childX, l.childY)}
          fill="none"
          stroke="var(--color-branch)"
          strokeWidth={2}
          strokeLinejoin="round"
          opacity={linkDim(l.fromId, l.toId)}
          style={{ transition: "opacity 0.2s ease" }}
        />
      ))}
      {layout.marriages.map((m, i) => {
        const label = marriageLabel(m.married, m.divorcedDate);
        return (
          <g
            key={`m${i}`}
            className="tree-marriage-link"
            opacity={marriageDim(m.aId, m.bId)}
            style={{ transition: "opacity 0.2s ease" }}
          >
            {label && <title>{label}</title>}
            {label && (
              <line
                className="tree-marriage-hitbox"
                x1={m.x1}
                y1={m.y}
                x2={m.x2}
                y2={m.y}
                stroke="transparent"
                strokeWidth={24}
              />
            )}
            <line
              x1={m.x1}
              y1={m.y}
              x2={m.x2}
              y2={m.y}
              stroke="var(--color-branch)"
              strokeWidth={2.5}
              strokeDasharray={m.divorced ? "5 5" : undefined}
            />
            {label && (
              <text
                x={(m.x1 + m.x2) / 2}
                y={m.y - 8}
                textAnchor="middle"
                className="tree-marriage-label"
              >
                {label}
              </text>
            )}
          </g>
        );
      })}
    </>
  );
});

const TreeToggles = memo(function TreeToggles({
  toggles,
  showMoreLabel,
  collapseLabel,
  onToggle,
}: {
  toggles: Layout["toggles"];
  showMoreLabel: string;
  collapseLabel: string;
  onToggle: (id: string) => void;
}) {
  return (
    <>
      {toggles.map((tg) => {
        const moreLabel = showMoreLabel.replace("{n}", String(tg.count));
        return (
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
                aria-label={tg.collapsed ? moreLabel : collapseLabel}
                aria-expanded={!tg.collapsed}
                data-tree-control
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => onToggle(tg.anchorId)}
                className="pointer-events-auto flex items-center gap-0.5 rounded-full border border-line bg-surface px-2 py-0.5 text-[11px] font-semibold text-muted shadow-sm transition hover:border-accent hover:text-accent"
              >
                {tg.collapsed ? moreLabel : "\u2212"}
              </button>
            </div>
          </foreignObject>
        );
      })}
    </>
  );
});

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
