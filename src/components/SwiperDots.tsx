import React from "react";

interface SwiperDotsProps {
  total: number;
  activeIndex: number;
  onDotClick: (index: number) => void;
}

export const SwiperDots: React.FC<SwiperDotsProps> = ({
  total,
  activeIndex,
  onDotClick,
}) => (
  <div className="ls-dots" role="tablist" aria-label="Slide navigation">
    {Array.from({ length: total }, (_, i) => (
      <button
        key={i}
        type="button"
        className={`ls-dot${i === activeIndex ? " ls-dot--active" : ""}`}
        role="tab"
        aria-selected={i === activeIndex}
        aria-label={`Go to slide ${i + 1}`}
        onClick={() => onDotClick(i)}
      />
    ))}
  </div>
);
