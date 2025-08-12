import React, { useEffect, useState } from 'react';

interface LoaderProps {
  onLoadingComplete?: () => void;
}

const Loader: React.FC<LoaderProps> = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Trigger CSS animations after mount
    setShow(true);
  }, []);

  useEffect(() => {
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
  }, [onLoadingComplete]);

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
          fetchPriority="high"
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