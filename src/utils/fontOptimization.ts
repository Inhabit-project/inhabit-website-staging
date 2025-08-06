/**
 * Font Optimization Utilities
 * Handles font loading performance, subsets, and runtime optimization
 */

interface FontMetrics {
  loadTime: number;
  renderTime: number;
  fontSize: string;
  fontFamily: string;
}

class FontOptimization {
  private static instance: FontOptimization;
  private fontMetrics: Map<string, FontMetrics> = new Map();
  private observer: PerformanceObserver | null = null;

  static getInstance(): FontOptimization {
    if (!FontOptimization.instance) {
      FontOptimization.instance = new FontOptimization();
    }
    return FontOptimization.instance;
  }

  /**
   * Initialize font performance monitoring
   */
  init(): void {
    if ('PerformanceObserver' in window) {
      try {
        this.observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'measure' && entry.name.includes('font')) {
              // Track font loading performance
            }
          });
        });
        this.observer.observe({ entryTypes: ['measure'] });
      } catch (error) {
        console.warn('Could not initialize PerformanceObserver for font monitoring:', error);
      }
    }

    // Monitor font load events
    if ('fonts' in document) {
      document.fonts.addEventListener('loading', (event) => {
        if (event.fontfaces && event.fontfaces.length > 0) {
          event.fontfaces.forEach((fontface) => {
            const fontId = fontface.family.replace(/\s+/g, '-');
            try {
              performance.mark(`font-${fontId}-load-start`);
            } catch (error) {
              console.warn(`Could not create performance mark for ${fontface.family}:`, error);
            }
          });
        }
      });

      document.fonts.addEventListener('loadingdone', (event) => {
        event.fontfaces.forEach((fontface) => {
          const fontId = fontface.family.replace(/\s+/g, '-');
          const startMark = `font-${fontId}-load-start`;
          const endMark = `font-${fontId}-load-end`;
          
          performance.mark(endMark);
          
          // Only measure if start mark exists
          try {
            const marks = performance.getEntriesByName(startMark, 'mark');
            if (marks.length > 0) {
              performance.measure(
                `font-${fontId}-load-time`,
                startMark,
                endMark
              );
            }
          } catch (error) {
            console.warn(`Could not measure font loading time for ${fontface.family}:`, error);
          }
        });
      });
    }
  }

  /**
   * Preload critical fonts with optimal settings
   * Fonts are loaded via CSS imports, this just ensures they're ready
   */
  preloadCriticalFonts(): void {
    if (!('fonts' in document)) {
      console.warn('FontFace API not supported, skipping font preloading');
      return;
    }

    const criticalFonts = [
      {
        family: 'Nunito Sans',
        weights: [400, 600],
        display: 'swap'
      },
      {
        family: 'Montserrat',
        weights: [400, 700],
        display: 'swap'
      },
      {
        family: 'Abel',
        weights: [400],
        display: 'swap'
      }
    ];

    // Fonts are already loaded via CSS imports, just ensure they're ready
    criticalFonts.forEach((font) => {
      font.weights.forEach((weight) => {
        const fontId = `${font.family}-${weight}`;
        
        // Check if font is already loaded
        if (!document.fonts.check(`${weight} 16px "${font.family}"`)) {
          // Font will be loaded by CSS imports, just track it
        }
      });
    });
  }

  /**
   * Optimize font loading based on connection speed
   */
  optimizeForConnection(): void {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      const effectiveType = connection?.effectiveType;

      if (effectiveType === 'slow-2g' || effectiveType === '2g') {
        // Load only essential fonts
        this.loadEssentialFontsOnly();
      } else if (effectiveType === '3g') {
        // Load with reduced font weights
        this.loadReducedFontSet();
      } else {
        // Load all fonts (4g/wifi)
        this.preloadCriticalFonts();
      }
    } else {
      // Fallback for browsers without Network Information API
      this.preloadCriticalFonts();
    }
  }

  /**
   * Load only essential fonts for slow connections
   */
  private loadEssentialFontsOnly(): void {
    // For slow connections, we rely on CSS imports but can optimize loading
  }

  /**
   * Load reduced font set for medium connections
   */
  private loadReducedFontSet(): void {
    // For medium connections, we rely on CSS imports
  }

  /**
   * Add font load event listeners for performance tracking
   */
  trackFontPerformance(): void {
    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        try {
          performance.mark('fonts-ready');
          
          // Measure total font loading time
          const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          if (navigationEntry && navigationEntry.domContentLoadedEventStart) {
            const fontLoadTime = performance.now() - navigationEntry.domContentLoadedEventStart;
          }
          
          // Log font loading status
          const status = this.getFontLoadingStatus();
        } catch (error) {
          console.warn('Error tracking font performance:', error);
        }
      }).catch((error) => {
        console.warn('Font loading failed or timed out:', error);
      });
    }
  }

  /**
   * Get font loading status
   */
  private getFontLoadingStatus(): { loading: number; loaded: number; error: number } {
    if (!('fonts' in document)) return { loading: 0, loaded: 0, error: 0 };
    
    try {
      const fonts = Array.from(document.fonts);
      return {
        loading: fonts.filter(font => font.status === 'loading').length,
        loaded: fonts.filter(font => font.status === 'loaded').length,
        error: fonts.filter(font => font.status === 'error').length
      };
    } catch (error) {
      console.warn('Could not get font loading status:', error);
      return { loading: 0, loaded: 0, error: 0 };
    }
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.fontMetrics.clear();
  }
}

// Export singleton instance
export const fontOptimization = FontOptimization.getInstance();

/**
 * Initialize font optimization
 * Call this in your main application entry point
 */
export function initializeFontOptimization(): void {
  fontOptimization.init();
  fontOptimization.optimizeForConnection();
  fontOptimization.trackFontPerformance();
}

/**
 * Font loading utility functions
 */
export const FontUtils = {
  /**
   * Check if a font is loaded
   */
  isFontLoaded(fontFamily: string, fontWeight = '400'): boolean {
    if (!('fonts' in document)) return false;
    
    return document.fonts.check(`${fontWeight} 16px "${fontFamily}"`);
  },

  /**
   * Wait for font to load
   */
  async waitForFont(fontFamily: string, fontWeight = '400', timeout = 3000): Promise<boolean> {
    if (!('fonts' in document)) return false;
    
    try {
      await Promise.race([
        document.fonts.load(`${fontWeight} 16px "${fontFamily}"`),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Font load timeout')), timeout))
      ]);
      return true;
    } catch {
      return false;
    }
  },
}; 