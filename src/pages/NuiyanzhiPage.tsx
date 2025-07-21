import { JSX, useEffect, useRef } from "react";
import Menu from "../components/Menu";
import InternalPagesHero from "../components/InternalPagesHero";
import InfoCard, { InfoCardRightImage } from "../components/InfoCard";
import FAQ, { FAQWhite } from "../components/FAQ";
import NFTGrid from "../components/NFTGrid";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";
import ImageSection from "../components/ImageSection";
import { NatureSpinner } from "@/ui/Loader";
import { useStore } from "@/store";
import { Helmet } from "react-helmet-async";

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

  useEffect(() => {
    if (onPageReady) onPageReady();
  }, [onPageReady]);

  return (
    <>
      <Helmet>
        <title>
          {t("nuiyanzhiPage.seoTitle") || "Ñuiyanzhi Hub | INHABIT"}
        </title>
        <meta
          name="description"
          content={
            t("nuiyanzhiPage.seoDescription") ||
            t("nuiyanzhiPage.imageSection.eyebrow")
          }
        />
        <meta
          property="og:title"
          content={t("nuiyanzhiPage.seoTitle") || "Ñuiyanzhi Hub | INHABIT"}
        />
        <meta
          property="og:description"
          content={
            t("nuiyanzhiPage.seoDescription") ||
            t("nuiyanzhiPage.imageSection.eyebrow")
          }
        />
        <meta property="og:image" content="/assets/1Hub/vision.webp" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <Menu />
      {/* Internal Hero Section - custom for Nuiyanzhi */}
      <InternalPagesHero
        variant="nuiyanzhi"
        onHeroImageLoad={onHeroImageLoad}
        // Optionally, you can extend InternalPagesHero to accept custom props for this hub
      />

      {/* Image Section: Nuiyanzhi Vision */}
      <ImageSection
        eyebrow={t("nuiyanzhiPage.imageSection.eyebrow")}
        heading={
          <span
            dangerouslySetInnerHTML={{
              __html: t("nuiyanzhiPage.imageSection.heading"),
            }}
          />
        }
        imageSrc="/assets/1Hub/vision.webp"
        imageAlt="Nuiyanzhi Vision"
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
        logoSrc="/assets/logo.svg"
        logoAlt="INHABIT Logo"
      />

      {/* Section: The Guardians (InfoCardRightImage) */}
      <InfoCardRightImage
        title={t("nuiyanzhiPage.guardians.title")}
        text={t("nuiyanzhiPage.guardians.text")}
        imageSrc="/assets/1Hub/guardians.webp"
        imageAlt={t("nuiyanzhiPage.guardians.imageAlt")}
        logoSrc="/assets/logo.svg"
        logoAlt="INHABIT Logo"
      />

      {/* Section: The Land (InfoCard) */}
      <InfoCard
        title={t("nuiyanzhiPage.land.title")}
        text={t("nuiyanzhiPage.land.text")}
        imageSrc="/assets/1Hub/land.webp"
        showPopupButton={true}
        logoSrc="/assets/logo.svg"
        logoAlt="INHABIT Logo"
      />

      <section aria-label="Available NFTs" ref={nftGridRef}>
        {campaignsLoading && <NatureSpinner />}

        {!campaignsLoading &&
          (campaigns.length === 0 ? (
            <p className="text-lg text-gray-500">No campaigns available.</p>
          ) : (
            campaigns.map((campaign) => (
              <NFTGrid key={campaign.id} campaign={campaign} />
            ))
          ))}
      </section>
      {/* Section: FAQ */}
      <FAQ
        faqItems={
          t("nuiyanzhiPage.faq.items", { returnObjects: true }) as any[]
        }
      />
      <Footer />
    </>
  );
}
