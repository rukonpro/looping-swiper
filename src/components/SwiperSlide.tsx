import React, { ReactNode } from "react";

interface SwiperSlideProps {
  children: ReactNode;
  index: number;
  totalItems: number;
  gap: number;
  isLast: boolean;
  /** When slidesPerView is set, each slide gets an explicit width */
  width?: number;
  /** For fade mode: is this the active slide? */
  isActive?: boolean;
  /** For fade mode */
  fadeMode?: boolean;
}

export const SwiperSlide: React.FC<SwiperSlideProps> = ({
  children,
  index,
  totalItems,
  gap,
  isLast,
  width,
  isActive,
  fadeMode,
}) => (
  <div
    className={`ls-slide${fadeMode && isActive ? " ls-slide--active" : ""}`}
    role="group"
    aria-roledescription="slide"
    aria-label={`Slide ${(index % totalItems) + 1} of ${totalItems}`}
    aria-hidden={fadeMode ? !isActive : undefined}
    style={{
      marginRight: fadeMode ? 0 : isLast ? 0 : gap,
      width: width !== undefined ? width : undefined,
    }}
  >
    {children}
  </div>
);
