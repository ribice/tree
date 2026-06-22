import type { ReactNode } from "react";

interface TreeControlsLabels {
  expandAll: string;
  collapseAll: string;
  fullscreen: string;
  exitFullscreen: string;
  zoomIn: string;
  zoomOut: string;
  reset: string;
}

interface TreeControlsProps {
  labels: TreeControlsLabels;
  isFullscreen: boolean;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  onToggleFullscreen: () => void;
}

interface TreeZoomControlsProps {
  labels: TreeControlsLabels;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

export function TreeControls({
  labels,
  isFullscreen,
  onExpandAll,
  onCollapseAll,
  onToggleFullscreen,
}: TreeControlsProps) {
  return (
    <div className="tree-controls absolute top-4 right-4 flex gap-1.5">
      <PillButton onClick={onExpandAll}>{labels.expandAll}</PillButton>
      <PillButton onClick={onCollapseAll}>{labels.collapseAll}</PillButton>
      <PillButton onClick={onToggleFullscreen}>
        {isFullscreen ? labels.exitFullscreen : labels.fullscreen}
      </PillButton>
    </div>
  );
}

export function TreeZoomControls({
  labels,
  onZoomIn,
  onZoomOut,
  onReset,
}: TreeZoomControlsProps) {
  return (
    <div className="absolute right-4 bottom-4 flex flex-col gap-1.5">
      <ControlButton label={labels.zoomIn} onClick={onZoomIn}>
        +
      </ControlButton>
      <ControlButton label={labels.zoomOut} onClick={onZoomOut}>
        -
      </ControlButton>
      <ControlButton label={labels.reset} onClick={onReset}>
        []
      </ControlButton>
    </div>
  );
}

function PillButton({
  children,
  onClick,
}: {
  children: ReactNode;
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
  children: ReactNode;
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
