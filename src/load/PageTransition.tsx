import React, { useEffect } from 'react';

interface PageTransitionProps {
  in: boolean; // true = transition in (reveal), false = transition out (cover)
  onComplete?: () => void;
}

const PageTransition: React.FC<PageTransitionProps> = ({ in: isIn, onComplete }) => {
  useEffect(() => {
    // Use a timeout to match the CSS animation duration (1.5s)
    const timer = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [isIn, onComplete]);

  return (
    <div className="page-transition-overlay">
      <div
        className={`page-transition-mask nature-transition ${
          isIn ? 'transition-in' : 'transition-out'
        }`}
      />
    </div>
  );
};

export default PageTransition;
