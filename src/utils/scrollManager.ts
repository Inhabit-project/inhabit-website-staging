import Lenis from 'lenis';
// Integrate with GSAP ScrollTrigger if present
let ScrollTrigger: any = null;
try {
  // Dynamically require to avoid errors if GSAP is not present
  ScrollTrigger = require('gsap/ScrollTrigger').ScrollTrigger;
} catch (e) {}

class ScrollManager {
  private lenis: Lenis | null = null;

  init() {
    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    // Integrate with GSAP ScrollTrigger if available
    if (ScrollTrigger && this.lenis) {
      this.lenis.on('scroll', ScrollTrigger.update);
    }

    this.addScrollListener();
  }

  private addScrollListener() {
    if (!this.lenis) return;

    const raf = (time: number) => {
      this.lenis?.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);
  }

  scrollTo(target: string | number | HTMLElement, options?: {
    offset?: number;
    duration?: number;
    immediate?: boolean;
  }) {
    this.lenis?.scrollTo(target, options);
  }

  destroy() {
    this.lenis?.destroy();
    this.lenis = null;
  }

  stop() {
    this.lenis?.stop();
  }

  start() {
    this.lenis?.start();
  }
}

export const scrollManager = new ScrollManager(); 