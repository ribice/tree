import { useCallback, useEffect, useRef, useState } from "react";
import type { MouseEvent, PointerEvent } from "react";
import { BOX_H, BOX_W, type Layout } from "../../lib/tree-layout";
import {
  isInteractiveTreeTarget,
  shouldSuppressTreeClick,
} from "./tree-interactions";

export interface Transform {
  x: number;
  y: number;
  k: number;
}

const MIN_K = 0.25;
const MAX_K = 2.5;
const MAX_FIT_K = 1.05;
const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function useTreeViewport(layout: Layout, fitKey: string) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wheelTargetRef = useRef<SVGSVGElement>(null);
  const layoutRef = useRef(layout);
  layoutRef.current = layout;

  const [transform, setTransform] = useState<Transform>({ x: 0, y: 0, k: 1 });
  const transformRef = useRef(transform);
  transformRef.current = transform;

  const [ready, setReady] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
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

  const fit = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const lay = layoutRef.current;
    if (!lay.nodes.length) return;
    const vw = el.clientWidth;
    const vh = el.clientHeight;
    if (vw < 640) {
      const rootNode =
        lay.nodes.find((node) => node.person.id === "avdikadija") ?? lay.nodes[0];
      if (rootNode) {
        const k = clamp(Math.min(0.84, vw / (BOX_W * 1.18)), 0.55, 0.84);
        setTransform({
          k,
          x: Math.max(16, (vw - BOX_W * k) / 2) - rootNode.x * k,
          y: 156 - rootNode.y * k,
        });
        return;
      }
    }
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
  }, []);

  useEffect(() => {
    fit();
    setReady(true);
    const el = containerRef.current;
    if (!el) return;
    const resizeObserver = new ResizeObserver(() => fit());
    resizeObserver.observe(el);
    return () => resizeObserver.disconnect();
  }, [fit]);

  useEffect(() => {
    fit();
  }, [fit, fitKey]);

  const localPoint = (clientX: number, clientY: number) => {
    const rect = containerRef.current!.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startPinch = () => {
    const [p1, p2] = [...pointers.current.values()];
    const mid = localPoint((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
    pinch.current = {
      dist: Math.hypot(p2.x - p1.x, p2.y - p1.y),
      k: transformRef.current.k,
      x: transformRef.current.x,
      y: transformRef.current.y,
      mx: mid.x,
      my: mid.y,
    };
  };

  const onWheel = useCallback((event: WheelEvent) => {
    event.preventDefault();
    const el = containerRef.current!;
    const rect = el.getBoundingClientRect();
    const px = event.clientX - rect.left;
    const py = event.clientY - rect.top;
    const { x, y, k } = transformRef.current;
    const factor = Math.exp(-event.deltaY * 0.0012);
    const nextK = clamp(k * factor, MIN_K, MAX_K);
    setTransform({
      k: nextK,
      x: px - ((px - x) / k) * nextK,
      y: py - ((py - y) / k) * nextK,
    });
  }, []);

  useEffect(() => {
    const el = wheelTargetRef.current;
    if (!el) return;
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [onWheel]);

  const onPointerDown = (event: PointerEvent) => {
    if (isInteractiveTreeTarget(event.target)) return;
    (event.target as Element).setPointerCapture?.(event.pointerId);
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.current.size === 1) {
      drag.current = {
        active: true,
        sx: event.clientX,
        sy: event.clientY,
        ox: transformRef.current.x,
        oy: transformRef.current.y,
        moved: 0,
      };
      setIsDragging(true);
    } else if (pointers.current.size === 2) {
      drag.current.active = false;
      setIsDragging(false);
      startPinch();
    }
  };

  const onPointerMove = (event: PointerEvent) => {
    if (pointers.current.has(event.pointerId)) {
      pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    }

    if (pointers.current.size >= 2 && pinch.current) {
      const [p1, p2] = [...pointers.current.values()];
      const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      const mid = localPoint((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
      const start = pinch.current;
      const nextK = clamp((start.k * dist) / start.dist, MIN_K, MAX_K);
      const wx = (start.mx - start.x) / start.k;
      const wy = (start.my - start.y) / start.k;
      setTransform({ k: nextK, x: mid.x - wx * nextK, y: mid.y - wy * nextK });
      return;
    }

    const currentDrag = drag.current;
    if (!currentDrag.active) return;
    const dx = event.clientX - currentDrag.sx;
    const dy = event.clientY - currentDrag.sy;
    currentDrag.moved = Math.max(currentDrag.moved, Math.abs(dx) + Math.abs(dy));
    setTransform((current) => ({
      ...current,
      x: currentDrag.ox + dx,
      y: currentDrag.oy + dy,
    }));
  };

  const onPointerUp = (event: PointerEvent) => {
    pointers.current.delete(event.pointerId);
    pinch.current = null;
    if (pointers.current.size === 1) {
      const [pointer] = [...pointers.current.values()];
      drag.current = {
        active: true,
        sx: pointer.x,
        sy: pointer.y,
        ox: transformRef.current.x,
        oy: transformRef.current.y,
        moved: 999,
      };
      setIsDragging(true);
    } else if (pointers.current.size === 0) {
      drag.current.active = false;
      setIsDragging(false);
    }
  };

  const onClickCapture = (event: MouseEvent) => {
    if (shouldSuppressTreeClick(drag.current.moved, event.target)) {
      event.preventDefault();
      event.stopPropagation();
    }
    drag.current.moved = 0;
  };

  const zoomBy = (factor: number) => {
    const el = containerRef.current!;
    const px = el.clientWidth / 2;
    const py = el.clientHeight / 2;
    const { x, y, k } = transformRef.current;
    const nextK = clamp(k * factor, MIN_K, MAX_K);
    setTransform({
      k: nextK,
      x: px - ((px - x) / k) * nextK,
      y: py - ((py - y) / k) * nextK,
    });
  };

  return {
    containerRef,
    wheelTargetRef,
    transform,
    setTransform,
    ready,
    isDragging,
    fit,
    zoomBy,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onClickCapture,
  };
}
