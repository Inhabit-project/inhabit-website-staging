/**
 * Font Loading Utility
 * Handles font loading with proper error handling and fallbacks
 */

interface FontConfig {
  family: string;
  weight: number;
  fallback?: string;
}

class FontLoader {
  private static instance: FontLoader;
  private loadedFonts: Set<string> = new Set();
  private failedFonts: Set<string> = new Set();

  static getInstance(): FontLoader {
    if (!FontLoader.instance) {
      FontLoader.instance = new FontLoader();
    }
    return FontLoader.instance;
  }

  /**
   * Load fonts with error handling
   */
  async loadFonts(fonts: FontConfig[]): Promise<void> {
    const loadPromises = fonts.map(font => this.loadFont(font));
    
    try {
      await Promise.allSettled(loadPromises);
    } catch (error) {
      console.warn('Some fonts failed to load:', error);
    }
  }

  /**
   * Load a single font with error handling
   */
  private async loadFont(font: FontConfig): Promise<void> {
    const fontKey = `${font.family}-${font.weight}`;
    
    if (this.loadedFonts.has(fontKey) || this.failedFonts.has(fontKey)) {
      return;
    }

    try {
      // Check if font is already available
      if ('fonts' in document && document.fonts.check(`${font.weight} 16px "${font.family}"`)) {
        this.loadedFonts.add(fontKey);
        return;
      }

      // Try to load the font
      if ('fonts' in document) {
        await document.fonts.load(`${font.weight} 16px "${font.family}"`);
        this.loadedFonts.add(fontKey);
      }
    } catch (error) {
      this.failedFonts.add(fontKey);
      console.warn(`Failed to load font ${font.family} ${font.weight}:`, error);
      
      // Apply fallback if specified
      if (font.fallback) {
        this.applyFallback(font);
      }
    }
  }

  /**
   * Apply fallback font when primary font fails
   */
  private applyFallback(font: FontConfig): void {
    if (!font.fallback) return;

    const style = document.createElement('style');
    style.textContent = `
      .font-${font.family.toLowerCase().replace(/\s+/g, '-')} {
        font-family: "${font.fallback}", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif !important;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Check if a font is loaded
   */
  isFontLoaded(family: string, weight: number): boolean {
    const fontKey = `${family}-${weight}`;
    return this.loadedFonts.has(fontKey);
  }

  /**
   * Check if a font failed to load
   */
  isFontFailed(family: string, weight: number): boolean {
    const fontKey = `${family}-${weight}`;
    return this.failedFonts.has(fontKey);
  }

  /**
   * Get loading status for all fonts
   */
  getLoadingStatus(): { loaded: string[]; failed: string[] } {
    return {
      loaded: Array.from(this.loadedFonts),
      failed: Array.from(this.failedFonts)
    };
  }

  /**
   * Reset loading state (useful for testing)
   */
  reset(): void {
    this.loadedFonts.clear();
    this.failedFonts.clear();
  }
}

// Export singleton instance
export const fontLoader = FontLoader.getInstance();

/**
 * Initialize font loading with error handling
 */
export function initializeFontLoading(): void {
  const fonts: FontConfig[] = [
    { family: 'Nunito Sans', weight: 400, fallback: 'system-ui' },
    { family: 'Nunito Sans', weight: 600, fallback: 'system-ui' },
    { family: 'Montserrat', weight: 400, fallback: 'system-ui' },
    { family: 'Montserrat', weight: 700, fallback: 'system-ui' },
    { family: 'Abel', weight: 400, fallback: 'system-ui' }
  ];

  // Load fonts with error handling
  fontLoader.loadFonts(fonts).catch(error => {
    console.warn('Font loading initialization failed:', error);
  });

  // Monitor font loading status
  if ('fonts' in document) {
    document.fonts.ready.then(() => {
      const status = fontLoader.getLoadingStatus();
    }).catch(error => {
      console.warn('Font loading monitoring failed:', error);
    });
  }
}

/**
 * Utility functions for font loading
 */
export const FontLoadingUtils = {
  /**
   * Wait for specific font to load
   */
  async waitForFont(family: string, weight: number, timeout = 5000): Promise<boolean> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      if (fontLoader.isFontLoaded(family, weight)) {
        return true;
      }
      if (fontLoader.isFontFailed(family, weight)) {
        return false;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return false;
  },

  /**
   * Apply fallback fonts when primary fonts fail
   */
  applyFallbacks(): void {
    const fallbackStyle = document.createElement('style');
    fallbackStyle.textContent = `
      /* Fallback fonts for when primary fonts fail to load */
      .font-nunito-sans {
        font-family: 'Nunito Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
      }
      .font-montserrat {
        font-family: 'Montserrat', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
      }
      .font-abel {
        font-family: 'Abel', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
      }
    `;
    document.head.appendChild(fallbackStyle);
  }
}; 