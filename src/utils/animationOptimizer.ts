import { gsap, ScrollTrigger } from './gsap';

interface AnimationOptimizationConfig {
  maxConcurrentAnimations?: number;
  throttleScrollEvents?: boolean;
  reduceMotion?: boolean;
  enablePerformanceMonitoring?: boolean;
}

class AnimationOptimizer {
  private static instance: AnimationOptimizer;
  private config: AnimationOptimizationConfig;
  private activeAnimations: Set<string> = new Set();
  private performanceMonitor: any = null;

  constructor() {
    this.config = {
      maxConcurrentAnimations: 10,
      throttleScrollEvents: true,
      reduceMotion: false,
      enablePerformanceMonitoring: true
    };
  }

  static getInstance(): AnimationOptimizer {
    if (!AnimationOptimizer.instance) {
      AnimationOptimizer.instance = new AnimationOptimizer();
    }
    return AnimationOptimizer.instance;
  }

  configure(config: Partial<AnimationOptimizationConfig>) {
    this.config = { ...this.config, ...config };
  }

  // Check if user prefers reduced motion
  shouldReduceMotion(): boolean {
    if (this.config.reduceMotion) return true;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // Optimize ScrollTrigger creation
  createOptimizedScrollTrigger(config: any): ScrollTrigger | null {
    // Check if we're at the animation limit
    if (this.activeAnimations.size >= (this.config.maxConcurrentAnimations || 10)) {
      console.warn('🎬 Animation limit reached, skipping new animation');
      return null;
    }

    // If user prefers reduced motion, create minimal animation
    if (this.shouldReduceMotion()) {
      return this.createReducedMotionTrigger(config);
    }

    // Add throttling for scroll events
    if (this.config.throttleScrollEvents) {
      config.scrollTrigger = {
        ...config.scrollTrigger,
        fastScrollEnd: true,
        preventOverlaps: true
      };
    }

    const trigger = ScrollTrigger.create(config);
    this.activeAnimations.add(config.id || `trigger-${Date.now()}`);

    return trigger;
  }

  // Create minimal animation for users who prefer reduced motion
  private createReducedMotionTrigger(config: any): ScrollTrigger {
    const minimalConfig = {
      ...config,
      scrollTrigger: {
        ...config.scrollTrigger,
        onEnter: () => {
          // Just set opacity to 1 without animation
          if (config.animation) {
            gsap.set(config.animation.targets(), { opacity: 1 });
          }
          config.scrollTrigger?.onEnter?.();
        },
        onLeave: () => {
          config.scrollTrigger?.onLeave?.();
        }
      }
    };

    return ScrollTrigger.create(minimalConfig);
  }

  // Monitor performance and optimize if needed
  startPerformanceMonitoring() {
    if (!this.config.enablePerformanceMonitoring) return;

    let frameCount = 0;
    let lastTime = performance.now();
    let lowFpsCount = 0;

    const monitor = () => {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));

        if (fps < 30) {
          lowFpsCount++;
          console.warn(`🎬 Low FPS detected: ${fps} (${lowFpsCount} times)`);

          // If consistently low FPS, disable some animations
          if (lowFpsCount > 3) {
            this.optimizeForPerformance();
          }
        } else {
          lowFpsCount = Math.max(0, lowFpsCount - 1);
        }

        frameCount = 0;
        lastTime = currentTime;
      }

      this.performanceMonitor = requestAnimationFrame(monitor);
    };

    this.performanceMonitor = requestAnimationFrame(monitor);
  }

  stopPerformanceMonitoring() {
    if (this.performanceMonitor) {
      cancelAnimationFrame(this.performanceMonitor);
      this.performanceMonitor = null;
    }
  }

  // Optimize animations when performance is poor
  private optimizeForPerformance() {
    console.log('🎬 Optimizing animations for better performance');

    // Reduce animation complexity
    this.config.maxConcurrentAnimations = Math.max(3, (this.config.maxConcurrentAnimations || 10) - 2);
    
    // Kill some existing animations
    const triggers = ScrollTrigger.getAll();
    if (triggers.length > 5) {
      // Kill the oldest triggers
      triggers.slice(0, Math.floor(triggers.length / 2)).forEach(trigger => {
        trigger.kill();
      });
    }

    // Refresh ScrollTrigger
    ScrollTrigger.refresh();
  }

  // Clean up animations
  cleanup() {
    this.activeAnimations.clear();
    this.stopPerformanceMonitoring();
  }

  // Get performance stats
  getPerformanceStats() {
    const triggers = ScrollTrigger.getAll();
    return {
      activeAnimations: this.activeAnimations.size,
      totalScrollTriggers: triggers.length,
      shouldReduceMotion: this.shouldReduceMotion(),
      maxConcurrentAnimations: this.config.maxConcurrentAnimations
    };
  }
}

export const animationOptimizer = AnimationOptimizer.getInstance();

// Enhanced GSAP utilities with optimization
export function optimizedGsapTo(target: any, vars: any, config?: any) {
  if (animationOptimizer.shouldReduceMotion()) {
    // For reduced motion, just set the final state
    gsap.set(target, { opacity: 1, y: 0, scale: 1 });
    return;
  }

  return gsap.to(target, vars, config);
}

export function optimizedScrollTrigger(config: any) {
  return animationOptimizer.createOptimizedScrollTrigger(config);
}

// Initialize performance monitoring
if (typeof window !== 'undefined') {
  animationOptimizer.startPerformanceMonitoring();
} 