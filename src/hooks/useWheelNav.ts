import { useEffect, useRef, RefObject } from "react";

export function useWheelNav(
  containerRef: RefObject<HTMLDivElement | null>,
  prev: () => void,
  next: () => void,
) {
  // Use refs so the event listener always has fresh callbacks
  const prevRef = useRef(prev);
  const nextRef = useRef(next);
  prevRef.current = prev;
  nextRef.current = next;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let accumulated = 0;
    let resetTimer: ReturnType<typeof setTimeout> | null = null;
    const THRESHOLD = 50; // pixels of delta to trigger one slide

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      // Use the dominant axis
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      accumulated += delta;

      // When accumulated delta exceeds threshold, trigger a slide
      if (Math.abs(accumulated) >= THRESHOLD) {
        if (accumulated > 0) nextRef.current();
        else prevRef.current();
        accumulated = 0;
      }

      // Reset accumulation after a pause (new scroll gesture)
      if (resetTimer) clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        accumulated = 0;
      }, 150);
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel);
      if (resetTimer) clearTimeout(resetTimer);
    };
  }, [containerRef]);
}
