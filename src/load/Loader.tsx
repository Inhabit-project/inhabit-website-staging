import React, { useEffect, useState } from 'react';

interface LoaderProps {
  onLoadingComplete?: () => void;
  // Explicit prop to ensure this loader only works for main hero
  isMainHeroLoader?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ onLoadingComplete, isMainHeroLoader = false }) => {
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(false);

  // Early return if this is not the main hero loader
  // This prevents the loader from rendering for internal pages or navigation
  useEffect(() => {
    if (!isMainHeroLoader) {
      // If this is not for the main hero, immediately call completion
      onLoadingComplete?.();
      return;
    }
    
    // Only trigger CSS animations for main hero loader
    setShow(true);
  }, [isMainHeroLoader, onLoadingComplete]);

  useEffect(() => {
    // Only run progress animation for main hero loader
    if (!isMainHeroLoader) {
      return;
    }

    const duration = 2000; // 2 seconds for the loading animation
    const interval = duration / 100; // 100 steps, one per percent

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onLoadingComplete?.();
          }, 200); // Wait 200ms to ensure 100% is visible
          return 100;
        }
        return prev + 1;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onLoadingComplete, isMainHeroLoader]);

  // Don't render anything if this is not for the main hero
  if (!isMainHeroLoader) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-light z-50 flex items-center justify-center"
    >
      <div 
        className={`absolute top-12 left-12 font-abel text-sm text-secondary uppercase transition-all duration-700 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
      >
        LOADING
      </div>
      <div 
        className={`relative w-[20rem] h-[20rem] m-auto transition-all duration-700 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'} animate-loaderRotate`}
      >
        <img 
          src="/assets/small-earth.webp" 
          alt="Earth loader" 
          className="w-full h-full object-cover animate-loaderPulse"
          loading="eager"
        />
      </div>
      <div 
        className={`absolute bottom-12 right-12 font-abel text-[9rem] text-secondary transition-all duration-700 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
      >
        {String(Math.floor(progress)).padStart(3, '0')}%
      </div>
    </div>
  );
};

export default Loader; 