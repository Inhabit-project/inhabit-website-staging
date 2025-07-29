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
        display: 'swap',
        subset: 'latin'
      },
      {
        family: 'Montserrat',
        weights: [400, 700],
        display: 'swap',
        subset: 'latin'
      },
      {
        family: 'Abel',
        weights: [400],
        display: 'swap',
        subset: 'latin'
      }
    ];

    criticalFonts.forEach((font) => {
      font.weights.forEach((weight) => {
        const fontId = `${font.family}-${weight}`;
        
        if (!document.querySelector(`link[data-font-id="${fontId}"]`)) {
          try {
            // Create optimized font face
            const fontUrlName = font.family.toLowerCase().replace(/\s+/g, '-');
            const fontFace = new FontFace(
              font.family,
              `url('/node_modules/@fontsource/${fontUrlName}/files/${fontUrlName}-${font.subset}-${weight}-normal.woff2') format('woff2')`,
              {
                weight: weight.toString(),
                display: font.display as FontDisplay,
                unicodeRange: this.getUnicodeRange(font.subset)
              }
            );

            document.fonts.add(fontFace);
            fontFace.load().catch((error) => {
              console.warn(`Failed to load font ${font.family} ${weight}:`, error);
            });
          } catch (error) {
            console.warn(`Error creating font face for ${font.family} ${weight}:`, error);
          }
        }
      });
    });
  }

  /**
   * Get unicode range for font subset
   * Only Latin subset is supported for optimal performance
   */
  private getUnicodeRange(subset: string): string {
    const ranges = {
      latin: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
      'latin-ext': 'U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF'
    };
    return ranges[subset as keyof typeof ranges] || ranges.latin;
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
    const essentialFonts = [
      { family: 'Nunito Sans', weight: 400 },
      { family: 'Montserrat', weight: 400 }
    ];

    essentialFonts.forEach((font) => {
      const fontFace = new FontFace(
        font.family,
        `url('/node_modules/@fontsource/${font.family.toLowerCase().replace(' ', '-')}/files/${font.family.toLowerCase().replace(' ', '-')}-latin-${font.weight}-normal.woff2') format('woff2')`,
        {
          weight: font.weight.toString(),
          display: 'swap'
        }
      );
      document.fonts.add(fontFace);
      fontFace.load();
    });
  }

  /**
   * Load reduced font set for medium connections
   */
  private loadReducedFontSet(): void {
    const reducedFonts = [
      { family: 'Nunito Sans', weights: [400] },
      { family: 'Montserrat', weights: [400] },
      { family: 'Abel', weights: [400] }
    ];

    reducedFonts.forEach((font) => {
      font.weights.forEach((weight) => {
        const fontFace = new FontFace(
          font.family,
          `url('/node_modules/@fontsource/${font.family.toLowerCase().replace(' ', '-')}/files/${font.family.toLowerCase().replace(' ', '-')}-latin-${weight}-normal.woff2') format('woff2')`,
          {
            weight: weight.toString(),
            display: 'swap'
          }
        );
        document.fonts.add(fontFace);
        fontFace.load();
      });
    });
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