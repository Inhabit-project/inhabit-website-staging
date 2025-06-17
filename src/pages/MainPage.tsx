import React, { useRef, useEffect } from "react";
import Menu from "../components/Menu";
import Hero from "../components/Hero";
import Video from "../components/Video";
import Hubs from "../components/Hubs";
import StewardshipNFT from "../components/StewardshipNFT";
import Highlight from "../components/Highlight";
import Photo from "../components/Photo";
import PhotoGallery from "../components/PhotoGallery";
import NFTGrid from "../components/NFTGrid";
import Infographic from "../components/Infographic";
import Testimonials from "../components/Testimonials";
import CTA from "../components/CTA";
import Blog from "../components/Blog";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";
import { scrollManager } from "../utils/scrollManager";
import { useStore } from "../store";

const campaignId = 1;

const MainPage: React.FC = () => {
  const { getCampaign } = useStore();
  const videoSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getCampaign(campaignId);

    if (scrollManager && typeof scrollManager.update === "function") {
      setTimeout(() => {
        scrollManager.update();
      }, 200);
    }
  }, []);

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only absolute top-2 left-2 bg-white text-black p-2 z-50 rounded"
      >
        Skip to main content
      </a>
      <Menu />
      <main id="main-content" tabIndex={-1} role="main">
        <section aria-label="Hero section">
          <Hero scrollToRef={videoSectionRef} />
        </section>
        <section aria-label="Video section" ref={videoSectionRef}>
          <Video />
        </section>
        <section aria-label="Hubs section">
          <Hubs />
        </section>
        <section aria-label="Stewardship NFT section">
          <StewardshipNFT />
        </section>
        <section aria-label="Highlight section">
          <Highlight />
        </section>
        <section aria-label="Photo section">
          <Photo />
        </section>
        <section aria-label="NFT Grid section">
          <NFTGrid />
        </section>
        <section aria-label="Infographic section">
          <Infographic />
        </section>
        <section aria-label="Testimonials section">
          <Testimonials />
        </section>
        <section aria-label="Call to action section">
          <CTA />
        </section>
        <section aria-label="Blog section">
          <Blog />
        </section>
        <section aria-label="FAQ section">
          <FAQ />
        </section>
      </main>
      <Footer />
    </>
  );
};

export default MainPage;
