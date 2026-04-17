import { useEffect } from "react";

export function useAutoplay(
  enabled: boolean,
  interval: number,
  isPaused: boolean,
  next: () => void,
) {
  useEffect(() => {
    if (!enabled || isPaused) return;
    const id = setInterval(next, interval);
    return () => clearInterval(id);
  }, [enabled, interval, isPaused, next]);
}
