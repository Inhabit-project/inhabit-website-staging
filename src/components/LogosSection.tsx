import React, { useRef, useEffect, useContext, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LoadingContext } from '../App';
import { useGSAP } from '@gsap/react';

// Register the hook to avoid React version discrepancies
gsap.registerPlugin(useGSAP);

interface Logo {
  logo: string;
  name: string;
}

interface LogosSectionProps {
  showAllies?: boolean;
  showBuilders?: boolean;
  showPartners?: boolean;
  allies?: Logo[];
  builders?: Logo[];
  partners?: Logo[];
}

const allies: Logo[] = [
  { logo: '/assets/logos/ally-logo-1.png', name: 'Ally 1' },
  { logo: '/assets/logos/ally-logo-2.png', name: 'Ally 2' },
  { logo: '/assets/logos/ally-logo-3.webp', name: 'Ally 3' },
  { logo: '/assets/logos/ally-logo-4.svg', name: 'Ally 4' },
  { logo: '/assets/logos/ally-logo-5.webp', name: 'Ally 5' },
];

const builders: Logo[] = [
  { logo: '/assets/logos/ally-logo-1.png', name: 'Builder 1' },
  { logo: '/assets/logos/builder-logo-2.webp', name: 'Builder 2' },
  { logo: '/assets/logos/ally-logo-4.svg', name: 'Builder 3' },
  { logo: '/assets/logos/ally-logo-3.webp', name: 'Builder 4' },
  { logo: '/assets/logos/ally-logo-5.webp', name: 'Builder 5' },
  { logo: '/assets/logos/builder-logo-6.svg', name: 'Builder 6' },
  { logo: '/assets/logos/builder-logo-7.webp', name: 'Builder 7' },
];

const partners: Logo[] = [
  { logo: '/assets/logos/partner-logo-1.png', name: 'Partner 1' },
  { logo: '/assets/logos/partner-logo-2.png', name: 'Partner 2' },
  { logo: '/assets/logos/partner-logo-3.svg', name: 'Partner 3' },
  { logo: '/assets/logos/partner-logo-4.png', name: 'Partner 4' },
  { logo: '/assets/logos/partner-logo-5.png', name: 'Partner 5' },
  { logo: '/assets/logos/partner-logo-6.svg', name: 'Partner 6' },
];

