/**
 * Font Preloader Utility
 * Preloads fonts using link tags for better reliability
 */

interface FontPreloadConfig {
  family: string;
  weight: number;
  style?: 'normal' | 'italic';
  display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
}

class FontPreloader {
  private static instance: FontPreloader;
  private preloadedFonts: Set<string> = new Set();

  static getInstance(): FontPreloader {
    if (!FontPreloader.instance) {
      FontPreloader.instance = new FontPreloader();
    }
    return FontPreloader.instance;
  }

  /**
   * Preload fonts using link tags
   */
  preloadFonts(fonts: FontPreloadConfig[]): void {
    fonts.forEach(font => {
      this.preloadFont(font);
    });
  }

  /**
   * Preload a single font
   */
  private preloadFont(font: FontPreloadConfig): void {
    const fontKey = `${font.family}-${font.weight}-${font.style || 'normal'}`;
    
    if (this.preloadedFonts.has(fontKey)) {
      return;
    }

    try {
      // Create link tag for font preloading
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      
      // Generate font URL based on @fontsource structure
      const fontUrlName = font.family.toLowerCase().replace(/\s+/g, '-');
      const styleSuffix = font.style === 'italic' ? 'italic' : 'normal';
      link.href = `/node_modules/@fontsource/${fontUrlName}/files/${fontUrlName}-latin-${font.weight}-${styleSuffix}.woff2`;
      
      // Add font-display attribute
      link.setAttribute('data-font-display', font.display || 'swap');
      
      document.head.appendChild(link);
      this.preloadedFonts.add(fontKey);
      
    } catch (error) {
      console.warn(`Failed to preload font ${font.family} ${font.weight}:`, error);
    }
  }

  /**
   * Add font-display CSS for preloaded fonts
   */
  addFontDisplayCSS(): void {
    const style = document.createElement('style');
    style.textContent = `
      /* Font display optimization for preloaded fonts */
      @font-face {
        font-family: 'Nunito Sans';
        font-display: swap;
      }
      @font-face {
        font-family: 'Montserrat';
        font-display: swap;
      }
      @font-face {
        font-family: 'Abel';
        font-display: swap;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Check if a font is preloaded
   */
  isFontPreloaded(family: string, weight: number, style = 'normal'): boolean {
    const fontKey = `${family}-${weight}-${style}`;
    return this.preloadedFonts.has(fontKey);
  }

  /**
   * Get all preloaded fonts
   */
  getPreloadedFonts(): string[] {
    return Array.from(this.preloadedFonts);
  }
}

// Export singleton instance
export const fontPreloader = FontPreloader.getInstance();

/**
 * Initialize font preloading
 */
export function initializeFontPreloading(): void {
  const fonts: FontPreloadConfig[] = [
    { family: 'Nunito Sans', weight: 400, display: 'swap' },
    { family: 'Nunito Sans', weight: 600, display: 'swap' },
    { family: 'Montserrat', weight: 400, display: 'swap' },
    { family: 'Montserrat', weight: 700, display: 'swap' },
    { family: 'Abel', weight: 400, display: 'swap' }
  ];

  // Add font-display CSS
  fontPreloader.addFontDisplayCSS();
  
  // Preload fonts
  fontPreloader.preloadFonts(fonts);
}

/**
 * Alternative font loading strategy using Google Fonts CDN
 * This can be used as a fallback if @fontsource fails
 */
export function loadFontsFromGoogleCDN(): void {
  const googleFontsLink = document.createElement('link');
  googleFontsLink.rel = 'preconnect';
  googleFontsLink.href = 'https://fonts.googleapis.com';
  document.head.appendChild(googleFontsLink);

  const googleFontsCSSLink = document.createElement('link');
  googleFontsCSSLink.rel = 'preconnect';
  googleFontsCSSLink.href = 'https://fonts.gstatic.com';
  googleFontsCSSLink.crossOrigin = 'anonymous';
  document.head.appendChild(googleFontsCSSLink);

  const fontStylesheet = document.createElement('link');
  fontStylesheet.rel = 'stylesheet';
  fontStylesheet.href = 'https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,wght@0,400;0,600;1,400&family=Montserrat:ital,wght@0,400;0,700;1,400&family=Abel&display=swap';
  document.head.appendChild(fontStylesheet);
} 