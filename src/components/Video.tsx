import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { initVideoSectionCursor } from '../utils/videoCursor';

interface VideoPlayerProps {
  videoUrl: string;
  startTime?: number;
  autoplay?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  videoUrl, 
  startTime = 2, 
  autoplay = true 
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
      // Build embed URL
      let embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? '1' : '0'}&start=${startTime}`;
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
    />
  );
};

interface VideoProps {
  showVideo?: boolean;
}

const Video: React.FC<VideoProps> = ({ showVideo = true }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isVideoPreloaded, setIsVideoPreloaded] = useState(false);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const { t } = useTranslation();

  // Initialize video cursor for the entire section
  useEffect(() => {
    if (!sectionRef.current) return;
    const cleanup = initVideoSectionCursor(sectionRef.current);
    return cleanup;
  }, []);

  // Function to preload the video when user hovers over the thumbnail
  // Removed ineffective preload logic for Vimeo player
  // Use Intersection Observer to trigger any other effects if needed
  useEffect(() => {
    if (!videoContainerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // No preload logic needed
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(videoContainerRef.current);
    return () => {
      observer.disconnect();
    };
  }, []);

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
          <p className="eyebrow text-light" id="video-eyebrow">
            {t('mainPage.video.eyebrow')}
          </p>
          
          {/* Main heading */}
          <h2 id="video-title" className="heading-2 text-light max-w-[1100px]" dangerouslySetInnerHTML={{ __html: t('mainPage.video.heading') }} />
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
              backgroundImage: 'url("/assets/video-bg.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            onClick={() => setIsPopupOpen(true)}
          >
            {/* Play button */}
            <button className="relative group">
              {/* Outer circle with animation */}
              <div className="w-[50px] md:w-[66px] h-[50px] md:h-[66px] rounded-full backdrop-blur-[4.125px] border border-white flex items-center justify-center animate-videoPulse hover:bg-orange-500/20 transition-all duration-300">
                {/* Play triangle */}
                <div className="w-0 h-0 border-t-[10px] md:border-t-[12px] border-t-transparent border-l-[16px] md:border-l-[20px] border-l-white border-b-[10px] md:border-b-[12px] border-b-transparent ml-1 group-hover:border-l-orange-500 transition-colors duration-300" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Video Popup */}
      {isPopupOpen && showVideo && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={(e) => {
            // Only close if clicking the backdrop
            if (e.target === e.currentTarget) {
              setIsPopupOpen(false);
            }
          }}
        >
          {/* Absolute close button at top right of popup */}
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
            <VideoPlayer 
              videoUrl="https://youtu.be/Gces1qpNDSE" 
              startTime={2}
              autoplay={true}
            />
          </div>
          
        </div>
        
      )}
    </section>
  );
};

export default Video; 