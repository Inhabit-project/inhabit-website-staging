import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// Register the hook to avoid React version discrepancies
gsap.registerPlugin(useGSAP);

interface PageTransitionProps {
  in: boolean; // true = transition in (reveal), false = transition out (cover)
  onComplete?: () => void;
}

const PageTransition: React.FC<PageTransitionProps> = ({ in: isIn, onComplete }) => {
  const maskRef = useRef<HTMLDivElement>(null);

  // Handle page transition animations with useGSAP
  useGSAP(() => {
    const mask = maskRef.current;
    if (!mask) return;

    if (isIn) {
      gsap.fromTo(
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
      gsap.fromTo(
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
  }, { scope: maskRef, dependencies: [isIn, onComplete] });

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
