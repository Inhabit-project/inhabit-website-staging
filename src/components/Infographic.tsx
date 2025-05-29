import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BiodiversityCard from './BiodiversityCard';
import BiodiversityCardsSection from './BiodiversityCardsSection';
import ImpactLegalInnovationCardsSection from './ImpactLegalInnovationCardsSection';

gsap.registerPlugin(ScrollTrigger);

const cardVariants = {
  hidden: { y: 100, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.2,
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1]
    }
  })
};

const cards = [
  {
    number: '001',
    title: 'Biodiversity Hotspots',
    description: 'Each HUB must generate and host a vast pool of biodiversity and living knowledge specific to a unique ecosystem, essential for navigating the challenges of our present times. These "living seed hubs" hosts an "inner corridor" within the land, connecting fragmented landscapes and serving as a refuge for endangered species.'
  },
  {
    number: '002',
    title: 'Community Engagement',
    description: 'Local communities are integral to the success of each HUB. Their traditional knowledge and active participation ensure the sustainable management and protection of these vital ecosystems.'
  },
  {
    number: '003',
    title: 'Research & Education',
    description: 'HUBs serve as living laboratories for scientific research and environmental education, fostering innovation and knowledge sharing for ecosystem restoration.'
  },
  {
    number: '004',
    title: 'Sustainable Practices',
    description: 'Implementing sustainable land management practices that balance ecological health with human needs, ensuring long-term viability of the ecosystems.'
  }
];

const Infographic: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const [showBelowContent] = useState(true);

  useEffect(() => {
    const section = sectionRef.current;
    const container = horizontalRef.current;
    if (!section || !container) return;

    // Get the width to scroll
    const pinWrap = container.querySelector('.pin-wrap') as HTMLElement;
    if (!pinWrap) return;
    const slides = Array.from(pinWrap.children) as HTMLElement[];
    const pinWrapWidth = pinWrap.scrollWidth;
    const horizontalScrollLength = pinWrapWidth - window.innerWidth;

    // Calculate snap points for slides 2, 3, 4 (index 1, 2, 3)
    const snapPoints = slides.map((slide, i) => {
      if (i === 0) return null; // No snap for first slide
      return -slide.offsetLeft;
    }).filter(x => x !== null);
    const snapValues = snapPoints.map(x => x! / -horizontalScrollLength);

    // Set up GSAP horizontal scroll with snapping
    const ctx = gsap.context(() => {
      gsap.to(pinWrap, {
        x: -horizontalScrollLength,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${pinWrapWidth}`,
          pin: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          snap: snapValues.length > 0 ? {
            snapTo: (value) => {
              // value is a progress (0-1), map to closest snapValue
              let closest = snapValues[0];
              let minDist = Math.abs(value - snapValues[0]);
              for (let i = 1; i < snapValues.length; i++) {
                const dist = Math.abs(value - snapValues[i]);
                if (dist < minDist) {
                  minDist = dist;
                  closest = snapValues[i];
                }
              }
              return closest;
            },
            duration: 0.5,
            ease: 'power1.inOut',
          } : false,
        },
      });
    }, section);

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full flex flex-col items-center background-gradient-light">
      {/* Horizontal Scroll Section (GSAP ScrollTrigger with Snap) */}
      <div style={{ position: 'relative', width: '100%' }}>
        <div
          ref={horizontalRef}
          className="w-full overflow-x-auto overflow-y-hidden"
          style={{
            WebkitOverflowScrolling: 'touch',
            overflowX: 'auto',
            overflowY: 'hidden',
            width: '100%',
            scrollBehavior: 'smooth',
            // Remove scrollSnapType
          }}
        >
          <div className="pin-wrap flex flex-nowrap min-w-max">
            {/* Slide 1: Land Tenure Framework */}
            <div className="horizontal-slide w-screen flex-shrink-0 flex flex-col items-start justify-center px-[clamp(1.5rem,5vw,6.25rem)]">
              <div className="flex flex-col md:flex-row items-start justify-between responsive-gap w-full mb-[2.5rem]">
                <h2 className="heading-2 text-secondary max-w-[40.9375rem]">
                  Land Tenure<br /><strong>Framework</strong>
                </h2>
                <p className="body-M text-secondary max-w-[35rem]">
                  INHABIT stewardship-based restoration model, is designed to become the most robust and effective approach to ensure the long-term protection and regeneration of degraded lands, while actively engaging everyone in ecosystem stewardship.
                </p>
              </div>
              <div className="self-center relative overflow-hidden">
                <img 
                  src="/assets/infographic-1.webp" 
                  alt="Land Tenure Framework Infographic"
                  className="w-full h-full object-cover"
                  onLoad={() => ScrollTrigger.refresh()}
                />
              </div>
            </div>
            {/* Slide 2: NFT Stewards */}
            <div className="horizontal-slide w-screen flex-shrink-0 flex flex-col lg:flex-row items-end justify-between gap-8 px-[clamp(1.5rem,5vw,6.25rem)] mb-[5rem]">
              <div className="w-full lg:w-2/5 max-w-6xl flex flex-col justify-end">
                <h2 className="heading-2 text-secondary mb-6">NFT Stewards</h2>
                <p className="body-M text-secondary">
                  Individuals from anywhere in the world can become lifelong protectors of nature, empowered to monitor, safeguard, and gain access to these thriving hubs, along with numerous benefits as they travel the Corridor.
                </p>
              </div>
              <div className="w-full lg:w-3/5 flex self-center justify-center">
                <div className="w-[43.75rem] h-[43.75rem]">
                  <img 
                    src="/assets/stewards-illustration.svg" 
                    alt="NFT Stewards Illustration"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
            {/* Slide 3: Nature */}
            <div className="horizontal-slide w-screen flex-shrink-0 flex flex-col lg:flex-row items-start justify-between gap-8 px-[clamp(1.5rem,5vw,6.25rem)] mb-[5rem]">
              <div className="w-full lg:w-2/5 max-w-6xl flex flex-col justify-start">
                <h2 className="heading-2 text-secondary mb-6">Nature</h2>
                <p className="body-M text-secondary">
                  Nature is considered an entity with rights within the land borders, in accordance with the Declaration of Rights of Nature (e.g. the right to autoregulation, restoration, protection, decision-making...)
                </p>
              </div>
              <div className="w-full lg:w-3/5 flex self-center justify-center">
                <div className="w-[43.75rem] h-[43.75rem]">
                  <img 
                    src="/assets/nature-illustration.svg" 
                    alt="Nature Illustration"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
            {/* Slide 4: Guardians */}
            <div className="horizontal-slide w-screen flex-shrink-0 flex flex-col lg:flex-row   gap-8 px-[clamp(1.5rem,5vw,6.25rem)] mb-[5rem]">
              <div className="w-full lg:w-2/5 max-w-6xl flex flex-col self-end">
                <h2 className="heading-2 text-secondary mb-6">Guardians</h2>
                <p className="body-M text-secondary">
                  A family of change-makers, receiving permanent usage rights and restoration financing to ensure the regeneration and conservation of the land, to develop an innovative biocultural HUB, and to expand the corridor safeguard, and gain access to these thriving hubs, along with numerous benefits as they travel the Corridor.
                </p>
              </div>
              <div className="w-full lg:w-3/5 flex self-center justify-center">
                <div className="w-[43.75rem] h-[43.75rem]">
                  <img 
                    src="/assets/guardians-illustration.svg" 
                    alt="NFT Stewards Illustration"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* New Impact Cards Section (appears after horizontal scroll) */}
      {showBelowContent && <ImpactLegalInnovationCardsSection />}
    </section>
  );
};

export default Infographic;