import { useRef, useEffect } from "react";
import Menu from "../components/Menu";
import Hero from "../components/Hero";
import Video from "../components/Video";
import Hubs from "../components/Hubs";
import StewardshipNFT from "../components/StewardshipNFT";
import Highlight from "../components/Highlight";
import Photo from "../components/Photo";
import NFTGrid from "../components/NFTGrid";
import Infographic from "../components/Infographic";
import Testimonials from "../components/Testimonials";
import CTA from "../components/CTA";
import Blog from "../components/Blog";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";
import { scrollManager } from "../utils/scrollManager";
import { useStore } from "../store";
import  { NatureSpinner } from "../ui/Loader";


interface Props {
  onPageReady?: () => void;
  onHeroImageLoad?: () => void;
}

 function MainPage(props: Props) {
  const { onHeroImageLoad, onPageReady } = props;
 const { campaigns, campaignsLoading, getCampaigns } = useStore();
  const videoSectionRef = useRef<HTMLElement>(null as unknown as HTMLElement);

  useEffect(() => {
    getCampaigns();

    if (scrollManager && typeof scrollManager.update === "function") {
      setTimeout(() => {
        scrollManager.update();
        if (onPageReady) onPageReady();
      }, 200);
    } else {
      if (onPageReady) onPageReady();
    }
  }, [onPageReady]);

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
        <section className="no-scroll-snap" aria-label="Hero section">
          <Hero scrollToRef={videoSectionRef} onHeroImageLoad={onHeroImageLoad} />
        </section>
        <section aria-label="Video section" className="scroll-container" ref={videoSectionRef}>
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
          {campaignsLoading && <NatureSpinner />}

          {!campaignsLoading &&
            (campaigns.length === 0 ? (
              // TODO: improve this message
              <p className="text-lg text-gray-500">No campaigns available.</p>
            ) : (
              campaigns.map((campaign) => (
                <NFTGrid key={campaign.id} campaign={campaign} />
              ))
            ))}
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
