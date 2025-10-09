import React, { useEffect } from 'react';

interface PageTransitionProps {
  onComplete?: () => void;
  transitionIn?: boolean;
}

const PageTransition: React.FC<PageTransitionProps> = ({ onComplete, transitionIn = false }) => {
  useEffect(() => {
    // Use a timeout to match the CSS animation duration (0.8s)
    const timer = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="page-transition-overlay">
      <div 
        className={`page-transition-mask nature-transition ${transitionIn ? 'transition-in' : 'transition-out'}`} 
      />
    </div>
  );
};

export default PageTransition;
