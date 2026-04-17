import { createContext, useContext } from "react";
import type { SwiperContextValue } from "./types";

export const SwiperContext = createContext<SwiperContextValue | null>(null);

export function useSwiperContext(): SwiperContextValue {
  const ctx = useContext(SwiperContext);
  if (!ctx) {
    throw new Error("Swiper sub-components must be used within <SwiperRoot>");
  }
  return ctx;
}
