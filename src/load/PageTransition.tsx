import React, { useEffect } from 'react';

interface PageTransitionProps {
  onComplete?: () => void;
}

const PageTransition: React.FC<PageTransitionProps> = ({ onComplete }) => {
  useEffect(() => {
    // Use a timeout to match the CSS animation duration (1.5s)
    const timer = setTimeout(() => {
      if (onComplete) {
        onComplete();
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
