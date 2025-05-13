import React from 'react';
import { useTranslation } from 'react-i18next';
import Menu from './Menu';

const Hero: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="relative w-full min-h-screen bg-secondary flex flex-col">
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
      <div className="relative mt-[7rem] w-full">
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
              <div className="bg-white/5 backdrop-blur-[100px] p-8 rounded-xl border border-white/20">
                <p className="body-M text-light">
                  {t('hero.description')}
                </p>
              </div>

              {/* CTA Button */}
              <button className="mt-4 flex items-center h-[4.2rem] bg-[var(--color-accent)] hover:bg-[var(--color-green-soft)] text-light hover:text-secondary rounded-button backdrop-blur-[6px] transition-all duration-200 group">
                <div className="flex items-center gap-2 px-6">
                  <img src="/icons/mouse-icon.svg" alt="Mouse" className="w-4 h-4 group-hover:invert" />
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