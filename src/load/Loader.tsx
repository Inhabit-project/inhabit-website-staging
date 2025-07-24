import React, { useEffect, useState, useRef, useCallback } from 'react';

interface LoaderProps {
  onLoadingComplete?: () => void;
  // Explicit prop to ensure this loader only works for main hero
  isMainHeroLoader?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ onLoadingComplete, isMainHeroLoader = false }) => {
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const imageRef = useRef<HTMLImageElement>(null);
  const preloadImageRef = useRef<HTMLImageElement>();

  // Optimized image preloading with error handling
  useEffect(() => {
    if (!isMainHeroLoader) return;

    const img = new Image();
    preloadImageRef.current = img;
    
    // Add loading optimizations
    img.loading = 'eager';
    img.decoding = 'async';
    
    const handleLoad = () => {
      setImageLoaded(true);
      setImageError(false);
    };
    
    const handleError = () => {
      setImageError(true);
      // Still show loader even if image fails to load
      setImageLoaded(true);
    };

    img.addEventListener('load', handleLoad);
    img.addEventListener('error', handleError);
    img.src = "/assets/small-earth.webp";

    return () => {
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
    };
  }, [isMainHeroLoader]);

  // Early return if this is not the main hero loader
  useEffect(() => {
    if (!isMainHeroLoader) {
      // If this is not for the main hero, immediately call completion
      onLoadingComplete?.();
      return;
    }
    
    // Only trigger CSS animations for main hero loader after image loads or fails
    if (imageLoaded) {
      setShow(true);
    }
  }, [isMainHeroLoader, onLoadingComplete, imageLoaded]);

  // Optimized animation using requestAnimationFrame
  const animateProgress = useCallback((timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }

    const duration = 2000; // 2 seconds for the loading animation
    const elapsed = timestamp - startTimeRef.current;
    const progressValue = Math.min((elapsed / duration) * 100, 100);

    setProgress(progressValue);

    if (progressValue < 100) {
      animationFrameRef.current = requestAnimationFrame(animateProgress);
    } else {
      // Wait 200ms to ensure 100% is visible
      setTimeout(() => {
        onLoadingComplete?.();
      }, 200);
    }
  }, [onLoadingComplete]);

  useEffect(() => {
    // Only run progress animation for main hero loader and after image loads
    if (!isMainHeroLoader || !imageLoaded) {
      return;
    }

    animationFrameRef.current = requestAnimationFrame(animateProgress);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isMainHeroLoader, imageLoaded, animateProgress]);

  // Don't render anything if this is not for the main hero
  if (!isMainHeroLoader) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-light z-50 flex items-center justify-center"
      style={{ 
        willChange: show ? 'auto' : 'opacity, transform',
      }}
    >
      <div 
        className={`absolute top-12 left-12 font-abel text-sm text-secondary uppercase transition-all duration-700 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
        style={{ 
          willChange: show ? 'auto' : 'opacity, transform',
        }}
      >
        LOADING
      </div>
      <div 
        className={`relative w-[20rem] h-[20rem] m-auto transition-all duration-700 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'} animate-loaderRotate`}
        style={{ 
          willChange: 'transform',
          transform: 'translate3d(0, 0, 0)', // Force hardware acceleration
        }}
      >
        {!imageError ? (
          <img 
            ref={imageRef}
            src="/assets/small-earth.webp" 
            alt="Earth loader" 
            className="w-full h-full object-cover animate-loaderPulse"
            loading="eager"
            decoding="async"
            style={{ 
              willChange: 'transform, opacity',
              transform: 'translate3d(0, 0, 0)', // Force hardware acceleration
              imageRendering: 'auto',
            }}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            fetchPriority="high"
          />
        ) : (
          // Fallback content if image fails to load
          <div 
            className="w-full h-full bg-green-soft rounded-full animate-loaderPulse flex items-center justify-center"
            style={{ 
              willChange: 'transform, opacity',
              transform: 'translate3d(0, 0, 0)',
            }}
          >
            <div className="text-secondary text-2xl font-montserrat font-medium">🌍</div>
          </div>
        )}
      </div>
      <div 
        className={`absolute bottom-12 right-12 font-abel text-[9rem] text-secondary transition-all duration-700 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
        style={{ 
          willChange: show ? 'auto' : 'opacity, transform',
        }}
      >
        {String(Math.floor(progress)).padStart(3, '0')}%
      </div>
    </div>
  );
};

export default Loader; 