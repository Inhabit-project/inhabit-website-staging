
import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LoadingContext } from '../App';
import { useGSAP } from '@gsap/react';

// Register the hook to avoid React version discrepancies
gsap.registerPlugin(useGSAP);

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

  const mobileAnimationRunRef = useRef(false);

  // Initialize animations with useGSAP
  useGSAP(() => {
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

    // Create scroll-triggered animation with better error handling
    try {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center",
          end: "center center",
          toggleActions: "play none none reverse",
          id: `video-${Date.now()}` // Unique ID to avoid conflicts
        }
      });

      timeline
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
          boxShadow: "0 0 30px rgba(213, 115, 0, 0.3)",
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut"
        });
      }

      // Refresh ScrollTrigger to ensure it works properly
      ScrollTrigger.refresh();
    } catch (error) {
      // Animation failed silently
    }
  }, { scope: sectionRef, dependencies: [isLoading] });

  // Refresh ScrollTrigger to ensure it works on page refresh
  ScrollTrigger.refresh();

  // Handle hover animations and mobile animations separately
  useEffect(() => {
    if (!playButtonRef.current || !playCircleRef.current) return;

    const handleMouseEnter = () => {
      gsap.to(playButtonRef.current, {
        scale: 1.1,
        duration: 0.3,
        ease: "power2.out"
      });
      gsap.to(playCircleRef.current, {
        backgroundColor: "rgba(213, 115, 0, 0.2)",
        borderColor: "rgb(213, 115, 0)",
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

    // Add event listeners
    playButtonRef.current.addEventListener('mouseenter', handleMouseEnter);
    playButtonRef.current.addEventListener('mouseleave', handleMouseLeave);

    // Mobile: auto-animate play button (only once)
    if (window.innerWidth <= 768 && !mobileAnimationRunRef.current) {
      mobileAnimationRunRef.current = true;
      gsap.to(playButtonRef.current, {
        scale: 1.1,
        duration: 0.3,
        ease: "power2.out"
      });
      gsap.to(playCircleRef.current, {
        backgroundColor: "rgba(213, 115, 0, 0.2)",
        borderColor: "rgb(213, 115, 0)",
        duration: 0.3
      });
    }

    // Cleanup function
    return () => {
      if (playButtonRef.current) {
        playButtonRef.current.removeEventListener('mouseenter', handleMouseEnter);
        playButtonRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []); // Empty dependency array since we only want to set up listeners once

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
                  <text className="text-[12.5px] font-medium fill-white uppercase">
                    <textPath href="#circle-path" startOffset="0%">
                      {(() => {
                        const text = t('common.playVideo');
                        const textLength = text.length;
                        // Calculate repetitions based on text length
                        // Shorter text (Spanish) needs more repetitions
                        // Longer text (English) needs fewer repetitions
                        const repetitions = textLength <= 8 ? 7 : 6;
                        return Array(repetitions).fill(text).join(' • ') + ' •';
                      })()}
                    </textPath>
                  </text>
                </svg>
              </div>
              
              {/* Play button */}
              <button 
                ref={playButtonRef}
                className="relative z-10"
                aria-label={t('common.playVideo')}
              >
                {/* Outer circle with animation */}
                <div 
                  ref={playCircleRef}
                  className="w-[40px] md:w-[50px] h-[40px] md:h-[50px] rounded-full backdrop-blur-[4.125px] border border-white flex items-center justify-center transition-all duration-300 animate-videoPulse"
                >
                  {/* Play triangle */}
                  <div className="w-0 h-0 border-t-[8px] md:border-t-[10px] border-t-transparent border-l-[12px] md:border-l-[15px] border-l-white border-b-[8px] md:border-b-[10px] border-b-transparent ml-1 group-hover:border-l-primary transition-colors duration-300" />
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
              <div className="absolute top-1/2 left-0 w-4 h-[2px] bg-white rotate-45 group-hover:bg-primary transition-colors duration-300" />
              <div className="absolute top-1/2 left-0 w-4 h-[2px] bg-white -rotate-45 group-hover:bg-primary transition-colors duration-300" />
            </div>
          </button>
          <div className="relative w-full h-full max-w-[100vw] max-h-[98vh] aspect-video">
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