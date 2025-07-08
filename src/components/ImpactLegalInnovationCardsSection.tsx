import React, { useRef, useEffect, useContext, useState } from 'react';
import ImpactCard from './ImpactCard';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LoadingContext } from '../App';

const ImpactLegalInnovationCardsSection: React.FC = () => {
  const { t } = useTranslation();
  const isLoading = useContext(LoadingContext);
  const [canAnimate, setCanAnimate] = useState(false);

  // Refs for animations
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const impactCards = [
    {
      label: t('mainPage.impactLegalInnovationCardsSection.cards.0.label'),
      icon: '/assets/icons/Icon-1.svg',
      title: t('mainPage.impactLegalInnovationCardsSection.cards.0.title'),
      subtitle: t('mainPage.impactLegalInnovationCardsSection.cards.0.subtitle'),
      description: t('mainPage.impactLegalInnovationCardsSection.cards.0.description'),
    },
    {
      label: t('mainPage.impactLegalInnovationCardsSection.cards.1.label'),
      icon: '/assets/icons/Icon-2.svg',
      title: t('mainPage.impactLegalInnovationCardsSection.cards.1.title'),
      subtitle: t('mainPage.impactLegalInnovationCardsSection.cards.1.subtitle'),
      description: t('mainPage.impactLegalInnovationCardsSection.cards.1.description'),
    },
    {
      label: t('mainPage.impactLegalInnovationCardsSection.cards.2.label'),
      icon: '/assets/icons/Icon-3.svg',
      title: t('mainPage.impactLegalInnovationCardsSection.cards.2.title'),
      subtitle: t('mainPage.impactLegalInnovationCardsSection.cards.2.subtitle'),
      description: t('mainPage.impactLegalInnovationCardsSection.cards.2.description'),
    },
    {
      label: t('mainPage.impactLegalInnovationCardsSection.cards.3.label'),
      icon: '/assets/icons/Icon-4.svg',
      title: t('mainPage.impactLegalInnovationCardsSection.cards.3.title'),
      subtitle: t('mainPage.impactLegalInnovationCardsSection.cards.3.subtitle'),
      description: t('mainPage.impactLegalInnovationCardsSection.cards.3.description'),
    },
  ];

  // Set initial states
  useEffect(() => {
    gsap.set([titleRef.current, descriptionRef.current], {
      opacity: 0,
      y: 50
    });

    gsap.set(cardsRef.current, {
      opacity: 0,
      y: 50,
      scale: 0.95
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
            start: "top 75%",
            end: "center center",
            toggleActions: "play none none reverse"
          }
        });

        // Title and description animations
        tl.to(titleRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out"
        })
        .to(descriptionRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out"
        }, "-=0.6")
        // Cards stagger animation with scale
        .to(cardsRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: {
            each: 0.15,
            from: "start"
          },
          ease: "power3.out"
        }, "-=0.4");
      });
    }

    return () => {
      ctx.revert();
    };
  }, [canAnimate]);

  return (
    <section 
      ref={sectionRef}
      className="w-full flex flex-col items-center background-gradient-light py-24 px-[clamp(1.5rem,5vw,6.25rem)] scroll-container"
    >
      <div className="flex flex-col md:flex-row items-start justify-between responsive-gap w-full max-w-[120rem] mx-auto mb-[2.5rem]">
        <h2 
          ref={titleRef}
          className="heading-2 text-secondary max-w-[40.9375rem]"
        >
          <span dangerouslySetInnerHTML={{ __html: t('mainPage.impactLegalInnovationCardsSection.title') }} />
        </h2>
        <p 
          ref={descriptionRef}
          className="body-M text-secondary max-w-[35rem]"
        >
          {t('mainPage.impactLegalInnovationCardsSection.description')}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-[107.5rem] mx-auto">
        {impactCards.map((card, idx) => (
          <div
            key={idx}
            ref={el => cardsRef.current[idx] = el}
          >
            <ImpactCard {...card} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ImpactLegalInnovationCardsSection; 