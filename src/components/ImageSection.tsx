import React, { useRef, useLayoutEffect, useContext } from 'react';
import { LoadingContext } from '../App';
import { gsap, ScrollTrigger } from '../utils/gsap';

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

  // Initialize animations - using the exact working pattern from Video/Hubs/StewardshipNFT
  useLayoutEffect(() => {
    if (isLoading) return;
    const section = sectionRef.current;
    const eyebrow = eyebrowRef.current;
    const heading = headingRef.current;
    const image = imageRef.current;
    if (!section || !eyebrow || !heading || !image) return;
    
    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set([eyebrow, heading], {
        opacity: 0,
        y: 50
      });
      gsap.set(image, {
        opacity: 0,
        y: 100,
        scale: 0.95
      });

      // Create scroll-triggered animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top center",
          end: "center center",
          toggleActions: "play none none reverse"
        }
      });

      tl.to(eyebrow, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
      })
      .to(heading, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.6")
      .to(image, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "power3.out"
      }, "-=0.4");

      ScrollTrigger.refresh();
    }, section);

    return () => {
      ctx.revert();
    };
  }, [isLoading]);

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