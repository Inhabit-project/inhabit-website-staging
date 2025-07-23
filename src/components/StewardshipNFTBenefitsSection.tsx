import React, { useRef, useEffect, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LoadingContext } from '../App';

const StewardshipNFTBenefitsSection: React.FC = () => {
  const { t } = useTranslation();
  const isLoading = useContext(LoadingContext);
  const [canAnimate, setCanAnimate] = useState(false);

  // Animation refs
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  const benefits = [
    {
      icon: '/assets/icons/6.svg',
      eyebrow: t('mainPage.stewardshipNFTBenefits.0.eyebrow'),
      title: t('mainPage.stewardshipNFTBenefits.0.title'),
      description: t('mainPage.stewardshipNFTBenefits.0.description'),
    },
    {
      icon: '/assets/icons/2.svg',
      eyebrow: t('mainPage.stewardshipNFTBenefits.1.eyebrow'),
      title: t('mainPage.stewardshipNFTBenefits.1.title'),
      description: t('mainPage.stewardshipNFTBenefits.1.description'),
    },
    {
      icon: '/assets/icons/4.svg',
      eyebrow: t('mainPage.stewardshipNFTBenefits.2.eyebrow'),
      title: t('mainPage.stewardshipNFTBenefits.2.title'),
      description: t('mainPage.stewardshipNFTBenefits.2.description'),
    },
    {
      icon: '/assets/icons/3.svg',
      eyebrow: t('mainPage.stewardshipNFTBenefits.3.eyebrow'),
      title: t('mainPage.stewardshipNFTBenefits.3.title'),
      description: t('mainPage.stewardshipNFTBenefits.3.description'),
    },
    {
      icon: '/assets/icons/5.svg',
      eyebrow: t('mainPage.stewardshipNFTBenefits.4.eyebrow'),
      title: t('mainPage.stewardshipNFTBenefits.4.title'),
      description: t('mainPage.stewardshipNFTBenefits.4.description'),
    },
    {
      icon: '/assets/icons/1.svg',
      eyebrow: t('mainPage.stewardshipNFTBenefits.5.eyebrow'),
      title: t('mainPage.stewardshipNFTBenefits.5.title'),
      description: t('mainPage.stewardshipNFTBenefits.5.description'),
    },
  ];

  // Set initial states
  useEffect(() => {
    if (sectionRef.current) {
      const ctx = gsap.context(() => {
        gsap.set(titleRef.current, { opacity: 0, y: 50 });
        gsap.set(descriptionRef.current, { opacity: 0, y: 50 });
        gsap.set(cardRefs.current, { opacity: 0, y: 50, scale: 0.95 });
      }, sectionRef);

      return () => ctx.revert();
    }
  }, []);

  // Handle loading state change
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setCanAnimate(true), 1500);
      return () => clearTimeout(timer);
    } else {
      setCanAnimate(false);
    }
  }, [isLoading]);

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
        paused: true,
        defaults: { ease: 'power3.out' }
      });

      timelineRef.current
        .to(titleRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
        })
        .to(
          descriptionRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          '-=0.6'
        )
        .to(
          cardRefs.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.15,
          },
          '-=0.4'
        );

      // Create new scroll trigger
      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 75%',
        end: 'center center',
        toggleActions: 'play none none reverse',
        animation: timelineRef.current,
        id: `stewardship-benefits-${Date.now()}`, // Unique ID to avoid conflicts
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }
    };
  }, [canAnimate, t]);

  return (
    <div
      ref={sectionRef}
      className="w-full py-24 px-[clamp(1.5rem,5vw,6.25rem)] flex flex-col items-center scroll-container background-gradient-light"
      style={{ background: 'var(--background-gradient-light)' }}
      aria-labelledby="benefits-title"
    >
      <div className="max-w-[120rem] w-full mx-auto flex flex-col md:flex-row justify-between gap-8 mb-16">
        <div>
          <h2
            id="benefits-title"
            ref={titleRef}
            className="heading-2 text-secondary max-w-[40.9375rem] mb-4"
          >
            <span dangerouslySetInnerHTML={{ __html: t('mainPage.stewardshipNFTBenefits.title') }} />
          </h2>
        </div>
        <p
          ref={descriptionRef}
          className="body-M text-[var(--color-secondary)] max-w-[38rem]"
        >
          {t('mainPage.stewardshipNFTBenefits.description')}
        </p>
      </div>
      <div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-14 w-full max-w-[120rem] mx-auto"
        role="list"
        aria-label="Stewardship NFT benefits"
      >
        {benefits.map((b, i) => (
          <article
            key={i}
            ref={(el: HTMLDivElement | null) => (cardRefs.current[i] = el)}
            className="relative flex flex-col gap-3 sm:gap-6 min-h-[380px] shadow-lg text-white justify-between"
            style={{
              background: 'var(--color-primary-dark, #162F08)',
              borderRadius: 'var(--radius-2xl, 1.5rem)',
              padding: '2.5rem',
            }}
            role="listitem"
            aria-labelledby={`benefit-${i}-title`}
          >
            {/* Icon - responsive positioning and left alignment on mobile */}
            <div 
              className="block sm:absolute sm:top-10 sm:right-10 sm:w-12 sm:h-12 w-10 h-10 mb-2 sm:mb-0 opacity-80 text-left self-end"
              style={{ position: 'static' }}
            >
              <img src={b.icon} alt="" className="w-full h-full object-contain" aria-hidden="true" />
            </div>
            <span className="eyebrow">{b.eyebrow}</span>
            <h3 id={`benefit-${i}-title`} className="heading-4  mb-2">
              <span dangerouslySetInnerHTML={{ __html: b.title }} />
            </h3>
            <p className="font-nunito text-base font-light whitespace-pre-line opacity-90 mt-auto">{b.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
};

export default StewardshipNFTBenefitsSection; 
