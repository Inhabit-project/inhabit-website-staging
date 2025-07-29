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
};

export default function NFTGrid(props: Props): JSX.Element {
  const { campaign } = props;
  const { t } = useTranslation();
  const isLoading = useContext(LoadingContext);
  const pageAnimationReady = useContext(PageAnimationContext);
  const [canAnimate, setCanAnimate] = useState(false);
  const { campaignsLoading } = useStore();

  // Refs for animations
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tableRef = useRef<HTMLDivElement>(null);
  
  // Handle loading state change
  useEffect(() => {
    // Allow animations when page is ready for animations OR when loader is not active
    if (pageAnimationReady || !isLoading) {
      const timer = setTimeout(() => {
        setCanAnimate(true);
      }, 1500);

      return () => clearTimeout(timer);
    } else {
      setCanAnimate(false);
    }
  }, [isLoading, pageAnimationReady]);

  // Reset card refs when campaign changes
  useEffect(() => {
    cardRefs.current = [];
  }, [campaign]);

  // Separate function to setup animation
  const setupAnimation = useCallback(() => {
    if (!canAnimate || !sectionRef.current) return;
    
    // Check if all required DOM elements are ready
    if (!titleRef.current || !descriptionRef.current || !tableRef.current) {
      return;
    }
    
    // Check if card refs are populated (they should match the number of collections)
    const validCardRefs = cardRefs.current.filter(Boolean);
    if (validCardRefs.length !== campaign.collections.length) {
      return;
    }
    
    // Set initial states
    gsap.set([titleRef.current, descriptionRef.current], {
      opacity: 0,
      y: 50,
    });
    gsap.set(cardRefs.current, {
      opacity: 0,
      y: 50,
      scale: 0.95,
    });
    gsap.set(tableRef.current, {
      opacity: 0,
      y: 30,
    });
    
    // Add a small delay to ensure everything is properly rendered
    setTimeout(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center",
          end: "center center",
          toggleActions: "play none none reverse",
        },
      });

      timeline
        .to(titleRef.current, {
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
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.6"
        )
        .to(
          cardRefs.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
          },
          "-=0.4"
        )
        .to(
          tableRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.4"
        );

      // Refresh ScrollTrigger to ensure it works on page refresh
      ScrollTrigger.refresh();
    }, 200); // Small delay to ensure DOM is fully rendered
  }, [canAnimate, campaign]);

  // Handle animation setup when dependencies change
  useEffect(() => {
    if (canAnimate && campaign && campaign.collections && campaign.collections.length > 0 && !campaignsLoading) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        setupAnimation();
      }, 100);
    }
  }, [canAnimate, campaign, campaignsLoading, setupAnimation]);

  // Set initial states and handle animations with useGSAP
  useGSAP(() => {
    if (!sectionRef.current) return;
    
    // Check if campaign data is ready and not loading
    if (!campaign || !campaign.collections || campaign.collections.length === 0 || campaignsLoading) {
      return;
    }
    
    // Check if all required DOM elements are ready
    if (!titleRef.current || !descriptionRef.current || !tableRef.current) {
      return;
    }
    
    // Check if card refs are populated (they should match the number of collections)
    const validCardRefs = cardRefs.current.filter(Boolean);
    if (validCardRefs.length !== campaign.collections.length) {
      return;
    }
    
    // Check if all collection images are loaded
    const imageElements = validCardRefs.map(ref => ref?.querySelector('img')).filter(Boolean);
    const allImagesLoaded = imageElements.every(img => (img as HTMLImageElement).complete);
    
    if (!allImagesLoaded) {
      // Wait for all images to load
      Promise.all(
        imageElements.map(img => {
          return new Promise<void>((resolve) => {
            if ((img as HTMLImageElement).complete) {
              resolve();
            } else {
              (img as HTMLImageElement).onload = () => resolve();
              (img as HTMLImageElement).onerror = () => resolve(); // Continue even if image fails
            }
          });
        })
      ).then(() => {
        // Retry animation setup after images are loaded
        setTimeout(() => {
          setupAnimation();
        }, 100);
      });
      return;
    }
    
    setupAnimation();
  }, { scope: sectionRef, dependencies: [canAnimate, campaign, campaign.collections, campaignsLoading] });

  // Early return if campaign data is not ready
  if (!campaign || !campaign.collections || campaign.collections.length === 0 || campaignsLoading) {
    return (
      <section
        ref={sectionRef}
        className="relative w-full background-gradient-dark mt-0 scroll-container"
        aria-labelledby="nft-grid-title"
      >
        <div className="max-w-[120rem] mx-auto px-[clamp(1.5rem,5vw,6.25rem)] py-24">
          <p className="text-lg text-gray-500">Loading NFT data...</p>
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
            <div
              key={collection.id}
              ref={el => (cardRefs.current[idx] = el)}
            >
              <CollectionCard
                collection={collection}
                campaign={campaign}
                variant="grid"
              />
            </div>
          ))}
        </div>
        {/* TODO: What do we do with this? */}
        {/* NFT Table (from Figma) */}
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
