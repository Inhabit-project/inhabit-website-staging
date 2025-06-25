import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

interface LoaderProps {
  onLoadingComplete?: () => void;
}

const Loader: React.FC<LoaderProps> = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const loaderRef = useRef<HTMLDivElement>(null);
  const earthRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial animation
    if (loaderRef.current && earthRef.current && progressRef.current && textRef.current) {
      gsap.set([earthRef.current, progressRef.current, textRef.current], { opacity: 0, y: 20 });
      
      gsap.timeline()
        .to(earthRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out"
        })
        .to([progressRef.current, textRef.current], {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out"
        }, "-=0.4");
    }
  }, []);

  useEffect(() => {
    const duration = 2000; // 2 seconds for the loading animation
    const interval = 10; // Update every 10ms
    const steps = duration / interval;
    const increment = 100 / steps;
    let currentProgress = 0;

    const timer = setInterval(() => {
      currentProgress += increment;
      if (currentProgress >= 100) {
        clearInterval(timer);
        setProgress(100);
        onLoadingComplete?.();
      } else {
        setProgress(Math.min(currentProgress, 100));
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onLoadingComplete]);

  return (
    <div 
      ref={loaderRef} 
      className="fixed inset-0 bg-light z-50 flex items-center justify-center"
    >
      <div 
        ref={textRef}
        className="absolute top-16 left-24 font-abel text-sm text-secondary uppercase"
      >
        LOADING
      </div>
      <div 
        ref={earthRef}
        className="relative w-[20rem] h-[20rem] animate-loaderRotate m-auto"
      >
        <img 
          src="/assets/small-earth.webp" 
          alt="Earth loader" 
          className="w-full h-full object-cover animate-loaderPulse"
        />
      </div>
      <div 
        ref={progressRef}
        className="absolute bottom-16 right-24 font-abel text-[53.48px] text-secondary"
      >
        {String(Math.floor(progress)).padStart(3, '0')}%
      </div>
    </div>
  );
};

export default Loader; 