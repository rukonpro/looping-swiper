import React from "react";

interface SwiperProgressBarProps {
  total: number;
  activeIndex: number;
}

export const SwiperProgressBar: React.FC<SwiperProgressBarProps> = ({
  total,
  activeIndex,
}) => {
  const progress = total > 1 ? ((activeIndex + 1) / total) * 100 : 100;

  return (
    <div
      className="ls-progress"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Slide ${activeIndex + 1} of ${total}`}
    >
      <div
        className="ls-progress-bar"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
