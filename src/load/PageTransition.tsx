import React, { useEffect } from 'react';
import { scrollManager } from '../utils/scrollManager';

interface PageTransitionProps {
  onComplete?: () => void;
}

const PageTransition: React.FC<PageTransitionProps> = ({ onComplete }) => {
  useEffect(() => {
    // Use a timeout to match the CSS animation duration (1.5s)
    const timer = setTimeout(async () => {
      try {
        // Ensure page is properly positioned at top/hero after transition
        // This is especially important for Safari
        await scrollManager.ensurePageStartsAtTop({ immediate: true, force: true });
        
        if (onComplete) {
          onComplete();
        }
      } catch (error) {
        console.warn('PageTransition scroll positioning failed:', error);
        // Fallback: ensure we're at least at the top
        window.scrollTo({ top: 0, behavior: "auto" });
        
        if (onComplete) {
          onComplete();
        }
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="page-transition-overlay">
      <div className="page-transition-mask nature-transition transition-in" />
    </div>
  );
};

export default PageTransition;
