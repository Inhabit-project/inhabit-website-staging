import { JSX, useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "../../../store";
import { Collection } from "src/models/collection.model";
import SubLoader from "../../../load/SubLoader";
import { SCAN_URL } from "@/config/const";
import CollectionCard from "../../../components/CollectionCard";

type Props = {
  collectionId: string;
};

export default function OtherCollections(props: Props): JSX.Element {
  const { collectionId } = props;
  const { t } = useTranslation();
  const { campaign, campaignLoading } = useStore();

  console.log("OtherCollections - campaign:", campaign);
  console.log("OtherCollections - campaignLoading:", campaignLoading);
  console.log("OtherCollections - collectionId:", collectionId);

  const otherCollections = campaign?.collections.filter(
    (c: Collection) => c.id !== Number(collectionId)
  );

  console.log("OtherCollections - otherCollections:", otherCollections);

  if (campaignLoading) {
    console.log("OtherCollections - showing loader");
    return <SubLoader isLoading={true} />;
  }

  if (!otherCollections || otherCollections.length === 0) {
    console.log("OtherCollections - no collections to show");
    return <></>;
  }

  return (
    <div className="w-full max-w-[1600px] mx-auto">
      <div className="flex flex-col gap-8">
        <h2 className="heading-2 text-secondary max-w-[40.9375rem]">
          <span dangerouslySetInnerHTML={{ __html: t("mainPage.otherCollections.title") }} />
        </h2>
        <div
          className="flex flex-row items-center space-x-3 sm:space-x-4 overflow-x-auto flex-nowrap scrollbar-hide snap-x snap-mandatory pl-4 lg:pl-0 lg:justify-center lg:overflow-visible lg:flex-wrap lg:snap-none lg:space-x-6"
          style={{ WebkitOverflowScrolling: 'touch' }}
          role="list"
          aria-label={t("mainPage.nftGrid.title")}
        >
      {otherCollections?.map((collection: Collection, index: number) => (
        campaign && (
          <CollectionCard
            key={index}
            collection={collection}
            campaign={campaign}
            variant="slider"
            skipTransition={true}
            onClick={() => {
              console.log("OtherCollections - Card clicked for collection:", collection.id);
              console.log("OtherCollections - Navigating to:", `/membership/${collection.campaignId}/${collection.id}`);
              console.log("OtherCollections - Campaign data being passed:", campaign);
            }}
          />
        )
      ))}
        </div>
      </div>
    </div>
  );
}
