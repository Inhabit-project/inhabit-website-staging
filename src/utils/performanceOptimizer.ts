import React from 'react';
import gsap from 'gsap';

/**
 * Performance Optimization Utilities
 * Helps prevent forced reflow and optimize animations
 */

interface PerformanceConfig {
  batchDOMReads?: boolean;
  useHardwareAcceleration?: boolean;
  debounceResize?: boolean;
}

class PerformanceOptimizer {
  private static instance: PerformanceOptimizer;
  private rafId: number | null = null;
  private resizeObservers: Map<Element, ResizeObserver> = new Map();

  static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer();
    }
    return PerformanceOptimizer.instance;
  }

  /**
   * Batch DOM reads to prevent forced reflow
   */
  batchDOMReads<T>(readOperations: (() => T)[]): T[] {
    const results: T[] = [];
    
    // Force a layout read to get all measurements at once
    document.body.offsetHeight; // Trigger layout
    
    // Execute all read operations
    readOperations.forEach(operation => {
      results.push(operation());
    });
    
    return results;
  }

  /**
   * Optimize element for hardware acceleration
   */
  optimizeForHardwareAcceleration(element: HTMLElement): void {
    element.style.transform = 'translateZ(0)';
    element.style.backfaceVisibility = 'hidden';
    element.style.willChange = 'auto';
  }

  /**
   * Create optimized ResizeObserver
   */
  createOptimizedResizeObserver(
    element: Element, 
    callback: () => void,
    debounceMs: number = 16
  ): ResizeObserver {
    let timeoutId: number | null = null;
    
    const debouncedCallback = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = window.setTimeout(() => {
        if (this.rafId) {
          cancelAnimationFrame(this.rafId);
        }
        this.rafId = requestAnimationFrame(callback);
      }, debounceMs);
    };

    const observer = new ResizeObserver(debouncedCallback);
    observer.observe(element);
    
    this.resizeObservers.set(element, observer);
    
    return observer;
  }

  /**
   * Clean up ResizeObserver
   */
  cleanupResizeObserver(element: Element): void {
    const observer = this.resizeObservers.get(element);
    if (observer) {
      observer.disconnect();
      this.resizeObservers.delete(element);
    }
  }

  /**
   * Optimize GSAP animations to prevent reflow
   */
  optimizeGSAPAnimation(animation: gsap.core.Tween): void {
    // Add hardware acceleration properties
    animation.vars.force3D = true;
    animation.vars.transformOrigin = "center center";
  }

  /**
   * Batch GSAP set operations
   */
  batchGSAPSet(elements: HTMLElement[], properties: gsap.TweenVars): void {
    gsap.set(elements, {
      ...properties,
      force3D: true,
      transformOrigin: "center center"
    });
  }

  /**
   * Optimize ScrollTrigger configuration
   */
  getOptimizedScrollTriggerConfig(trigger: HTMLElement, config: any = {}) {
    return {
      trigger,
      fastScrollEnd: true,
      preventOverlaps: true,
      ...config
    };
  }

  /**
   * Clean up all resources
   */
  cleanup(): void {
    // Clean up RAF
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    // Clean up all ResizeObservers
    this.resizeObservers.forEach(observer => {
      observer.disconnect();
    });
    this.resizeObservers.clear();
  }
}

// Export singleton instance
export const performanceOptimizer = PerformanceOptimizer.getInstance();

/**
 * Hook for optimized resize handling
 */
export function useOptimizedResize(
  elementRef: React.RefObject<HTMLElement>,
  callback: () => void,
  debounceMs: number = 16
): void {
  React.useEffect(() => {
    if (!elementRef.current) return;

    const observer = performanceOptimizer.createOptimizedResizeObserver(
      elementRef.current,
      callback,
      debounceMs
    );

    return () => {
      if (elementRef.current) {
        performanceOptimizer.cleanupResizeObserver(elementRef.current);
      }
    };
  }, [elementRef, callback, debounceMs]);
}

/**
 * Hook for optimized DOM measurements
 */
