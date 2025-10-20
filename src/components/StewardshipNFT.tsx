import React, { useRef, useContext } from "react";
import { useTranslation } from "react-i18next";
import { gsap, ScrollTrigger } from "../utils/gsap";
import { LoadingContext } from "../App";
import { useGSAP } from '@gsap/react';
import StewardshipNFTCard from "./StewardshipNFTCard";

// Register the hook to avoid React version discrepancies
gsap.registerPlugin(useGSAP);

const StewardshipNFT: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const isLoading = useContext(LoadingContext);

  // Initialize section animations with useGSAP
  useGSAP(() => {
    if (isLoading) return;
    const section = sectionRef.current;
    const title = titleRef.current;
    const description = descriptionRef.current;
    const image = imageRef.current;
    if (!section || !title || !description || !image) return;
    
    gsap.set([title, description], {
      opacity: 0,
      y: 50,
    });
    gsap.set(image, {
      opacity: 0,
      y: 100,
      scale: 0.95,
    });
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top center",
        end: "center center",
        toggleActions: "play none none reverse",
      },
    });
    
    tl.to(title, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
    })
      .to(
        description,
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
        },
        "-=0.6"
      )
      .to(
        image,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
        },
        "-=0.7"
      );
    
    ScrollTrigger.refresh();
  }, { scope: sectionRef, dependencies: [isLoading] });

  return (
    <section
      ref={sectionRef}
      className="relative w-full background-gradient-dark flex flex-col items-center min-h-screen"
    >
      <div className="relative z-10 w-full max-w-[120rem] mx-auto px-[clamp(1.5rem,5vw,6.25rem)] py-8 md:py-24 flex flex-col items-center justify-center min-h-full">
        {/* Stewardship NFT Card */}
        <StewardshipNFTCard />
      </div>
    </section>
  );
};

export default StewardshipNFT;
