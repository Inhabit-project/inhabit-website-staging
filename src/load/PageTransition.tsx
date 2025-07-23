import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface PageTransitionProps {
  in: boolean; // true = transition in (reveal), false = transition out (cover)
  onComplete?: () => void;
}

const PageTransition: React.FC<PageTransitionProps> = ({ in: isIn, onComplete }) => {
  const maskRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mask = maskRef.current;
    if (!mask) return;
    let tween: gsap.core.Tween;
    if (isIn) {
      tween = gsap.fromTo(
        mask,
        { scale: 0, opacity: 1 },
        {
          scale: 1.2,
          opacity: 0,
          duration: 1.2,
          ease: 'expo.inOut',
          onComplete,
        }
      );
    } else {
      tween = gsap.fromTo(
        mask,
        { scale: 1.2, opacity: 0 },
        {
          scale: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'expo.inOut',
          onComplete,
        }
      );
    }
    return () => { tween && tween.kill(); };
  }, [isIn, onComplete]);

  return (
    <div className="page-transition-overlay">
      <div
        ref={maskRef}
        className="page-transition-mask"
        style={{
          WebkitMaskImage: 'url(/assets/loader-logo.svg)',
          maskImage: 'url(/assets/loader-logo.svg)',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskPosition: 'center',
          WebkitMaskSize: 'contain',
          maskSize: 'contain',
        }}
      />
    </div>
  );
};

export default PageTransition;
