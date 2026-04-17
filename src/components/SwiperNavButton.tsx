import React, { ReactNode } from "react";

interface SwiperNavButtonProps {
  direction: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
}

export const SwiperNavButton: React.FC<SwiperNavButtonProps> = ({
  direction,
  onClick,
  disabled,
}) => (
  <button
    type="button"
    className={`ls-nav-button ls-nav-button--${direction}`}
    aria-label={direction === "prev" ? "Previous slide" : "Next slide"}
    onClick={onClick}
    disabled={disabled}
  >
    {direction === "prev" ? "\u2039" : "\u203A"}
  </button>
);
