import { useRef, useState, useContext, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ComparisonCards } from "./NFTComparison/ComparisonCards";
import { Campaign } from "@/models/campaign.model";
import { gsap, ScrollTrigger } from "../utils/gsap";
import { LoadingContext, PageAnimationContext } from "@/App";
import { useGSAP } from "@gsap/react";
import { useStore } from "@/store";
import CollectionCard from "./CollectionCard";

// Register the hook to avoid React version discrepancies
gsap.registerPlugin(useGSAP);

type Props = {
  campaign: Campaign;
  immediateAnimation?: boolean; // Nueva prop para animaciones inmediatas
};

// Animation configuration constants
const ANIMATION_CONFIG = {
  desktop: {
    duration: 0.8,
    stagger: 0.15,
    ease: "power3.out",
    initialY: 50,
    initialScale: 0.95,
    triggerStart: "top center",
    triggerEnd: "center center",
    delay: 200,
  },
  mobile: {
    duration: 0.6,
    stagger: 0.1,
    ease: "power2.out",
    initialY: 30,
    initialScale: 0.98,
    triggerStart: "top 80%",
    triggerEnd: "bottom 20%",
    delay: 100,
  },
} as const;

export default function NFTGrid(props: Props): JSX.Element {
  const { campaign, immediateAnimation = false } = props;
  const { t } = useTranslation();
  const isLoading = useContext(LoadingContext);
  const pageAnimationReady = useContext(PageAnimationContext);
  const [canAnimate, setCanAnimate] = useState(false);
  const { campaignsLoading } = useStore();

  // Refs for animations
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tableRef = useRef<HTMLDivElement>(null);

  // Track if animation has been initialized to prevent re-triggering
  const animationInitializedRef = useRef(false);

  // Check if we're on mobile using CSS media query approach
  const [isMobile, setIsMobile] = useState(false);

  // Handle mobile detection using ResizeObserver for better performance
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");

    const handleResize = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
    };

    // Set initial state
    handleResize(mediaQuery);

    // Add listener
    mediaQuery.addEventListener("change", handleResize);

    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, []);

  // Handle loading state change
  useEffect(() => {
    if (pageAnimationReady || !isLoading) {
      const delay = immediateAnimation ? 0 : 1500; // Usar delay inmediato si se especifica
      console.log(
        `NFTGrid: Configurando animación con delay ${delay}ms (immediateAnimation: ${immediateAnimation})`
      );

      const timer = setTimeout(() => {
        setCanAnimate(true);
      }, delay);

      return () => clearTimeout(timer);
    } else {
      setCanAnimate(false);
    }
  }, [isLoading, pageAnimationReady, immediateAnimation]);

  // Reset animation state when campaign changes
  useEffect(() => {
    cardRefs.current = [];
    animationInitializedRef.current = false;

    // Clean up ScrollTrigger instances
    ScrollTrigger.getAll().forEach((trigger) => {
      if (trigger.vars.trigger === sectionRef.current) {
        trigger.kill();
      }
    });
  }, [campaign]);

  // Optimized animation setup function
  const setupAnimation = useCallback(() => {
    if (!canAnimate || !sectionRef.current || animationInitializedRef.current)
      return;

    // Get configuration based on device type
    const config = isMobile
      ? ANIMATION_CONFIG.mobile
      : ANIMATION_CONFIG.desktop;

    // Validate required DOM elements
    const requiredElements = [
      titleRef.current,
      descriptionRef.current,
      tableRef.current,
    ];
    if (requiredElements.some((el) => !el)) {
      return;
    }

    // Validate card refs
    const validCardRefs = cardRefs.current.filter(Boolean);
    if (validCardRefs.length === 0) {
      return;
    }

    // Mark as initialized
    animationInitializedRef.current = true;

    // Set initial states
    gsap.set([titleRef.current, descriptionRef.current], {
      opacity: 0,
      y: config.initialY,
    });

    gsap.set(validCardRefs, {
      opacity: 0,
      y: config.initialY,
      scale: config.initialScale,
    });

    gsap.set(tableRef.current, {
      opacity: 0,
      y: config.initialY * 0.6,
    });

    // Create timeline with optimized ScrollTrigger
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: config.triggerStart,
        end: config.triggerEnd,
        toggleActions: "play none none reverse",
        // Performance optimizations
        fastScrollEnd: true,
        preventOverlaps: true,
      },
    });

    // Animate elements with proper staggering
    timeline
      .to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: config.duration,
        ease: config.ease,
      })
      .to(
        descriptionRef.current,
        {
          opacity: 1,
          y: 0,
          duration: config.duration,
          ease: config.ease,
        },
        `-=${config.duration * 0.75}`
      )
      .to(
        validCardRefs,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: config.duration,
          stagger: config.stagger,
          ease: config.ease,
        },
        `-=${config.duration * 0.5}`
      )
      .to(
        tableRef.current,
        {
          opacity: 1,
          y: 0,
          duration: config.duration,
          ease: config.ease,
        },
        `-=${config.duration * 0.25}`
      );

    // Refresh ScrollTrigger
    ScrollTrigger.refresh();
  }, [canAnimate, campaign, isMobile]);

  // Handle animation setup with proper timing
  useEffect(() => {
    if (canAnimate && campaign?.collections?.length > 0 && !campaignsLoading) {
      const config = isMobile
        ? ANIMATION_CONFIG.mobile
        : ANIMATION_CONFIG.desktop;

      const timer = setTimeout(() => {
        setupAnimation();
      }, config.delay);

      return () => clearTimeout(timer);
    }
  }, [canAnimate, campaign, campaignsLoading, setupAnimation, isMobile]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === sectionRef.current) {
          trigger.kill();
        }
      });
    };
  }, []);

  // Optimized useGSAP implementation
  useGSAP(
    () => {
      if (
        !sectionRef.current ||
        !canAnimate ||
        !campaign?.collections?.length ||
        campaignsLoading
      ) {
        return;
      }

      // Validate all required elements
      const requiredElements = [
        titleRef.current,
        descriptionRef.current,
        tableRef.current,
      ];
      if (requiredElements.some((el) => !el)) {
        return;
      }

      const validCardRefs = cardRefs.current.filter(Boolean);
      if (validCardRefs.length === 0) {
        return;
      }

      // On mobile, start animation immediately
      if (isMobile) {
        setupAnimation();
        return;
      }

      // On desktop, wait for images to load for smoother experience
      const imageElements = validCardRefs
        .map((ref) => ref?.querySelector("img"))
        .filter(Boolean);
      const allImagesLoaded = imageElements.every(
        (img) => (img as HTMLImageElement).complete
      );

      if (allImagesLoaded) {
        setupAnimation();
      } else {
        // Wait for images to load
        Promise.all(
          imageElements.map((img) => {
            return new Promise<void>((resolve) => {
              if ((img as HTMLImageElement).complete) {
                resolve();
              } else {
                (img as HTMLImageElement).onload = () => resolve();
                (img as HTMLImageElement).onerror = () => resolve();
              }
            });
          })
        ).then(() => {
          setupAnimation();
        });
      }
    },
    {
      scope: sectionRef,
      dependencies: [canAnimate, campaign, campaignsLoading, isMobile],
    }
  );

  // Early return if data is not ready or animation not ready
  if (
    !campaign ||
    !campaign.collections ||
    campaign.collections.length === 0 ||
    campaignsLoading ||
    !canAnimate
  ) {
    return (
      <section
        ref={sectionRef}
        className="relative w-full background-gradient-dark mt-0 scroll-container"
        aria-labelledby="nft-grid-title"
      >
        <div className="max-w-[120rem] mx-auto px-[clamp(1.5rem,5vw,6.25rem)] py-24">
          {/* Renderizar contenido vacío sin loader */}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative w-full background-gradient-dark mt-0 scroll-container"
      aria-labelledby="nft-grid-title"
    >
      <div className="max-w-[120rem] mx-auto px-[clamp(1.5rem,5vw,6.25rem)] py-24">
        {/* Header section */}
        <div className="flex flex-col md:flex-row items-start justify-between responsive-gap w-full mb-[2.5rem]">
          <h2
            ref={titleRef}
            id="nft-grid-title"
            className="heading-2 text-light max-w-[40.9375rem]"
          >
            <span
              dangerouslySetInnerHTML={{ __html: t("mainPage.nftGrid.title") }}
            />
          </h2>
          <p ref={descriptionRef} className="body-M text-light max-w-[35rem]">
            {t("mainPage.nftGrid.description")}
          </p>
        </div>

        {/* NFT Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          role="list"
          aria-label={t("mainPage.nftGrid.title")}
        >
          {/* NFT Card */}
          {campaign.collections.map((collection, idx) => (
            <div key={collection.id} ref={(el) => (cardRefs.current[idx] = el)}>
              <CollectionCard
                collection={collection}
                campaign={campaign}
                variant="grid"
              />
            </div>
          ))}
        </div>

        {/* NFT Table */}
        <div ref={tableRef} className="overflow-x-auto mt-16">
          <ComparisonCards campaign={campaign} />
        </div>
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block align-middle"
    >
      <rect width="20" height="20" rx="4" fill="#D57300" />
      <path
        d="M6 10.5L9 13.5L14 8.5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EmptyCheckIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block align-middle"
    >
      <rect
        width="20"
        height="20"
        rx="4"
        fill="#1c3625"
        stroke="#D57300"
        strokeWidth="2"
      />
    </svg>
  );
}
