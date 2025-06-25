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
import Spinner from "../../ui/Loader";
// import { Modal } from "./_componets/Modal";

export default function Membership(): JSX.Element {
  // hooks
  const [collection, setCollection] = useState<Collection | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
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

      if (!group) {
        navigate("/404");
        return;
      }

      setIsReferralValid(true);
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

        if (Object.keys(loadedCampaign).length === 0) {
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
        setCampaign(loadedCampaign);
      }
    };

    load();
  }, [isReferralValid, state]);

  // TODO: See this logic, it seems to be a bit convoluted
  if (campaignLoading) return <Spinner />;
  if (!campaignLoading && !collection) return <Spinner />;

  return (
    <>
      <Menu />
      <div className="mt-8 w-full background-gradient-light flex flex-col lg:flex-row gap-8 px-4 py-12 lg:py-20 max-w-[1600px] mx-auto pb-24">
        <div className="flex-1 flex flex-col gap-8">
          <Info collection={collection!} />
          <OtherCollections collectionId={collectionId!} />
          <RightsTable rights={collection!.rights} />
        </div>
        <Checkout
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          membershipContract={collection!.membershipContract}
          price={collection!.price}
        />
        {/* {isModalOpen && (
          <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
        )} */}
      </div>
    </>
  );
}
