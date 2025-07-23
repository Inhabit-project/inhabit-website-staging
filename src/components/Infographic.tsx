import React, { useRef, useLayoutEffect, useContext } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslation } from "react-i18next";
import { gsap, ScrollTrigger } from "../utils/gsap";
import { LoadingContext } from "../App";
import BiodiversityCard from "./BiodiversityCard";
import BiodiversityCardsSection from "./BiodiversityCardsSection";
import ImpactLegalInnovationCardsSection from "./ImpactLegalInnovationCardsSection";

const cardVariants = {
  hidden: { y: 100, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.2,
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
};

const cards = [
  {
    number: "001",
    title: "Biodiversity Hotspots",
    description:
      'Each HUB must generate and host a vast pool of biodiversity and living knowledge specific to a unique ecosystem, essential for navigating the challenges of our present times. These "living seed hubs" hosts an "inner corridor" within the land, connecting fragmented landscapes and serving as a refuge for endangered species.',
  },
  {
    number: "002",
    title: "Community Engagement",
    description:
      "Local communities are integral to the success of each HUB. Their traditional knowledge and active participation ensure the sustainable management and protection of these vital ecosystems.",
  },
  {
    number: "003",
    title: "Research & Education",
    description:
      "HUBs serve as living laboratories for scientific research and environmental education, fostering innovation and knowledge sharing for ecosystem restoration.",
  },
  {
    number: "004",
    title: "Sustainable Practices",
    description:
      "Implementing sustainable land management practices that balance ecological health with human needs, ensuring long-term viability of the ecosystems.",
  },
];

const Infographic: React.FC = () => {
  const { t } = useTranslation();
  const isLoading = useContext(LoadingContext);

  // Slide refs
  const slide1TitleRef = useRef<HTMLHeadingElement>(null);
  const slide1DescRef = useRef<HTMLParagraphElement>(null);
  const slide1ImgRef = useRef<HTMLImageElement>(null);
  const slide2TitleRef = useRef<HTMLHeadingElement>(null);
  const slide2DescRef = useRef<HTMLParagraphElement>(null);
  const slide2ImgRef = useRef<HTMLImageElement>(null);
  const slide3TitleRef = useRef<HTMLHeadingElement>(null);
  const slide3DescRef = useRef<HTMLParagraphElement>(null);
  const slide3ImgRef = useRef<HTMLImageElement>(null);
  const slide4TitleRef = useRef<HTMLHeadingElement>(null);
  const slide4DescRef = useRef<HTMLParagraphElement>(null);
  const slide4ImgRef = useRef<HTMLImageElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  // Initialize animations - matching exact working pattern from StewardshipNFT
  useLayoutEffect(() => {
    if (isLoading) return;
    
    const root = rootRef.current;
    if (!root) return;
    
    const ctx = gsap.context(() => {
      // Set initial states for all slides (only if elements exist)
      const allElements = [
        slide1TitleRef.current,
        slide1DescRef.current,
        slide1ImgRef.current,
        slide2TitleRef.current,
        slide2DescRef.current,
        slide2ImgRef.current,
        slide3TitleRef.current,
        slide3DescRef.current,
        slide3ImgRef.current,
        slide4TitleRef.current,
        slide4DescRef.current,
        slide4ImgRef.current,
      ].filter(Boolean); // Only include elements that exist

      const allImages = [
        slide1ImgRef.current,
        slide2ImgRef.current,
        slide3ImgRef.current,
        slide4ImgRef.current,
      ].filter(Boolean); // Only include images that exist

      // Set initial states for existing elements
      if (allElements.length > 0) {
        gsap.set(allElements, {
          opacity: 0,
          y: 50,
        });
      }

      if (allImages.length > 0) {
        gsap.set(allImages, {
          scale: 0.95,
        });
      }

      // Create timeline for Slide 1 (only if elements exist)
      const slide1Title = slide1TitleRef.current;
      const slide1Desc = slide1DescRef.current;
      const slide1Img = slide1ImgRef.current;
      if (slide1Title && slide1Desc && slide1Img) {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: slide1Title,
              start: "top 85%",
              end: "bottom 20%",
              toggleActions: "play none none none",
            },
          })
          .to(slide1Title, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          })
          .to(
            slide1Desc,
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
            "-=0.6"
          )
          .to(
            slide1Img,
            { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out" },
            "-=0.4"
          );
      }

      // Create timeline for Slide 2 (only if elements exist)
      const slide2Title = slide2TitleRef.current;
      const slide2Desc = slide2DescRef.current;
      const slide2Img = slide2ImgRef.current;
      if (slide2Title && slide2Desc && slide2Img) {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: slide2Title,
              start: "top 85%",
              end: "bottom 20%",
              toggleActions: "play none none none",
            },
          })
          .to(slide2Title, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          })
          .to(
            slide2Desc,
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
            "-=0.6"
          )
          .to(
            slide2Img,
            { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out" },
            "-=0.4"
          );
      }

      // Create timeline for Slide 3 (only if elements exist)
      const slide3Title = slide3TitleRef.current;
      const slide3Desc = slide3DescRef.current;
      const slide3Img = slide3ImgRef.current;
      if (slide3Title && slide3Desc && slide3Img) {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: slide3Title,
              start: "top 85%",
              end: "bottom 20%",
              toggleActions: "play none none none",
            },
          })
          .to(slide3Title, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          })
          .to(
            slide3Desc,
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
            "-=0.6"
          )
          .to(
            slide3Img,
            { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out" },
            "-=0.4"
          );
      }

      // Create timeline for Slide 4 (only if elements exist)
      const slide4Title = slide4TitleRef.current;
      const slide4Desc = slide4DescRef.current;
      const slide4Img = slide4ImgRef.current;
      if (slide4Title && slide4Desc && slide4Img) {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: slide4Title,
              start: "top 85%",
              end: "bottom 20%",
              toggleActions: "play none none none",
            },
          })
          .to(slide4Title, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          })
          .to(
            slide4Desc,
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
            "-=0.6"
          )
          .to(
            slide4Img,
            { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out" },
            "-=0.4"
          );
      }

      // Refresh ScrollTrigger after all timelines are set up
      ScrollTrigger.refresh();
    }, root);

    return () => {
      ctx.revert();
      // Additional cleanup to ensure ScrollTriggers are properly removed
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger && root.contains(trigger.trigger)) {
          trigger.kill();
        }
      });
    };
  }, [isLoading]); // Removed 't' dependency to prevent unnecessary re-runs

  return (
    <section
      ref={rootRef}
      className="relative w-full flex flex-col items-center background-gradient-light"
    >
      {/* Slide 1: Land Tenure Framework */}
      <div className="background-gradient-light w-full flex flex-col items-start justify-center px-[clamp(1.5rem,5vw,6.25rem)] py-24">
        <div className="flex flex-col md:flex-row items-start justify-between responsive-gap w-full mb-[2.5rem]">
          <h2
            ref={slide1TitleRef}
            className="heading-2 text-secondary max-w-[40.9375rem]"
          >
            <span
              dangerouslySetInnerHTML={{
                __html: t("mainPage.infographic.landTenureTitle"),
              }}
            />
          </h2>
          <p
            ref={slide1DescRef}
            className="body-M text-secondary max-w-[36rem]"
          >
            {t("mainPage.infographic.landTenureDescription")}
          </p>
        </div>
        <div className="self-center relative overflow-hidden">
          <img
            ref={slide1ImgRef}
            src="/assets/infographic-1.webp"
            alt="Land Tenure Framework Infographic"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
      {/* Slide 2: NFT Stewards */}
      <section className="py-24 background-gradient-light w-full flex flex-col lg:flex-row items-center justify-between gap-8 px-[clamp(1.5rem,5vw,6.25rem)] ">
        <div className="w-full lg:w-2/5 max-w-6xl flex flex-col ">
          <h2
            ref={slide2TitleRef}
            className="heading-2 text-secondary mb-6 font-bold"
            dangerouslySetInnerHTML={{
              __html: t("mainPage.infographic.nftStewardsTitle"),
            }}
          />
          <p ref={slide2DescRef} className="body-M text-secondary">
            {t("mainPage.infographic.nftStewardsDescription")}
          </p>
        </div>
        <div className="w-full lg:w-3/5 flex self-center justify-end">
          <div className="w-[43.75rem] ">
            <img
              ref={slide2ImgRef}
              src="/assets/stewards-illustration.webp"
              alt="NFT Stewards Illustration"
              className="w-full h-full object-contain"
              loading="lazy"
            />
          </div>
        </div>
      </section>
      {/* Slide 3: Nature */}
      <section className="py-24 background-gradient-light w-full flex flex-col lg:flex-row items-center justify-between gap-8 px-[clamp(1.5rem,5vw,6.25rem)] ">
        <div className="w-full lg:w-2/5 max-w-6xl flex flex-col justify-start">
          <h2
            ref={slide3TitleRef}
            className="heading-2 text-secondary mb-6 font-bold"
          >
            {t("mainPage.infographic.natureTitle")}
          </h2>
          <p ref={slide3DescRef} className="body-M text-secondary">
            {t("mainPage.infographic.natureDescription")}
          </p>
        </div>
        <div className="w-full lg:w-3/5 flex self-center justify-end">
          <div className="w-[43.75rem] ">
            <img
              ref={slide3ImgRef}
              src="/assets/nature-illustration.webp"
              alt="Nature Illustration"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </section>
      {/* Slide 4: Guardians */}
      <section className="py-24 background-gradient-light w-full flex flex-col lg:flex-row items-center justify-between gap-8 px-[clamp(1.5rem,5vw,6.25rem)] ">
        <div className="w-full lg:w-2/5 max-w-6xl flex flex-col">
          <h2
            ref={slide4TitleRef}
            className="heading-2 text-secondary mb-6 font-bold"
          >
            {t("mainPage.infographic.guardiansTitle")}
          </h2>
          <p ref={slide4DescRef} className="body-M text-secondary">
            {t("mainPage.infographic.guardiansDescription")}
          </p>
        </div>
        <div className="w-full lg:w-3/5 flex self-center justify-end">
          <div className="w-[43.75rem] ">
            <img
              ref={slide4ImgRef}
              src="/assets/guardians-illustration.webp"
              alt="Guardians Illustration"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </section>
      {/* New Impact Cards Section */}
      <ImpactLegalInnovationCardsSection />
    </section>
  );
};

export default Infographic;
