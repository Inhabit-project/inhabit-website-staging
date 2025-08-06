import React, { useRef, useEffect, useContext, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LoadingContext } from '../App';
import { useGSAP } from '@gsap/react';
import { useTranslation } from 'react-i18next';

// Register the hook to avoid React version discrepancies
gsap.registerPlugin(useGSAP);

interface InfoCardProps {
  title: string;
  subtitle?: string;
  logoSrc?: string;
  logoAlt?: string;
  text: string;
  imageSrc: string;
  imageAlt?: string;
  className?: string;
  showPopupButton?: boolean;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, subtitle = '', logoSrc, logoAlt = '', text, imageSrc, imageAlt = '', className, showPopupButton = false }) => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const titleGroupRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isLoading = useContext(LoadingContext);
  const [canAnimate, setCanAnimate] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Set initial states with useGSAP
  useGSAP(() => {
    if (!sectionRef.current) return;

    gsap.set(imageRef.current, {
      opacity: 0,
      x: -50,
      scale: 0.95
    });
    gsap.set([titleGroupRef.current, ...(logoRef.current ? [logoRef.current] : [])], {
      opacity: 0,
      y: 30
    });
    gsap.set(textRef.current, {
      opacity: 0,
      y: 20
    });
  }, { scope: sectionRef });

  // Handle loading state change
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setCanAnimate(true);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setCanAnimate(false);
    }
  }, [isLoading]);

  // Handle animations with useGSAP
  useGSAP(() => {
    if (!canAnimate || !sectionRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 75%",
        end: "center center",
        toggleActions: "play none none reverse"
      }
    });

    tl.to(imageRef.current, {
      opacity: 1,
      x: 0,
      scale: 1,
      duration: 1,
      ease: "power3.out"
    })
    .to([titleGroupRef.current, ...(logoRef.current ? [logoRef.current] : [])], {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.1
    }, "-=0.6")
    .to(textRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.4");
  }, { scope: sectionRef, dependencies: [canAnimate] });

  return (
    <section 
      ref={sectionRef}
      className={`relative w-full flex items-center justify-center py-16 background-gradient-dark ${className || ''}`}
      aria-labelledby="info-card-title"
    >
      {/* Optional overlay or pattern can be added here if needed */}
      <div className="container z-10 flex flex-col lg:flex-row w-full items-center justify-between px-0 rounded-[1.25rem] overflow-hidden shadow-lg border border-white/20 backdrop-blur-[200px] bg-white/5">
        {/* Image */}
        <div ref={imageRef} className="flex-shrink-0 w-full lg:w-1/2 aspect-square flex items-center justify-center bg-secondary">
          <img 
            src={imageSrc} 
            alt={imageAlt} 
            className="w-full h-full object-cover rounded-t-[1.25rem] lg:rounded-t-none lg:rounded-l-[1.25rem]"
            loading="lazy"
          />
        </div>
        {/* Text + Logo + Title */}
        <div ref={contentRef} className="flex-1 flex flex-col items-start justify-center p-6 lg:p-12 bg-transparent lg:w-1/2">
          <div className="flex mb-6 w-full items-center">
            <span ref={titleGroupRef} className="flex flex-col flex-1">
              {title && (() => {
                const words = title.trim().split(' ');
                if (words.length === 1) {
                  return (
                    <h2 
                      id="info-card-title"
                      style={{ display: 'block', fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '3.5rem', color: '#E6F2D6', lineHeight: 1 }}
                    >
                      {words[0]}
                    </h2>
                  );
                } else {
                  return (
                    <h2 id="info-card-title">
                      <span style={{ display: 'block', fontFamily: 'Montserrat, sans-serif', fontWeight: 300, fontSize: '3.5rem', color: '#E6F2D6', lineHeight: 1 }}>
                        {words[0]}
                      </span>
                      <span style={{ display: 'block', fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '3.5rem', color: '#E6F2D6', lineHeight: 1 }}>
                        {words.slice(1).join(' ')}
                      </span>
                    </h2>
                  );
                }
              })()}
              {subtitle && (
                <span className="heading-2 text-light leading-tight mt-1">{subtitle}</span>
              )}
            </span>
            {logoSrc && (
              <img 
                ref={logoRef}
                src={logoSrc} 
                alt={logoAlt} 
                className="h-[7rem] w-auto ml-4"
                loading="lazy"
              />
            )}
          </div>
          <div ref={textRef} className="body-S opacity-90 max-w-prose">
            {text.split('\n').map((line, idx) => (
              <p key={idx} className="mb-4 last:mb-0">{line}</p>
            ))}
          </div>
          {showPopupButton && (
            <button
              className="mt-6 btn-primary px-6"
              onClick={() => setIsPopupOpen(true)}
              aria-expanded={isPopupOpen}
              aria-controls="news-popup"
            >
              {t('mainPage.checkTerritory')}
            </button>
          )}
        </div>
      </div>
      {isPopupOpen && (
        <div 
          className="popup-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="news-popup-title"
        >
          <button
            onClick={() => setIsPopupOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 z-50 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-[4.125px] flex items-center justify-center transition-all duration-300 group"
            aria-label="Close news popup"
          >
            <div className="relative w-4 h-4">
              <div className="absolute top-1/2 left-0 w-4 h-[2px] bg-white rotate-45 group-hover:bg-orange-500 transition-colors duration-300" />
              <div className="absolute top-1/2 left-0 w-4 h-[2px] bg-white -rotate-45 group-hover:bg-orange-500 transition-colors duration-300" />
            </div>
          </button>
          <div className="popup-content">
            <iframe
              id="news-popup"
              src="https://explorer.land/p/project/bioculturalcorridor/site/Z6UXzL/news"
              title="Ñuiyanzhi News"
              style={{ width: '100%', height: '80vh', border: 'none', borderRadius: '1rem', background: 'white' }}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default InfoCard;

// InfoCard with image on the right side
export const InfoCardRightImage: React.FC<InfoCardProps> = ({ title, subtitle = '', logoSrc, logoAlt = '', text, imageSrc, imageAlt = '', className }) => {
  const isLoading = useContext(LoadingContext);
  const [canAnimate, setCanAnimate] = useState(false);

  // Animation refs
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleGroupRef = useRef<HTMLSpanElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // Set initial states
  useEffect(() => {
    if (sectionRef.current) {
      const ctx = gsap.context(() => {
        gsap.set(imageRef.current, {
          opacity: 0,
          x: 50,
          scale: 0.95
        });
        gsap.set([titleGroupRef.current, ...(logoRef.current ? [logoRef.current] : [])], {
          opacity: 0,
          y: 30
        });
        gsap.set(textRef.current, {
          opacity: 0,
          y: 20
        });
      }, sectionRef);

      return () => ctx.revert();
    }
  }, []);

  // Handle loading state change
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setCanAnimate(true);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setCanAnimate(false);
    }
  }, [isLoading]);

  // Handle animations
  useEffect(() => {
    if (!canAnimate || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          end: "center center",
          toggleActions: "play none none reverse"
        }
      });

      tl.to(imageRef.current, {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 1,
        ease: "power3.out"
      })
      .to([titleGroupRef.current, ...(logoRef.current ? [logoRef.current] : [])], {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1
      }, "-=0.6")
      .to(textRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.4");
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, [canAnimate]);

  return (
    <section 
      ref={sectionRef}
      className={`relative w-full flex items-center justify-center py-16 background-gradient-dark ${className || ''}`}
      aria-labelledby="info-card-right-title"
    >
      <div className="container z-10 flex flex-col lg:flex-row-reverse w-full items-center justify-between px-0 rounded-[1.25rem] overflow-hidden shadow-lg border border-white/20 backdrop-blur-[200px] bg-white/5">
        {/* Image on the right for large screens */}
        <div ref={imageRef} className="flex-shrink-0 w-full lg:w-1/2 aspect-square flex items-center justify-center bg-secondary">
          <img 
            src={imageSrc} 
            alt={imageAlt} 
            className="w-full h-full object-cover rounded-t-[1.25rem] lg:rounded-t-none lg:rounded-r-[1.25rem]"
            loading="lazy"
          />
        </div>
        {/* Text + Logo + Title */}
        <div ref={contentRef} className="flex-1 flex flex-col items-start justify-center p-6 lg:p-12 bg-transparent lg:w-1/2">
          <div className="flex mb-6 w-full items-center">
            <span ref={titleGroupRef} className="flex flex-col flex-1">
              {title && (() => {
                const words = title.trim().split(' ');
                if (words.length === 1) {
                  return (
                    <h2 
                      id="info-card-right-title"
                      style={{ display: 'block', fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '3.5rem', color: '#E6F2D6', lineHeight: 1 }}
                    >
                      {words[0]}
                    </h2>
                  );
                } else {
                  return (
                    <h2 id="info-card-right-title">
                      <span style={{ display: 'block', fontFamily: 'Montserrat, sans-serif', fontWeight: 300, fontSize: '3.5rem', color: '#E6F2D6', lineHeight: 1 }}>
                        {words[0]}
                      </span>
                      <span style={{ display: 'block', fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '3.5rem', color: '#E6F2D6', lineHeight: 1 }}>
                        {words.slice(1).join(' ')}
                      </span>
                    </h2>
                  );
                }
              })()}
              {subtitle && (
                <span className="heading-2 text-light leading-tight mt-1">{subtitle}</span>
              )}
            </span>
            {logoSrc && (
              <img 
                ref={logoRef}
                src={logoSrc} 
                alt={logoAlt} 
                className="h-[7rem] w-auto ml-4"
                loading="lazy"
              />
            )}
          </div>
          <div ref={textRef} className="body-S opacity-90 max-w-prose">
            {text.split('\n').map((line, idx) => (
              <p key={idx} className="mb-4 last:mb-0">{line}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}; 