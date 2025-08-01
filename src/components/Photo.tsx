import React, { useRef, useState, useContext, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap, ScrollTrigger } from '../utils/gsap';
import { LoadingContext } from '../App';
import { useGSAP } from '@gsap/react';

// Register the hook to avoid React version discrepancies
gsap.registerPlugin(useGSAP);

// Utility to set --vh CSS variable for mobile viewport height
function useMobileVh() {
  React.useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setVh();
    window.addEventListener('resize', setVh);
    return () => window.removeEventListener('resize', setVh);
  }, []);
}

// Preload images before component mounts
function usePreloadImages(srcs: string[], onAllLoaded: () => void) {
  React.useEffect(() => {
    let loaded = 0;
    const total = srcs.length;
    const imgElements: HTMLImageElement[] = [];
    srcs.forEach(src => {
      const img = new window.Image();
      img.src = src;
      img.onload = img.onerror = () => {
        loaded++;
        if (loaded === total) {
          onAllLoaded();
        }
      };
      imgElements.push(img);
    });
    // No cleanup needed for preloaded images
    // eslint-disable-next-line
  }, []);
}

const Photo: React.FC = () => {
  const { t } = useTranslation();
  const section1Ref = useRef<HTMLElement>(null);
  const section2Ref = useRef<HTMLElement>(null);
  const image1ContainerRef = useRef<HTMLDivElement>(null);
  const image2ContainerRef = useRef<HTMLDivElement>(null);
  const textBox1Ref = useRef<HTMLDivElement>(null);
  const textBox2Ref = useRef<HTMLDivElement>(null);
  const isLoading = useContext(LoadingContext);

  // Track image loading
  const [imagesLoaded, setImagesLoaded] = useState(false);
  
  // Add canAnimate state for Pattern 2 consistency
  const [canAnimate, setCanAnimate] = useState(false);

  // Preload images before rendering
  usePreloadImages([
    '/assets/photo1.webp',
    '/assets/photo-2.webp',
  ], () => setImagesLoaded(true));

  // Set --vh for mobile
  useMobileVh();

  // Add Safari class to body for possible CSS overrides
  React.useEffect(() => {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari) {
      document.body.classList.add('safari');
    }
    return () => {
      document.body.classList.remove('safari');
    };
  }, []);

  // Handle loading state change with Pattern 2 delay
  React.useEffect(() => {
    if (!isLoading && imagesLoaded) {
      setCanAnimate(true);
    } else {
      setCanAnimate(false);
    }
  }, [isLoading, imagesLoaded]);

  // Animate text boxes with useGSAP
  useGSAP(() => {
    if (!canAnimate) return;

    // Section 1 text box animation with better error handling
    if (textBox1Ref.current && section1Ref.current) {
      try {
        gsap.timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: {
            trigger: section1Ref.current,
            start: 'top center',
            end: 'center center',
            toggleActions: 'play none none reverse',
          },
        })
        .fromTo(textBox1Ref.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
      } catch (error) {
        console.error('Photo section 1 animation failed:', error);
      }
    }
    
    // Section 2 text box animation with better error handling
    if (textBox2Ref.current && section2Ref.current) {
      try {
        gsap.timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: {
            trigger: section2Ref.current,
            start: 'top center',
            end: 'center center',
            toggleActions: 'play none none reverse',
          },
        })
        .fromTo(textBox2Ref.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
      } catch (error) {
        console.error('Photo section 2 animation failed:', error);
      }
    }
  }, { dependencies: [canAnimate] });

  // Aspect ratio for image containers (e.g., 3/2)
  const aspectRatio = '3/2';

  // Don't render until images are preloaded
  if (!imagesLoaded) {
    return null;
  }

  return (
    <div className="relative w-full">
      {/* Photo 1 */}
      <section
        ref={section1Ref}
        className="relative w-full photo-parallax-bg"
        style={{
          minHeight: 'calc(var(--vh, 1vh) * 100)',
          backgroundImage: "url('/assets/photo1.webp')",
        }}
      >
        <div
          ref={textBox1Ref}
          className="absolute bottom-[clamp(1.5rem,5vw,6.25rem)] right-[clamp(1.5rem,5vw,6.25rem)] max-w-[40rem] bg-white/10 photo-textbox-blur p-4 md:p-8 rounded-[20px] mx-4 md:mx-0 shadow-lg"
        >
          <p className="body-M text-light">
            {t('mainPage.photo.section1')}
          </p>
        </div>
      </section>

      {/* Photo 2 */}
      <section
        ref={section2Ref}
        className="relative w-full photo-parallax-bg"
        style={{
          minHeight: 'calc(var(--vh, 1vh) * 100)',
          backgroundImage: "url('/assets/photo-2.webp')",
        }}
      >
        <div
          ref={textBox2Ref}
          className="absolute bottom-[clamp(1.5rem,5vw,6.25rem)] left-[clamp(1.5rem,5vw,6.25rem)] max-w-[40rem] bg-white/10 photo-textbox-blur p-4 md:p-8 rounded-[20px] mx-4 md:mx-0 shadow-lg"
        >
          <p className="body-M text-light">
            {t('mainPage.photo.section2')}
          </p>
        </div>
      </section>
    </div>
  );
};

export default Photo; 