import { useState, useEffect, RefObject } from "react";

export function useVisibility(
  elementRef: RefObject<HTMLElement | null>,
): boolean {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") return;

    const el = elementRef.current;
    if (!el) return;

    let inViewport = true;
    let tabVisible = !document.hidden;

    const update = () => setIsVisible(inViewport && tabVisible);

    // Intersection Observer — is element in viewport?
    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewport = entry.isIntersecting;
        update();
      },
      { threshold: 0.1 },
    );
    observer.observe(el);

    // Page Visibility API — is tab active?
    const onVisChange = () => {
      tabVisible = !document.hidden;
      update();
    };
    document.addEventListener("visibilitychange", onVisChange);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisChange);
    };
  }, [elementRef]);

  return isVisible;
}
