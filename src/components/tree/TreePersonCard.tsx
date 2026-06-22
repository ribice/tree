import { BOX_H, BOX_W, type PositionedPerson } from "../../lib/tree-layout";
import { treePersonTooltip, type TreeTooltipLabels } from "./tree-person-details";

interface TreePersonCardProps {
  node: PositionedPerson;
  basePath: string;
  livingLabel: string;
  detailLabels: TreeTooltipLabels;
  highlighted: boolean;
  dim: number;
  onHoverChange: (hovering: boolean) => void;
}

export function TreePersonCard({
  node,
  basePath,
  livingLabel,
  detailLabels,
  highlighted,
  dim,
  onHoverChange,
}: TreePersonCardProps) {
  const person = node.person;
  const displayName = person.treeName || person.name;
  const tooltip = treePersonTooltip(person, detailLabels);
  const sexClass =
    person.sex === "f"
      ? "tree-person-female"
      : person.sex === "m"
        ? "tree-person-male"
        : "";

  return (
    <foreignObject
      x={node.x}
      y={node.y}
      width={BOX_W}
      height={BOX_H}
      opacity={dim}
      style={{ transition: "opacity 0.2s ease" }}
    >
      <a
        href={`${basePath}/${person.id}`}
        title={tooltip}
        onMouseEnter={() => onHoverChange(true)}
        onMouseLeave={() => onHoverChange(false)}
        className={`tree-person-card group relative flex h-full w-full items-center gap-3 rounded-lg border bg-surface px-3 py-2.5 shadow-sm transition duration-150 hover:-translate-y-0.5 hover:border-accent hover:shadow-lg ${sexClass} ${
          highlighted
            ? "border-accent ring-2 ring-accent ring-offset-2 ring-offset-paper"
            : "border-line"
        }`}
      >
        {person.living && (
          <span
            className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-surface"
            title={livingLabel}
          />
        )}
        <span
          className={`tree-person-avatar flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full text-base font-semibold ring-1 transition ${sexClass}`}
        >
          {person.photo ? (
            <img
              src={person.photo}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            person.initials
          )}
        </span>
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block truncate pr-2 text-[15px] font-semibold text-ink group-hover:text-accent">
            {displayName}
          </span>
          {person.lifespan && (
            <span className="mt-0.5 block truncate text-xs font-medium text-muted">
              {person.lifespan}
            </span>
          )}
          {person.tagline && (
            <span className="mt-0.5 block truncate text-[11px] text-muted">
              {person.tagline}
            </span>
          )}
        </span>
      </a>
    </foreignObject>
  );
}
