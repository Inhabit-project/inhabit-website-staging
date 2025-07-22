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
import { useStore } from "../store";
import { NatureSpinner } from "../ui/Loader";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

interface Props {
  onPageReady?: () => void;
  onHeroImageLoad?: () => void;
  scrollToSection?: string | null;
}

function MainPage(props: Props) {
  const { onHeroImageLoad, onPageReady, scrollToSection } = props;
  const { t } = useTranslation();

  const { campaigns, campaignsLoading, lastCampaign, getCampaigns } =
    useStore();
  const nftGridRef = useRef<HTMLElement>(null);
  const videoSectionRef = useRef<HTMLElement>(null as unknown as HTMLElement);

  useEffect(() => {
    getCampaigns();
    if (onPageReady) onPageReady();
  }, [onPageReady]);

  useEffect(() => {
    if (
      scrollToSection === "nftGrid" &&
      nftGridRef.current &&
      !campaignsLoading &&
      campaigns.length > 0
    ) {
      const offset = -100;
      const y =
        nftGridRef.current.getBoundingClientRect().top +
        window.scrollY +
        offset;

      window.scrollTo({ top: y, behavior: "auto" });
    }
  }, [scrollToSection, campaignsLoading, campaigns]);

  return (
    <>
      <Helmet>
        <title>{t("hero.title").replace(/<[^>]+>/g, "")} | INHABIT</title>
        <meta name="description" content={t("hero.description")} />
        <meta
          property="og:title"
          content={t("hero.title").replace(/<[^>]+>/g, "") + " | INHABIT"}
        />
        <meta property="og:description" content={t("hero.description")} />
        <meta property="og:image" content="/assets/hero.webp" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
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
          <Hero
            scrollToRef={videoSectionRef}
            onHeroImageLoad={onHeroImageLoad}
          />
        </section>
        <section
          aria-label="Video section"
          className="scroll-container"
          ref={videoSectionRef}
        >
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
        <section ref={nftGridRef} aria-label="NFT Grid section">
          {!campaignsLoading &&
            (!lastCampaign ? (
              // TODO: improve this message
              <p className="text-lg text-gray-500">No campaigns available.</p>
            ) : (
              <NFTGrid key={lastCampaign.id} campaign={lastCampaign} />
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
}

export default MainPage;
