import Lenis from 'lenis';
// Integrate with GSAP ScrollTrigger if present
let ScrollTrigger: any = null;
try {
  // Dynamically require to avoid errors if GSAP is not present
  ScrollTrigger = require('gsap/ScrollTrigger').ScrollTrigger;
} catch (e) {}

class ScrollManager {
  private lenis: Lenis | null = null;
  private rafId: number | null = null;
  private initialized: boolean = false;

  init() {
    if (this.initialized) {
      console.warn('ScrollManager already initialized.');
      return;
    }
    this.initialized = true;
    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });
    console.log('Lenis initialized', this.lenis);

    // Integrate with GSAP ScrollTrigger if available
    if (ScrollTrigger && this.lenis) {
      this.lenis.on('scroll', () => {
        // Debug log
        // console.log('Lenis scroll event');
        ScrollTrigger.update();
      });
    }

    this.addScrollListener();

    // Expose for console testing
    if (typeof window !== 'undefined') {
      (window as any).scrollManager = this;
    }
  }

  private addScrollListener() {
    if (!this.lenis) return;
    const raf = (time: number) => {
      this.lenis?.raf(time);
      this.rafId = requestAnimationFrame(raf);
    };
    this.rafId = requestAnimationFrame(raf);
  }

  scrollTo(target: string | number | HTMLElement, options?: {
    offset?: number;
    duration?: number;
    immediate?: boolean;
  }) {
    this.lenis?.scrollTo(target, options);
    if (ScrollTrigger) {
      ScrollTrigger.refresh();
    }
  }

  destroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.lenis?.destroy();
    this.lenis = null;
    this.initialized = false;
    if (typeof window !== 'undefined' && (window as any).scrollManager === this) {
      delete (window as any).scrollManager;
    }
    console.log('Lenis destroyed');
  }

  stop() {
    this.lenis?.stop();
  }

  start() {
    this.lenis?.start();
  }

  // Add this method to allow manual scroll update
  update() {
    if (this.lenis) {
      this.lenis.raf(performance.now());
    }
  }
}

export const scrollManager = new ScrollManager(); 