import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Collection } from "@/models/collection.model";
import { Campaign } from "@/models/campaign.model";

interface CollectionCardProps {
  collection: Collection;
  campaign: Campaign;
  variant?: "grid" | "slider";
  className?: string;
  onClick?: () => void;
  skipTransition?: boolean;
}

export default function CollectionCard({
  collection,
  campaign,
  variant = "grid",
  className = "",
  onClick,
  skipTransition = false,
}: CollectionCardProps): JSX.Element {
  const { t } = useTranslation();

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  // Responsive classes based on variant
  const containerClasses = variant === "slider" 
    ? "relative min-w-[75vw] sm:min-w-[60vw] md:min-w-[50vw] max-w-xs snap-center lg:min-w-0 lg:max-w-xs lg:snap-none p-5 sm:p-6 lg:p-8"
    : "relative p-5 sm:p-6 lg:p-8";

  const titleClasses = variant === "slider"
    ? "text-[1.75rem] sm:text-[1.875rem] lg:text-[2rem] font-montserrat text-center text-white"
    : "text-[2rem] font-montserrat text-center text-white";

  const priceClasses = variant === "slider"
    ? "text-[2.5rem] sm:text-[2.75rem] lg:text-[3rem] leading-none font-abel text-center text-white tracking-[-2px]"
    : "text-[3rem] leading-none font-abel text-center text-white tracking-[-2px]";

  const descriptionClasses = variant === "slider"
    ? "text-[0.9375rem] sm:text-[0.96875rem] lg:text-[1rem] text-center text-green-soft tracking-[-2.5%]"
    : "text-[1rem] text-center text-green-soft tracking-[-2.5%]";

  const buttonClasses = variant === "slider"
    ? "btn-primary-nfocus w-full flex items-center justify-center text-sm sm:text-base py-3 sm:py-4"
    : "btn-primary w-full flex items-center justify-center group";

  const iconSize = 24;

  return (
    <div
      className={`${containerClasses} ${className}`}
      style={{
        background: "var(--color-bright-green)",
        borderRadius: "var(--radius-lg)",
      }}
      role="listitem"
    >
      {/* Top-right icon */}
      <div className="absolute top-4 right-4 hover-scale-up">
        <Link
          to={`/membership/${collection.campaignId}/${collection.id}`}
          state={{ 
            campaign, 
            collection, 
            skipTransition 
          }}
          onMouseUp={(e) => e.currentTarget.blur()}
          onClick={handleClick}
          className="block"
          aria-label={t("mainPage.nftGrid.checkoutNFT", "Checkout NFT")}
        >
          <div className="bg-white/20 backdrop-blur-2xl rounded-[var(--radius-3xl)] p-1 border">
            <svg
              width={iconSize}
              height={iconSize}
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

      {/* Background overlay */}
      <div
        className="absolute inset-0 rounded-[var(--radius-lg)] opacity-80"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative flex flex-col items-end gap-4">
        <div className="w-full flex flex-col gap-4">
          {/* Title */}
          <h3 className={titleClasses}>
            {collection.symbol}
          </h3>

          {/* Image */}
          <div className="relative w-full flex justify-center">
            <div
              className="aspect-square rounded-[var(--radius-md)] overflow-hidden border border-white/15 flex items-center justify-center"
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

          {/* Price and description */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              <p className={priceClasses}>
                {`$ ${collection.price} USD`}
              </p>
            </div>
            <p className={descriptionClasses}>
              {collection.availableSupply}{" "}
              {t("mainPage.nftGrid.availableMembership")}
            </p>
          </div>

          {/* Button */}
          <Link
            to={`/membership/${collection.campaignId}/${collection.id}`}
            state={{ 
              campaign, 
              collection, 
              skipTransition 
            }}
            onMouseUp={(e) => e.currentTarget.blur()}
            onClick={handleClick}
            className={buttonClasses}
            aria-label={t("mainPage.nftGrid.checkoutNFT", "Checkout NFT")}
          >
            {variant === "slider" ? (
              <span>{t("mainPage.nftGrid.checkThisNFT")}</span>
            ) : (
              <span className="button-text group-hover:text-secondary transition-colors duration-300">
                {t("mainPage.nftGrid.checkThisNFT")}
              </span>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
} 