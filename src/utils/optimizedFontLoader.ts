/**
 * Optimized Font Loader - LATIN ONLY
 * Implements best practices for non-blocking font loading
 * COMPLETELY ELIMINATES Cyrillic and Vietnamese fonts for maximum performance
 */

interface FontConfig {
  family: string;
  weight: number;
  style?: 'normal' | 'italic';
  display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
}

class OptimizedFontLoader {
  private static instance: OptimizedFontLoader;
  private loadedFonts: Set<string> = new Set();
  private fontLoadPromises: Map<string, Promise<boolean>> = new Map();

  static getInstance(): OptimizedFontLoader {
    if (!OptimizedFontLoader.instance) {
      OptimizedFontLoader.instance = new OptimizedFontLoader();
    }
    return OptimizedFontLoader.instance;
  }

  /**
   * Initialize font loading with performance monitoring
   */
  init(): void {
    // Monitor font loading performance
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'resource' && entry.name.includes('font')) {
              this.trackFontPerformance(entry);
            }
          });
        });
        observer.observe({ entryTypes: ['resource'] });
      } catch (error) {
        console.warn('Could not initialize PerformanceObserver for font monitoring:', error);
      }
    }

    // Apply font loading strategy based on connection
    this.applyConnectionOptimizedStrategy();
  }

  /**
   * Apply font loading strategy based on connection speed
   */
  private applyConnectionOptimizedStrategy(): void {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      const effectiveType = connection?.effectiveType;
      const downlink = connection?.downlink;

      if (effectiveType === 'slow-2g' || effectiveType === '2g' || downlink < 0.5) {
        this.loadEssentialFontsOnly();
      } else if (effectiveType === '3g' || downlink < 1.5) {
        this.loadReducedFontSet();
      } else {
        this.loadAllFonts();
      }
    } else {
      // Fallback for browsers without Network Information API
      this.loadAllFonts();
    }
  }

  /**
   * Load only essential fonts for slow connections
   */
  private loadEssentialFontsOnly(): void {
    const essentialFonts: FontConfig[] = [
      { family: 'Nunito Sans', weight: 400, display: 'swap' } // LATIN ONLY
    ];
    this.loadFonts(essentialFonts);
  }

  /**
   * Load reduced font set for medium connections
   */
  private loadReducedFontSet(): void {
    const reducedFonts: FontConfig[] = [
      { family: 'Nunito Sans', weight: 400, display: 'swap' }, // LATIN ONLY
      { family: 'Nunito Sans', weight: 600, display: 'swap' }, // LATIN ONLY
      { family: 'Montserrat', weight: 400, display: 'swap' }   // LATIN ONLY
    ];
    this.loadFonts(reducedFonts);
  }

  /**
   * Load all fonts for fast connections - LATIN ONLY
   */
  private loadAllFonts(): void {
    const allFonts: FontConfig[] = [
      { family: 'Nunito Sans', weight: 400, display: 'swap' }, // LATIN ONLY
      { family: 'Nunito Sans', weight: 600, display: 'swap' }, // LATIN ONLY
      { family: 'Montserrat', weight: 400, display: 'swap' },  // LATIN ONLY
      { family: 'Montserrat', weight: 700, display: 'swap' },  // LATIN ONLY
      { family: 'Abel', weight: 400, display: 'swap' }         // LATIN ONLY
    ];
    this.loadFonts(allFonts);
  }

  /**
   * Load fonts with optimal strategy
   */
  private loadFonts(fonts: FontConfig[]): void {
    fonts.forEach(font => {
      this.loadFont(font);
    });
  }

  /**
   * Load a single font with optimal strategy
   */
  private loadFont(font: FontConfig): void {
    const fontKey = `${font.family}-${font.weight}-${font.style || 'normal'}`;
    
    if (this.loadedFonts.has(fontKey) || this.fontLoadPromises.has(fontKey)) {
      return;
    }

    // Create font loading promise
    const loadPromise = this.createFontLoadPromise(font);
    this.fontLoadPromises.set(fontKey, loadPromise);

    // Handle font loading result
    loadPromise.then((success) => {
      if (success) {
        this.loadedFonts.add(fontKey);
      }
      this.fontLoadPromises.delete(fontKey);
    }).catch((error) => {
      console.warn(`Font loading failed for ${font.family} ${font.weight}:`, error);
      this.fontLoadPromises.delete(fontKey);
    });
  }

  /**
   * Create a promise for font loading
   */
  private createFontLoadPromise(font: FontConfig): Promise<boolean> {
    return new Promise((resolve) => {
      if (!('fonts' in document)) {
        resolve(false);
        return;
      }

      // Check if font is already available
      if (document.fonts.check(`${font.weight} 16px "${font.family}"`)) {
        resolve(true);
        return;
      }

      // Load font with timeout
      const timeout = setTimeout(() => {
        resolve(false);
      }, 3000);

      document.fonts.load(`${font.weight} 16px "${font.family}"`).then(() => {
        clearTimeout(timeout);
        resolve(true);
      }).catch(() => {
        clearTimeout(timeout);
        resolve(false);
      });
    });
  }

  /**
   * Track font loading performance
   */
  private trackFontPerformance(entry: PerformanceEntry): void {
    if (entry.entryType === 'resource') {
      const resourceEntry = entry as PerformanceResourceTiming;
      if (resourceEntry.name.includes('font')) {
        const loadTime = resourceEntry.responseEnd - resourceEntry.requestStart;
        console.debug(`Font loaded in ${loadTime.toFixed(2)}ms: ${resourceEntry.name}`);
      }
    }
  }

  /**
   * Wait for specific font to load
   */
  async waitForFont(family: string, weight: number, timeout = 5000): Promise<boolean> {
    const fontKey = `${family}-${weight}-normal`;
    
    if (this.loadedFonts.has(fontKey)) {
      return true;
    }

    const loadPromise = this.fontLoadPromises.get(fontKey);
    if (loadPromise) {
      try {
        return await Promise.race([
          loadPromise,
          new Promise<boolean>((_, reject) => 
            setTimeout(() => reject(new Error('Font load timeout')), timeout)
          )
        ]);
      } catch {
        return false;
      }
    }

    return false;
  }

  /**
   * Check if a font is loaded
   */
  isFontLoaded(family: string, weight: number): boolean {
    const fontKey = `${family}-${weight}-normal`;
    return this.loadedFonts.has(fontKey);
  }

  /**
   * Get loading status
   */
  getLoadingStatus(): { loaded: string[]; loading: string[] } {
    return {
      loaded: Array.from(this.loadedFonts),
      loading: Array.from(this.fontLoadPromises.keys())
    };
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.fontLoadPromises.clear();
    this.loadedFonts.clear();
  }
}

// Export singleton instance
export const optimizedFontLoader = OptimizedFontLoader.getInstance();

/**
 * Initialize optimized font loading
 */
export function initializeOptimizedFontLoading(): void {
  optimizedFontLoader.init();
}

/**
 * Utility functions for font loading
 */
export const FontUtils = {
  /**
   * Wait for font to load
   */
  waitForFont: (family: string, weight: number, timeout?: number) => 
    optimizedFontLoader.waitForFont(family, weight, timeout),

  /**
   * Check if font is loaded
   */
  isFontLoaded: (family: string, weight: number) => 
    optimizedFontLoader.isFontLoaded(family, weight),

  /**
   * Get loading status
   */
  getLoadingStatus: () => optimizedFontLoader.getLoadingStatus()
};
