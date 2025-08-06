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