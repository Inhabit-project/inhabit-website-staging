import React, { useRef, useLayoutEffect, useContext, useState, useEffect } from 'react';
import ImpactCard from './ImpactCard';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LoadingContext } from '../App';

const FourCriteriaHubGlobal: React.FC = () => {
  const { t } = useTranslation();
  const isLoading = useContext(LoadingContext);
  const [canAnimate, setCanAnimate] = useState(false);

  // Refs for animations
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Get cards array and section title from translations
  let fundsCards = t('mainPage.stewardshipNFTPage.fundsCardsSection.cards', { returnObjects: true }) as Array<any>;
  const sectionTitle = t('mainPage.stewardshipNFTPage.fundsCardsSection.title');
  if (!Array.isArray(fundsCards)) {
    console.warn('Translation for fundsCardsSection.cards is missing or not an array');
    fundsCards = [];
  }

  // Register ScrollTrigger (safe to call multiple times)
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  // Set initial states
  useLayoutEffect(() => {
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
  useLayoutEffect(() => {
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
      }, sectionRef);
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
      <div className="w-full max-w-[120rem] mx-auto mb-12 flex flex-col items-start">
        <h2 className="heading-2 text-secondary mb-2">
          <span dangerouslySetInnerHTML={{ __html: sectionTitle }} />
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-[107.5rem] mx-auto">
        {fundsCards.map((card, idx) => (
          <div
            key={idx}
            ref={el => cardsRef.current[idx] = el}
          >
            <ImpactCard
              number={card.number}
              label={card.label}
              icon={'/assets/icons/Icon-1.svg'}
              title={card.title}
              subtitle={card.subtitle}
              description={card.description}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default FourCriteriaHubGlobal; 