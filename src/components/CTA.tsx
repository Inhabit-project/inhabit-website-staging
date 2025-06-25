import React, { useRef, useEffect, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LoadingContext } from '../App';

const CTA: React.FC = () => {
  const { t } = useTranslation();
  const isLoading = useContext(LoadingContext);
  const [canAnimate, setCanAnimate] = useState(false);

  // Refs for animations
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Set initial states
  useEffect(() => {
    gsap.set(bgRef.current, {
      opacity: 0,
      scale: 1.1
    });

    gsap.set(contentRef.current, {
      opacity: 0,
      y: 100
    });

    gsap.set(titleRef.current, {
      opacity: 0,
      y: 50
    });

    gsap.set(buttonsRef.current, {
      opacity: 0,
      y: 30
    });

    gsap.set(imageContainerRef.current, {
      opacity: 0,
      x: 50
    });
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
    let ctx = gsap.context(() => {});

    if (canAnimate) {
      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top center",
            end: "center center",
            toggleActions: "play none none reverse"
          }
        });

        // Background fade in and scale
        tl.to(bgRef.current, {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "power3.out"
        })
        // Content container slide up
        .to(contentRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out"
        }, "-=0.8")
        // Title animation
        .to(titleRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out"
        }, "-=0.4")
        // Buttons animation
        .to(buttonsRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out"
        }, "-=0.6")
        // Image container slide in
        .to(imageContainerRef.current, {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out"
        }, "-=0.6");
      });
    }

    return () => {
      ctx.revert();
    };
  }, [canAnimate]);

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden scroll-container"
      aria-label={t('mainPage.cta.title')}
    >
      {/* Background Image */}
      <div 
        ref={bgRef}
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: 'url("/assets/CTA.webp")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        role="presentation"
        aria-hidden="true"
      />

      {/* Content Container */}
      <div ref={contentRef} className="relative z-10 flex min-h-screen items-center justify-center px-[clamp(1rem,5vw,6.25rem)]">
        <div className="w-full max-w-[120rem] rounded-[20px] overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Text and Buttons Container with semi-transparent background */}
            <div className="w-full md:w-[70%] p-6 md:p-12 bg-secondary/80 backdrop-blur-lg">
              <h3 ref={titleRef} className="heading-3 text-light text-center md:text-left">
                <span dangerouslySetInnerHTML={{ __html: t('mainPage.cta.title') }} />
              </h3>

              {/* Buttons */}
              <div ref={buttonsRef} className="mt-8 md:mt-12 flex flex-col md:flex-row gap-4 justify-center md:justify-start">
                {/* Primary Button (Orange) */}
                <button
                  onClick={() => window.location.href = 'mailto:hello@inhabit.earth'}
                  className="mt-0 flex items-center h-[4.2rem] bg-[var(--color-accent)] hover:bg-[var(--color-green-soft)] text-light hover:text-secondary rounded-button backdrop-blur-sm transition-all duration-200 group no-underline"
                  aria-label={t('mainPage.cta.becomeGuardian')}
                > 
                  <div className="flex items-center gap-2 px-6">
                    <img 
                      src="assets/icons/Chield_check_light.svg" 
                      alt="" 
                      className="w-5 h-5 transition-colors duration-200 group-hover:invert" 
                      aria-hidden="true"
                    />
                    <span className="button-text text-sm tracking-[0.02em] uppercase">{t('mainPage.cta.becomeGuardian')}</span>
                  </div>
                  <div className="flex items-center px-4">
                    <svg 
                      className="w-6 h-6 transition-transform duration-200 group-hover:translate-x-1" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </button>

                {/* Secondary Button (Green) */}
                <button
                  onClick={() => window.location.href = 'mailto:hello@inhabit.earth'}
                  className="btn-secondary flex items-center h-[4.2rem] bg-[var(--color-green-soft)] hover:bg-[var(--color-accent)] text-secondary hover:text-light rounded-button backdrop-blur-sm transition-all duration-200 group no-underline"
                  aria-label={t('mainPage.cta.discover')}
                >
                  <div className="flex items-center gap-2 px-4 md:px-6">
                    <img 
                      src="assets/icons/User_add_alt_fill.svg" 
                      alt="" 
                      className="w-5 h-5 transition-colors duration-200 group-hover:invert" 
                      aria-hidden="true"
                    />
                    <span className="button-text text-sm tracking-[0.02em] uppercase">
                      {t('mainPage.cta.discover')}
                    </span>
                  </div>
                  <div className="flex items-center px-3 md:px-4">
                    <svg 
                      className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-200 group-hover:translate-x-1" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </button>
              </div>
            </div>

            {/* Image Container */}
            <div ref={imageContainerRef} className="relative w-full md:w-[30%]">
              <div className="absolute inset-0 bg-secondary/30" aria-hidden="true"></div>
              <img 
                src="/assets/cta-img.webp" 
                alt={t('mainPage.cta.imageAlt')} 
                className="w-full h-full object-cover aspect-[4/3]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA; 