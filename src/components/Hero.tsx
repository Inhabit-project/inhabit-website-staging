import React, { useRef, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import Menu from './Menu';
import { scrollManager } from '../utils/scrollManager';
import gsap from 'gsap';
import { LoadingContext } from '../App';

interface HeroProps {
  scrollToRef?: React.RefObject<HTMLElement>;
  onHeroImageLoad?: () => void;
}

const Hero: React.FC<HeroProps> = ({ scrollToRef, onHeroImageLoad }) => {
  const { t, i18n } = useTranslation();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const descriptionCardRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const backgroundImageRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleWordsRef = useRef<HTMLSpanElement[]>([]);
  const isLoading = useContext(LoadingContext);
  const animationRef = useRef<gsap.core.Timeline | null>(null);

  const handleScrollClick = () => {
    if (scrollToRef?.current) {
      scrollManager.scrollTo(scrollToRef.current, { duration: 1.2 });
    }
  };

  // Reset animation state
  const resetAnimationState = () => {
    // Clear previous animation
    if (animationRef.current) {
      animationRef.current.kill();
      animationRef.current = null;
    }

    // Reset title words ref
    titleWordsRef.current = [];

    // Reset initial states only if elements exist
    if (buttonRef.current) {
      gsap.set([buttonRef.current], { 
        opacity: 0,
        y: 50 
      });
    }
    
    if (backgroundRef.current) {
      gsap.set(backgroundRef.current, { 
        opacity: 1 // Keep background container visible
      });
    }

    if (backgroundImageRef.current) {
      gsap.set(backgroundImageRef.current, {
        opacity: 0,
        scale: 1.1
      });
    }

    if (descriptionCardRef.current) {
      gsap.set(descriptionCardRef.current, {
        opacity: 0,
        y: 50,
        scale: 0.95
      });
    }

    if (descriptionRef.current) {
      gsap.set(descriptionRef.current, {
        opacity: 0
      });
    }
  };

  // Setup title words
  const setupTitleWords = () => {
    if (!titleRef.current) return;

    // Reset title content
    titleRef.current.innerHTML = '';

    // Create a wrapper div to hold the animated spans
    const wrapper = document.createElement('div');
    wrapper.style.display = 'inline';
    wrapper.innerHTML = t('hero.title');
    titleRef.current.appendChild(wrapper);

    // Function to wrap words in spans while preserving HTML
    const wrapWordsInSpans = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
        const fragment = document.createDocumentFragment();
        const text = node.textContent;
        let match;
        let lastIndex = 0;
        const wordRegex = /\S+/g;

        while ((match = wordRegex.exec(text)) !== null) {
          if (match.index > lastIndex) {
            fragment.appendChild(
              document.createTextNode(text.slice(lastIndex, match.index))
            );
          }

          const span = document.createElement('span');
          span.textContent = match[0];
          span.style.opacity = '0';
          span.style.transform = 'translateY(50px)';
          span.style.display = 'inline-block';
          fragment.appendChild(span);
          titleWordsRef.current.push(span);

          lastIndex = match.index + match[0].length;
        }

        if (lastIndex < text.length) {
          fragment.appendChild(
            document.createTextNode(text.slice(lastIndex))
          );
        }

        node.parentNode?.replaceChild(fragment, node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        Array.from(node.childNodes).forEach(wrapWordsInSpans);
      }
    };

    wrapWordsInSpans(wrapper);
  };

  // Setup animations
  const setupAnimations = () => {
    if (isLoading || animationRef.current) return;

    animationRef.current = gsap.timeline({
      defaults: {
        ease: "power3.out"
      }
    });

    animationRef.current
      .to(backgroundImageRef.current, {
        opacity: 1,
        scale: 1,
        duration: 2,
        ease: "power2.out"
      })
      .to(titleWordsRef.current, {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 1.2,
        ease: "back.out(1.7)"
      }, "-=1.5")
      .to(descriptionCardRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "back.out(1.2)"
      }, "-=0.5")
      .to(descriptionRef.current, {
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.3")
      .to(buttonRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.7)"
      }, "-=0.3");

    // Add hover animation for the button
    if (buttonRef.current) {
      const enterAnimation = () => {
        gsap.to(buttonRef.current, {
          scale: 1.05,
          duration: 0.3,
          ease: "power2.out"
        });
      };

      const leaveAnimation = () => {
        gsap.to(buttonRef.current, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        });
      };

      buttonRef.current.addEventListener('mouseenter', enterAnimation);
      buttonRef.current.addEventListener('mouseleave', leaveAnimation);

      // Store cleanup function
      return () => {
        if (buttonRef.current) {
          buttonRef.current.removeEventListener('mouseenter', enterAnimation);
          buttonRef.current.removeEventListener('mouseleave', leaveAnimation);
        }
      };
    }
  };

  // Handle initial setup and language changes
  useEffect(() => {
    resetAnimationState();
    setupTitleWords();
    const cleanup = setupAnimations();

    return () => {
      resetAnimationState();
      if (cleanup) cleanup();
    };
  }, [t, i18n.language, isLoading]);

  return (
    <div className="relative w-full h-screen bg-secondary flex flex-col no-scroll-snap overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        ref={backgroundRef}
        className="absolute inset-0 w-full h-full"
      >
        <img
          ref={backgroundImageRef}
          src="/assets/hero.webp"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          onLoad={onHeroImageLoad}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 to-transparent"></div>
      </div>

      {/* Menu Component */}
      <Menu />

      {/* Hero Content */}
      <div ref={contentRef} className="relative mt-[7rem] w-full h-[82vh] sm:h-[90vh] flex flex-col justify-between">
        {/* Centered Title Container */}
        <div className="flex justify-center">
          <h1 
            ref={titleRef}
            className="heading-1 text-center max-w-[92rem]"
          />
        </div>

        {/* Left-aligned Content Container */}
        <div className="w-full">
          <div className="w-full max-w-container px-[clamp(1.5rem,5vw,6.25rem)]">
            {/* Description Card */}
            <div className="relative max-w-[28rem]">
              <div 
                ref={descriptionCardRef}
                className="bg-white/5 backdrop-blur-5xl p-8 rounded-xl border border-white/20"
              >
                <p 
                  ref={descriptionRef}
                  className="body-M text-light"
                >
                  {t('hero.description')}
                </p>
              </div>

              {/* CTA Button */}
              <button
                ref={buttonRef}
                className="mt-4 mb-12 flex items-center btn-primary transition-colors duration-200 group opacity-0 "
                onClick={handleScrollClick}
              >
                <div className="flex items-center gap-2 px-6">
                  <img src="/icons/mouse-icon.svg" alt="Mouse" className="w-4 h-4 hero-mouse-icon" />
                  <span className="button-text text-sm tracking-[0.02em] uppercase">{t('hero.scrollButton')}</span>
                </div>
                <div className="flex items-center px-4">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="24" height="24">
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