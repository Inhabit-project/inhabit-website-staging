import React, { useState, useRef, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initVideoSectionCursor } from '../utils/videoCursor';
import { LoadingContext } from '../App';
import SubLoader from './SubLoader';

const ProjectsVideoSection: React.FC = () => {
  const { t } = useTranslation();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [canAnimate, setCanAnimate] = useState(false);
  const isLoading = useContext(LoadingContext);
  const [isVideoLoading, setIsVideoLoading] = useState(false);

  // Refs for animations
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const playButtonRef = useRef<HTMLButtonElement>(null);
  const playCircleRef = useRef<HTMLDivElement>(null);

  // Set initial states
  useEffect(() => {
    gsap.set([eyebrowRef.current, headingRef.current], {
      opacity: 0,
      y: 50
    });

    gsap.set(videoContainerRef.current, {
      opacity: 0,
      y: 100,
      scale: 0.95
    });

    gsap.set(playButtonRef.current, {
      opacity: 0,
      scale: 0.5
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

  // Initialize video cursor for the entire section
  useEffect(() => {
    if (!sectionRef.current) return;
    const cleanup = initVideoSectionCursor(sectionRef.current);
    return cleanup;
  }, []);

  // Handle animations
  useEffect(() => {
    if (!canAnimate || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center",
          end: "center center",
          toggleActions: "play none none reverse"
        }
      });

      tl.to(eyebrowRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
      })
      .to(headingRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.6")
      .to(videoContainerRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: "power3.out"
      }, "-=0.7")
      .to(playButtonRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.7)"
      }, "-=0.5");

      // Add hover animation for the play button
      if (playButtonRef.current) {
        playButtonRef.current.addEventListener('mouseenter', () => {
          gsap.to(playButtonRef.current, {
            scale: 1.1,
            duration: 0.3,
            ease: "power2.out"
          });
          gsap.to(playCircleRef.current, {
            backgroundColor: "rgba(255, 166, 0, 0.2)",
            borderColor: "rgb(255, 166, 0)",
            duration: 0.3
          });
        });

        playButtonRef.current.addEventListener('mouseleave', () => {
          gsap.to(playButtonRef.current, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
          });
          gsap.to(playCircleRef.current, {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderColor: "rgb(255, 255, 255)",
            duration: 0.3
          });
        });
        // Mobile: auto-animate play button
        if (window.innerWidth <= 768) {
          gsap.to(playButtonRef.current, {
            scale: 1.1,
            duration: 0.3,
            ease: "power2.out"
          });
          gsap.to(playCircleRef.current, {
            backgroundColor: "rgba(255, 166, 0, 0.2)",
            borderColor: "rgb(255, 166, 0)",
            duration: 0.3
          });
        }
      }
    });

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [canAnimate]);

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
      className="relative w-full background-gradient-dark flex flex-col items-center custom-cursor-hide" 
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
          <p ref={eyebrowRef} className="eyebrow text-light" id="projects-video-eyebrow">
            {t('mainPage.projectsVideo.eyebrow')}
          </p>
          {/* Main heading */}
          <h2 ref={headingRef} id="projects-video-title" className="heading-2 text-light max-w-[1100px]">
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
            onClick={() => { setIsPopupOpen(true); setIsVideoLoading(true); }}
            onKeyPress={handleKeyPress}
            role="button"
            tabIndex={0}
            aria-label={t('mainPage.projectsVideo.playFeaturedVideo')}
          >
            {/* Play button */}
            <button 
              ref={playButtonRef}
              className="relative group"
              aria-label={t('mainPage.projectsVideo.playVideo')}
            >
              {/* Outer circle with animation */}
              <div 
                ref={playCircleRef}
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
            <SubLoader isLoading={isVideoLoading} />
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
              onLoad={() => setIsVideoLoading(false)}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default ProjectsVideoSection; 