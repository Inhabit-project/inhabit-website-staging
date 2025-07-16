import { useRef, JSX } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ComparisonCards } from "./NFTComparison/ComparisonCards";
import { Campaign } from "@/models/campaign.model";

type Props = {
  campaign: Campaign;
};

export default function NFTGrid(props: Props): JSX.Element {
  const { campaign } = props;
  const { t } = useTranslation();
  const tableRef = useRef<HTMLDivElement>(null);

  return (
    <section
      className="relative w-full background-gradient-dark mt-0 scroll-container"
      aria-labelledby="nft-grid-title"
    >
      <div className="max-w-[120rem] mx-auto px-[clamp(1.5rem,5vw,6.25rem)] py-24">
        {/* Header section */}
        <div className="flex flex-col md:flex-row items-start justify-between responsive-gap w-full mb-[2.5rem]">
          <h2
            id="nft-grid-title"
            className="heading-2 text-light max-w-[40.9375rem]"
          >
            <span
              dangerouslySetInnerHTML={{ __html: t("mainPage.nftGrid.title") }}
            />
          </h2>
          <p className="body-M text-light max-w-[35rem]">
            {t("mainPage.nftGrid.description")}
          </p>
        </div>

        {/* NFT Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          role="list"
          aria-label={t("mainPage.nftGrid.title")}
        >
          {/* NFT Card */}
          {campaign.collections.map((collection) => (
            <div
              key={collection.id}
              className="relative"
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
                  state={{ campaign, collection }}
                  className="block"
                  aria-label={t(
                    "mainPage.nftGrid.checkoutNFT",
                    "Checkout TITI NFT"
                  )}
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
                      {/* TODO: Ask about score */}
                      {/* <div
                              className="flex justify-center items-center gap-3"
                              role="img"
                              aria-label={t(
                                "mainPage.nftGrid.rating",
                                "NFT Rating: 1 out of 4 stars"
                              )}
                            >
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                              >
                                <path
                                  d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                                  stroke="#DBEAB2"
                                  strokeWidth="0.45"
                                />
                              </svg>
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                              >
                                <path
                                  d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                                  stroke="#B6B6B6"
                                  strokeWidth="0.45"
                                />
                              </svg>
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                              >
                                <path
                                  d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                                  stroke="#B6B6B6"
                                  strokeWidth="0.45"
                                />
                              </svg>
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                              >
                                <path
                                  d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                                  stroke="#B6B6B6"
                                  strokeWidth="0.45"
                                />
                              </svg>
                            </div> */}
                    </div>
                    <p className="text-[1rem] text-center text-green-soft tracking-[-2.5%]">
                      {collection.availableSupply}{" "}
                      {t("mainPage.nftGrid.availableMembership")}
                    </p>
                  </div>
                  <Link
                    to={`/membership/${collection.campaignId}/${collection.id}`}
                    state={{ campaign, collection }}
                    className="btn-primary w-full flex items-center justify-center group"
                    aria-label={t(
                      "mainPage.nftGrid.checkoutNFT",
                      "Checkout TITI NFT"
                    )}
                  >
                    <span className="button-text group-hover:text-secondary transition-colors duration-300">
                      {t("mainPage.nftGrid.checkThisNFT")}
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* TODO: What do we do with this? */}
        {/* NFT Table (from Figma) */}
        <div ref={tableRef} className="overflow-x-auto mt-16">
          <ComparisonCards campaign={campaign} />
        </div>
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block align-middle"
    >
      <rect width="20" height="20" rx="4" fill="#D57300" />
      <path
        d="M6 10.5L9 13.5L14 8.5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EmptyCheckIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block align-middle"
    >
      <rect
        width="20"
        height="20"
        rx="4"
        fill="#1c3625"
        stroke="#D57300"
        strokeWidth="2"
      />
    </svg>
  );
}
