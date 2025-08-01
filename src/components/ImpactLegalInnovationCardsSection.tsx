import React, { useRef, useContext, useState, useEffect } from 'react';
import ImpactCard from './ImpactCard';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LoadingContext } from '../App';
import { useGSAP } from '@gsap/react';

// Register the hook to avoid React version discrepancies
gsap.registerPlugin(useGSAP);

const ImpactLegalInnovationCardsSection: React.FC = () => {
  const { t } = useTranslation();
  const isLoading = useContext(LoadingContext);
  const [canAnimate, setCanAnimate] = useState(false);

  // Refs for animations
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Get cards array from translations
  const innovationCards = t('mainPage.impactLegalInnovationPage.innovationCardsSection.cards', { returnObjects: true }) as Array<any>;

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
        {innovationCards.map((card, idx) => (
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