
import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LoadingContext } from '../App';
import SubLoader from '@/load/SubLoader';

interface VideoPlayerProps {
  videoUrl: string;
  startTime?: number;
  autoplay?: boolean;
  onLoad?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  videoUrl, 
  startTime = 2, 
  autoplay = true,
  onLoad
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { t } = useTranslation();
  
  // Construct the video URL with parameters
  const getVideoUrl = useCallback(() => {
    // Check if it's a YouTube link
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      // Extract the video ID
      let videoId = '';
      if (videoUrl.includes('youtu.be')) {
        videoId = videoUrl.split('youtu.be/')[1].split(/[?&#]/)[0];
      } else {
        const urlObj = new URL(videoUrl);
        videoId = urlObj.searchParams.get('v') || '';
      }
      // Build embed URL with enhanced parameters for better visibility
      let embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? '1' : '0'}&start=${startTime}&mute=0&controls=1&rel=0&showinfo=0&modestbranding=1`;
      return embedUrl;
    }
    // Fallback: return the original URL
    return videoUrl;
  }, [videoUrl, startTime, autoplay]);

  return (
    <iframe
      ref={iframeRef}
      width="100%"
      height="100%"
      src={getVideoUrl()}
      title={t('mainPage.hero.title')}
      frameBorder="0"
      allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
      allowFullScreen
      referrerPolicy="strict-origin-when-cross-origin"
      className="w-full h-full"
      loading="lazy"
      onLoad={onLoad}
    />
  );
};

interface VideoProps {
  showVideo?: boolean;
}

const Video: React.FC<VideoProps> = ({ showVideo = true }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isVideoPreloaded, setIsVideoPreloaded] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const playButtonRef = useRef<HTMLButtonElement>(null);
  const playCircleRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const isLoading = useContext(LoadingContext);

  // Store references for cleanup
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | undefined>(undefined);
  const eventListenersRef = useRef<{ element: HTMLElement; type: string; handler: EventListener }[]>([]);
  const mobileAnimationRunRef = useRef(false);

  // Initialize animations
  useEffect(() => {
    if (isLoading) return;

    // Set initial states
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

    // Create scroll-triggered animation
    timelineRef.current = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top center",
        end: "center center",
        toggleActions: "play none none reverse"
      }
    });

    // Store the ScrollTrigger reference for cleanup
    scrollTriggerRef.current = timelineRef.current.scrollTrigger;

    timelineRef.current
      .to(eyebrowRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
      })
      .to(headingRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
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

    // Add attention-grabbing pulse animation to video container
    if (videoContainerRef.current) {
      gsap.to(videoContainerRef.current, {
        boxShadow: "0 0 30px rgba(255, 166, 0, 0.3)",
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut"
      });
    }

    // Add hover animation for the play button
    if (playButtonRef.current) {
      const handleMouseEnter = () => {
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
      };

      const handleMouseLeave = () => {
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
      };

      // Add event listeners and store references for cleanup
      playButtonRef.current.addEventListener('mouseenter', handleMouseEnter);
      playButtonRef.current.addEventListener('mouseleave', handleMouseLeave);
      
      eventListenersRef.current.push(
        { element: playButtonRef.current, type: 'mouseenter', handler: handleMouseEnter },
        { element: playButtonRef.current, type: 'mouseleave', handler: handleMouseLeave }
      );

      // Mobile: auto-animate play button (only once)
      if (window.innerWidth <= 768 && !mobileAnimationRunRef.current) {
        mobileAnimationRunRef.current = true;
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

    return () => {
      // Clean up event listeners
      eventListenersRef.current.forEach(({ element, type, handler }) => {
        element.removeEventListener(type, handler);
      });
      eventListenersRef.current = [];

      // Kill the specific ScrollTrigger
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = undefined;
      }

      // Kill the timeline
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
    };
  }, [isLoading]);

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
    setIsVideoLoading(true);
  };

  return (
    <section 
      ref={sectionRef}
      className="relative w-full background-gradient-dark flex flex-col items-center" 
      aria-labelledby="video-title"
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
          <p 
            ref={eyebrowRef}
            className="eyebrow text-light" 
            id="video-eyebrow"
          >
            {t('mainPage.video.eyebrow')}
          </p>
          
          {/* Main heading */}
          <h2 
            ref={headingRef}
            id="video-title" 
            className="heading-2 text-light max-w-[1100px]" 
            dangerouslySetInnerHTML={{ __html: t('mainPage.video.heading') }} 
          />
        </div>

        {/* Video container */}
        <div 
          ref={videoContainerRef}
          className="self-end w-full md:w-[45rem] h-[16rem] md:h-[22rem] rounded-xl overflow-hidden relative"
        >
          {/* Video placeholder with background image */}
          <div 
            className="w-full h-full flex items-center justify-center relative cursor-pointer group"
            style={{
              backgroundImage: 'url("/assets/video-bg.webp")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            onClick={handleOpenPopup}
          >
            {/* Play button with animated text - perfectly centered */}
            <div className="relative flex items-center justify-center">
              {/* Animated text around the circle */}
              <div className="absolute w-[100px] h-[100px] md:w-[120px] md:h-[120px] animate-spin-slow">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <defs>
                    <path id="circle-path" d="M 50 50 m -40 0 a 40 40 0 1 1 80 0 a 40 40 0 1 1 -80 0" />
                  </defs>
                  <text className="text-xs font-medium fill-white">
                    <textPath href="#circle-path" startOffset="0%">
                      PLAY VIDEO • PLAY VIDEO • PLAY VIDEO • PLAY VIDEO •
                    </textPath>
                  </text>
                </svg>
              </div>
              
              {/* Play button */}
              <button 
                ref={playButtonRef}
                className="relative z-10"
                aria-label="Play video"
              >
                {/* Outer circle with animation */}
                <div 
                  ref={playCircleRef}
                  className="w-[40px] md:w-[50px] h-[40px] md:h-[50px] rounded-full backdrop-blur-[4.125px] border border-white flex items-center justify-center transition-all duration-300 animate-videoPulse"
                >
                  {/* Play triangle */}
                  <div className="w-0 h-0 border-t-[8px] md:border-t-[10px] border-t-transparent border-l-[12px] md:border-l-[15px] border-l-white border-b-[8px] md:border-b-[10px] border-b-transparent ml-1 group-hover:border-l-orange-500 transition-colors duration-300" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Popup */}
      {isPopupOpen && showVideo && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsPopupOpen(false);
            }
          }}
        >
          <button
            onClick={() => setIsPopupOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 z-50 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-[4.125px] flex items-center justify-center transition-all duration-300 group"
            aria-label={t('common.closeVideo', 'Close video')}
          >
            <div className="relative w-4 h-4">
              <div className="absolute top-1/2 left-0 w-4 h-[2px] bg-white rotate-45 group-hover:bg-orange-500 transition-colors duration-300" />
              <div className="absolute top-1/2 left-0 w-4 h-[2px] bg-white -rotate-45 group-hover:bg-orange-500 transition-colors duration-300" />
            </div>
          </button>
          <div className="relative w-full h-full max-w-[100vw] max-h-[98vh] aspect-video">
            <SubLoader isLoading={isVideoLoading} />
            <VideoPlayer 
              videoUrl="https://youtu.be/rziRiIrr_kE" 
              startTime={2}
              autoplay={true}
              // @ts-ignore
              onLoad={() => setIsVideoLoading(false)}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default Video; 