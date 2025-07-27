import React, { useRef, useEffect, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap, ScrollTrigger } from '../utils/gsap';
import { LoadingContext } from '../App';
import ImpactLegalInnovationCardsSection from './ImpactLegalInnovationCardsSection';

const Infographic: React.FC = () => {
  const { t } = useTranslation();
  const isLoading = useContext(LoadingContext);
  const [canAnimate, setCanAnimate] = useState(false);
  const [showCards, setShowCards] = useState(false);

  // Slide refs
  const slide1TitleRef = useRef<HTMLHeadingElement>(null);
  const slide1DescRef = useRef<HTMLParagraphElement>(null);
  const slide1ImgRef = useRef<HTMLImageElement>(null);
  const slide2TitleRef = useRef<HTMLHeadingElement>(null);
  const slide2DescRef = useRef<HTMLParagraphElement>(null);
  const slide2ImgRef = useRef<HTMLImageElement>(null);
  const slide3TitleRef = useRef<HTMLHeadingElement>(null);
  const slide3DescRef = useRef<HTMLParagraphElement>(null);
  const slide3ImgRef = useRef<HTMLImageElement>(null);
  const slide4TitleRef = useRef<HTMLHeadingElement>(null);
  const slide4DescRef = useRef<HTMLParagraphElement>(null);
  const slide4ImgRef = useRef<HTMLImageElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const cardsSectionRef = useRef<HTMLDivElement>(null);
  
  // Store triggers for cleanup
  const infographicTriggers = useRef<ScrollTrigger[]>([]);

  // Set initial states
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([
        slide1TitleRef.current, slide1DescRef.current, slide1ImgRef.current,
        slide2TitleRef.current, slide2DescRef.current, slide2ImgRef.current,
        slide3TitleRef.current, slide3DescRef.current, slide3ImgRef.current,
        slide4TitleRef.current, slide4DescRef.current, slide4ImgRef.current
      ], {
        opacity: 0,
        y: 50
      });
      gsap.set([
        slide1ImgRef.current, slide2ImgRef.current, slide3ImgRef.current, slide4ImgRef.current
      ], {
        scale: 0.95
      });
    }, rootRef);
    return () => ctx.revert();
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

  // Handle animations with sequential timing for better performance
  useEffect(() => {
    let ctx: gsap.Context | undefined;
    
    // Clean up any previous triggers before creating new ones
    infographicTriggers.current.forEach(trigger => {
      if (trigger && typeof trigger.kill === 'function') trigger.kill();
    });
    infographicTriggers.current = [];
    
    if (canAnimate) {
      ctx = gsap.context(() => {
        // Create sequential timeline for better performance
        const mainTimeline = gsap.timeline();
        
        // Slide 1 - starts immediately when in view
        infographicTriggers.current.push(
          gsap.timeline({
            scrollTrigger: {
              trigger: slide1TitleRef.current,
              start: 'top 80%',
              end: 'center center',
              toggleActions: 'play none none reverse',
            }
          })
            .to(slide1TitleRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
            .to(slide1DescRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
            .to(slide1ImgRef.current, { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out' }, '-=0.4')
            .scrollTrigger as ScrollTrigger
        );

        // Slide 2 - starts after slide 1 completes
        infographicTriggers.current.push(
          gsap.timeline({
            scrollTrigger: {
              trigger: slide2TitleRef.current,
              start: 'top 80%',
              end: 'center center',
              toggleActions: 'play none none reverse',
            }
          })
            .to(slide2TitleRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
            .to(slide2DescRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
            .to(slide2ImgRef.current, { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out' }, '-=0.4')
            .scrollTrigger as ScrollTrigger
        );

        // Slide 3 - starts after slide 2 completes
        infographicTriggers.current.push(
          gsap.timeline({
            scrollTrigger: {
              trigger: slide3TitleRef.current,
              start: 'top 80%',
              end: 'center center',
              toggleActions: 'play none none reverse',
            }
          })
            .to(slide3TitleRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
            .to(slide3DescRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
            .to(slide3ImgRef.current, { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out' }, '-=0.4')
            .scrollTrigger as ScrollTrigger
        );

        // Slide 4 - starts after slide 3 completes
        infographicTriggers.current.push(
          gsap.timeline({
            scrollTrigger: {
              trigger: slide4TitleRef.current,
              start: 'top 80%',
              end: 'center center',
              toggleActions: 'play none none reverse',
            }
          })
            .to(slide4TitleRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
            .to(slide4DescRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
            .to(slide4ImgRef.current, { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out' }, '-=0.4')
            .scrollTrigger as ScrollTrigger
        );

        // Cards section trigger - only loads after slide 4 is complete
        infographicTriggers.current.push(
          gsap.timeline({
            scrollTrigger: {
              trigger: slide4ImgRef.current,
              start: 'bottom 90%',
              end: 'bottom 50%',
              toggleActions: 'play none none reverse',
              onEnter: () => setShowCards(true),
            }
          }).scrollTrigger as ScrollTrigger
        );

        // Refresh ScrollTrigger after all timelines are set up
        ScrollTrigger.refresh();
      }, rootRef);
    }
    
    return () => {
      if (ctx) ctx.revert();
      // Robustly kill all ScrollTriggers created by this component
      infographicTriggers.current.forEach(trigger => {
        if (trigger && typeof trigger.kill === 'function') trigger.kill();
      });
      infographicTriggers.current = [];
      // Also kill any orphaned triggers for safety
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger && trigger.vars && trigger.vars.trigger && rootRef.current && rootRef.current.contains(trigger.vars.trigger as Node)) {
          trigger.kill();
        }
      });
    };
  }, [canAnimate, t]);

  return (
    <section ref={rootRef} className="relative w-full flex flex-col items-center background-gradient-light">
      {/* Slide 1: Land Tenure Framework */}
      <div className="background-gradient-light w-full flex flex-col items-start justify-center px-[clamp(1.5rem,5vw,6.25rem)] py-24">
        <div className="flex flex-col md:flex-row items-start justify-between responsive-gap w-full mb-[2.5rem]">
          <h2 ref={slide1TitleRef} className="heading-2 text-secondary max-w-[40.9375rem]">
            <span dangerouslySetInnerHTML={{ __html: t('mainPage.infographic.landTenureTitle') }} />
          </h2>
          <p ref={slide1DescRef} className="body-M text-secondary max-w-[36rem]">
            {t('mainPage.infographic.landTenureDescription')}
          </p>
        </div>
        <div className="self-center relative overflow-hidden">
          <img 
            ref={slide1ImgRef}
            src="/assets/infographic-1.webp" 
            alt="Land Tenure Framework Infographic"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </div>

      {/* Slide 2: NFT Stewards */}
      <section className="py-24 background-gradient-light w-full flex flex-col lg:flex-row items-center justify-between gap-8 px-[clamp(1.5rem,5vw,6.25rem)]">
        <div className="w-full lg:w-2/5 max-w-6xl flex flex-col">
          <h2 ref={slide2TitleRef} className="heading-2 text-secondary mb-6 font-bold" dangerouslySetInnerHTML={{ __html: t('mainPage.infographic.nftStewardsTitle') }} />
          <p ref={slide2DescRef} className="body-M text-secondary">
            {t('mainPage.infographic.nftStewardsDescription')}
          </p>
        </div>
        <div className="w-full lg:w-3/5 flex self-center justify-end">
          <div className="w-[43.75rem]">
            <img 
              ref={slide2ImgRef}
              src="/assets/stewards-illustration.webp" 
              alt="NFT Stewards Illustration"
              className="w-full h-full object-contain"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Slide 3: Nature */}
      <section className="py-24 background-gradient-light w-full flex flex-col lg:flex-row items-center justify-between gap-8 px-[clamp(1.5rem,5vw,6.25rem)]">
        <div className="w-full lg:w-2/5 max-w-6xl flex flex-col justify-start">
          <h2 ref={slide3TitleRef} className="heading-2 text-secondary mb-6 font-bold">{t('mainPage.infographic.natureTitle')}</h2>
          <p ref={slide3DescRef} className="body-M text-secondary">
            {t('mainPage.infographic.natureDescription')}
          </p>
        </div>
        <div className="w-full lg:w-3/5 flex self-center justify-end">
          <div className="w-[43.75rem]">
            <img 
              ref={slide3ImgRef}
              src="/assets/nature-illustration.webp" 
              alt="Nature Illustration"
              className="w-full h-full object-contain"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Slide 4: Guardians */}
      <section className="py-24 background-gradient-light w-full flex flex-col lg:flex-row items-center justify-between gap-8 px-[clamp(1.5rem,5vw,6.25rem)]">
        <div className="w-full lg:w-2/5 max-w-6xl flex flex-col">
          <h2 ref={slide4TitleRef} className="heading-2 text-secondary mb-6 font-bold">{t('mainPage.infographic.guardiansTitle')}</h2>
          <p ref={slide4DescRef} className="body-M text-secondary">
            {t('mainPage.infographic.guardiansDescription')}
          </p>
        </div>
        <div className="w-full lg:w-3/5 flex self-center justify-end">
          <div className="w-[43.75rem]">
            <img 
              ref={slide4ImgRef}
              src="/assets/guardians-illustration.webp" 
              alt="Guardians Illustration"
              className="w-full h-full object-contain"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Cards Section - Only renders when showCards is true for better performance */}
      {showCards && (
        <div ref={cardsSectionRef}>
          <ImpactLegalInnovationCardsSection />
        </div>
      )}
    </section>
  );
};

export default Infographic; 