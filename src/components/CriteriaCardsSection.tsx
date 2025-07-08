import React, { useRef, useEffect, useContext, useState } from 'react';
import ImpactCard from './ImpactCard';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LoadingContext } from '../App';

const impactCards = [
  {
    number: '01',
    icon: '/assets/icons/Icon-1.svg',
    title: 'Nature',
    subtitle: 'Rights',
    description: 'This framework permanently safeguards the land by recognising it as a legal entity with rights, while providing specific rights and benefits to individuals who support its protection and regeneration.',
  },
  {
    number: '02',
    icon: '/assets/icons/Icon-2.svg',
    title: 'Guardians',
    subtitle: 'Rights',
    description: 'This framework provides permanent usage rights and restoration financing to land guardians, creating the essential conditions for long-term regeneration of these lands and the expansion of the ecological corridor.',
  },
  {
    number: '03',
    icon: '/assets/icons/Icon-3.svg',
    title: 'NFT Stewards',
    subtitle: 'Rights',
    description: 'This framework gives NFT stewards stewardship rights over the land, acting as guarantors of nature\u2019s rights. It enables them to monitor and support restoration while enjoying exclusive benefits and access to biodiversity hotspots and essential knowledge.',
  },
  {
    number: '04',
    icon: '/assets/icons/Icon-4.svg',
    title: 'Enforcement',
    subtitle: 'Rights',
    description: 'Smart contracts ensure that the entire framework and stakeholders\u2019 rights are transparently enforced and verifiable, providing a trusted digital system for tracking compliance and enabling meaningful on-site participation in restoration initiatives across the Corridor.',
  },
];

const CriteriaCardsSection: React.FC = () => {
  const isLoading = useContext(LoadingContext);
  const [canAnimate, setCanAnimate] = useState(false);

  // Refs for animations
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Set initial states
  useEffect(() => {
    gsap.set(titleRef.current, {
      opacity: 0,
      y: 50
    });

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

        // Title animation
        tl.to(titleRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out"
        })
        // Cards stagger animation
        .to(cardsRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
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
      className="w-full py-24 background-gradient-light"
      aria-labelledby="criteria-cards-title"
    >
      <div className="w-full max-w-[120rem] mx-auto px-[clamp(1.5rem,5vw,6.25rem)]">
        <h2 
          ref={titleRef}
          id="criteria-cards-title"
          className="heading-2 text-secondary mb-16"
        >
          Hub Criteria
        </h2>
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          role="list"
          aria-label="Hub criteria cards"
        >
          {impactCards.map((card, index) => (
            <div 
              key={card.number}
              ref={el => cardsRef.current[index] = el}
              role="listitem"
              aria-labelledby={`card-${card.number}-title`}
            >
              <ImpactCard
                number={card.number}
                icon={card.icon}
                title={card.title}
                subtitle={card.subtitle}
                description={card.description}
                id={`card-${card.number}-title`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CriteriaCardsSection; 