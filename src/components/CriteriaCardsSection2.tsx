import React, { useRef, useEffect, useContext, useState } from 'react';
import ImpactCard from './ImpactCard';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LoadingContext } from '../App';

const CriteriaCardsSection2: React.FC = () => {
  const { t } = useTranslation();
  const isLoading = useContext(LoadingContext);
  const [canAnimate, setCanAnimate] = useState(false);

  // Refs for animations
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const criteriaCards = [
    {
      number: '01',
      icon: '/assets/icons/Icon-1.svg',
      title: t('mainPage.criteriaCardsSection2.cards.0.title'),
      subtitle: t('mainPage.criteriaCardsSection2.cards.0.subtitle'),
      description: t('mainPage.criteriaCardsSection2.cards.0.description'),
    },
    {
      number: '02',
      icon: '/assets/icons/Icon-2.svg',
      title: t('mainPage.criteriaCardsSection2.cards.1.title'),
      subtitle: t('mainPage.criteriaCardsSection2.cards.1.subtitle'),
      description: t('mainPage.criteriaCardsSection2.cards.1.description'),
    },
    {
      number: '03',
      icon: '/assets/icons/Icon-3.svg',
      title: t('mainPage.criteriaCardsSection2.cards.2.title'),
      subtitle: t('mainPage.criteriaCardsSection2.cards.2.subtitle'),
      description: t('mainPage.criteriaCardsSection2.cards.2.description'),
    },
    {
      number: '04',
      icon: '/assets/icons/Icon-4.svg',
      title: t('mainPage.criteriaCardsSection2.cards.3.title'),
      subtitle: t('mainPage.criteriaCardsSection2.cards.3.subtitle'),
      description: t('mainPage.criteriaCardsSection2.cards.3.description'),
    },
  ];

  // Set initial states
  useEffect(() => {
    gsap.set(cardsRef.current, {
      opacity: 0,
      y: 50
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

        // Cards stagger animation
        tl.to(cardsRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out"
        });
      });
    }

    return () => {
      ctx.revert();
    };
  }, [canAnimate]);

  return (
    <section
      ref={sectionRef}
      className="w-full flex flex-col items-center py-24 px-[clamp(1.5rem,5vw,6.25rem)]"
      style={{ background: 'var(--light-gradient, linear-gradient(90deg, #DEEDCB 2.26%, #F6FFEA 50.64%, #DEEDCB 99.01%))' }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-[107.5rem] mx-auto">
        {criteriaCards.map((card, idx) => (
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

export default CriteriaCardsSection2; 