export function useOptimizedMeasurements<T>(
  elementRef: React.RefObject<HTMLElement>,
  measurementsFn: (element: HTMLElement) => T,
  dependencies: React.DependencyList = []
): T | null {
  const [result, setResult] = React.useState<T | null>(null);

  React.useEffect(() => {
    if (!elementRef.current) return;

    const measure = (): void => {
      if (!elementRef.current) return;
      
      const measurements = performanceOptimizer.batchDOMReads([
        () => measurementsFn(elementRef.current!)
      ]);
      
      setResult(measurements[0]);
    };

    // Initial measurement
    measure();

    // Set up resize observer for updates
    const observer = performanceOptimizer.createOptimizedResizeObserver(
      elementRef.current,
      measure
    );

    return () => {
      if (elementRef.current) {
        performanceOptimizer.cleanupResizeObserver(elementRef.current);
      }
    };
  }, [elementRef, measurementsFn, ...dependencies]);

  return result;
}

/**
 * Utility for optimizing GSAP animations
 */
export const GSAPOptimizer = {
  /**
   * Create optimized timeline
   */
  createOptimizedTimeline(config: any = {}) {
    return gsap.timeline({
      ...config,
      onUpdate: () => {
        // Force hardware acceleration
        if (config.onUpdate) {
          config.onUpdate();
        }
      }
    });
  },

  /**
   * Optimize ScrollTrigger
   */
  optimizeScrollTrigger(trigger: HTMLElement, config: any = {}) {
    return performanceOptimizer.getOptimizedScrollTriggerConfig(trigger, config);
  },

  /**
   * Batch set operations
   */
  batchSet(elements: HTMLElement[], properties: gsap.TweenVars) {
    performanceOptimizer.batchGSAPSet(elements, properties);
  }
}; 

/**
 * Performance optimization utilities for better loading performance
 */

// Priority levels for different types of content
export enum LoadingPriority {
  CRITICAL = 'critical',      // Above-the-fold content (Hero, Menu)
  HIGH = 'high',              // Important content (Video, Hubs, NFT)
  MEDIUM = 'medium',          // Secondary content (Photo, Infographic)
  LOW = 'low',                // Below-the-fold content (Blog, FAQ, Footer)
}

// Component loading configuration
export interface ComponentLoadConfig {
  priority: LoadingPriority;
  preload?: boolean;
  lazy?: boolean;
  suspense?: boolean;
}

// Performance monitoring
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTimer(name: string): void {
    this.metrics.set(name, performance.now());
  }

  endTimer(name: string): number {
    const startTime = this.metrics.get(name);
    if (startTime) {
      const duration = performance.now() - startTime;
      this.metrics.delete(name);
      return duration;
    }
    return 0;
  }

  measureTime(name: string, fn: () => void): number {
    this.startTimer(name);
    fn();
    return this.endTimer(name);
  }

  async measureAsyncTime<T>(name: string, fn: () => Promise<T>): Promise<T> {
    this.startTimer(name);
    try {
      const result = await fn();
      return result;
    } finally {
      this.endTimer(name);
    }
  }

  getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }
}

// Resource preloader
export class ResourcePreloader {
  private static instance: ResourcePreloader;
  private preloadedResources: Set<string> = new Set();

  static getInstance(): ResourcePreloader {
    if (!ResourcePreloader.instance) {
      ResourcePreloader.instance = new ResourcePreloader();
    }
    return ResourcePreloader.instance;
  }

  preloadImage(src: string, priority: 'high' | 'low' = 'low'): Promise<void> {
    if (this.preloadedResources.has(src)) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.preloadedResources.add(src);
        resolve();
      };
      img.onerror = reject;
      
      if (priority === 'high') {
        img.fetchPriority = 'high';
      }
      
