import React, { useRef, useEffect, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { gsap, ScrollTrigger } from "../utils/gsap";
import { LoadingContext } from "../App";

const CTA: React.FC = () => {
  const { t } = useTranslation();
  const isLoading = useContext(LoadingContext);
  const [canAnimate, setCanAnimate] = useState(false);
  const [ready, setReady] = useState(false); // for initial CSS class

  // Simplified refs
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null); // blur+image
  const textGroupRef = useRef<HTMLDivElement>(null); // title+buttons
  const imageContainerRef = useRef<HTMLDivElement>(null); // image only

  // Set initial states on mount
  useEffect(() => {
    gsap.set(bgRef.current, { scale: 1.2 });
    gsap.set(imageContainerRef.current, { opacity: 0, y: 40 });
    gsap.set(mainContentRef.current, { opacity: 1 }); // keep container visible
    gsap.set(textGroupRef.current, { opacity: 0, y: 20 });
    setReady(true); // Remove initial CSS class after mount
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

  // Simplified animation
  useEffect(() => {
    if (!canAnimate || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center",
          end: "center center",
          toggleActions: "restart none none none",
        },
      });
      tl.to(bgRef.current, {
        scale: 1,
        duration: 0.6,
        ease: "power2.out",
      })
        .to(
          imageContainerRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "<" // at the same time as bgRef
        )
        .to(
          textGroupRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
          },
          "+=0.1" // after bg+image
        );
      // Refresh ScrollTrigger after timeline is set up
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 0);
    }, sectionRef);
    return () => {
      ctx.revert();
    };
  }, [canAnimate]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden scroll-container"
      aria-label={t("mainPage.cta.title")}
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
        className={`relative z-10 flex min-h-screen items-center justify-center px-[clamp(1rem,5vw,6.25rem)]${
          !ready ? " cta-initial-hidden" : ""
        }`}
      >
        <div className="w-full max-w-[120rem] rounded-[20px] overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Text and Buttons Container with semi-transparent background */}
            <div className="w-full md:w-[70%] p-6 md:p-12 bg-secondary/80 backdrop-blur-lg">
              <div ref={textGroupRef}>
                <h3 className="heading-3 text-light text-center md:text-left">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: t("mainPage.cta.title"),
                    }}
                  />
                </h3>
                {/* Buttons */}
                <div className="mt-8 md:mt-12 flex flex-col md:flex-row gap-4 justify-center md:justify-start">
                  {/* Primary Button (Orange) */}
                  <button
                    onClick={() => (window.location.href = "/hubs/nuiyanzhi")}
                    className="mt-0 flex items-center h-[4.2rem] bg-[var(--color-accent)] hover:bg-[var(--color-green-soft)] text-light hover:text-secondary rounded-button backdrop-blur-sm transition-all duration-200 group no-underline"
                    aria-label="Explore Nuiyanzhi Hub"
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
                        Explore Nuiyanzhi Hub
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
                  {/* Secondary Button (Green) */}
                  <button
                    onClick={() =>
                      (window.location.href = "mailto:hello@inhabit.earth")
                    }
                    className="btn-secondary flex items-center h-[4.2rem] bg-[var(--color-green-soft)] hover:bg-[var(--color-accent)] text-secondary hover:text-light rounded-button backdrop-blur-sm transition-all duration-200 group no-underline"
                    aria-label={t("mainPage.cta.becomeGuardian")}
                  >
                    <div className="flex items-center gap-2 px-4 md:px-6">
                      <img
                        src="assets/icons/User_add_alt_fill.svg"
                        alt=""
                        className="w-5 h-5 transition-colors duration-200 group-hover:invert"
                        aria-hidden="true"
                      />
                      <span className="button-text text-sm tracking-[0.02em] uppercase">
                        {t("mainPage.cta.becomeGuardian")}
                      </span>
                    </div>
                    <div className="flex items-center px-3 md:px-4">
                      <svg
                        className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-200 group-hover:translate-x-1"
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
                src="/assets/cta-img.webp"
                alt={t("mainPage.cta.imageAlt")}
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

export default CTA;
