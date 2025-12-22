import { JSX, useState, useEffect, useMemo } from "react";
import { Nft } from "@/models/nft.model";
import NftDetail from "./_componets/NftDetail";

type NftWithTransfered = Nft & {
  transfered: boolean;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  nfts: Nft[];
};

export function ViewAssetsModal(props: Props): JSX.Element {
  const { isOpen, onClose, nfts } = props;

  // states
  const [nftsTransfered, setNftsTransfered] = useState<NftWithTransfered[]>([]);
  const [selectedNft, setSelectedNft] = useState<Nft | null>(null);

  // effects
  /// set nfts transfered
  useEffect(() => {
    setNftsTransfered(
      nfts.map((nft) => ({
        ...nft,
        transfered: false,
      }))
    );
  }, [nfts]);

  /// Reset when modal closes - always show grid when opening
  useEffect(() => {
    if (!isOpen) {
      setSelectedNft(null);
    }
  }, [isOpen]);

  // functions
  /// handle nft transfered
  const handleNftTransferred = (nft: Nft) => {
    setNftsTransfered((prev) =>
      prev.map((item) =>
        item.contractAddress === nft.contractAddress &&
        item.tokenId === nft.tokenId
          ? { ...item, transfered: true }
          : item
      )
    );
    /// return to grid
    setSelectedNft(null);
  };

  if (!isOpen) return <></>;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-4xl mx-4 background-gradient-dark rounded-3xl border border-green-soft shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-green-soft/20 px-6 py-4 border-b border-green-soft/20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {selectedNft && (
              <button
                onClick={() => {
                  setSelectedNft(null);
                }}
                className=" text-light hover:text-[#D57300] transition-colors"
                aria-label="Back"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}
            <h2 className="heading-4 text-light font-semibold">
              {selectedNft ? selectedNft.name : "Your Digital Assets"}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center border border-white/20 transition-all"
            aria-label="Close"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-8 max-h-[80vh] overflow-y-auto">
          {/* ----------------------------- */}
          {/*       NFT DETAIL VIEW         */}
          {/* ----------------------------- */}
          {selectedNft ? (
            <NftDetail
              selectedNft={selectedNft}
              handleNftTransferred={handleNftTransferred}
            />
          ) : (
            /* ----------------------------- */
            /*         NFT GRID VIEW        */
            /* ----------------------------- */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {nftsTransfered.filter((nft) => !nft.transfered).length === 0 ? (
                <div className="col-span-2 text-center py-12">
                  <p className="body-M text-light/70">No NFTs detected.</p>
                </div>
              ) : (
                nftsTransfered
                  .filter((nft) => !nft.transfered)
                  .map((nft) => (
                    <button
                      key={`${nft.contractAddress}-${nft.tokenId}`}
                      onClick={() => setSelectedNft(nft)}
                      className="rounded-xl overflow-hidden border-[0.5px] border-green-soft bg-green-soft/10 hover:bg-green-soft/20 transition-all shadow-sm"
                    >
                      <div className="aspect-square">
                        <img
                          src={nft.imageUrl}
                          alt={nft.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4 flex flex-col gap-1">
                        <h3 className="body-M text-light font-medium">
                          {nft.name}
                        </h3>
                        <p className="text-[#D57300] body-S hover:underline">
                          See more
                        </p>
                      </div>
                    </button>
                  ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
