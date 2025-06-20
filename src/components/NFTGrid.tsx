import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useStore } from "../store";
import { Collection } from "src/models/collection.model";

const NFTGrid: React.FC = () => {
  const { t } = useTranslation();

  const { campaign, campaignLoading } = useStore();

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
          {/* TODO: Add spinner */}
          {campaignLoading
            ? "Is loading..."
            : campaign?.collections.map(
                (collection: Collection, index: number) => (
                  <div
                    key={index}
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
                )
              )}
          {/* Repeat for other NFTs */}
        </div>
        {/* NFT Table (from Figma) */}
        <div className="overflow-x-auto mt-16">
          <table
            className="min-w-full border-separate border-spacing-0 text-left text-light bg-[#1c3625]/80 rounded-2xl"
            aria-label={t(
              "mainPage.nftGrid.comparisonTable",
              "NFT Comparison Table"
            )}
          >
            <thead>
              <tr>
                <th
                  className="px-6 py-3 font-bold text-lg align-bottom bg-transparent border border-white"
                  rowSpan={2}
                ></th>
                <th
                  className="px-6 py-3 font-bold text-lg text-center border border-white bg-[#1a2b14] text-white"
                  colSpan={2}
                >
                  TITÍ
                </th>
                <th
                  className="px-6 py-3 font-bold text-lg text-center border border-white bg-[#1a2b14] text-white"
                  colSpan={2}
                >
                  PAUJIL
                </th>
                <th
                  className="px-6 py-3 font-bold text-lg text-center border border-white bg-[#1a2b14] text-white"
                  colSpan={2}
                >
                  CARACOLÍ
                </th>
                <th
                  className="px-6 py-3 font-bold text-lg text-center border border-white bg-[#1a2b14] text-white"
                  colSpan={2}
                >
                  JAGUAR
                </th>
              </tr>
              <tr>
                <th className="px-4 py-2 text-center font-bold border border-white text-white bg-transparent">
                  MINIMUM
                  <br />
                  FUNDRAISE
                </th>
                <th className="px-4 py-2 text-center font-bold border border-white text-white bg-transparent">
                  FULL
                  <br />
                  FUNDRAISE
                </th>
                <th className="px-4 py-2 text-center font-bold border border-white text-white bg-transparent">
                  MINIMUM
                  <br />
                  FUNDRAISE
                </th>
                <th className="px-4 py-2 text-center font-bold border border-white text-white bg-transparent">
                  FULL
                  <br />
                  FUNDRAISE
                </th>
                <th className="px-4 py-2 text-center font-bold border border-white text-white bg-transparent">
                  MINIMUM
                  <br />
                  FUNDRAISE
                </th>
                <th className="px-4 py-2 text-center font-bold border border-white text-white bg-transparent">
                  FULL
                  <br />
                  FUNDRAISE
                </th>
                <th className="px-4 py-2 text-center font-bold border border-white text-white bg-transparent">
                  MINIMUM
                  <br />
                  FUNDRAISE
                </th>
                <th className="px-4 py-2 text-center font-bold border border-white text-white bg-transparent">
                  FULL
                  <br />
                  FUNDRAISE
                </th>
              </tr>
            </thead>
            <tbody>
              {/* LAND RIGHTS */}
              <tr className="bg-white/5">
                <td
                  className="px-6 py-4 font-bold border border-white"
                  colSpan={9}
                >
                  LAND RIGHTS
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 border border-white">
                  Life-long Membership & Stewardship
                  <br />
                  <span className="text-xs font-normal">
                    You gain lifelong stewardship and utility rights over a
                    tokenized real-world land.
                  </span>
                </td>
                {Array(8)
                  .fill(0)
                  .map((_, i) => (
                    <td
                      key={i}
                      className="px-4 py-4 text-center border border-white"
                    >
                      {CheckIcon()}
                    </td>
                  ))}
              </tr>
              <tr>
                <td className="px-6 py-4 border border-white">
                  Legal Protector of the land
                  <br />
                  <span className="text-xs font-normal">
                    You become part of the legal system of guarantee that
                    recognizes Nature as a subject with rights on a specific
                    land related to this membership, in line with the
                    Declaration of the Rights of Nature and Biocultural
                    principles.
                  </span>
                </td>
                {Array(8)
                  .fill(0)
                  .map((_, i) => (
                    <td
                      key={i}
                      className="px-4 py-4 text-center border border-white"
                    >
                      {CheckIcon()}
                    </td>
                  ))}
              </tr>
              {/* GOVERNANCE RIGHTS */}
              <tr className="bg-white/5">
                <td
                  className="px-6 py-4 font-bold border border-white"
                  colSpan={9}
                >
                  GOVERNANCE RIGHTS
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 border border-white">
                  Inhabit DAO access
                  <br />
                  <span className="text-xs font-normal">
                    You receive governance rights over specific matters as a
                    land guarantor. You have a say in decisions regarding
                    unexpected changes in land use, shifts in Hub management, or
                    any unforeseen events that could alter the relationship
                    between stakeholders and the land or threaten the Rights of
                    Nature.
                  </span>
                </td>
                {[
                  CheckIcon(),
                  EmptyCheckIcon(),
                  CheckIcon(),
                  CheckIcon(),
                  CheckIcon(),
                  CheckIcon(),
                  CheckIcon(),
                  CheckIcon(),
                ].map((icon, i) => (
                  <td
                    key={i}
                    className="px-4 py-4 text-center border border-white"
                  >
                    {icon}
                  </td>
                ))}
              </tr>
              {/* ART RIGHTS */}
              <tr className="bg-white/5">
                <td
                  className="px-6 py-4 font-bold border border-white"
                  colSpan={9}
                >
                  ART RIGHTS
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 border border-white">
                  Badge of legal protector via exclusive ArtWork by{" "}
                  <span className="text-orange-400 font-bold">
                    Jeisson Castillo
                  </span>
                  <br />
                  <span className="text-xs font-normal">
                    Each ArtPiece represents a Migratory Floating Garden from
                    the HUB's ecosystem, featuring a native species vital to
                    that habitat and tied to levels of care in Kogui ancestral
                    thinking. The unique Art Badge symbolizes your legal
                    stewardship connection to a specific piece of land, which
                    you can use to travel and activate the corridor.
                  </span>
                </td>
                {Array(8)
                  .fill(0)
                  .map((_, i) => (
                    <td
                      key={i}
                      className="px-4 py-4 text-center border border-white"
                    >
                      {CheckIcon()}
                    </td>
                  ))}
              </tr>
              {/* MONITORING RIGHTS */}
              <tr className="bg-white/5">
                <td
                  className="px-6 py-4 font-bold border border-white"
                  colSpan={9}
                >
                  MONITORING RIGHTS
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 border border-white">
                  Impact Monitoring access via{" "}
                  <span className="text-orange-400 font-bold">MAP HERE</span>
                  <br />
                  <span className="text-xs font-normal">
                    Track the progress of the land you help protect through
                    real-time data mapping and geolocation narratives. Follow
                    the transformation of the land into a Biocultural hub. You
                    receive regular real-time data and impact reports,
                    geolocation, visual mapping, and key performance indicators
                    (KPIs) detailing progress in areas like tree planting,
                    biodiversity increase, and local community impact.
                  </span>
                </td>
                {[
                  CheckIcon(),
                  EmptyCheckIcon(),
                  CheckIcon(),
                  CheckIcon(),
                  CheckIcon(),
                  CheckIcon(),
                  CheckIcon(),
                  CheckIcon(),
                ].map((icon, i) => (
                  <td
                    key={i}
                    className="px-4 py-4 text-center border border-white"
                  >
                    {icon}
                  </td>
                ))}
              </tr>
              {/* UTILITY RIGHTS */}
              <tr className="bg-white/5">
                <td
                  className="px-6 py-4 font-bold border border-white"
                  colSpan={9}
                >
                  UTILITY RIGHTS
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 border border-white">
                  Free accommodation
                </td>
                {[
                  EmptyCheckIcon(),
                  EmptyCheckIcon(),
                  "1 day",
                  "1 day",
                  "2 days",
                  "3 days",
                  "3 days",
                  "4 days",
                ].map((val, i) => (
                  <td
                    key={i}
                    className="px-4 py-4 text-center border border-white"
                  >
                    {typeof val === "string" ? val : val}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 border border-white">Free meals</td>
                {[
                  EmptyCheckIcon(),
                  EmptyCheckIcon(),
                  "3 days",
                  "4 days",
                  "4 days",
                  "4 days",
                  "4 days",
                  "4 days",
                ].map((val, i) => (
                  <td
                    key={i}
                    className="px-4 py-4 text-center border border-white"
                  >
                    {typeof val === "string" ? val : val}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 border border-white">
                  Accommodation discount
                </td>
                {[
                  EmptyCheckIcon(),
                  "10%",
                  EmptyCheckIcon(),
                  "20%",
                  "20%",
                  "30%",
                  "20%",
                  "30%",
                ].map((val, i) => (
                  <td
                    key={i}
                    className="px-4 py-4 text-center border border-white"
                  >
                    {typeof val === "string" ? val : val}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 border border-white">Meal discount</td>
                {[
                  EmptyCheckIcon(),
                  "10%",
                  EmptyCheckIcon(),
                  "20%",
                  "20%",
                  "30%",
                  "20%",
                  "30%",
                ].map((val, i) => (
                  <td
                    key={i}
                    className="px-4 py-4 text-center border border-white"
                  >
                    {typeof val === "string" ? val : val}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 border border-white">
                  Discounted workshops
                </td>
                {[
                  EmptyCheckIcon(),
                  "1 workshop",
                  EmptyCheckIcon(),
                  "1 workshop",
                  "2 workshops",
                  "2 workshops",
                  "2 workshops + 1 personalized workshop",
                  "2 workshops + 2 personalized workshops",
                ].map((val, i) => (
                  <td
                    key={i}
                    className="px-4 py-4 text-center border border-white"
                  >
                    {typeof val === "string" ? val : val}
                  </td>
                ))}
              </tr>
              {/* EDUCATION RIGHTS */}
              <tr className="bg-white/5">
                <td
                  className="px-6 py-4 font-bold border border-white"
                  colSpan={9}
                >
                  EDUCATION RIGHTS
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 border border-white">
                  Access to educational contents
                  <br />
                  <span className="text-xs font-normal">
                    About inhabiting knowledge and techniques
                  </span>
                </td>
                {[
                  EmptyCheckIcon(),
                  "Basic level contents",
                  EmptyCheckIcon(),
                  "Basic level contents",
                  "Basic level contents",
                  "Medium level contents",
                  "Medium level contents",
                  "Full level contents",
                ].map((val, i) => (
                  <td
                    key={i}
                    className="px-4 py-4 text-center border border-white"
                  >
                    {typeof val === "string" ? val : val}
                  </td>
                ))}
              </tr>
              {/* ASSET RIGHTS */}
              <tr className="bg-white/5">
                <td
                  className="px-6 py-4 font-bold border border-white"
                  colSpan={9}
                >
                  ASSET RIGHTS
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 border border-white">
                  Future NFT upgrades
                  <br />
                  <span className="text-xs font-normal">
                    As an early backer, you are entitled to receive future
                    versions of the NFT for free, which will include additional
                    rights and benefits as the project evolves in the NFT 2.0
                    (conditional on development).
                  </span>
                </td>
                {[
                  CheckIcon(),
                  EmptyCheckIcon(),
                  CheckIcon(),
                  CheckIcon(),
                  CheckIcon(),
                  CheckIcon(),
                  CheckIcon(),
                  CheckIcon(),
                ].map((icon, i) => (
                  <td
                    key={i}
                    className="px-4 py-4 text-center border border-white"
                  >
                    {icon}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

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

export default NFTGrid;
