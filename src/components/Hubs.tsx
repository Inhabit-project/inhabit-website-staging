import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

const hubCards = [
  {
    image: '/assets/hub-1.jpg',
    title: 'Ñuiyanzhi Biocultural HUB',
    subtitle: 'Sierra Nevada de Santa Marta',
    eyebrow: 'SOIL RESTORATION & BIOCLIMATIC ARCHITECTURE:',
    description: 'Action Research Between Traditional and Academic Knowledge By Amelia Carrillo Pardo and Juan Duque',
    coordinates: '19° 25′ 42″ N; 99° 7′ 39″ O',
    markerStyle: 'top-[10rem] left-[48rem]'
  },
  {
    image: '/assets/hub-2.jpg',
    title: 'Amazonia Biodiversity Hub',
    subtitle: 'Amazon Rainforest',
    eyebrow: 'BIODIVERSITY HOTSPOT:',
    description: 'A sanctuary for rare species and a center for research and education, blending modern science with indigenous wisdom.',
    coordinates: '19° 25′ 42″ N; 99° 7′ 39″ O',
    markerStyle: 'top-[10rem] right-[12rem]'
  },
  {
    image: '/assets/hub-3.jpg',
    title: 'Atacama Innovation Hub',
    subtitle: 'Atacama Desert',
    eyebrow: 'DESERT INNOVATION:',
    description: 'Pioneering sustainable living in arid environments, focusing on water conservation and renewable energy.',
    coordinates: '19° 25′ 42″ N; 99° 7′ 39″ O',
    markerStyle: 'top-[10rem] left-[30rem]'
  }
];

const Hubs: React.FC = () => {
  const [selectedHub, setSelectedHub] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const cardContentRef = useRef<HTMLDivElement>(null);

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

  return (
    <section className="relative bg-gradient-light w-full flex flex-col items-center">
      {/* Content */}
      <div className="relative z-10 w-full max-w-[120rem] mx-auto px-[clamp(1.5rem,5vw,6.25rem)] py-24">
        <div className="flex flex-col items-start gap-12">
          {/* Header section */}
          <div className="flex flex-col md:flex-row items-start justify-between gap-[13.3125rem] w-full">
            <h2 className="heading-2 text-secondary max-w-[40.9375rem]">
              Bio-cultural<br /><strong>Hubs</strong>
            </h2>
            <p className="body-M text-secondary max-w-[35rem]">
              Located across bioregions, HUBS are important biodiversity hotspots and learning centres that preserve and share ecological resources and living knowledge to shape the corridor.
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
                className={`absolute ${hub.markerStyle} flex flex-row items-start group focus:outline-none`}
                onClick={() => setSelectedHub(idx)}
                aria-label={`Show info for ${hub.title}`}
                style={{ zIndex: 2 }}
              >
                {/* Marker with vertical line and base */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', height: '6.5rem', position: 'relative',  }}>
                  <img
                    src="/assets/map-marker.svg"
                    alt="Map marker"
                    style={{ width: '3rem', height: 'auto', display: 'block', zIndex: 2 }}
                  />
                 
                </div>
                {/* Text to the right of the marker */}
                <div className="flex flex-col items-start">
                  <span className="text-white marker-underline text-left" style={{ fontFamily: 'Abel, sans-serif', fontSize: '1rem', fontWeight: 400 }}>{hub.title}</span>
                  <span className="text-white marker-underline text-left" style={{ fontFamily: 'Abel, sans-serif', fontSize: '1rem', fontWeight: 400 }}>{hub.coordinates.split(';')[0]}</span>
                  <span className="text-white marker-underline text-left" style={{ fontFamily: 'Abel, sans-serif', fontSize: '1rem', fontWeight: 400 }}>{hub.coordinates.split(';')[1]}</span>
                </div>
              </button>
            ))}

            {/* Featured image card - only show if a marker is selected */}
            {selectedHub !== null && (
              <div
                ref={cardRef}
                className="absolute top-[1rem] right-[10%] w-[28rem] h-[38rem] rounded-xl overflow-hidden"
                style={{zIndex: 3}}
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
                        className="w-10 h-10 rounded-full bg-white/50 backdrop-blur-[50px] border border-[#EFEFEF]/50 flex items-center justify-center group transition-all duration-300 hover:border-white hover:bg-white/80 text-black"
                        onClick={() => setSelectedHub(null)}
                        aria-label="Close hub card"
                        style={{ position: 'absolute', top: 0, right: 0 }}
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 6L14 14M14 6L6 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                    {/* Navigation button */}
                    <div className="flex justify-end mt-8">
                      <button
                        className="w-16 h-16 rounded-4xl bg-white/30 backdrop-blur-[50px] border border-[#EFEFEF]/50 flex items-center justify-center group transition-all duration-300 hover:border-white hover:bg-white/40"
                        onClick={() => setSelectedHub((selectedHub + 1) % hubCards.length)}
                        aria-label="Next hub"
                      >
                        <img 
                          src="/assets/figma-images/hub-card-arrow.svg" 
                          alt="Next" 
                          className="w-6 h-6"
                        />
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
                      <h4 className="text-white text-[1.1rem] font-montserrat font-light leading-[1.2] mb-4 card-animate">
                        {hubCards[selectedHub].subtitle}
                      </h4>
                      <p className="text-white text-sm tracking-[-0.015em] font-nunito card-animate">
                        {hubCards[selectedHub].description}
                      </p>
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