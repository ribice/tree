const TREE_CONTROL_SELECTOR =
  'button, input, select, textarea, [role="button"], [data-tree-control]';

export function isInteractiveTreeTarget(target: EventTarget | null): boolean {
  const maybeElement = target as { closest?: (selector: string) => Element | null } | null;
  return typeof maybeElement?.closest === "function"
    ? Boolean(maybeElement.closest(TREE_CONTROL_SELECTOR))
    : false;
}

export function shouldSuppressTreeClick(
  moved: number,
  target: EventTarget | null,
): boolean {
  return moved > 6 && !isInteractiveTreeTarget(target);
}
