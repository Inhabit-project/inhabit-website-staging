import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useTranslation } from 'react-i18next';

const Hubs: React.FC = () => {
  const { t } = useTranslation();
  const [selectedHub, setSelectedHub] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const cardContentRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Animate card in with GSAP
  useEffect(() => {
    if (selectedHub !== null && cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 40, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out' }
      );
    }
  }, [selectedHub]);

  // Auto-hide after 3s if not hovered
  useEffect(() => {
    if (selectedHub !== null && !isHovered) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setSelectedHub(null);
      }, 3000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [selectedHub, isHovered]);

  useEffect(() => {
    if (selectedHub !== null && cardContentRef.current) {
      const children = cardContentRef.current.querySelectorAll('.card-animate');
      gsap.set(children, { opacity: 0, y: 20 });
      gsap.to(children, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power2.out',
        delay: 0.15
      });
    }
  }, [selectedHub]);

  // Use translation for hub cards
  const hubCards = [
    {
      image: '/assets/hub-1.webp',
      title: t('mainPage.hubs.cards.0.title'),
      eyebrow: t('mainPage.hubs.cards.0.eyebrow'),
      description: t('mainPage.hubs.cards.0.description'),
      coordinates: '11° 15′ 49″ N; 73° 53′ 28″ W',
      position: { top: 'clamp(6rem,11vw,14rem)', right: 'clamp(6rem,12vw,18rem)' }
    },
    {
      image: '/assets/hub-2.webp',
      title: t('mainPage.hubs.cards.1.title'),
      eyebrow: t('mainPage.hubs.cards.1.eyebrow'),
      description: t('mainPage.hubs.cards.1.description'),
      coordinates: '11° 11′ 15″ N; 73° 28′ 58″ W',
      position: { top: 'clamp(5rem,10vw,12rem)', left: 'clamp(10rem,30vw,32rem)' }
    },
    {
      image: '/assets/hub-3.webp',
      title: t('mainPage.hubs.cards.2.title'),
      eyebrow: t('mainPage.hubs.cards.2.eyebrow'),
      description: t('mainPage.hubs.cards.2.description'),
      coordinates: '11° 14′ 48″ N; 73° 32′ 51″ W',
      position: { top: 'clamp(5rem,10vw,12rem)', left: 'clamp(16rem,48vw,52rem)' }
    }
  ];

  return (
    <section
      ref={sectionRef}
      className="relative w-full flex flex-col items-center background-gradient-light"
      style={{ minHeight: '100vh' }}
    >
      {/* Content */}
      <div className="relative z-10 w-full max-w-[120rem] mx-auto px-[clamp(1.5rem,5vw,6.25rem)] py-24">
        <div className="flex flex-col items-start gap-12">
          {/* Header section */}
          <div className="flex flex-col md:flex-row items-start justify-between gap-[13.3125rem] w-full">
            <h2 className="heading-2 text-secondary max-w-[40.9375rem]" dangerouslySetInnerHTML={{ __html: t('mainPage.hubs.title') }} />
            <p className="body-M text-secondary max-w-[35rem]">
              {t('mainPage.hubs.description')}
            </p>
          </div>

          {/* Main terrain image */}
          <div className="relative w-full min-h-[35rem]">
            {/* 3D terrain image */}
            <div className="absolute w-full left-1/2 -translate-x-1/2">
              <img 
                src="/assets/map.webp" 
                alt="Global biodiversity corridor map" 
                className="w-full h-full object-contain"
              />
            </div>

            {/* Location markers */}
            {hubCards.map((hub, idx) => (
              <button
                key={idx}
                className="absolute flex flex-row items-start group focus:outline-none"
                onClick={() => setSelectedHub(idx)}
                aria-label={`Show info for ${hub.title}`}
                style={{ ...hub.position, zIndex: 2 }}
              >
                {/* Mobile marker */}
                <div className="md:hidden relative">
                  <div className="w-4 h-4 rounded-full border border-green-soft"></div>
                  <div className="w-2 h-2 rounded-full bg-green-soft absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                </div>

                {/* Desktop marker with vertical line and text */}
                <div className="hidden md:flex flex-row items-start">
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', height: '8rem', position: 'relative' }}>
                    <img
                      src="/assets/map-marker.svg"
                      alt="Map marker"
                      className="w-8 lg:w-10"
                      style={{ height: 'auto', display: 'block', zIndex: 2 }}
                    />
                  </div>
                  {/* Text to the right of the marker */}
                  <div className="flex flex-col items-start">
                    <span className="text-white marker-underline text-left text-base" style={{ fontFamily: 'Abel, sans-serif', fontWeight: 400 }}>{hub.title}</span>
                    <span className="text-white marker-underline text-left text-base" style={{ fontFamily: 'Abel, sans-serif', fontWeight: 400 }}>{hub.coordinates.split(';')[0]}</span>
                    <span className="text-white marker-underline text-left text-base" style={{ fontFamily: 'Abel, sans-serif', fontWeight: 400 }}>{hub.coordinates.split(';')[1]}</span>
                  </div>
                </div>
              </button>
            ))}

            {/* Featured image card - only show if a marker is selected */}
            {selectedHub !== null && (
              <div
                ref={cardRef}
                className="absolute w-[28rem] h-[38rem] rounded-xl overflow-hidden"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 3
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <div className="relative h-full">
                  {/* Background image */}
                  <img 
                    src={hubCards[selectedHub].image} 
                    alt="" 
                    className="absolute inset-0 w-full h-full object-cover"
                  />

                  {/* Content overlay */}
                  <div
                    className="relative h-full flex flex-col p-6"
                    ref={cardContentRef}
                  >
                    {/* Close button */}
                    <div className="flex justify-end -mt-4">
                      <button
                        className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-[50px] border border-[#EFEFEF]/50 flex items-center justify-center group transition-all duration-300 hover:border-white hover:bg-white/50 text-white"
                        onClick={() => setSelectedHub(null)}
                        aria-label="Close hub card"
                        style={{ position: 'absolute', top: 10, right: 10 }}
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 6L14 14M14 6L6 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                    

                    {/* Spacer */}
                    <div className="flex-grow min-h-[120px]"></div>

                    {/* Text content */}
                    <div className="bg-white/10 backdrop-blur-[50px] rounded-2xl p-4 border border-white/5">
                      <p className="text-white text-sm uppercase tracking-[-0.015em] mb-4 eyebrow card-animate">{hubCards[selectedHub].eyebrow}</p>
                      <h3 className="text-white text-[1.6rem] font-montserrat font-regular leading-[1.2] mb-2 card-animate">
                        {hubCards[selectedHub].title}
                      </h3>
                      <p className="text-white text-sm tracking-[-0.015em] font-nunito card-animate">
                        {hubCards[selectedHub].description}
                      </p>
                      {/* Call to Action Button aligned right 
                      <div className="flex justify-end w-full">
                        <a
                          href="/hubs"
                          className="btn-primary-sm mt-2 px-2 py-2 transition-all duration-300 hover:bg-primary-dark focus:outline-none card-animate"
                          style={{ minWidth: '10rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          Know our hubs
                        </a>
                      </div>*/}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hubs; 