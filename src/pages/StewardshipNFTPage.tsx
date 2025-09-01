import { JSX, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import Menu from "../components/Menu";
import InternalPagesHero from "../components/InternalPagesHero";
import CTA from "../components/CTA";
import Blog from "../components/blog/Blog";
import { FAQStewardshipNFT } from "../components/FAQ";
import Footer from "../components/Footer";
import ImageSection from "../components/ImageSection";
import StewardshipNFTBenefitsSection from "../components/StewardshipNFTBenefitsSection";
import Highlight from "../components/Highlight";
import NFTWorksSection from "../components/NFTWorksSection";
import FourCriteriaHubGlobal from "../components/FourCriteriaHubGlobal";
import NFTGrid from "../components/NFTGrid";
import { useStore } from "@/store";
import SEOHead from "@/components/SEOHead";
import { scrollManager } from "../utils/scrollManager";

interface Props {
  onPageReady?: () => void;
  onHeroImageLoad?: () => void;
  scrollToSection?: string | null;
}

export default function StewardshipNFTPage(props: Props): JSX.Element {
  const { t } = useTranslation();

  // props
  const { onPageReady, onHeroImageLoad, scrollToSection } = props;

  // external hooks
  const { campaigns, campaignsLoading, getCampaigns } = useStore();

  // variables
  const nftGridRef = useRef<HTMLElement>(null);

  // effects
  useEffect(() => {
    if (campaigns.length === 0) {
      getCampaigns();
    }
  }, []);

  useEffect(() => {
    // Only scroll to NFT grid if explicitly requested and not on initial page load
    if (
      scrollToSection === "nftGrid" &&
      nftGridRef.current &&
      !campaignsLoading &&
      campaigns.length > 0
    ) {
      // Add a delay to ensure hero section is properly loaded first
      setTimeout(() => {
        const offset = -100;
        const y =
          nftGridRef.current!.getBoundingClientRect().top +
          window.scrollY +
          offset;
        window.scrollTo({ top: y, behavior: "auto" });
      }, 500); // Delay to ensure hero section loads first
    }
  }, [scrollToSection, campaignsLoading, campaigns]);

  useEffect(() => {
    if (onPageReady) onPageReady();
  }, [onPageReady]);

  // Ensure page always starts at hero section
  useEffect(() => {
    if (!scrollToSection) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        if (scrollManager && typeof scrollManager.scrollToHero === "function") {
          scrollManager.scrollToHero({ immediate: true });
        } else {
          window.scrollTo({ top: 0, behavior: "auto" });
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [scrollToSection]);

  return (
    <>
      <SEOHead
        pageType="mainPage.stewardshipNFTPage"
        customData={{
          image: "/assets/nft-hero.jpg",
        }}
      />
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only absolute top-2 left-2 bg-white text-black p-2 z-50 rounded"
      >
        {t("common.skipToMainContent")}
      </a>
      <div className="min-h-screen background-gradient-light">
        <Menu />
        <main id="main-content" role="main" tabIndex={-1}>
          <section className="hero" aria-label={t("sections.hero")}>
            <InternalPagesHero
              variant="stewardship"
              onHeroImageLoad={onHeroImageLoad}
            />
          </section>
          <section aria-label={t("sections.stewardshipNFT")}>
            <ImageSection
              eyebrow={t("mainPage.stewardshipNFTPage.imageSection.eyebrow")}
              heading={
                <span
                  dangerouslySetInnerHTML={{
                    __html: t(
                      "mainPage.stewardshipNFTPage.imageSection.heading"
                    ),
                  }}
                />
              }
              imageSrc="/assets/power-nft.webp"
              imageAlt={t("mainPage.stewardshipNFTPage.imageSection.imageAlt")}
            />
          </section>
          <section aria-label={t("sections.stewardshipNFT")}>
            <StewardshipNFTBenefitsSection />
          </section>
          <section aria-label={t("sections.highlight")}>
            <Highlight />
          </section>
          <section aria-label={t("sections.stewardshipNFT")}>
            <NFTWorksSection />
          </section>
          <section aria-label={t("sections.faq")}>
            <FourCriteriaHubGlobal />
          </section>
          <section aria-label={t("sections.nftGrid")} ref={nftGridRef}>
            {!campaignsLoading &&
              (campaigns.length === 0 ? (
                <p className="text-lg text-gray-500">
                  {t("common.noCampaignsAvailable")}
                </p>
              ) : (
                campaigns.map((campaign) => (
                  <NFTGrid key={campaign.id} campaign={campaign} />
                ))
              ))}
          </section>
          <section aria-label={t("sections.blog")}>
            <Blog />
          </section>
          <section aria-label={t("sections.cta")}>
            <CTA />
          </section>
          <section aria-label={t("sections.faq")}>
            <FAQStewardshipNFT />
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
