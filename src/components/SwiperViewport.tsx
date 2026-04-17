import React, { forwardRef, ReactNode } from "react";

interface SwiperViewportProps {
  children: ReactNode;
  keyboardNavigation: boolean;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export const SwiperViewport = forwardRef<HTMLDivElement, SwiperViewportProps>(
  ({ children, keyboardNavigation, onKeyDown }, ref) => (
    <div
      ref={ref}
      className="ls-viewport"
      role="region"
      aria-roledescription="carousel"
      aria-label="Swiper carousel"
      tabIndex={keyboardNavigation ? 0 : undefined}
      onKeyDown={onKeyDown}
    >
      {children}
    </div>
  ),
);

SwiperViewport.displayName = "SwiperViewport";
