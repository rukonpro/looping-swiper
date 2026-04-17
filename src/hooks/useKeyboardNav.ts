import { useCallback } from "react";

export function useKeyboardNav(
  enabled: boolean,
  prev: () => void,
  next: () => void,
) {
  return useCallback(
    (e: React.KeyboardEvent) => {
      if (!enabled) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      }
    },
    [enabled, prev, next],
  );
}
