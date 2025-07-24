class ScrollManager {
  init() {
    // Optionally, initialize smoother scroll here in the future
  }

  scrollTo(target: string | number | HTMLElement, options?: {
    offset?: number;
    duration?: number;
    immediate?: boolean;
  }) {
    let scrollTarget: number = 0;
    if (typeof target === "string") {
      const el = document.querySelector(target);
      if (el instanceof HTMLElement) {
        scrollTarget = el.getBoundingClientRect().top + window.pageYOffset;
      }
    } else if (typeof target === "number") {
      scrollTarget = target;
    } else if (target instanceof HTMLElement) {
      scrollTarget = target.getBoundingClientRect().top + window.pageYOffset;
    }
    const offset = options?.offset ?? 0;
    const top = scrollTarget + offset;
    const behavior = options?.immediate ? "auto" : "smooth";
    window.scrollTo({ top, behavior });
  }

  destroy() {}
  stop() {}
  start() {}
  update() {}
}

export const scrollManager = new ScrollManager();

import { useEffect, useRef } from 'react';

/**
 * React hook: Adds a scroll listener to handle menu hide/show based on scroll direction and threshold.
 * @param onVisibilityChange Callback called with true (show) or false (hide)
 * @param options Optional: { threshold: number, getDisable: () => boolean }
 */
export function useMenuScrollHide(
  onVisibilityChange: (isVisible: boolean) => void,
  options?: { threshold?: number; getDisable?: () => boolean }
) {
  const threshold = options?.threshold ?? 10;
  const lastScrollY = useRef(typeof window !== 'undefined' ? window.scrollY : 0);

  useEffect(() => {
    function handleScroll() {
      if (options?.getDisable && options.getDisable()) return;
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;
      if (currentScrollY === 0) {
        onVisibilityChange(true);
      } else if (delta > threshold) {
        onVisibilityChange(false);
      } else if (delta < -threshold) {
        onVisibilityChange(true);
      }
      lastScrollY.current = currentScrollY;
    }
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [onVisibilityChange, threshold, options]);
} 