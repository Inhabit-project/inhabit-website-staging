import React, { useRef, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap, ScrollTrigger } from '../utils/gsap';
import { LoadingContext } from '../App';
import { useGSAP } from '@gsap/react';

// Register the hook to avoid React version discrepancies
gsap.registerPlugin(useGSAP);

interface SlideData {
  id: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  position?: { x: number; y: number };
}

const Infographic: React.FC = () => {
  const { t } = useTranslation();
  const isLoading = useContext(LoadingContext);
  const [canAnimate, setCanAnimate] = useState(false);
  const [activeSlide, setActiveSlide] = useState<string | null>(null);
  const [isCardOpen, setIsCardOpen] = useState(false);

  // Slide refs
  const slide1TitleRef = useRef<HTMLHeadingElement>(null);
  const slide1DescRef = useRef<HTMLParagraphElement>(null);
  const slide1ImgRef = useRef<HTMLImageElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const cardContentRef = useRef<HTMLDivElement>(null);
  const cardImageRef = useRef<HTMLImageElement>(null);
  const cardTitleRef = useRef<HTMLHeadingElement>(null);
  const cardDescRef = useRef<HTMLParagraphElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const pointsRef = useRef<HTMLDivElement>(null);

  // Handle loading state change
  React.useEffect(() => {
    if (!isLoading) {
      setCanAnimate(true);
    } else {
      setCanAnimate(false);
    }
  }, [isLoading]);

  // Slide data
  const slides: SlideData[] = [
    {
      id: 'land-tenure',
      title: t('mainPage.infographic.landTenureTitle'),
      description: t('mainPage.infographic.landTenureDescription'),
      image: '/assets/infographic.webp',
      alt: 'Land Tenure Framework Infographic',
      position: { x: 20, y: 30 }
    },
    {
      id: 'nft-stewards',
      title: t('mainPage.infographic.nftStewardsTitle'),
      description: t('mainPage.infographic.nftStewardsDescription'),
      image: '/assets/stewards-illustration.webp',
      alt: 'NFT Stewards Illustration',
      position: { x: 80, y: 63 }
    },
    {
      id: 'nature',
      title: t('mainPage.infographic.natureTitle'),
      description: t('mainPage.infographic.natureDescription'),
      image: '/assets/nature-illustration.webp',
      alt: 'Nature Illustration',
      position: { x: 47, y: 80 }
    },
    {
      id: 'guardians',
      title: t('mainPage.infographic.guardiansTitle'),
      description: t('mainPage.infographic.guardiansDescription'),
      image: '/assets/guardians-illustration.webp',
      alt: 'Guardians Illustration',
      position: { x: 20, y: 55 }
    }
  ];

  // Handle point click
  const handlePointClick = (slideId: string) => {
    setActiveSlide(slideId);
    setIsCardOpen(true);
  };

  // Handle card close
  const handleCloseCard = () => {
    setIsCardOpen(false);
    setTimeout(() => {
      setActiveSlide(null);
    }, 300);
  };

  // Prevent scrolling when card is open
  React.useEffect(() => {
    if (isCardOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCardOpen]);

  // Set initial states and handle animations with useGSAP
  useGSAP(() => {
    // Set all elements to initial state
    const allElements = [
      slide1TitleRef.current, slide1DescRef.current, slide1ImgRef.current
    ];
    
    gsap.set(allElements, {
      opacity: 0,
      y: 30
    });
    
    // Set images to slightly scaled down
    gsap.set(slide1ImgRef.current, {
      scale: 0.95
    });

    // Set points to initial state
    if (pointsRef.current) {
      gsap.set(Array.from(pointsRef.current.children), {
        opacity: 0,
        scale: 0.8
      });
    }

    // Only create animations if we can animate
    if (!canAnimate) return;
    
    try {
      // Create a single timeline but with better configuration
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 75%',
          end: 'bottom 25%',
          toggleActions: 'play none none reverse',
          id: `infographic-${Date.now()}`,
        }
      });

      // Slide 1 animations (original design)
      timeline
        .to(slide1TitleRef.current, { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          ease: 'power2.out' 
        })
        .to(slide1DescRef.current, { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          ease: 'power2.out' 
        }, '-=0.6')
        .to(slide1ImgRef.current, { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: 1, 
          ease: 'power2.out' 
        }, '-=0.4')
        .to(pointsRef.current ? Array.from(pointsRef.current.children) : [], {
          opacity: 1,
          scale: 1,
          duration: 0.1,
          ease: 'power2.out',
          stagger: 0.08
        }, '-=0.1');

      // Refresh ScrollTrigger
      setTimeout(() => {
        try {
          if (ScrollTrigger.getAll().length > 0) {
            ScrollTrigger.refresh();
          }
        } catch (error) {
          console.warn("ScrollTrigger refresh failed in Infographic:", error);
        }
      }, 100);
    } catch (error) {
      // Animation failed silently
    }
  }, { scope: rootRef, dependencies: [canAnimate, t] });

  // Separate useGSAP for card animations to prevent reloading
  useGSAP(() => {
    if (isCardOpen && cardRef.current) {
      // Set card to initial state
      gsap.set(cardRef.current, {
        scale: 0.8,
        opacity: 0
      });

      // Card animations
      const cardTimeline = gsap.timeline();
      
      cardTimeline
        .to(cardRef.current, {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out'
        })
        .to(cardContentRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out'
        }, '-=0.2')
        .to(cardImageRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power2.out'
        }, '-=0.4')
        .to([cardTitleRef.current, cardDescRef.current], {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out'
        }, '-=0.6')
        .to(closeButtonRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: 'power2.out'
        }, '-=0.4');
    }
  }, { dependencies: [isCardOpen, activeSlide] });

  const activeSlideData = slides.find(slide => slide.id === activeSlide);

  return (
    <section ref={rootRef} className="relative w-full flex flex-col items-center background-gradient-light">
      {/* Slide 1: Land Tenure Framework - Original Design */}
      <div className="w-full flex flex-col items-start justify-center px-[clamp(1.5rem,5vw,6.25rem)] py-24">
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
            src="/assets/infographic.webp" 
            alt="Land Tenure Framework Infographic"
            className="w-full h-full object-cover"
          />
          
          {/* Clickable Images */}
          <div ref={pointsRef} className="absolute inset-0">
            {slides.slice(1).map((slide) => (
              <button
                key={slide.id}
                onClick={() => handlePointClick(slide.id)}
                className="absolute w-24 h-24 md:w-[200px] md:h-[200px] transition-transform duration-300 cursor-pointer group pointer-pulse"
                style={{
                  left: `${slide.position?.x}%`,
                  top: `${slide.position?.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                aria-label={`Click to learn more about ${slide.title}`}
              >
                <div className="w-full h-full rounded-full group-hover:ring-4 group-hover:ring-primary hover:ring-primary !ring-primary transition-all duration-300" style={{ '--tw-ring-color': '#d57300' } as React.CSSProperties}>
                  <img 
                    src={slide.image}
                    alt={slide.alt}
                    className="w-full h-full object-contain rounded-full"
                    loading="lazy"
                  />
                </div>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white text-secondary text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                  {slide.title.split(' ').slice(0, 2).join(' ')}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Card Modal */}
      {isCardOpen && activeSlideData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-hidden">
          <div 
            ref={cardRef}
            className="background-gradient-light rounded-2xl shadow-2xl w-[95vw] max-h-[95vh] overflow-hidden relative flex flex-col"
          >
            {/* Close Button - Always visible */}
            <button
              ref={closeButtonRef}
              onClick={handleCloseCard}
              className="absolute top-4 right-4 z-20 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors duration-200"
              aria-label="Close card"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Card Content - Scrollable */}
            <div ref={cardContentRef} className="flex flex-col lg:flex-row h-full overflow-y-auto p-6 lg:p-12">
              {/* Image Section */}
              <div className="w-full lg:w-1/2 h-64 lg:h-auto flex-shrink-0">
                <img 
                  ref={cardImageRef}
                  src={activeSlideData.image}
                  alt={activeSlideData.alt}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>

              {/* Text Section */}
              <div className="w-full lg:w-1/2 p-4 lg:p-8 flex flex-col justify-start">
                <h2 
                  ref={cardTitleRef}
                  className="heading-2 text-secondary mb-6 font-bold"
                  dangerouslySetInnerHTML={{ __html: activeSlideData.title }}
                />
                <p 
                  ref={cardDescRef}
                  className="body-M text-secondary"
                >
                  {activeSlideData.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Infographic; 