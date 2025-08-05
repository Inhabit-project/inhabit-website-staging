import { useEffect, useState, JSX } from "react";
import Menu from "../../components/Menu";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Campaign } from "../../models/campaign.model";
import { Collection } from "../../models/collection.model";
import { useStore } from "../../store";
import RightsTable from "./_componets/RightsTable";
import { Info } from "./_componets/Info";
import OtherCollections from "./_componets/OtherCollections";
import Stepper from "./_componets/Stepper";
import { usePrivy } from "@privy-io/react-auth";

type Props = {
  onHeroImageLoad?: VoidFunction;
  onPageReady?: VoidFunction;
};

export default function Membership(props: Props): JSX.Element {
  // props
  const { onHeroImageLoad } = props;

  // hooks
  const [collection, setCollection] = useState<Collection | null>(null);
  const [isReferralValid, setIsReferralValid] = useState<boolean>(false);

  // external hooks
  const { ready } = usePrivy();
  const { campaignId, collectionId, referral } = useParams();
  const navigate = useNavigate();

  const state = useLocation().state as {
    collection?: Collection;
    campaign?: Campaign;
    skipTransition?: boolean;
  };

  const {
    campaignLoading,
    inhabit,
    getCampaign,
    setCampaign,
    setCollection: setCollectionStore,
  } = useStore();

  // effects
  useEffect(() => {
    if (Number.isNaN(campaignId) || Number.isNaN(collectionId)) {
      console.error("Invalid campaignId or collectionId, navigating to 404");
      navigate("/404");
    }
  }, [campaignId, collectionId]);

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
  }, [campaignId, collectionId, referral]);

  useEffect(() => {
    const loadCampaign = async () => {
      if (!isReferralValid) return;

      try {
        if (state?.collection && state?.campaign) {
          setCollection(state.collection);
          setCollectionStore(state.collection);
          setCampaign(state.campaign);
          return;
        }

        const loadedCampaign = await getCampaign(Number(campaignId));

        if (!loadedCampaign) {
          console.error("Campaign not found, navigating to 404");
          navigate("/404");
          return;
        }

        const found = loadedCampaign.collections.find(
          (c) => c.id === Number(collectionId)
        );

        if (!found) {
          console.error("Collection not found, navigating to 404");
          navigate("/404");
          return;
        }

        setCollection(found);
        setCollectionStore(found);
        setCampaign(loadedCampaign);
      } catch (error) {
        console.error("Error loading campaign data:", error);
        navigate("/404");
      }
    };

    loadCampaign();
  }, [isReferralValid, state, campaignId, collectionId]);

  useEffect(() => {
    if (!campaignLoading && collection && onHeroImageLoad) {
      onHeroImageLoad();
    }
  }, [campaignLoading, collection, onHeroImageLoad]);

  // Call onPageReady when data is loaded
  useEffect(() => {
    if (!campaignLoading && collection) {
      // Small delay to ensure everything is rendered
      const timer = setTimeout(() => {
        if (props.onPageReady) {
          props.onPageReady();
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [campaignLoading, collection, props.onPageReady]);

  // Fallback: if page doesn't load within 10 seconds, show error
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (campaignLoading) {
        console.error("Campaign loading timeout - page may be frozen");
      }
    }, 10000);
    return () => clearTimeout(fallbackTimer);
  }, [campaignLoading]);

  // Cleanup effect to ensure proper state reset
  useEffect(() => {
    return () => {};
  }, []);

  return (
    <>
      <Menu />
      {campaignLoading ? (
        <div className="mt-8 w-full background-gradient-light flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto mb-4"></div>
            <p className="text-secondary">Loading collection data...</p>
          </div>
        </div>
      ) : collection ? (
        <>
          <div className="mt-8 w-full background-gradient-light flex flex-col lg:flex-row gap-8 px-4 lg:py-20 max-w-[1600px] mx-auto ">
            <div className="flex-1 flex flex-col gap-8">
              <Info collection={collection} />
              <RightsTable rights={collection.rights} />
            </div>
            <Stepper
              availableSupply={collection.availableSupply}
              price={collection.price}
              membershipContract={collection.membershipContract}
            />
          </div>
          {/* Show OtherCollections after the stepper on mobile only */}
          <div className="block lg:hidden py-8 px-4">
            <OtherCollections collectionId={collectionId!} />
          </div>
          {/* Show OtherCollections only on desktop */}
          <div className="hidden lg:block px-4 lg:py-8">
            <OtherCollections collectionId={collectionId!} />
          </div>
        </>
      ) : (
        <div className="mt-8 w-full background-gradient-light flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <p className="text-secondary">No collection data available</p>
          </div>
        </div>
      )}
    </>
  );
}
