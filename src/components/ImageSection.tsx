import React, { useRef, useEffect, useContext, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LoadingContext } from '../App';
import { useGSAP } from '@gsap/react';

// Register the hook to avoid React version discrepancies
gsap.registerPlugin(useGSAP);

interface ImageSectionProps {
  eyebrow: string;
  heading: React.ReactNode;
  imageSrc: string;
  imageAlt?: string;
}

const ImageSection: React.FC<ImageSectionProps> = ({ eyebrow, heading, imageSrc, imageAlt = '' }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const isLoading = useContext(LoadingContext);
  const [canAnimate, setCanAnimate] = useState(false);

  // Set initial states with useGSAP
  useGSAP(() => {
    gsap.set([eyebrowRef.current, headingRef.current], {
      opacity: 0,
      y: 50
    });
    gsap.set(imageRef.current, {
      opacity: 0,
      y: 100,
      scale: 0.95
    });
  }, { scope: sectionRef });

  // Handle loading state change with debounce
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (!isLoading) {
      timer = setTimeout(() => {
        setCanAnimate(true);
      }, 1500);
    } else {
      setCanAnimate(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isLoading]);

  // Handle animations with useGSAP
  useGSAP(() => {
    if (!canAnimate || !sectionRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top center',
        end: 'center center',
        toggleActions: 'play none none reverse',
      }
    });

    // Build the animation sequence
    if (eyebrowRef.current && headingRef.current && imageRef.current) {
      tl.to(eyebrowRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
      })
      .to(headingRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
      }, '-=0.6')
      .to(imageRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
      }, '-=0.7');
    }
  }, { scope: sectionRef, dependencies: [canAnimate] });

  return (
    <section ref={sectionRef} className="relative w-full background-gradient-dark flex flex-col items-center scroll-container">
      {/* Background with decorative elements */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <img 
          src="/assets/intro-bg.svg" 
          alt="" 
          className="absolute right-0 h-full opacity-40"
          loading="lazy" 
        />
      </div>
      {/* Content */}
      <div className="z-10 w-full h-full max-w-[120rem] mx-auto px-[clamp(1.5rem,5vw,6.25rem)] py-24 flex flex-col justify-between min-h-screen">
        {/* Text content */}
        <div className="flex flex-col gap-3">
          {/* Eyebrow text */}
          <p ref={eyebrowRef} className="eyebrow text-light">
            {eyebrow}
          </p>
          {/* Main heading */}
          <h2 ref={headingRef} className="heading-2 text-light max-w-[1100px]">
            {heading}
          </h2>
        </div>
        {/* Image container */}
        <div className="self-end w-full md:w-[45rem] h-[16rem] md:h-[22rem] rounded-xl overflow-hidden mt-12">
          <img 
            ref={imageRef}
            src={imageSrc} 
            alt={imageAlt} 
            className="w-full h-full object-cover" 
          />
        </div>
      </div>
    </section>
  );
};

export default ImageSection; 