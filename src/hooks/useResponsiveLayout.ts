import { useState, useEffect, useCallback, RefObject } from "react";
import type { ResponsiveValue } from "../types";

const BREAKPOINTS: Record<string, number> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

function resolveResponsive(value: ResponsiveValue<number>, width: number): number {
  if (typeof value === "number") return value;

  let result = value.base ?? 1;
  const keys = ["sm", "md", "lg", "xl"] as const;
  for (const key of keys) {
    if (value[key] !== undefined && width >= BREAKPOINTS[key]) {
      result = value[key]!;
    }
  }
  return result;
}

export function useResponsiveLayout(
  containerRef: RefObject<HTMLDivElement | null>,
  trackRef: RefObject<HTMLDivElement | null>,
  gap: number,
  totalItems: number,
  slidesPerView?: ResponsiveValue<number>,
) {
  const [cardWidth, setCardWidth] = useState(300);
  const [visibleCount, setVisibleCount] = useState(1);
  const [slideWidth, setSlideWidth] = useState<number | undefined>(undefined);

  const measure = useCallback(() => {
    if (!containerRef.current) return;
    const cWidth = containerRef.current.offsetWidth;

    if (slidesPerView !== undefined) {
      // Controlled mode: compute slide width from slidesPerView
      const spv = resolveResponsive(slidesPerView, cWidth);
      const effectiveSpv = Math.min(spv, totalItems);
      const sw = (cWidth - gap * (Math.ceil(effectiveSpv) - 1)) / effectiveSpv;
      const singleCardWidth = sw + gap;
      setCardWidth(singleCardWidth);
      setVisibleCount(Math.max(1, Math.floor(effectiveSpv)));
      setSlideWidth(sw);
    } else {
      // Auto mode: measure first child
      if (!trackRef.current?.firstChild) return;
      const child = trackRef.current.firstChild as HTMLElement;
      const singleCardWidth = child.offsetWidth + gap;
      setCardWidth(singleCardWidth);
      setVisibleCount(Math.max(1, Math.floor(cWidth / singleCardWidth)));
      setSlideWidth(undefined);
    }
  }, [containerRef, trackRef, gap, totalItems, slidesPerView]);

  useEffect(() => {
    measure();

    const observer = new ResizeObserver(measure);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [measure]);

  return { cardWidth, visibleCount, slideWidth };
}
