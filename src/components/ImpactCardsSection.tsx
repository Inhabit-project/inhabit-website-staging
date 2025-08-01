import React, { useRef, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap, ScrollTrigger } from '../utils/gsap';
import { LoadingContext } from '../App';
import ImpactCard from './ImpactCard';
import { useGSAP } from '@gsap/react';

// Register the hook to avoid React version discrepancies
gsap.registerPlugin(useGSAP);

const ImpactCardsSection: React.FC = () => {
  const { t } = useTranslation();
  const isLoading = useContext(LoadingContext);
  const [canAnimate, setCanAnimate] = useState(false);

  // Cards section refs
  const cardsTitleRef = useRef<HTMLHeadingElement>(null);
  const cardsDescRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

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

  // Handle loading state change
  React.useEffect(() => {
    if (!isLoading) {
      setCanAnimate(true);
    } else {
      setCanAnimate(false);
    }
  }, [isLoading]);

  // Set initial states and handle animations with useGSAP
  useGSAP(() => {
    // Set cards to initial state
    gsap.set(cardsRef.current, {
      opacity: 0,
      y: 30,
      scale: 0.95
    });

    gsap.set([cardsTitleRef.current, cardsDescRef.current], {
      opacity: 0,
      y: 30
    });

    // Only create animations if we can animate
    if (!canAnimate) return;
    
    try {
      // Create a timeline for cards section
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          end: 'bottom 25%',
          toggleActions: 'play none none reverse',
          id: `impact-cards-${Date.now()}`,
        }
      });

      // Cards section animations
      timeline
        .to(cardsTitleRef.current, { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          ease: 'power2.out' 
        })
        .to(cardsDescRef.current, { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          ease: 'power2.out' 
        }, '-=0.6')
        .to(cardsRef.current, { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: 0.8, 
          stagger: {
            each: 0.15,
            from: "start"
          },
          ease: 'power2.out' 
        }, '-=0.4');

      // Refresh ScrollTrigger to ensure it works properly
      setTimeout(() => {
        try {
          if (ScrollTrigger.getAll().length > 0) {
            ScrollTrigger.refresh();
          }
        } catch (error) {
          console.warn("ScrollTrigger refresh failed in ImpactCardsSection:", error);
        }
      }, 100);
    } catch (error) {
      // Animation failed silently
    }
  }, { scope: sectionRef, dependencies: [canAnimate, t] });

  return (
    <section 
      ref={sectionRef}
      className="w-full flex flex-col items-center background-gradient-light py-24 px-[clamp(1.5rem,5vw,6.25rem)]"
    >
      <div className="flex flex-col md:flex-row items-start justify-between responsive-gap w-full max-w-[120rem] mx-auto mb-[2.5rem]">
        <h2 
          ref={cardsTitleRef}
          className="heading-2 text-secondary max-w-[40.9375rem]"
        >
          <span dangerouslySetInnerHTML={{ __html: t('mainPage.impactLegalInnovationCardsSection.title') }} />
        </h2>
        <p 
          ref={cardsDescRef}
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

export default ImpactCardsSection; 