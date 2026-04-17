import { ReactNode, CSSProperties, RefObject } from "react";

export type SwiperTheme =
  | "light"
  | "dark"
  | "midnight"
  | "ocean"
  | "sunset"
  | "forest"
  | "lavender"
  | "rose"
  | "slate"
  | "ember"
  | "arctic"
  | "neon"
  | "pastel"
  | "monochrome"
  | "cyberpunk"
  | "retro"
  | "minimal"
  | "glass"
  | "brutalist"
  | "candy"
  | "earth"
  | "sapphire"
  | "copper"
  | "aurora"
  | "storm";

export type ResponsiveValue<T> = T | {
  base?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
};

export interface LoopingSwiperProps {
  children: ReactNode[];
  /** Visual theme (default: "light") */
  theme?: SwiperTheme | (string & {});
  /** Gap between cards in pixels (default: 20) */
  gap?: number;
  /** Enable infinite circular looping (default: false) */
  infinite?: boolean;
  /** Show navigation arrows (default: true) */
  showNavigation?: boolean;
  /** Show pagination dots (default: false) */
  showDots?: boolean;
  /** Show progress bar (default: false) */
  showProgressBar?: boolean;
  /** Enable autoplay (default: false) */
  autoplay?: boolean;
  /** Autoplay interval in ms (default: 3000) */
  autoplayInterval?: number;
  /** Pause autoplay on hover (default: true) */
  pauseOnHover?: boolean;
  /** Enable keyboard navigation (default: true) */
  keyboardNavigation?: boolean;
  /** Drag threshold in px to trigger slide change (default: 50) */
  dragThreshold?: number;
  /** Transition duration in ms (default: 300) */
  transitionDuration?: number;
  /** Number of slides visible at once. Supports responsive breakpoints. */
  slidesPerView?: ResponsiveValue<number>;
  /** Enable free-scroll mode with momentum and snap (default: false) */
  freeScroll?: boolean;
  /** Transition effect (default: "slide") */
  effect?: "slide" | "fade";
  /** Callback when active slide changes */
  onSlideChange?: (index: number) => void;
  /** Custom class name for the container */
  className?: string;
  /** Custom styles for the container */
  style?: CSSProperties;
  /** Custom render for the prev button */
  renderPrevButton?: (onClick: () => void, disabled: boolean) => ReactNode;
  /** Custom render for the next button */
  renderNextButton?: (onClick: () => void, disabled: boolean) => ReactNode;
}

export interface SwiperState {
  current: number;
  realIndex: number;
  totalItems: number;
  visibleCount: number;
  cardWidth: number;
  isTransitioning: boolean;
  canGoPrev: boolean;
  canGoNext: boolean;
}

export interface SwiperActions {
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
}

export interface DragHandlers {
  onPointerDown: (e: React.PointerEvent) => void;
}

export interface SwiperContextValue extends SwiperState, SwiperActions {
  config: SwiperConfig;
  trackRef: RefObject<HTMLDivElement | null>;
  containerRef: RefObject<HTMLDivElement | null>;
  dragHandlers: DragHandlers;
}

export interface SwiperConfig {
  gap: number;
  infinite: boolean;
  dragThreshold: number;
  transitionDuration: number;
  autoplay: boolean;
  autoplayInterval: number;
  pauseOnHover: boolean;
  keyboardNavigation: boolean;
}
