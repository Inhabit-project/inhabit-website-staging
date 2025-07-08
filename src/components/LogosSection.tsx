import React, { useRef, useEffect, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LoadingContext } from '../App';

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
  const [repeatCount, setRepeatCount] = useState(2);
  const [canAnimate, setCanAnimate] = useState(false);
  const isLoading = useContext(LoadingContext);

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

  useEffect(() => {
    if (containerRef.current && cardRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const cardWidth = cardRef.current.offsetWidth + 32; // 32px gap (2rem)
      const minCards = Math.ceil((containerWidth * 2) / cardWidth);
      setRepeatCount(Math.max(2, Math.ceil(minCards / logos.length)));

      // Initial GSAP state
      gsap.set(cardRef.current, {
        opacity: 0,
        y: 30
      });

      // Animate in when ready
      if (canAnimate) {
        gsap.to(cardRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out"
        });
      }
    }
  }, [logos.length, canAnimate]);

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
          willChange: 'transform',
          animation: canAnimate ? 'marquee 30s linear infinite' : 'none'
        }}
      >
        {displayLogos.map((logo, index) => (
          <div
            key={index}
            className="bg-white/10 shadow-[0px_0px_47.8px_rgba(0,0,0,0.10)] backdrop-blur-md flex items-center justify-center"
            style={{ width: '20rem', height: '8.75rem', minWidth: '20rem', maxWidth: '20rem', borderRadius: 'var(--radius-md)' }}
            role="listitem"
          >
            <img
              src={logo.logo}
              alt={logo.name}
              className="object-contain max-h-[7.5rem] max-w-[13.75rem]"
              style={{ margin: 'auto' }}
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
          }
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
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
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  
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

  // Set initial states
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Set initial states for titles
      [alliesTitleRef, buildersTitleRef, partnersTitleRef].forEach(ref => {
        if (ref.current) {
          gsap.set(ref.current, {
            opacity: 0,
            y: 50
          });
        }
      });

      // Set initial states for marquees
      [alliesMarqueeRef, buildersMarqueeRef, partnersMarqueeRef].forEach(ref => {
        if (ref.current) {
          gsap.set(ref.current, {
            opacity: 0,
            y: 30
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Handle animations
  useEffect(() => {
    if (!canAnimate || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Kill existing timeline and scroll trigger if they exist
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }

      // Create new timeline
      timelineRef.current = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          end: 'center center',
          toggleActions: 'play none none reverse',
          id: `logos-section-${Date.now()}` // Unique ID to avoid conflicts
        }
      });

      // Animate each section if it exists
      if (showAllies && alliesTitleRef.current && alliesMarqueeRef.current) {
        timelineRef.current
          .to(alliesTitleRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
          })
          .to(alliesMarqueeRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
          }, '-=0.4');
      }

      if (showBuilders && buildersTitleRef.current && buildersMarqueeRef.current) {
        timelineRef.current
          .to(buildersTitleRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
          }, '-=0.2')
          .to(buildersMarqueeRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
          }, '-=0.4');
      }

      if (showPartners && partnersTitleRef.current && partnersMarqueeRef.current) {
        timelineRef.current
          .to(partnersTitleRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
          }, '-=0.2')
          .to(partnersMarqueeRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
          }, '-=0.4');
      }
    }, sectionRef);

    return () => {
      ctx.revert(); // This will clean up all animations created in this context
      if (timelineRef.current) timelineRef.current.kill();
      if (scrollTriggerRef.current) scrollTriggerRef.current.kill();
    };
  }, [canAnimate, showAllies, showBuilders, showPartners]);

  return (
    <section 
      ref={sectionRef}
      className="background-gradient-dark py-8 md:py-16 lg:py-[6.5rem] px-4 md:px-8 lg:px-[6.25rem] overflow-x-hidden flex flex-col gap-8 md:gap-16 lg:gap-[3.75rem] scroll-container"
      aria-label="Partners and collaborators"
    >
      <div className="w-full">
        <div className="flex flex-col gap-8 w-full">
          {showAllies && (
            <section aria-labelledby="allies-title">
              <div className="flex flex-row items-start justify-between w-full mb-6 md:mb-10">
                <h2 
                  ref={alliesTitleRef}
                  id="allies-title"
                  className="font-light text-4xl md:text-6xl lg:text-[5rem] leading-[1.1em] text-[#F6FFEA]"
                >
                  <span dangerouslySetInnerHTML={{ __html: t('mainPage.testimonials.partnersTitle') }} />
                </h2>
              </div>
              <div ref={alliesMarqueeRef}>
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
                  className="font-light text-4xl md:text-6xl lg:text-[5rem] leading-[1.1em] text-[#F6FFEA]"
                >
                  <span dangerouslySetInnerHTML={{ __html: t('mainPage.logosSection.buildersTitle') }} />
                </h2>
              </div>
              <div ref={buildersMarqueeRef}>
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
                  className="font-light text-4xl md:text-6xl lg:text-[5rem] leading-[1.1em] text-[#F6FFEA]"
                >
                  <span dangerouslySetInnerHTML={{ __html: t('mainPage.logosSection.partnersTitle') }} />
                </h2>
              </div>
              <div ref={partnersMarqueeRef}>
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