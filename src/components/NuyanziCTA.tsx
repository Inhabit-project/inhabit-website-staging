import React, { useRef, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { gsap, ScrollTrigger } from "../utils/gsap";
import { LoadingContext } from "../App";
import { useGSAP } from '@gsap/react';

// Register the hook to avoid React version discrepancies
gsap.registerPlugin(useGSAP);

const NuyanziCTA: React.FC = () => {
  const { t } = useTranslation();
  const isLoading = useContext(LoadingContext);
  const [canAnimate, setCanAnimate] = useState(false);

  // Simplified refs
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null); // blur+image
  const textGroupRef = useRef<HTMLDivElement>(null); // title+buttons
  const imageContainerRef = useRef<HTMLDivElement>(null); // image only

  // Set initial states and handle animations with useGSAP
  useGSAP(() => {
    // Set initial states
    gsap.set(bgRef.current, { scale: 1.1 });
    gsap.set(imageContainerRef.current, { opacity: 0, y: 30 });
    gsap.set(textGroupRef.current, { opacity: 0, y: 20 });
    gsap.set(mainContentRef.current, { opacity: 1 }); // Keep container visible

    // Only create animations if we can animate
    if (!canAnimate || !sectionRef.current) return;
    
    const timeline = gsap.timeline({
      paused: true,
      defaults: { ease: 'power3.out' }
    });

    // Animate background first (subtle scale)
    timeline.to(bgRef.current, {
      scale: 1,
      duration: 1.5,
      ease: 'power2.out'
    }, 0.2) // Small delay to ensure smooth start
    // Animate image container
    .to(imageContainerRef.current, {
      opacity: 1,
      y: 0,
      duration: 1.0,
      ease: 'power3.out'
    }, "-=1.0") // Start after background animation begins
    // Animate text group last
    .to(textGroupRef.current, {
      opacity: 1,
      y: 0,
      duration: 1.0,
      ease: 'power3.out'
    }, "-=0.5"); // Start after image animation begins

    // Create scroll trigger
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 80%", // Back to original position
      end: "bottom 20%", // Back to original position
      toggleActions: "play none none reverse",
      animation: timeline,
      id: `nuyanzi-cta-${Date.now()}`, // Unique ID to avoid conflicts
    });

    // Refresh ScrollTrigger to ensure it works properly - with delay to avoid conflicts
    setTimeout(() => {
      try {
        // Only refresh if there are active ScrollTriggers
        if (ScrollTrigger.getAll().length > 0) {
          ScrollTrigger.refresh();
        }
      } catch (error) {
        console.warn("ScrollTrigger refresh failed in NuyanziCTA:", error);
      }
    }, 100);
  }, { scope: sectionRef, dependencies: [canAnimate] });

  // Handle loading state change
  React.useEffect(() => {
    // Allow animations immediately when loader is not active
    if (!isLoading) {
      setCanAnimate(true);
    } else {
      setCanAnimate(false);
    }
  }, [isLoading]);

  const handlePresentationClick = () => {
    window.open("https://www.canva.com/design/DAGpOqXVkIY/pXgWgQt2dsLWP8wSELwddQ/view?utm_content=DAGpOqXVkIY&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h4d7600fd34", "_blank");
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden "
      aria-label={t("nuiyanzhiPage.cta.title")}
    >
      {/* Background Image */}
      <div
        ref={bgRef}
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: 'url("/assets/CTA.webp")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        role="presentation"
        aria-hidden="true"
      />

      {/* Main Content (Blur+Image+Text) */}
      <div
        ref={mainContentRef}
        className="relative z-10 flex min-h-screen items-center justify-center px-[clamp(1rem,5vw,6.25rem)]"
      >
        <div className="w-full max-w-[120rem] rounded-[20px] overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Text and Buttons Container with semi-transparent background */}
            <div className="w-full md:w-[70%] p-6 md:p-12 bg-secondary/80 backdrop-blur-lg">
              <div ref={textGroupRef}>
                <h3 className="heading-3 text-light text-center md:text-left">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: t("nuiyanzhiPage.cta.title"),
                    }}
                  />
                </h3>
                {/* Buttons */}
                <div className="mt-8 md:mt-12 flex justify-center md:justify-start">
                  {/* Primary Button */}
                  <button
                    onClick={handlePresentationClick}
                    className="mt-0 flex items-center h-[4.2rem] bg-[var(--color-accent)] hover:bg-[var(--color-green-soft)] text-light hover:text-secondary rounded-button backdrop-blur-sm transition-all duration-200 group no-underline"
                    aria-label={t('nuiyanzhiPage.cta.showPresentation')}
                  >
                    <div className="flex items-center gap-2 px-6">
                      <svg
                        className="w-5 h-5 text-light group-hover:text-[var(--color-green-dark)] transition-colors duration-200"
                        width="24"
                        height="25"
                        viewBox="0 0 24 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          d="M6.8291 17.2954C13.9002 21.5381 19.557 15.8812 18.8499 5.27465C8.24352 4.56753 2.58692 10.2246 6.8291 17.2954ZM6.8291 17.2954C6.82902 17.2953 6.82918 17.2956 6.8291 17.2954ZM6.8291 17.2954L5 19.1239M6.8291 17.2954L10.6569 13.467"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="button-text text-sm tracking-[0.02em] uppercase">
                        {t('nuiyanzhiPage.cta.showPresentation')}
                      </span>
                    </div>
                    <div className="flex items-center px-4">
                      <svg
                        className="w-6 h-6 transition-transform duration-200 group-hover:translate-x-1"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        aria-hidden="true"
                        width="24"
                        height="24"
                      >
                        <path
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            </div>
            {/* Image Container */}
            <div className="relative w-full md:w-[30%]" ref={imageContainerRef}>
              <div
                className="absolute inset-0 bg-secondary/30"
                aria-hidden="true"
              ></div>
              <img
                src="/assets/1Hub/guardians.webp"
                alt={t("nuiyanzhiPage.cta.imageAlt")}
                className="w-full h-full object-cover aspect-[4/3]"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NuyanziCTA; 