import { useState, useCallback } from "react";

interface UseFadeSwiperOptions {
  totalItems: number;
  infinite: boolean;
  onSlideChange?: (index: number) => void;
}

export function useFadeSwiper({
  totalItems,
  infinite,
  onSlideChange,
}: UseFadeSwiperOptions) {
  const [activeIndex, setActiveIndex] = useState(0);

  const canGoPrev = infinite || activeIndex > 0;
  const canGoNext = infinite || activeIndex < totalItems - 1;

  const goTo = useCallback(
    (index: number) => {
      const clamped = ((index % totalItems) + totalItems) % totalItems;
      setActiveIndex(clamped);
      onSlideChange?.(clamped);
    },
    [totalItems, onSlideChange],
  );

  const next = useCallback(() => {
    if (!canGoNext) return;
    goTo(activeIndex + 1);
  }, [activeIndex, canGoNext, goTo]);

  const prev = useCallback(() => {
    if (!canGoPrev) return;
    goTo(activeIndex - 1);
  }, [activeIndex, canGoPrev, goTo]);

  return {
    activeIndex,
    canGoPrev,
    canGoNext,
    next,
    prev,
    goTo,
  };
}
