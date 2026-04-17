import React, { useRef, useState, Children, useMemo } from "react";
import type { LoopingSwiperProps } from "../types";
import { DEFAULT_CONFIG } from "../constants";
import {
  useSwiper,
  useResponsiveLayout,
  useDrag,
  useAutoplay,
  useKeyboardNav,
  useWheelNav,
  useReducedMotion,
  useVisibility,
  useFadeSwiper,
} from "../hooks";
import { SwiperRoot } from "./SwiperRoot";
import { SwiperViewport } from "./SwiperViewport";
import { SwiperTrack } from "./SwiperTrack";
import { SwiperSlide } from "./SwiperSlide";
import { SwiperNavButton } from "./SwiperNavButton";
import { SwiperDots } from "./SwiperDots";
import { SwiperProgressBar } from "./SwiperProgressBar";

export const LoopingSwiper: React.FC<LoopingSwiperProps> = ({
  children,
  theme = "light",
  gap = DEFAULT_CONFIG.gap,
  infinite = DEFAULT_CONFIG.infinite,
  showNavigation = true,
  showDots = false,
  showProgressBar = false,
  autoplay = DEFAULT_CONFIG.autoplay,
  autoplayInterval = DEFAULT_CONFIG.autoplayInterval,
  pauseOnHover = DEFAULT_CONFIG.pauseOnHover,
  keyboardNavigation = DEFAULT_CONFIG.keyboardNavigation,
  dragThreshold = DEFAULT_CONFIG.dragThreshold,
  transitionDuration = DEFAULT_CONFIG.transitionDuration,
  slidesPerView,
  freeScroll = false,
  effect = "slide",
  onSlideChange,
  className,
  style,
  renderPrevButton,
  renderNextButton,
}) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const items = Children.toArray(children);
  const totalItems = items.length;

  // Smart features
  const reducedMotion = useReducedMotion();
  const isVisible = useVisibility(containerRef);
  const effectiveDuration = reducedMotion ? 0 : transitionDuration;
  const effectivelyPaused = isPaused || !isVisible;

  // Fade mode incompatibilities
  const isFade = effect === "fade";
  const effectiveFreeScroll = isFade ? false : freeScroll;
  const effectiveSlidesPerView = isFade ? undefined : slidesPerView;

  const { cardWidth, visibleCount, slideWidth } = useResponsiveLayout(
    containerRef,
    trackRef,
    gap,
    totalItems,
    effectiveSlidesPerView,
  );

  // ─── Slide Mode ─────────────────────────────────────────────────────

  const swiper = useSwiper({
    totalItems,
    infinite,
    cardWidth,
    visibleCount,
    transitionDuration: effectiveDuration,
    trackRef,
    onSlideChange: isFade ? undefined : onSlideChange,
  });

  const dragHandlers = useDrag({
    currentRef: swiper.currentRef,
    cardWidth,
    infinite,
    canGoPrev: swiper.canGoPrev,
    canGoNext: swiper.canGoNext,
    transitionDuration: effectiveDuration,
    dragThreshold,
    trackRef,
    containerRef,
    moveBy: swiper.moveBy,
    applyPosition: swiper.applyPosition,
    freeScroll: effectiveFreeScroll,
    loopCount: swiper.loopCount,
    offset: swiper.offset,
    totalItems,
    syncIndex: (idx) => {
      const real = ((idx - swiper.offset) % totalItems + totalItems) % totalItems;
      onSlideChange?.(real);
    },
  });

  // ─── Fade Mode ──────────────────────────────────────────────────────

  const fade = useFadeSwiper({
    totalItems,
    infinite,
    onSlideChange: isFade ? onSlideChange : undefined,
  });

  // Unified navigation
  const navNext = isFade ? fade.next : swiper.next;
  const navPrev = isFade ? fade.prev : swiper.prev;
  const navGoTo = isFade ? fade.goTo : swiper.goTo;
  const canPrev = isFade ? fade.canGoPrev : swiper.canGoPrev;
  const canNext = isFade ? fade.canGoNext : swiper.canGoNext;
  const activeIndex = isFade ? fade.activeIndex : swiper.realIndex;

  useAutoplay(autoplay, autoplayInterval, effectivelyPaused, navNext);
  const onKeyDown = useKeyboardNav(keyboardNavigation, navPrev, navNext);
  useWheelNav(containerRef, navPrev, navNext);

  // ─── Build items array ──────────────────────────────────────────────

  const loopItems = useMemo(() => {
    if (isFade) return items; // No cloning for fade
    if (!infinite) return items;
    // Virtual cloning: buffer = visibleCount + 1
    const buffer = Math.min(visibleCount + 1, totalItems);
    if (totalItems <= visibleCount + 1) {
      // Small list: fallback to 3x
      return [...items, ...items, ...items];
    }
    return [...items.slice(-buffer), ...items, ...items.slice(0, buffer)];
  }, [isFade, infinite, items, visibleCount, totalItems]);

  // ─── Render ─────────────────────────────────────────────────────────

  return (
    <SwiperRoot
      theme={theme}
      className={className}
      style={style}
      onMouseEnter={() => {
        if (pauseOnHover && autoplay) setIsPaused(true);
      }}
      onMouseLeave={() => {
        if (pauseOnHover && autoplay) setIsPaused(false);
      }}
    >
      <SwiperViewport
        ref={containerRef}
        keyboardNavigation={keyboardNavigation}
        onKeyDown={onKeyDown}
      >
        {showNavigation &&
          (renderPrevButton ? (
            renderPrevButton(navPrev, !canPrev)
          ) : (
            <SwiperNavButton direction="prev" onClick={navPrev} disabled={!canPrev} />
          ))}

        <SwiperTrack
          ref={trackRef}
          dragHandlers={isFade ? undefined : dragHandlers}
          fadeMode={isFade}
        >
          {loopItems.map((child, idx) => (
            <SwiperSlide
              key={`slide-${idx}`}
              index={idx}
              totalItems={totalItems}
              gap={isFade ? 0 : gap}
              isLast={idx === loopItems.length - 1}
              width={slideWidth}
              fadeMode={isFade}
              isActive={isFade ? idx === fade.activeIndex : undefined}
            >
              {child}
            </SwiperSlide>
          ))}
        </SwiperTrack>

        {showNavigation &&
          (renderNextButton ? (
            renderNextButton(navNext, !canNext)
          ) : (
            <SwiperNavButton direction="next" onClick={navNext} disabled={!canNext} />
          ))}
      </SwiperViewport>

      {showDots && totalItems > 1 && (
        <SwiperDots total={totalItems} activeIndex={activeIndex} onDotClick={navGoTo} />
      )}

      {showProgressBar && totalItems > 1 && (
        <SwiperProgressBar total={totalItems} activeIndex={activeIndex} />
      )}
    </SwiperRoot>
  );
};
