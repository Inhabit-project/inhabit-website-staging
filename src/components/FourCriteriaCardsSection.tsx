import React, { useRef, useEffect, useContext, useState } from 'react';
import ImpactCard from './ImpactCard';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LoadingContext } from '../App';
import { useGSAP } from '@gsap/react';

// Register the hook to avoid React version discrepancies
gsap.registerPlugin(useGSAP);

const ICONS = [
  '/assets/icons/Icon-1.svg',
  '/assets/icons/Icon-2.svg',
  '/assets/icons/Icon-3.svg',
  '/assets/icons/Icon-4.svg',
];

const FourCriteriaCardsSection: React.FC = () => {
  const { t } = useTranslation();
  const isLoading = useContext(LoadingContext);
  const [canAnimate, setCanAnimate] = useState(false);

  // Refs for animations
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Get cards array from translations
  const criteriaCards = t('mainPage.FourCriteriaHubGlobal.cards', { returnObjects: true }) as Array<{
    number: string;
    title: string;
    subtitle: string;
    description: string;
  }>;

  // Set initial states with useGSAP
  useGSAP(() => {
    gsap.set([titleRef.current, descriptionRef.current], {
      opacity: 0,
      y: 50
    });

    gsap.set(cardsRef.current, {
      opacity: 0,
      y: 50
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
    if (!canAnimate) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top center",
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
    // Cards stagger animation
    .to(cardsRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out"
    }, "-=0.4");
  }, { scope: sectionRef, dependencies: [canAnimate] });

  return (
    <section
      ref={sectionRef}
      className="w-full flex flex-col items-center py-24 px-[clamp(1.5rem,5vw,6.25rem)]"
      style={{ background: 'var(--light-gradient, linear-gradient(90deg, #DEEDCB 2.26%, #F6FFEA 50.64%, #DEEDCB 99.01%))' }}
    >
      <div className="w-full max-w-[120rem] mx-auto mb-12 flex flex-col md:flex-row md:items-start md:justify-between gap-8">
        <div>
          <h2 
            ref={titleRef}
            className="heading-2 text-secondary mb-4"
          >
            <span dangerouslySetInnerHTML={{ __html: t('mainPage.criteriaCardsSection.title') }} />
          </h2>
        </div>
        <div 
          ref={descriptionRef}
          className="max-w-xl text-secondary body-M" 
          style={{fontWeight: 400}}
        >
          {t('mainPage.criteriaCardsSection.description')}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-[107.5rem] mx-auto">
        {criteriaCards.map((card, idx) => (
          <div 
            key={idx}
            ref={el => cardsRef.current[idx] = el}
          >
            <ImpactCard {...card} icon={ICONS[idx]} label={card.title} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default FourCriteriaCardsSection; 