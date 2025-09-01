class ScrollManager {
  private isScrolling = false;
  private scrollQueue: Array<() => void> = [];
  private scrollTimeout: NodeJS.Timeout | null = null;
  private isDestroyed = false;

  init() {
    // Optionally, initialize smoother scroll here in the future
    this.isDestroyed = false;
  }

  // Detect Safari browser
  private isSafari(): boolean {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  }

  // Safari-specific scroll handling
  private async safariScrollToTop(): Promise<void> {
    return new Promise((resolve) => {
      // Safari needs multiple approaches to ensure scroll to top works
      try {
        // Method 1: Direct scroll to top
        window.scrollTo({ top: 0, behavior: "auto" });
        
        // Method 2: Reset body and document scroll positions
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        
        // Method 3: Use scrollIntoView on body
        document.body.scrollIntoView({ behavior: "auto", block: "start" });
        
        // Method 4: Force layout recalculation
        document.body.offsetHeight;
        
        // Method 5: Additional scroll reset after a brief delay
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: "auto" });
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;
          resolve();
        }, 50);
      } catch (error) {
        console.warn('Safari scroll to top failed:', error);
        resolve();
      }
    });
  }

  private async executeScroll(scrollOperation: () => void): Promise<void> {
    if (this.isDestroyed) return;

    return new Promise((resolve) => {
      if (this.isScrolling) {
        // Queue the scroll operation
        this.scrollQueue.push(() => {
          this.executeScroll(scrollOperation).then(resolve);
        });
        return;
      }

      this.isScrolling = true;
      
      try {
        scrollOperation();
        
        // Clear any existing timeout
        if (this.scrollTimeout) {
          clearTimeout(this.scrollTimeout);
        }
        
        // Set a timeout to allow the next scroll operation
        this.scrollTimeout = setTimeout(() => {
          this.isScrolling = false;
          this.processQueue();
        }, 100); // Reduced from previous delays to improve responsiveness
        
      } catch (error) {
        console.warn('Scroll operation failed:', error);
        this.isScrolling = false;
        this.processQueue();
      }
      
      resolve();
    });
  }

  private processQueue(): void {
    if (this.scrollQueue.length > 0 && !this.isScrolling) {
      const nextScroll = this.scrollQueue.shift();
      if (nextScroll) {
        nextScroll();
      }
    }
  }

  async scrollTo(target: string | number | HTMLElement, options?: {
    offset?: number;
    duration?: number;
    immediate?: boolean;
  }): Promise<void> {
    if (this.isDestroyed) return;

    return this.executeScroll(() => {
      let scrollTarget: number = 0;
      
      try {
        if (typeof target === "string") {
          const el = document.querySelector(target);
          if (el instanceof HTMLElement) {
            scrollTarget = el.getBoundingClientRect().top + window.pageYOffset;
          } else {
            console.warn(`Element with selector "${target}" not found`);
            return;
          }
        } else if (typeof target === "number") {
          scrollTarget = target;
        } else if (target instanceof HTMLElement) {
          scrollTarget = target.getBoundingClientRect().top + window.pageYOffset;
        } else {
          console.warn('Invalid scroll target');
          return;
        }

        const offset = options?.offset ?? 0;
        const top = Math.max(0, scrollTarget + offset); // Ensure we don't scroll to negative values
        const behavior = options?.immediate ? "auto" : "smooth";
        
        window.scrollTo({ top, behavior });
      } catch (error) {
        console.warn('Error in scrollTo:', error);
        // Fallback to immediate scroll to top
        window.scrollTo({ top: 0, behavior: "auto" });
      }
    });
  }

  // Enhanced method to ensure page always loads at hero section
  async scrollToHero(options?: {
    immediate?: boolean;
    offset?: number;
  }): Promise<void> {
    if (this.isDestroyed) return;

    return this.executeScroll(async () => {
      try {
        // Safari-specific handling for scroll to top
        if (this.isSafari()) {
          await this.safariScrollToTop();
        } else {
          // First, force scroll to top to ensure we're at the beginning
          window.scrollTo({ top: 0, behavior: "auto" });
          
          // Also reset body and document scroll positions
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;
        }
        
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
          // Use the existing scrollTo method for consistency
          const offset = options?.offset ?? 0;
          const top = Math.max(0, heroElement.getBoundingClientRect().top + window.pageYOffset + offset);
          const behavior = options?.immediate ? "auto" : "smooth";
          window.scrollTo({ top, behavior });
        } else {
          // Fallback to top of page
          if (this.isSafari()) {
            await this.safariScrollToTop();
          } else {
            window.scrollTo({ top: 0, behavior: "auto" });
          }
        }
      } catch (error) {
        console.warn('Error in scrollToHero:', error);
        // Fallback to immediate scroll to top
        if (this.isSafari()) {
          await this.safariScrollToTop();
        } else {
          window.scrollTo({ top: 0, behavior: "auto" });
        }
      }
    });
  }

  // Enhanced method to ensure page loads at top/hero on navigation
  async ensurePageStartsAtTop(options?: {
    immediate?: boolean;
    force?: boolean;
  }): Promise<void> {
    if (this.isDestroyed) return;

    return this.executeScroll(async () => {
      try {
        // Safari-specific handling
        if (this.isSafari()) {
          await this.safariScrollToTop();
        } else {
          // Always force scroll to top first
          window.scrollTo({ top: 0, behavior: "auto" });
          
          // Also reset body and document scroll positions
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;
        }
        
        // If force is true or we're at the top, scroll to hero
        if (options?.force || window.scrollY === 0) {
          // Use the existing scrollToHero method
          await this.scrollToHero({ immediate: options?.immediate ?? true });
        }
      } catch (error) {
        console.warn('Error in ensurePageStartsAtTop:', error);
        // Fallback to immediate scroll to top
        if (this.isSafari()) {
          await this.safariScrollToTop();
        } else {
          window.scrollTo({ top: 0, behavior: "auto" });
        }
      }
    });
  }

  // Method to handle scroll-snap conflicts
  async handleScrollSnapConflict(): Promise<void> {
    if (this.isDestroyed) return;

    return this.executeScroll(async () => {
      try {
        // Temporarily disable scroll-snap during scroll operations
        const html = document.documentElement;
        const body = document.body;
        
        // Store original scroll-snap values
        const originalHtmlSnap = html.style.scrollSnapType;
        const originalBodySnap = body.style.scrollSnapType;
        
        // Temporarily disable scroll-snap
        html.style.scrollSnapType = 'none';
        body.style.scrollSnapType = 'none';
        
        // Wait for scroll to complete
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Restore scroll-snap
        html.style.scrollSnapType = originalHtmlSnap;
        body.style.scrollSnapType = originalBodySnap;
        
      } catch (error) {
        console.warn('Error handling scroll-snap conflict:', error);
      }
    });
  }

  // Method to handle GSAP ScrollTrigger conflicts
  async handleScrollTriggerConflict(): Promise<void> {
    if (this.isDestroyed) return;

    return this.executeScroll(async () => {
      try {
        // Wait for any current GSAP animations to complete
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // Refresh ScrollTrigger if available
        try {
          const { ScrollTrigger } = await import('./gsap');
          if (ScrollTrigger.getAll().length > 0) {
            ScrollTrigger.refresh();
          }
        } catch (error) {
          // GSAP not available, continue
        }
      } catch (error) {
        console.warn('Error handling ScrollTrigger conflict:', error);
      }
    });
  }

  // Method to check if scrolling is currently in progress
  isCurrentlyScrolling(): boolean {
    return this.isScrolling;
  }

  // Method to wait for current scroll to complete
  async waitForScrollComplete(): Promise<void> {
    while (this.isScrolling) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }

  // Method to clear the scroll queue
  clearQueue(): void {
    this.scrollQueue = [];
  }

  // Method to stop current scroll operation
  stop(): void {
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
      this.scrollTimeout = null;
    }
    this.isScrolling = false;
    this.processQueue();
  }

  // Method to start the scroll manager
  start(): void {
    if (!this.isDestroyed) {
      this.isScrolling = false;
      this.processQueue();
    }
  }

  // Method to update scroll manager state
  update(): void {
    // This method can be used for future updates
    // Currently no-op but available for extensibility
  }

  // Method to destroy the scroll manager
  destroy(): void {
    this.isDestroyed = true;
    this.stop();
    this.clearQueue();
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
      this.scrollTimeout = null;
    }
  }
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

