import { JSX, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { useStore } from "@/store";
import SEOHead from "@/components/SEOHead";
import { useNavigate, useParams } from "react-router-dom";
import NFTGrid from "@/components/NFTGrid";
import Cookies from "js-cookie";
import { Hex, keccak256, toBytes } from "viem";
import { COOKIE_REFERRAL } from "@/config/const";

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

  // effects
  useEffect(() => {
    const validateSlugs = async () => {
      if (!referral) {
        setIsReferralValid(true);
        return;
      }

      const group = await inhabit.getGroup(Number(campaignId), referral as Hex);

      if (!group) {
        navigate("/404");
        return;
      }

      const hashedReferral = keccak256(toBytes(referral));

      const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000);

      Cookies.remove(COOKIE_REFERRAL, { path: "/" });

      Cookies.set(COOKIE_REFERRAL, hashedReferral, {
        expires: oneHourFromNow,
        path: "/",
        sameSite: "lax",
        secure: true,
      });

      setIsReferralValid(true);
    };

    validateSlugs();
  }, [campaignId, referral, navigate, inhabit]);

  useEffect(() => {
    const loadCampaign = async () => {
      if (!isReferralValid) return;
      if (campaigns.length === 0) {
        await getCampaigns();
      }
    };

    loadCampaign();
  }, [isReferralValid, campaigns.length, getCampaigns]);

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
