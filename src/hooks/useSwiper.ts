import { useState, useRef, useEffect, useCallback, RefObject } from "react";

const DURATION_INCREMENT = 80;

interface UseSwiperOptions {
  totalItems: number;
  infinite: boolean;
  cardWidth: number;
  visibleCount: number;
  transitionDuration: number;
  trackRef: RefObject<HTMLDivElement | null>;
  onSlideChange?: (index: number) => void;
}

export function useSwiper({
  totalItems,
  infinite,
  cardWidth,
  visibleCount,
  transitionDuration,
  trackRef,
  onSlideChange,
}: UseSwiperOptions) {
  const loopCount = infinite ? totalItems * 3 : totalItems;
  const offset = infinite ? totalItems : 0;

  const currentRef = useRef(offset);
  const [realIndex, setRealIndex] = useState(0);

  const computeReal = useCallback(
    (idx: number) => ((idx - offset) % totalItems + totalItems) % totalItems,
    [offset, totalItems],
  );

  // Compute adaptive duration: more slides = longer animation, capped at 3x base
  const adaptiveDuration = useCallback(
    (distance: number) => {
      if (transitionDuration === 0) return 0;
      const d = Math.abs(distance);
      if (d <= 1) return transitionDuration;
      return Math.min(
        transitionDuration + (d - 1) * DURATION_INCREMENT,
        transitionDuration * 3,
      );
    },
    [transitionDuration],
  );

  // Apply transform imperatively — THE ONLY place track position is set
  const applyPosition = useCallback(
    (index: number, animate: boolean, durationOverride?: number) => {
      if (!trackRef.current) return;
      if (animate) {
        const dur = durationOverride ?? transitionDuration;
        trackRef.current.style.transition = `transform ${dur}ms cubic-bezier(0.25, 1, 0.5, 1)`;
      } else {
        trackRef.current.style.transition = "none";
      }
      trackRef.current.style.transform = `translateX(-${index * cardWidth}px)`;
    },
    [trackRef, transitionDuration, cardWidth],
  );

  // Initial position (no animation)
  useEffect(() => {
    applyPosition(currentRef.current, false);
  }, [cardWidth, applyPosition]);

  // Circular seamless reset — uses transitionend
  useEffect(() => {
    const track = trackRef.current;
    if (!track || !infinite) return;

    const handleTransitionEnd = (e: TransitionEvent) => {
      if (e.target !== track || e.propertyName !== "transform") return;

      const cur = currentRef.current;
      let resetTo: number | null = null;

      if (cur >= loopCount - offset) {
        resetTo = offset + (cur - (loopCount - offset));
      } else if (cur < offset) {
        resetTo = loopCount - offset + (cur - offset);
      }

      if (resetTo !== null) {
        currentRef.current = resetTo;
        applyPosition(resetTo, false);
        void track.offsetWidth;
      }
    };

    track.addEventListener("transitionend", handleTransitionEnd);
    return () => track.removeEventListener("transitionend", handleTransitionEnd);
  }, [infinite, loopCount, offset, trackRef, applyPosition]);

  const canGoPrev = useCallback(
    () => infinite || currentRef.current > 0,
    [infinite],
  );

  const canGoNext = useCallback(
    () => infinite || currentRef.current < totalItems - visibleCount,
    [infinite, totalItems, visibleCount],
  );

  const syncRealIndex = useCallback(
    (idx: number) => {
      const r = computeReal(idx);
      setRealIndex(r);
      onSlideChange?.(r);
    },
    [computeReal, onSlideChange],
  );

  const next = useCallback(() => {
    if (!canGoNext()) return;
    currentRef.current += 1;
    applyPosition(currentRef.current, true);
    syncRealIndex(currentRef.current);
  }, [canGoNext, applyPosition, syncRealIndex]);

  const prev = useCallback(() => {
    if (!canGoPrev()) return;
    currentRef.current -= 1;
    applyPosition(currentRef.current, true);
    syncRealIndex(currentRef.current);
  }, [canGoPrev, applyPosition, syncRealIndex]);

  const goTo = useCallback(
    (index: number) => {
      const distance = Math.abs(offset + index - currentRef.current);
      currentRef.current = offset + index;
      applyPosition(currentRef.current, true, adaptiveDuration(distance));
      syncRealIndex(currentRef.current);
    },
    [offset, applyPosition, adaptiveDuration, syncRealIndex],
  );

  const moveBy = useCallback(
    (n: number) => {
      let target = currentRef.current + n;
      if (!infinite) {
        target = Math.max(0, Math.min(target, totalItems - visibleCount));
      }
      const distance = Math.abs(target - currentRef.current);
      currentRef.current = target;
      applyPosition(currentRef.current, true, adaptiveDuration(distance));
      syncRealIndex(currentRef.current);
    },
    [infinite, totalItems, visibleCount, applyPosition, adaptiveDuration, syncRealIndex],
  );

  return {
    get current() {
      return currentRef.current;
    },
    currentRef,
    realIndex,
    canGoPrev: canGoPrev(),
    canGoNext: canGoNext(),
    loopCount,
    offset,
    next,
    prev,
    goTo,
    moveBy,
    applyPosition,
  };
}
