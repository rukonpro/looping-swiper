import React, { ReactNode, CSSProperties } from "react";
import type { SwiperTheme } from "../types";

interface SwiperRootProps {
  children: ReactNode;
  theme?: SwiperTheme | (string & {});
  className?: string;
  style?: CSSProperties;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const SwiperRoot: React.FC<SwiperRootProps> = ({
  children,
  theme = "light",
  className,
  style,
  onMouseEnter,
  onMouseLeave,
}) => (
  <div
    className={className ? `ls-root ${className}` : "ls-root"}
    data-swiper-theme={theme}
    style={style}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    {children}
  </div>
);
