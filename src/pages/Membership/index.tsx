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

type Props = { onHeroImageLoad?: VoidFunction };

export default function Membership(props: Props): JSX.Element {
  // props
  const { onHeroImageLoad } = props;

  // hooks
  const [collection, setCollection] = useState<Collection | null>(null);
  const [isReferralValid, setIsReferralValid] = useState<boolean>(false);

  // external hooks
  const { campaignId, collectionId, referral } = useParams();
  const navigate = useNavigate();

  const state = useLocation().state as {
    collection?: Collection;
    campaign?: Campaign;
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
    if (Number.isNaN(campaignId) || Number.isNaN(collectionId))
      navigate("/404");
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

      if (state?.collection && state?.campaign) {
        setCollection(state.collection);
        setCollectionStore(state.collection);
        setCampaign(state.campaign);
        return;
      }

      const loadedCampaign = await getCampaign(Number(campaignId));

      if (!loadedCampaign) {
        navigate("/404");
        return;
      }

      const found = loadedCampaign.collections.find(
        (c) => c.id === Number(collectionId)
      );

      if (!found) {
        navigate("/404");
        return;
      }

      setCollection(found);
      setCollectionStore(found);
      setCampaign(loadedCampaign);
    };

    loadCampaign();
  }, [isReferralValid, state]);

  useEffect(() => {
    if (!campaignLoading && collection && onHeroImageLoad) {
      onHeroImageLoad();
    }
  }, [campaignLoading, collection, onHeroImageLoad]);

  return (
    <>
      <Menu />
      {collection && (
        <>
          <div className="mt-8 w-full background-gradient-light flex flex-col lg:flex-row gap-8 px-4 lg:py-20 max-w-[1600px] mx-auto ">
            <div className="flex-1 flex flex-col gap-8">
              <Info collection={collection} />
              <RightsTable rights={collection.rights} />
            </div>
            <Stepper
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
      )}
    </>
  );
}
