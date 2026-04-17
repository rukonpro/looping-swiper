import React, { forwardRef, ReactNode } from "react";
import type { DragHandlers } from "../types";

interface SwiperTrackProps {
  children: ReactNode;
  dragHandlers?: DragHandlers;
  fadeMode?: boolean;
}

export const SwiperTrack = forwardRef<HTMLDivElement, SwiperTrackProps>(
  ({ children, dragHandlers, fadeMode }, ref) => (
    <div
      ref={ref}
      className={fadeMode ? "ls-track ls-track--fade" : "ls-track"}
      aria-live="polite"
      style={fadeMode ? undefined : { touchAction: "pan-y pinch-zoom" }}
      onPointerDown={dragHandlers?.onPointerDown}
    >
      {children}
    </div>
  ),
);

SwiperTrack.displayName = "SwiperTrack";
