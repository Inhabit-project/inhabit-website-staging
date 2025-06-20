import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { initVideoSectionCursor } from '../utils/videoCursor';

const ProjectsVideoSection: React.FC = () => {
  const { t } = useTranslation();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Initialize video cursor for the entire section
  useEffect(() => {
    if (!sectionRef.current) return;
    const cleanup = initVideoSectionCursor(sectionRef.current);
    return cleanup;
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsPopupOpen(true);
    }
  };

  const handleCloseKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsPopupOpen(false);
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="relative w-full background-gradient-dark flex flex-col items-center" 
      aria-labelledby="projects-video-title"
    >
      {/* Background with decorative elements */}
      <div className="absolute inset-0 w-full h-full overflow-hidden" aria-hidden="true">
        <img 
          src="/assets/intro-bg.svg" 
          alt="" 
          className="absolute right-0 h-full opacity-40"
          loading="lazy" 
        />
      </div>

      {/* Content */}
      <div className="z-10 w-full h-full max-w-[120rem] mx-auto px-[clamp(1.5rem,5vw,6.25rem)] py-24 flex flex-col justify-between min-h-screen">
        {/* Text content */}
        <div className="flex flex-col gap-3">
          {/* Eyebrow text */}
          <p className="eyebrow text-light" id="projects-video-eyebrow">
            {t('mainPage.projectsVideo.eyebrow')}
          </p>
          {/* Main heading */}
          <h2 id="projects-video-title" className="heading-2 text-light max-w-[1100px]">
            <span dangerouslySetInnerHTML={{ __html: t('mainPage.projectsVideo.heading') }} />
          </h2>
        </div>

        {/* Video container */}
        <div 
          ref={videoContainerRef}
          className="self-end w-full md:w-[45rem] h-[16rem] md:h-[22rem] rounded-xl overflow-hidden"
        >
          {/* Video placeholder with background image */}
          <div 
            className="w-full h-full flex items-center justify-center relative cursor-pointer"
            style={{
              backgroundImage: 'url("/assets/video-bg-1.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            onClick={() => setIsPopupOpen(true)}
            onKeyPress={handleKeyPress}
            role="button"
            tabIndex={0}
            aria-label={t('mainPage.projectsVideo.playFeaturedVideo')}
          >
            {/* Play button */}
            <button 
              className="relative group"
              aria-label={t('mainPage.projectsVideo.playVideo')}
            >
              {/* Outer circle with animation */}
              <div 
                className="w-[50px] md:w-[66px] h-[50px] md:h-[66px] rounded-full backdrop-blur-[4.125px] border border-white flex items-center justify-center animate-videoPulse hover:bg-orange-500/20 transition-all duration-300"
                aria-hidden="true"
              >
                {/* Play triangle */}
                <div 
                  className="w-0 h-0 border-t-[10px] md:border-t-[12px] border-t-transparent border-l-[16px] md:border-l-[20px] border-l-white border-b-[10px] md:border-b-[12px] border-b-transparent ml-1 group-hover:border-l-orange-500 transition-colors duration-300"
                  aria-hidden="true"
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Video Popup */}
      {isPopupOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsPopupOpen(false);
            }
          }}
          onKeyDown={handleCloseKeyPress}
          role="dialog"
          aria-modal="true"
          aria-label={t('mainPage.projectsVideo.videoPlayer')}
        >
          {/* Absolute close button at top right of popup */}
          <button
            onClick={() => setIsPopupOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 z-50 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-[4.125px] flex items-center justify-center transition-all duration-300 group"
            aria-label={t('mainPage.projectsVideo.closeVideo')}
          >
            <div className="relative w-4 h-4" aria-hidden="true">
              <div className="absolute top-1/2 left-0 w-4 h-[2px] bg-white rotate-45 group-hover:bg-orange-500 transition-colors duration-300" />
              <div className="absolute top-1/2 left-0 w-4 h-[2px] bg-white -rotate-45 group-hover:bg-orange-500 transition-colors duration-300" />
            </div>
          </button>
          <div className="relative w-full h-full max-w-[100vw] max-h-[98vh] aspect-video">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/vMyOS_ATgmA?autoplay=1"
              title={t('mainPage.projectsVideo.iframeTitle')}
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
              allowFullScreen
              className="w-full h-full"
              loading="lazy"
              aria-label={t('mainPage.projectsVideo.iframeAriaLabel')}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default ProjectsVideoSection; 