      img.src = src;
    });
  }

  preloadFont(family: string, weight: string = '400'): void {
    if (document.fonts) {
      document.fonts.load(`${weight} 16px ${family}`);
    }
  }

  preloadCriticalResources(): void {
    // Preload critical images
    this.preloadImage('/assets/hero.avif', 'high');
    this.preloadImage('/assets/hero-mobile.webp', 'high');
    
    // Preload critical fonts
    this.preloadFont('Montserrat', '400');
    this.preloadFont('Montserrat', '700');
    this.preloadFont('Abel', '400');
  }
}

// Intersection Observer for lazy loading
export class LazyLoader {
  private static instance: LazyLoader;
  private observers: Map<string, IntersectionObserver> = new Map();

  static getInstance(): LazyLoader {
    if (!LazyLoader.instance) {
      LazyLoader.instance = new LazyLoader();
    }
    return LazyLoader.instance;
  }

  observe(
    element: Element,
    callback: (entries: IntersectionObserverEntry[]) => void,
    options: IntersectionObserverInit = {}
  ): string {
    const id = `observer_${Date.now()}_${Math.random()}`;
    
    const observer = new IntersectionObserver(callback, {
      rootMargin: '50px',
      threshold: 0.1,
      ...options,
    });
    
    observer.observe(element);
    this.observers.set(id, observer);
    
    return id;
  }

  unobserve(id: string): void {
    const observer = this.observers.get(id);
    if (observer) {
      observer.disconnect();
      this.observers.delete(id);
    }
  }

  disconnectAll(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}

// Main page loading optimizer
export class MainPageOptimizer {
  private static instance: MainPageOptimizer;
  private performanceMonitor: PerformanceMonitor;
  private resourcePreloader: ResourcePreloader;
  private lazyLoader: LazyLoader;

  private constructor() {
    this.performanceMonitor = PerformanceMonitor.getInstance();
    this.resourcePreloader = ResourcePreloader.getInstance();
    this.lazyLoader = LazyLoader.getInstance();
  }

  static getInstance(): MainPageOptimizer {
    if (!MainPageOptimizer.instance) {
      MainPageOptimizer.instance = new MainPageOptimizer();
    }
    return MainPageOptimizer.instance;
  }

  async optimizeInitialLoad(): Promise<void> {
    this.performanceMonitor.startTimer('mainPageLoad');
    
    try {
      // Preload critical resources
      this.resourcePreloader.preloadCriticalResources();
      
      // Optimize font loading
      this.optimizeFontLoading();
      
      // Optimize image loading
      this.optimizeImageLoading();
      
      // Setup performance monitoring
      this.setupPerformanceMonitoring();
      
    } catch (error) {
      console.warn('Performance optimization failed:', error);
    }
  }

  private optimizeFontLoading(): void {
    // Use font-display: swap for better performance
    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        console.log('Fonts loaded successfully');
      });
    }
  }

  private optimizeImageLoading(): void {
    // Set loading priorities for images
    const images = document.querySelectorAll('img[data-loading-priority]');
    images.forEach(img => {
      const priority = img.getAttribute('data-loading-priority');
      if (priority === 'high') {
        (img as HTMLImageElement).fetchPriority = 'high';
      }
    });
  }

  private setupPerformanceMonitoring(): void {
    // Monitor Core Web Vitals
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'largest-contentful-paint') {
              console.log('LCP:', entry.startTime);
            }
            if (entry.entryType === 'first-input') {
              const firstInputEntry = entry as PerformanceEventTiming;
              console.log('FID:', firstInputEntry.processingStart - firstInputEntry.startTime);
            }
          }
        });
        
        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
      } catch (error) {
        console.warn('Performance monitoring setup failed:', error);
      }
    }
  }

  getLoadTime(): number {
    return this.performanceMonitor.endTimer('mainPageLoad');
  }

  cleanup(): void {
    this.lazyLoader.disconnectAll();
  }
}

// Export singleton instances
export const performanceMonitor = PerformanceMonitor.getInstance();
export const resourcePreloader = ResourcePreloader.getInstance();
export const lazyLoader = LazyLoader.getInstance();
export const mainPageOptimizer = MainPageOptimizer.getInstance(); 