// Marquee component for infinite scrolling logos
const Marquee: React.FC<{ logos: Logo[] }> = ({ logos }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const isLoading = useContext(LoadingContext);
  const [canAnimate, setCanAnimate] = useState(false);
  const [repeatCount, setRepeatCount] = useState(1);
  const rafId = useRef<number | null>(null);
  const resizeObserver = useRef<ResizeObserver | null>(null);

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

  // Optimized repeat calculation with batching
  const calculateRepeat = useCallback(() => {
    if (!containerRef.current || !cardRef.current) return;

    // Batch DOM reads
    const containerRect = containerRef.current.getBoundingClientRect();
    const cardRect = cardRef.current.getBoundingClientRect();
    
    const containerWidth = containerRect.width;
    const cardWidth = cardRect.width;
    const neededRepeats = Math.ceil((containerWidth * 2) / cardWidth);
    setRepeatCount(Math.max(neededRepeats, 2));
  }, []);

  // Handle resize with ResizeObserver for better performance
  useEffect(() => {
    if (!containerRef.current) return;

    // Use ResizeObserver instead of window resize for better performance
    resizeObserver.current = new ResizeObserver(() => {
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(calculateRepeat);
    });

    resizeObserver.current.observe(containerRef.current);
    calculateRepeat(); // Initial calculation

    return () => {
      if (resizeObserver.current) {
        resizeObserver.current.disconnect();
      }
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [calculateRepeat]);

  // Handle animations with useGSAP - optimized to prevent reflow
  useGSAP(() => {
    if (!containerRef.current || !cardRef.current) return;

    // Set initial state using transform instead of layout properties
    gsap.set(cardRef.current, {
      opacity: 0,
      y: 30,
      force3D: true, // Force hardware acceleration
      transformOrigin: "center center"
    });

    // Animate in when ready
    if (canAnimate) {
      gsap.to(cardRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        force3D: true
      });
    }
  }, { scope: containerRef, dependencies: [canAnimate, logos.length] });

  // If exactly 5 logos, repeat them to make the marquee look continuous
  const marqueeLogos = logos.length === 5 ? [...logos, ...logos, ...logos] : logos;
  // Repeat the set enough times to fill the track
  const displayLogos = Array(repeatCount).fill(marqueeLogos).flat();

  return (
    <div 
      ref={containerRef} 
      className="relative w-full overflow-x-hidden py-8"
      role="list"
      aria-label="Logo marquee"
    >
      <div
        ref={cardRef}
        className={`flex gap-8 w-max items-center ${canAnimate ? 'marquee-track' : ''}`}
        style={{
          willChange: canAnimate ? 'transform' : 'auto',
          transform: 'translateZ(0)', // Force hardware acceleration
          backfaceVisibility: 'hidden' // Prevent flickering
        }}
      >
        {displayLogos.map((logo, index) => (
          <div
            key={index}
            className="bg-white/10 shadow-[0px_0px_47.8px_rgba(0,0,0,0.10)] backdrop-blur-md flex items-center justify-center"
            style={{ 
              width: '20rem', 
              height: '8.75rem', 
              minWidth: '20rem', 
              maxWidth: '20rem', 
              borderRadius: 'var(--radius-md)',
              transform: 'translateZ(0)', // Force hardware acceleration
              backfaceVisibility: 'hidden'
            }}
            role="listitem"
          >
            <img
              src={logo.logo}
              alt={logo.name}
              className="object-contain max-h-[7.5rem] max-w-[13.75rem]"
              style={{ 
                margin: 'auto',
                transform: 'translateZ(0)', // Force hardware acceleration
                backfaceVisibility: 'hidden'
              }}
              loading="lazy"
            />
          </div>
        ))}
      </div>
      <style>
        {`
          .marquee-track {
            will-change: transform;
            animation: marquee 30s linear infinite;
            transform: translateZ(0);
            backface-visibility: hidden;
          }
          @keyframes marquee {
            0% { transform: translateX(0) translateZ(0); }
            100% { transform: translateX(-50%) translateZ(0); }
          }
        `}
      </style>
    </div>
  );
};

const LogosSection: React.FC<LogosSectionProps> = ({ showAllies, showBuilders, showPartners, allies: alliesProp, builders: buildersProp, partners: partnersProp }) => {
  const { t } = useTranslation();
  const isLoading = useContext(LoadingContext);
  const [canAnimate, setCanAnimate] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  
  // Refs for titles and marquees
  const alliesTitleRef = useRef<HTMLHeadingElement>(null);
  const alliesMarqueeRef = useRef<HTMLDivElement>(null);
  const buildersTitleRef = useRef<HTMLHeadingElement>(null);
  const buildersMarqueeRef = useRef<HTMLDivElement>(null);
  const partnersTitleRef = useRef<HTMLHeadingElement>(null);
  const partnersMarqueeRef = useRef<HTMLDivElement>(null);

  const alliesToShow = alliesProp || allies;
  const buildersToShow = buildersProp || builders;
  const partnersToShow = partnersProp || partners;

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

  // Set initial states with useGSAP - optimized to prevent reflow
  useGSAP(() => {
    if (!sectionRef.current) return;

    // Batch all initial state settings
    const elementsToSet = [
      ...([alliesTitleRef, buildersTitleRef, partnersTitleRef].map(ref => ref.current).filter(Boolean)),
      ...([alliesMarqueeRef, buildersMarqueeRef, partnersMarqueeRef].map(ref => ref.current).filter(Boolean))
    ];

    gsap.set(elementsToSet, {
      opacity: 0,
      y: 50,
      force3D: true, // Force hardware acceleration
      transformOrigin: "center center"
    });
  }, { scope: sectionRef });

  // Handle animations with useGSAP - optimized to prevent reflow
  useGSAP(() => {
    if (!canAnimate || !sectionRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
        end: 'center center',
        toggleActions: 'play none none reverse',
        id: `logos-section-${Date.now()}`, // Unique ID to avoid conflicts
        // Performance optimizations
        fastScrollEnd: true,
        preventOverlaps: true
      }
    });

    // Animate each section if it exists
    if (showAllies && alliesTitleRef.current && alliesMarqueeRef.current) {
      tl.to(alliesTitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        force3D: true
      })
      .to(alliesMarqueeRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        force3D: true
      }, '-=0.4');
    }

    if (showBuilders && buildersTitleRef.current && buildersMarqueeRef.current) {
      tl.to(buildersTitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        force3D: true
      }, '-=0.2')
      .to(buildersMarqueeRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        force3D: true
      }, '-=0.4');
    }

    if (showPartners && partnersTitleRef.current && partnersMarqueeRef.current) {
      tl.to(partnersTitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        force3D: true
      }, '-=0.2')
      .to(partnersMarqueeRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        force3D: true
      }, '-=0.4');
    }
  }, { scope: sectionRef, dependencies: [canAnimate, showAllies, showBuilders, showPartners] });

  return (
    <section 
      ref={sectionRef}
      className="background-gradient-dark py-8 md:py-16 lg:py-[6.5rem] px-4 md:px-8 lg:px-[6.25rem] overflow-x-hidden flex flex-col gap-8 md:gap-16 lg:gap-[3.75rem] scroll-container"
      aria-label="Partners and collaborators"
      style={{
        willChange: 'auto',
        transform: 'translateZ(0)', // Force hardware acceleration
        backfaceVisibility: 'hidden'
      }}
    >
      <div className="w-full">
        <div className="flex flex-col gap-8 w-full">
          {showAllies && (
            <section aria-labelledby="allies-title">
              <div className="flex flex-row items-start justify-between w-full mb-6 md:mb-10">
                <h2 
                  ref={alliesTitleRef}
                  id="allies-title"
                  className="heading-2 text-light max-w-[40.9375rem]"
                  style={{
                    willChange: 'auto',
                    transform: 'translateZ(0)',
                    backfaceVisibility: 'hidden'
                  }}
                >
                  <span dangerouslySetInnerHTML={{ __html: t('mainPage.testimonials.partnersTitle') }} />
                </h2>
              </div>
              <div 
                ref={alliesMarqueeRef}
                style={{
                  willChange: 'auto',
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden'
                }}
              >
                <Marquee logos={alliesToShow} />
              </div>
            </section>
          )}
          {showBuilders && (
            <section aria-labelledby="builders-title">
              <div className="flex flex-row items-start justify-between w-full mb-6 md:mb-10">
                <h2 
                  ref={buildersTitleRef}
                  id="builders-title"
                  className="heading-2 text-light max-w-[40.9375rem]"
                  style={{
                    willChange: 'auto',
                    transform: 'translateZ(0)',
                    backfaceVisibility: 'hidden'
                  }}
                >
                  <span dangerouslySetInnerHTML={{ __html: t('mainPage.logosSection.buildersTitle') }} />
                </h2>
              </div>
              <div 
                ref={buildersMarqueeRef}
                style={{
                  willChange: 'auto',
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden'
                }}
              >
                <Marquee logos={buildersToShow} />
              </div>
            </section>
          )}
          {showPartners && (
            <section aria-labelledby="partners-title">
              <div className="flex flex-row items-start justify-between w-full mb-6 md:mb-10">
                <h2 
                  ref={partnersTitleRef}
                  id="partners-title"
                  className="heading-2 text-light max-w-[40.9375rem]"
                  style={{
                    willChange: 'auto',
                    transform: 'translateZ(0)',
                    backfaceVisibility: 'hidden'
                  }}
                >
                  <span dangerouslySetInnerHTML={{ __html: t('mainPage.logosSection.partnersTitle') }} />
                </h2>
              </div>
              <div 
                ref={partnersMarqueeRef}
                style={{
                  willChange: 'auto',
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden'
                }}
              >
                <Marquee logos={partnersToShow} />
              </div>
            </section>
          )}
        </div>
      </div>
    </section>
  );
};

export default LogosSection; 