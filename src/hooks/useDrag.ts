import { useRef, useCallback, useEffect, RefObject, MutableRefObject } from "react";
import type { DragHandlers } from "../types";

interface UseDragOptions {
  currentRef: MutableRefObject<number>;
  cardWidth: number;
  infinite: boolean;
  canGoPrev: boolean;
  canGoNext: boolean;
  transitionDuration: number;
  dragThreshold: number;
  trackRef: RefObject<HTMLDivElement | null>;
  containerRef: RefObject<HTMLDivElement | null>;
  moveBy: (n: number) => void;
  applyPosition: (index: number, animate: boolean, duration?: number) => void;
  freeScroll?: boolean;
  /** For free-scroll: total loop item count */
  loopCount?: number;
  /** For free-scroll: offset into loop items */
  offset?: number;
  /** For free-scroll: total original items */
  totalItems?: number;
  /** For free-scroll: sync real index after momentum */
  syncIndex?: (idx: number) => void;
}

interface VelocitySample {
  x: number;
  t: number;
}

function rubberBand(delta: number, limit: number): number {
  return delta / (1 + Math.abs(delta) / limit / 0.55);
}

export function useDrag({
  currentRef,
  cardWidth,
  infinite,
  canGoPrev,
  canGoNext,
  transitionDuration,
  dragThreshold,
  trackRef,
  containerRef,
  moveBy,
  applyPosition,
  freeScroll = false,
  loopCount = 0,
  offset = 0,
  totalItems = 0,
  syncIndex,
}: UseDragOptions): DragHandlers {
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const dragDelta = useRef(0);
  const directionLocked = useRef<"h" | "v" | null>(null);
  const velocitySamples = useRef<VelocitySample[]>([]);
  const rafId = useRef<number | null>(null);
  const pointerId = useRef<number | null>(null);
  const momentumId = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
      if (momentumId.current !== null) cancelAnimationFrame(momentumId.current);
    };
  }, []);

  const renderDrag = useCallback(() => {
    if (!trackRef.current) return;
    const base = -currentRef.current * cardWidth;
    let delta = dragDelta.current;

    if (!infinite) {
      const w = containerRef.current?.offsetWidth ?? 400;
      if (!canGoPrev && delta > 0) delta = rubberBand(delta, w);
      else if (!canGoNext && delta < 0) delta = rubberBand(delta, w);
    }

    trackRef.current.style.transition = "none";
    trackRef.current.style.transform = `translateX(${base + delta}px)`;
  }, [currentRef, cardWidth, infinite, canGoPrev, canGoNext, trackRef, containerRef]);

  const getVelocity = useCallback((): number => {
    const s = velocitySamples.current;
    if (s.length < 2) return 0;
    const now = s[s.length - 1].t;
    const recent = s.filter((v) => v.t >= now - 80);
    if (recent.length < 2) return 0;
    const dt = recent[recent.length - 1].t - recent[0].t;
    return dt === 0 ? 0 : (recent[recent.length - 1].x - recent[0].x) / dt;
  }, []);

  // Free-scroll momentum animation
  const startMomentum = useCallback(
    (initialVelocity: number, currentPixelOffset: number) => {
      if (!trackRef.current) return;
      let velocity = initialVelocity; // px per frame (~16ms)
      let pos = currentPixelOffset;

      const animate = () => {
        velocity *= 0.95; // friction
        pos += velocity;

        // Clamp for non-infinite
        if (!infinite) {
          const maxPos = 0;
          const minPos = -((totalItems - 1) * cardWidth);
          if (pos > maxPos) { pos = maxPos; velocity = 0; }
          if (pos < minPos) { pos = minPos; velocity = 0; }
        }

        trackRef.current!.style.transition = "none";
        trackRef.current!.style.transform = `translateX(${pos}px)`;

        if (Math.abs(velocity) > 0.5) {
          momentumId.current = requestAnimationFrame(animate);
        } else {
          // Snap to nearest slide
          momentumId.current = null;
          let nearestIndex = Math.round(-pos / cardWidth);

          // Handle circular reset for infinite
          if (infinite && loopCount > 0) {
            if (nearestIndex >= loopCount - offset) nearestIndex = offset;
            else if (nearestIndex < offset) nearestIndex = loopCount - offset - 1;
          } else {
            nearestIndex = Math.max(0, Math.min(nearestIndex, totalItems - 1));
          }

          currentRef.current = nearestIndex;
          applyPosition(nearestIndex, true, transitionDuration);
          syncIndex?.(nearestIndex);
        }
      };

      momentumId.current = requestAnimationFrame(animate);
    },
    [trackRef, cardWidth, infinite, totalItems, loopCount, offset, currentRef, applyPosition, transitionDuration, syncIndex],
  );

  const endDrag = useCallback(() => {
    if (!isDragging.current || !trackRef.current) return;
    isDragging.current = false;
    directionLocked.current = null;

    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }

    if (pointerId.current !== null) {
      try { trackRef.current.releasePointerCapture(pointerId.current); } catch {}
      pointerId.current = null;
    }

    const velocity = getVelocity();
    const delta = dragDelta.current;
    dragDelta.current = 0;
    velocitySamples.current = [];

    if (freeScroll) {
      // Free-scroll: momentum physics
      const currentPixelPos = -currentRef.current * cardWidth + delta;
      const pixelVelocity = velocity * 16; // convert px/ms to px/frame
      if (Math.abs(pixelVelocity) > 1) {
        startMomentum(pixelVelocity, currentPixelPos);
      } else {
        // No momentum — snap to nearest
        const nearest = Math.round(-currentPixelPos / cardWidth);
        const clamped = infinite ? nearest : Math.max(0, Math.min(nearest, totalItems - 1));
        currentRef.current = clamped;
        applyPosition(clamped, true, transitionDuration);
        syncIndex?.(clamped);
      }
      return;
    }

    // Standard discrete mode
    const absV = Math.abs(velocity);
    const absD = Math.abs(delta);
    let slides = 0;

    if (absV > 0.6) {
      slides = Math.min(4, Math.max(1, Math.round(absV / 0.4)));
    } else if (absD > dragThreshold) {
      slides = Math.max(1, Math.round(absD / cardWidth));
    }

    if (slides > 0) {
      const dir = (velocity !== 0 ? velocity : delta) > 0 ? -1 : 1;
      moveBy(dir * slides);
    } else {
      applyPosition(currentRef.current, true);
    }
  }, [currentRef, cardWidth, dragThreshold, trackRef, moveBy, applyPosition, getVelocity, freeScroll, startMomentum, infinite, totalItems, transitionDuration, syncIndex]);

  const moveDrag = useCallback(
    (e: PointerEvent) => {
      if (!isDragging.current) return;

      const dx = e.clientX - startX.current;
      const dy = e.clientY - startY.current;

      if (directionLocked.current === null) {
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
        if (Math.abs(dy) > Math.abs(dx) * 1.2) {
          directionLocked.current = "v";
          isDragging.current = false;
          if (pointerId.current !== null && trackRef.current) {
            try { trackRef.current.releasePointerCapture(pointerId.current); } catch {}
          }
          applyPosition(currentRef.current, true);
          return;
        }
        directionLocked.current = "h";
      }
      if (directionLocked.current !== "h") return;

      dragDelta.current = dx;
      velocitySamples.current.push({ x: dx, t: e.timeStamp });

      const cutoff = e.timeStamp - 100;
      if (velocitySamples.current.length > 20) {
        velocitySamples.current = velocitySamples.current.filter((s) => s.t >= cutoff);
      }

      if (rafId.current === null) {
        rafId.current = requestAnimationFrame(() => {
          rafId.current = null;
          renderDrag();
        });
      }
    },
    [currentRef, trackRef, applyPosition, renderDrag],
  );

  useEffect(() => {
    const up = () => endDrag();
    window.addEventListener("pointermove", moveDrag);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", moveDrag);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [moveDrag, endDrag]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0) return;

      // Stop any ongoing momentum
      if (momentumId.current !== null) {
        cancelAnimationFrame(momentumId.current);
        momentumId.current = null;
      }

      isDragging.current = true;
      startX.current = e.clientX;
      startY.current = e.clientY;
      dragDelta.current = 0;
      directionLocked.current = null;
      velocitySamples.current = [];
      pointerId.current = e.pointerId;

      if (trackRef.current) {
        trackRef.current.setPointerCapture(e.pointerId);
        const computed = getComputedStyle(trackRef.current);
        const currentTransform = computed.transform;
        trackRef.current.style.transition = "none";
        trackRef.current.style.transform = currentTransform;
      }
    },
    [trackRef],
  );

  return { onPointerDown };
}
