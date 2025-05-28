import React, { useRef, useEffect, useState } from 'react';

interface Logo {
  logo: string;
  name: string;
}

interface LogosSectionProps {
  showAllies?: boolean;
  showBuilders?: boolean;
  showPartners?: boolean;
  allies?: Logo[];
  builders?: Logo[];
  partners?: Logo[];
}

const allies: Logo[] = [
  { logo: '/assets/logos/ally-logo-1.png', name: 'Ally 1' },
  { logo: '/assets/logos/ally-logo-2.png', name: 'Ally 2' },
  { logo: '/assets/logos/ally-logo-3.webp', name: 'Ally 3' },
  { logo: '/assets/logos/ally-logo-4.svg', name: 'Ally 4' },
  { logo: '/assets/logos/ally-logo-5.webp', name: 'Ally 5' },
];

const builders: Logo[] = [
  { logo: '/assets/logos/ally-logo-1.png', name: 'Builder 1' },
  { logo: '/assets/logos/builder-logo-2.webp', name: 'Builder 2' },
  { logo: '/assets/logos/ally-logo-4.svg', name: 'Builder 3' },
  { logo: '/assets/logos/ally-logo-3.webp', name: 'Builder 4' },
  { logo: '/assets/logos/ally-logo-5.webp', name: 'Builder 5' },
  { logo: '/assets/logos/builder-logo-6.svg', name: 'Builder 6' },
  { logo: '/assets/logos/builder-logo-7.webp', name: 'Builder 7' },
];

const partners: Logo[] = [
  { logo: '/assets/logos/partner-logo-1.png', name: 'Partner 1' },
  { logo: '/assets/logos/partner-logo-2.png', name: 'Partner 2' },
  { logo: '/assets/logos/partner-logo-3.png', name: 'Partner 3' },
  { logo: '/assets/logos/partner-logo-4.png', name: 'Partner 4' },
  { logo: '/assets/logos/partner-logo-5.png', name: 'Partner 5' },
  { logo: '/assets/logos/partner-logo-6.svg', name: 'Partner 6' },
];

// Marquee component for infinite scrolling logos
const Marquee: React.FC<{ logos: Logo[] }> = ({ logos }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [repeatCount, setRepeatCount] = useState(2);

  useEffect(() => {
    if (containerRef.current && cardRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const cardWidth = cardRef.current.offsetWidth + 32; // 32px gap (2rem)
      const minCards = Math.ceil((containerWidth * 2) / cardWidth);
      setRepeatCount(Math.max(2, Math.ceil(minCards / logos.length)));
    }
  }, [logos.length]);

  // If exactly 5 logos, repeat them to make the marquee look continuous
  const marqueeLogos = logos.length === 5 ? [...logos, ...logos, ...logos] : logos;
  // Repeat the set enough times to fill the track
  const displayLogos = Array(repeatCount).fill(marqueeLogos).flat();

  return (
    <div ref={containerRef} className="relative w-full overflow-x-hidden py-8">
      <div
        className="flex gap-8 w-max items-center marquee-track"
        style={{
          animation: 'marquee 30s linear infinite',
        }}
      >
        {displayLogos.map((logo, index) => (
          <div
            key={index}
            ref={index === 0 ? cardRef : undefined}
            className="bg-white/10 shadow-[0px_0px_47.8px_rgba(0,0,0,0.10)] backdrop-blur-md flex items-center justify-center"
            style={{ width: '20rem', height: '8.75rem', minWidth: '20rem', maxWidth: '20rem', borderRadius: 'var(--radius-md)' }}
          >
            <img
              src={logo.logo}
              alt={logo.name}
              className="object-contain max-h-[7.5rem] max-w-[13.75rem]"
              style={{ margin: 'auto' }}
            />
          </div>
        ))}
      </div>
      <style>
        {`
          .marquee-track {
            will-change: transform;
          }
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}
      </style>
    </div>
  );
};

const LogosSection: React.FC<LogosSectionProps> = ({ showAllies, showBuilders, showPartners, allies: alliesProp, builders: buildersProp, partners: partnersProp }) => {
  const alliesToShow = alliesProp || allies;
  const buildersToShow = buildersProp || builders;
  const partnersToShow = partnersProp || partners;
  return (
    <section className="background-gradient-dark py-8 md:py-16 lg:py-[6.5rem] px-4 md:px-8 lg:px-[6.25rem] overflow-x-hidden flex flex-col gap-8 md:gap-16 lg:gap-[3.75rem] scroll-container">
      <div className="w-full">
        <div className="flex flex-col gap-8 w-full">
          {showAllies && (
            <section>
              <div className="flex flex-row items-start justify-between w-full mb-6 md:mb-10">
                <h2 className="font-light text-4xl md:text-6xl lg:text-[5rem] leading-[1.1em] text-[#F6FFEA]">
                  Our<br /><strong>Allies</strong>
                </h2>
              </div>
              <Marquee logos={alliesToShow} />
            </section>
          )}
          {showBuilders && (
            <section>
              <div className="flex flex-row items-start justify-between w-full mb-6 md:mb-10">
                <h2 className="font-light text-4xl md:text-6xl lg:text-[5rem] leading-[1.1em] text-[#F6FFEA]">
                  Our<br /><strong>Builders</strong>
                </h2>
              </div>
              <Marquee logos={buildersToShow} />
            </section>
          )}
          {showPartners && (
            <section>
              <div className="flex flex-row items-start justify-between w-full mb-6 md:mb-10">
                <h2 className="font-light text-4xl md:text-6xl lg:text-[5rem] leading-[1.1em] text-[#F6FFEA]">
                  Our<br /><strong>Partners</strong>
                </h2>
              </div>
              <Marquee logos={partnersToShow} />
            </section>
          )}
        </div>
      </div>
    </section>
  );
};

export default LogosSection; 