import React, { useState, useRef, useEffect, useLayoutEffect, useContext } from "react";
import { gsap, ScrollTrigger } from "../utils/gsap";
import { useTranslation } from "react-i18next";
import { LoadingContext } from "../App";

const Hubs: React.FC = () => {
  const { t } = useTranslation();
  const [selectedHub, setSelectedHub] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const cardContentRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const mapWrapperRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<(HTMLButtonElement | null)[]>([]);
  const isLoading = useContext(LoadingContext);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Preload image utility
  const preloadImage = (src: string) => {
    if (!src) return;
    const img = new window.Image();
    img.src = src;
  };

  // Focus close button when card opens
  useEffect(() => {
    if (selectedHub !== null && closeBtnRef.current) {
      closeBtnRef.current.focus();
    }
  }, [selectedHub]);

  // Initialize section animations
  useLayoutEffect(() => {
    if (isLoading) return;
    const ctx = gsap.context(() => {
      gsap.set([titleRef.current, descriptionRef.current], {
        opacity: 0,
        y: 50,
      });
      gsap.set(mapWrapperRef.current, {
        opacity: 0,
        y: 100,
        scale: 0.95,
      });
      gsap.set(markersRef.current, {
        opacity: 0,
        scale: 0.5,
      });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center",
          end: "center center",
          toggleActions: "play none none reverse",
        },
      });
      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      })
        .to(
          descriptionRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
          },
          "-=0.6"
        )
        .to(
          mapWrapperRef.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
            ease: "power3.out",
          },
          "-=0.7"
        )
        .to(
          markersRef.current,
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "back.out(1.7)",
          },
          "-=0.8"
        );
    });
    return () => ctx.revert();
  }, [isLoading]);

  // Animate card in with GSAP
  useEffect(() => {
    if (selectedHub !== null && cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 40, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out" }
      );
    }
  }, [selectedHub]);

  // Auto-hide after 3s if not hovered
  useEffect(() => {
    if (selectedHub !== null && !isHovered) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setSelectedHub(null);
      }, 3000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [selectedHub, isHovered]);

  useEffect(() => {
    if (selectedHub !== null && cardContentRef.current) {
      const children = cardContentRef.current.querySelectorAll(".card-animate");
      gsap.set(children, { opacity: 0, y: 20 });
      gsap.to(children, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: "power2.out",
        delay: 0.15,
      });
    }
  }, [selectedHub]);

  // Use translation for hub cards
  const hubCards = [
    {
      image: "/assets/hub-1.webp",
      title: t("mainPage.hubs.cards.0.title"),
      eyebrow: t("mainPage.hubs.cards.0.eyebrow"),
      description: t("mainPage.hubs.cards.0.description"),
      coordinates: "11° 15′ 49″ N; 73° 53′ 28″ W",
    },
    {
      image: "/assets/hub-2.webp",
      title: t("mainPage.hubs.cards.1.title"),
      eyebrow: t("mainPage.hubs.cards.1.eyebrow"),
      description: t("mainPage.hubs.cards.1.description"),
      coordinates: "11° 11′ 15″ N; 73° 28′ 58″ W",
    },
    {
      image: "/assets/hub-3.webp",
      title: t("mainPage.hubs.cards.2.title"),
      eyebrow: t("mainPage.hubs.cards.2.eyebrow"),
      description: t("mainPage.hubs.cards.2.description"),
      coordinates: "11° 14′ 48″ N; 73° 32′ 51″ W",
    },
  ];

  return (
    <>
      <style>
        {`
          .hub-marker {
            position: absolute;
            z-index: 2;
          }

          /* Mobile marker positions (percentages) */
          .hub-marker-1 { top: 35%; left: 75%; }
          .hub-marker-2 { top: 30%; left: 35%; }
          .hub-marker-3 { top: 30%; left: 50%; }

          .mobile-marker-pulse {
            animation: pulse-marker 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }

          @keyframes pulse-marker {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.2);
            }
          }

          /* Marker color transition on hover */
          .hub-marker .marker-outer {
            border: 2px solid var(--color-green-soft);
            transition: border-color 0.3s;
          }
          .hub-marker .marker-inner {
            background: var(--color-green-soft);
            transition: background 0.3s;
          }
          .hub-marker:hover .marker-outer,
          .hub-marker:focus .marker-outer,
          .hub-marker:active .marker-outer,
          .hub-marker.group:hover .marker-outer {
            border-color: var(--color-primary);
          }
          .hub-marker:hover .marker-inner,
          .hub-marker:focus .marker-inner,
          .hub-marker:active .marker-inner,
          .hub-marker.group:hover .marker-inner {
            background: var(--color-primary);
          }

          /* Desktop marker positions (using original clamp values) */
          @media (min-width: 768px) {
            .hub-marker-1 { 
              top: clamp(9rem,16vw,19rem); 
              right: clamp(6rem,12vw,18rem); 
              left: auto; 
            }
            .hub-marker-2 { 
              top: clamp(7rem,15vw,16rem); 
              left: clamp(10rem,30vw,32rem); 
              right: auto;
            }
            .hub-marker-3 { 
              top: clamp(6rem,14vw,16rem); 
              left: clamp(16rem,48vw,52rem); 
              right: auto;
            }
          }

          /* Card centering for mobile/desktop */
          .hub-card-centered {
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: min(30rem, calc(100vw - 2rem));
            height: min(36rem, calc(100vh - 4rem));
            z-index: 50;
            pointer-events: auto;
          }
          
          /* Responsive adjustments */
          @media (max-width: 640px) {
            .hub-card-centered {
              width: calc(100vw - 1rem);
              height: min(32rem, calc(100vh - 2rem));
              max-width: 28rem;
            }
          }
        `}
      </style>
      <section
        ref={sectionRef}
        className="hubs-section relative w-full flex flex-col items-center background-gradient-light min-h-screen max-h-screen overflow-hidden scroll-snap-section"
        style={{ minHeight: "100vh", maxHeight: "100vh", overflow: "hidden" }}
      >
        {/* Content */}
        <div className="hubs-content relative z-10 w-full max-w-[120rem] mx-auto px-[clamp(1.5rem,5vw,6.25rem)] py-24">
          <div className="flex flex-col items-start gap-12">
            {/* Header section */}
            <div className="flex flex-col md:flex-row items-start justify-between gap-8 w-full">
              <h2
                ref={titleRef}
                className="heading-2 text-secondary max-w-[40.9375rem]"
                dangerouslySetInnerHTML={{ __html: t("mainPage.hubs.title") }}
              />
              <p
                ref={descriptionRef}
                className="body-M text-secondary max-w-[35rem]"
              >
                {t("mainPage.hubs.description")}
              </p>
            </div>

            {/* Main terrain image */}
            <div className="relative w-full min-h-[60vh] md:min-h-[35rem] flex items-center justify-center md:block">
              {/* Wrapper for map and markers */}
              <div
                ref={mapWrapperRef}
                className="relative w-11/12 max-w-lg md:w-full md:max-w-none md:absolute md:left-1/2 md:-translate-x-1/2 md:top-0"
              >
                <img
                  src="/assets/map.webp"
                  alt="Global biodiversity corridor map"
                  className="w-full h-full object-contain"
                />

                {/* Location markers */}
                {hubCards.map((hub, idx) => (
                  <button
                    key={idx}
                    ref={(el) => (markersRef.current[idx] = el)}
                    className={`hub-marker hub-marker-${
                      idx + 1
                    } flex flex-row items-start group focus:outline-none`}
                    onClick={() => setSelectedHub(idx)}
                    onMouseEnter={() => preloadImage(hub.image)}
                    onFocus={() => preloadImage(hub.image)}
                    aria-label={`Show info for ${hub.title}`}
                  >
                    {/* Animated marker (pulse) - now always visible */}
                    <div className="relative mobile-marker-pulse mr-2">
                      <div className="w-8 h-8 rounded-full marker-outer"></div>
                      <div className="w-4 h-4 rounded-full marker-inner absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                    </div>

                    {/* Desktop marker with vertical line and text */}
                    <div className="hidden md:flex flex-row items-start">
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "start",
                          height: "8rem",
                          position: "relative",
                        }}
                      ></div>
                      {/* Text to the right of the marker */}
                      <div className="flex flex-col items-start">
                        <span
                          className="text-white marker-underline text-left text-base"
                          style={{
                            fontFamily: "Abel, sans-serif",
                            fontWeight: 400,
                          }}
                        >
                          {hub.title}
                        </span>
                        <span
                          className="text-white marker-underline text-left text-base"
                          style={{
                            fontFamily: "Abel, sans-serif",
                            fontWeight: 400,
                          }}
                        >
                          {hub.coordinates.split(";")[0]}
                        </span>
                        <span
                          className="text-white marker-underline text-left text-base"
                          style={{
                            fontFamily: "Abel, sans-serif",
                            fontWeight: 400,
                          }}
                        >
                          {hub.coordinates.split(";")[1]}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>



              {/* Featured image card - only show if a marker is selected */}
              {selectedHub !== null && (
                <div
                  ref={cardRef}
                  className="hub-card-centered rounded-xl overflow-hidden"
                  style={{ willChange: "transform, opacity" }}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <div className="relative h-full">
                    {/* Background image */}
                    <img
                      src={hubCards[selectedHub].image}
                      alt=""
                      loading="lazy"
                      width={400}
                      height={400}
                      className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* Content overlay */}
                    <div
                      className="relative h-full flex flex-col p-6"
                      ref={cardContentRef}
                    >
                      {/* Close button */}
                      <div className="flex justify-end -mt-4">
                        <button
                          ref={closeBtnRef}
                          className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-[50px] border border-[#EFEFEF]/50 flex items-center justify-center group transition-all duration-300 hover:border-white hover:bg-white/50 text-white"
                          onClick={() => setSelectedHub(null)}
                          aria-label="Close hub card"
                          style={{ position: "absolute", top: 10, right: 10 }}
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M6 6L14 14M14 6L6 14"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Spacer */}
                      <div className="flex-grow min-h-[120px]"></div>

                      {/* Text content */}
                      <div className="bg-white/10 backdrop-blur-[50px] rounded-2xl p-4 border border-white/5">
                        <p className="text-white text-sm uppercase tracking-[-0.015em] mb-4 eyebrow card-animate">
                          {hubCards[selectedHub].eyebrow}
                        </p>
                        <h3 className="text-white text-[1.6rem] font-montserrat font-regular leading-[1.2] mb-2 card-animate">
                          {hubCards[selectedHub].title}
                        </h3>
                        <p className="text-white text-sm tracking-[-0.015em] font-nunito card-animate">
                          {hubCards[selectedHub].description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hubs;
