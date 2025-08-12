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

  // New method to ensure page always loads at hero section
  scrollToHero(options?: {
    immediate?: boolean;
    offset?: number;
  }) {
    // First, force scroll to top to ensure we're at the beginning
    window.scrollTo({ top: 0, behavior: "auto" });
    
    // Try multiple selectors to find the hero section, prioritizing aria-label
    const heroSelectors = [
      'section[aria-label*="hero"]', // Section with hero in aria-label (most specific)
      'main section:first-child', // First section in main
      '.hero', // Hero class
      'section:first-of-type', // First section
      'main > section:first-child' // First section in main
    ];

    let heroElement: HTMLElement | null = null;
    
    for (const selector of heroSelectors) {
      const element = document.querySelector(selector);
      if (element instanceof HTMLElement) {
        heroElement = element;
        break;
      }
    }

    if (heroElement) {
      this.scrollTo(heroElement, {
        offset: options?.offset ?? 0,
        immediate: options?.immediate ?? true
      });
    } else {
      // Fallback to top of page
      this.scrollTo(0, {
        immediate: options?.immediate ?? true
      });
    }
  }

  // Enhanced method to ensure page loads at top/hero on navigation
  ensurePageStartsAtTop(options?: {
    immediate?: boolean;
    force?: boolean;
  }) {
    // Always force scroll to top first
    window.scrollTo({ top: 0, behavior: "auto" });
    
    // Also reset body and document scroll positions
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    
    // If force is true or we're at the top, scroll to hero
    if (options?.force || window.scrollY === 0) {
      this.scrollToHero({ immediate: options?.immediate ?? true });
    }
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