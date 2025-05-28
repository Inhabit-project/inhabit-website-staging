import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Menu from './Menu';
import { scrollManager } from '../utils/scrollManager';

interface HeroProps {
  scrollToRef?: React.RefObject<HTMLElement>;
}

const Hero: React.FC<HeroProps> = ({ scrollToRef }) => {
  const { t } = useTranslation();

  const handleScrollClick = () => {
    if (scrollToRef && scrollToRef.current) {
      scrollManager.scrollTo(scrollToRef.current, { duration: 1.2 });
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-secondary flex flex-col no-snap">
      {/* Background Image */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: 'url("/assets/hero.webp")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 1
        }}
      />

      {/* Menu Component */}
      <Menu />

      {/* Hero Content */}
      <div className="relative mt-[7rem] w-full ">
        {/* Centered Title Container */}
        <div className="flex justify-center mb-[17rem]">
          <h1 
            className="heading-1 text-center max-w-[89.3125rem]"
            dangerouslySetInnerHTML={{ __html: t('hero.title') }}
          />
        </div>

        {/* Left-aligned Content Container */}
        <div className="w-full">
          <div className="w-full max-w-container px-[clamp(1.5rem,5vw,6.25rem)]">
            {/* Description Card */}
            <div className="relative max-w-[28rem]">
              <div className="bg-white/5 backdrop-blur-5xl p-8 rounded-xl border border-white/20">
                <p className="body-M text-light">
                  {t('hero.description')}
                </p>
              </div>

              {/* CTA Button */}
              <button
                className="mt-4 flex items-center h-[4.2rem] bg-[var(--color-accent)] hover:bg-[var(--color-green-soft)] text-light hover:text-secondary rounded-button backdrop-blur-sm transition-all duration-200 group"
                onClick={handleScrollClick}
              >
                <div className="flex items-center gap-2 px-6">
                  <img src="/icons/mouse-icon.svg" alt="Mouse" className="w-4 h-4 hero-mouse-icon" />
                  <span className="button-text text-sm tracking-[0.02em] uppercase">{t('hero.scrollButton')}</span>
                </div>
                <div className="flex items-center px-4">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero; 