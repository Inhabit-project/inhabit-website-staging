import { JSX, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { useStore } from "@/store";
import SEOHead from "@/components/SEOHead";
import { useNavigate, useParams } from "react-router-dom";
import { scrollManager } from "@/utils/scrollManager";
import NFTGrid from "@/components/NFTGrid";

interface Props {
  onPageReady?: () => void;
  onHeroImageLoad?: () => void;
}

export default function LastestCampaign(props: Props): JSX.Element {
  const { t } = useTranslation();

  // props
  const { onPageReady } = props;

  // hooks
  const [isReferralValid, setIsReferralValid] = useState<boolean>(false);

  // external hooks
  const { campaignId, referral } = useParams();
  const navigate = useNavigate();

  const { campaigns, campaignsLoading, inhabit, getCampaigns } = useStore();

  // variables
  const nftGridRef = useRef<HTMLElement>(null);
  const nftGridItemRef = useRef<HTMLDivElement>(null);

  // effects
  useEffect(() => {
    const validateSlugs = async () => {
      if (!referral) {
        setIsReferralValid(true);
        return;
      }

      const group = await inhabit.getGroup(Number(campaignId), referral);

      if (!group) {
        navigate("/404");
        return;
      }

      setIsReferralValid(true);
    };

    validateSlugs();
  }, [campaignId, referral]);
  useEffect(() => {
    const loadCampaign = async () => {
      if (!isReferralValid) return;
      if (campaigns.length === 0) {
        await getCampaigns();
      }
    };

    loadCampaign();
  }, [isReferralValid]);

  useEffect(() => {
    // Posicionar directamente en el grid cuando hay referral y las campañas están listas
    if (
      !campaignsLoading &&
      campaigns.length > 0 &&
      referral &&
      isReferralValid &&
      nftGridItemRef.current
    ) {
      // Posicionar directamente sin animación suave
      setTimeout(() => {
        const offset = -80;
        const y =
          nftGridItemRef.current!.getBoundingClientRect().top +
          window.scrollY +
          offset;
        window.scrollTo({ top: y, behavior: "auto" });
      }, 100);
    }
  }, [campaignsLoading, campaigns.length, referral, isReferralValid]);

  useEffect(() => {
    if (onPageReady) onPageReady();
  }, [onPageReady]);

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
        <main id="main-content" role="main" tabIndex={-1}>
          <section aria-label={t("sections.nftGrid")} ref={nftGridRef}>
            {!campaignsLoading &&
              campaigns.map((campaign) => (
                <NFTGrid
                  key={campaign.id}
                  campaign={campaign}
                  immediateAnimation={true}
                />
              ))}
          </section>
        </main>
      </div>
    </>
  );
}
