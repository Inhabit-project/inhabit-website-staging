import { JSX, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useStore } from "../../../store";
import { Collection } from "src/models/collection.model";
import SubLoader from "../../../load/SubLoader";
import { SCAN_URL } from "@/config/const";

type Props = {
  collectionId: string;
};

export default function OtherCollections(props: Props): JSX.Element {
  const { collectionId } = props;
  const { t } = useTranslation();
  const { campaign, campaignLoading } = useStore();

  const otherCollections = campaign?.collections.filter(
    (c: Collection) => c.id !== Number(collectionId)
  );

  if (campaignLoading) {
    return <SubLoader isLoading={true} />;
  }

  if (!otherCollections || otherCollections.length === 0) {
    return <></>;
  }

  return (
    <div
      className="flex flex-row items-center space-x-3 overflow-x-auto flex-nowrap scrollbar-hide snap-x snap-mandatory pl-4 md:pl-0 md:justify-center md:overflow-visible md:flex-wrap md:snap-none"
      style={{ WebkitOverflowScrolling: 'touch' }}
      role="list"
      aria-label={t("mainPage.nftGrid.title")}
    >
      {otherCollections?.map((collection: Collection, index: number) => (
        <div
          key={index}
          className="relative min-w-[80vw] max-w-xs snap-center md:min-w-0 md:max-w-xs md:snap-none"
          style={{
            background: "var(--color-bright-green)",
            borderRadius: "var(--radius-2xl)",
            padding: "2rem",
          }}
          role="listitem"
        >
          <div className="absolute top-4 right-4 hover-scale-up">
            <Link
              to={`/membership/${collection.campaignId}/${collection.id}`}
              state={{ campaign, collection, skipTransition: true }}
              onMouseUp={(e) => e.currentTarget.blur()}
            >
              <div className="bg-white/20 backdrop-blur-2xl rounded-[var(--radius-3xl)] p-1 border">
                <svg
                  width="35"
                  height="35"
                  viewBox="0 0 35 35"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M10.5039 24.543L24.4709 10.576"
                    stroke="#F6FFEA"
                    strokeWidth="2.01125"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10.5039 10.576L24.4709 10.576L24.4709 24.543"
                    stroke="#F6FFEA"
                    strokeWidth="2.01125"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </Link>
          </div>
          <div
            className="absolute inset-0 rounded-[var(--radius-2xl)] opacity-80"
            aria-hidden="true"
          />
          <div className="relative flex flex-col items-end gap-4">
            <div className="w-full flex flex-col gap-4">
              <h3 className="text-[2rem] font-montserrat text-center text-white">
                {collection.symbol}
              </h3>
              <div className="relative w-full flex justify-center">
                <div
                  className="aspect-[3/3] rounded-[var(--radius-md)] overflow-hidden border border-white/15 flex items-center justify-center"
                  style={{ width: "90%", height: "90%" }}
                >
                  <img
                    src={collection.image}
                    alt={collection.symbol}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4">
                  <p className="text-[3rem] leading-none font-abel text-center text-white tracking-[-2px]">
                    {`$ ${collection.price} USD`}
                  </p>
                </div>
                <p className="text-[1rem] text-center text-green-soft tracking-[-2.5%]">
                  {collection.availableSupply}{" "}
                  {t("mainPage.nftGrid.availableMembership")}
                </p>
              </div>
              <Link
                to={`/membership/${collection.campaignId}/${collection.id}`}
                state={{ campaign, collection, skipTransition: true }}
                onMouseUp={(e) => e.currentTarget.blur()}
                className="btn-primary-nfocus w-full flex items-center justify-center"
              >
                {t("mainPage.nftGrid.checkThisNFT")}
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
