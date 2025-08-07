import { JSX, useEffect, useRef } from "react";
import Menu from "../components/Menu";
import InternalPagesHero from "../components/InternalPagesHero";
import InfoCard, { InfoCardRightImage } from "../components/InfoCard";
import FAQ, { FAQWhite } from "../components/FAQ";
import NFTGrid from "../components/NFTGrid";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";
import VideoSection from "../components/VideoSection";
import NuyanziCTA from "../components/NuyanziCTA";
import { useStore } from "@/store";
import SEOHead from "@/components/SEOHead";
import { scrollManager } from "../utils/scrollManager";

interface Props {
  onPageReady?: () => void;
  onHeroImageLoad?: () => void;
  scrollToSection?: string | null;
}

export default function NuiyanzhiPage(props: Props): JSX.Element {
  const { t } = useTranslation();

  // props
  const { onPageReady, onHeroImageLoad, scrollToSection } = props;

  // external hooks
  const { campaigns, campaignsLoading, getCampaigns } = useStore();

  // variables
  const nftGridRef = useRef<HTMLElement>(null);

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
        pageType="nuiyanzhiPage"
        customData={{
          image: "/assets/1Hub/vision.webp"
        }}
      />
      <Menu />
      <main id="main-content" role="main" tabIndex={-1}>
        <section className="hero" aria-label={t('sections.hero')}>
          {/* Internal Hero Section - custom for Nuiyanzhi */}
          <InternalPagesHero
            variant="nuiyanzhi"
            onHeroImageLoad={onHeroImageLoad}
            // Optionally, you can extend InternalPagesHero to accept custom props for this hub
          />
        </section>

        {/* Video Section: Nuiyanzhi Vision */}
        <VideoSection
          eyebrow={t("nuiyanzhiPage.imageSection.eyebrow")}
          heading={
            <span
              dangerouslySetInnerHTML={{
                __html: t("nuiyanzhiPage.imageSection.heading"),
              }}
            />
          }
          videoUrl="https://www.youtube.com/watch?v=YZEqU3EQu58&ab_channel=Inhabit"
          thumbnailSrc="/assets/nuiyanzhi-video.webp"
          thumbnailAlt="Nuiyanzhi Vision Video"
        />

        {/* Section: Four goals to be a HUB */}
        <FAQWhite
          title={t("nuiyanzhiPage.fourCriteria.title")}
          description={t("nuiyanzhiPage.fourCriteria.description")}
          faqItems={
            t("nuiyanzhiPage.fourCriteria.items", {
              returnObjects: true,
            }) as any[]
          }
        />

        {/* Section: The Vision (InfoCard) */}
        <InfoCard
          title={t("nuiyanzhiPage.vision.title")}
          text={t("nuiyanzhiPage.vision.text")}
          imageSrc="/assets/1Hub/vision.webp"
          imageAlt={t("nuiyanzhiPage.vision.imageAlt")}
        />

        {/* Section: The Guardians (InfoCardRightImage) */}
        <InfoCardRightImage
          title={t("nuiyanzhiPage.guardians.title")}
          text={t("nuiyanzhiPage.guardians.text")}
          imageSrc="/assets/1Hub/guardians.webp"
          imageAlt={t("nuiyanzhiPage.guardians.imageAlt")}
        />

        {/* Section: The Land (InfoCard) */}
        <InfoCard
          title={t("nuiyanzhiPage.land.title")}
          text={t("nuiyanzhiPage.land.text")}
          imageSrc="/assets/1Hub/land.webp"
          showPopupButton={true}
        />

        <section aria-label="Available NFTs" ref={nftGridRef}>
          {!campaignsLoading &&
            (campaigns.length === 0 ? (
                              <p className="text-lg text-gray-500">{t('common.noCampaignsAvailable')}</p>
            ) : (
              campaigns.map((campaign) => (
                <NFTGrid key={campaign.id} campaign={campaign} />
              ))
            ))}
        </section>
        {/* Section: CTA */}
        <NuyanziCTA />
        {/* Section: FAQ */}
        <FAQ
          faqItems={
            t("nuiyanzhiPage.faq.items", { returnObjects: true }) as any[]
          }
        />
      </main>
      <Footer />
    </>
  );
}
