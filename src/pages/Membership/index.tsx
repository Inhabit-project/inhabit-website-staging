import { useEffect, useState, JSX } from "react";
import Menu from "../../components/Menu";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Campaign } from "../../models/campaign.model";
import { Collection } from "../../models/collection.model";
import { useStore } from "../../store";
import { Checkout } from "./_componets/Checkout";
import RightsTable from "./_componets/RightsTable";
import { Info } from "./_componets/Info";
import OtherCollections from "./_componets/OtherCollections";

export default function Membership(): JSX.Element {
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

  const { campaignLoading, inhabit, getCampaign, setCampaign } = useStore();

  // effects
  useEffect(() => {
    const validateReferral = async () => {
      if (referral === undefined) {
        setIsReferralValid(true);
        return;
      }

      const group = await inhabit.getGroup(referral);

      if (group.referral !== referral || !group.state) {
        navigate("/404");
      } else {
        setIsReferralValid(true);
      }
    };

    validateReferral();
  }, [referral]);

  useEffect(() => {
    const load = async () => {
      if (!isReferralValid) return;

      if (state?.collection && state?.campaign) {
        setCollection(state.collection);
        setCampaign(state.campaign);
      } else if (campaignId && collectionId) {
        const loadedCampaign = await getCampaign(Number(campaignId));
        const found = loadedCampaign.collections.find(
          (c) => c.id === Number(collectionId)
        );

        setCollection(found || null);
      }
    };

    load();
  }, [isReferralValid, state]);

  return (
    <>
      {/* TODO: Add layout */}
      {/* TODO: Add spinner */}
      <Menu />
      {campaignLoading ? (
        "Is loading..."
      ) : collection && collectionId ? (
        <div className="mt-8 w-full background-gradient-light flex flex-col lg:flex-row gap-8 px-4 py-12 lg:py-20 max-w-[1600px] mx-auto pb-24">
          <div className="flex-1 flex flex-col gap-8">
            {/* TODO: add switch campaing collections */}
            {/* Membership Info */}
            <Info collection={collection} />
            {<OtherCollections collectionId={collectionId} />}
            {/* Membership Rights */}
            <RightsTable collection={collection} />
          </div>
          {/* Checkout Component */}
          <Checkout price={collection.price} />
        </div>
      ) : (
        // TODO: navigate to 404 page
        "Collection not found"
      )}
    </>
  );
}
