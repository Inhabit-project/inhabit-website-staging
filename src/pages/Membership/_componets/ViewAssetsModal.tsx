import { JSX, useState, useEffect } from "react";
import { Nft } from "@/models/nft.model";
import { BLOCKCHAIN_LOGO_BY_CHAIN_ID } from "@/config/const";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  nfts: Nft[];
};

export function ViewAssetsModal(props: Props): JSX.Element {
  const { isOpen, onClose, nfts } = props;

  // states
  const [selectedNft, setSelectedNft] = useState<Nft | null>(null);
  const [transferAddress, setTransferAddress] = useState<string>("");

  // Reset when modal closes - always show grid when opening
  useEffect(() => {
    if (!isOpen) {
      setSelectedNft(null);
      setTransferAddress("");
    }
  }, [isOpen]);

  if (!isOpen) return <></>;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md"
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
                  setTransferAddress("");
                }}
                className="text-light hover:text-[#D57300] transition-colors"
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
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Side Image */}
              <div className="w-full lg:w-1/2">
                <div className="aspect-square rounded-xl overflow-hidden border-[0.5px] border-green-soft bg-green-soft/10 shadow-sm">
                  <img
                    src={selectedNft.imageUrl}
                    alt={selectedNft.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Transfer NFT */}
                <div className="mt-6 pt-6 border-t border-green-soft/20">
                  <label className="body-S text-light font-semibold mb-1">
                    Transfer NFT
                  </label>
                  <div className="mt-2 flex flex-col gap-3">
                    <input
                      type="text"
                      className="input-main"
                      placeholder="Recipient address (0x...)"
                      value={transferAddress}
                      onChange={(e) => setTransferAddress(e.target.value)}
                    />
                    <button
                      className="btn-primary w-full"
                      disabled={!transferAddress || transferAddress.length < 42}
                    >
                      Transfer
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Side Details */}
              <div className="flex-1 flex flex-col gap-6 pr-2">
                {/* Name */}
                <section>
                  <p className="body-S text-light/60 font-semibold mb-1">
                    Name
                  </p>
                  <p className="body-M text-light">{selectedNft.name}</p>
                </section>

                {/* Description */}
                {selectedNft.description && (
                  <section>
                    <p className="body-S text-light/60 font-semibold mb-1">
                      Description
                    </p>
                    <p className="body-S text-light/80 leading-relaxed whitespace-pre-line">
                      {selectedNft.description}
                    </p>
                  </section>
                )}

                {/* Chain ID */}
                <section>
                  <p className="body-S text-light/60 font-semibold mb-1">
                    Chain
                  </p>
                  <img
                    src={BLOCKCHAIN_LOGO_BY_CHAIN_ID(selectedNft.chainId)}
                    alt={`Blockchain logo for chain ${selectedNft.chainId}`}
                    className="w-9 h-9"
                  />
                </section>

                {/* Contract Address */}
                <section>
                  <p className="body-S text-light/60 font-semibold mb-1">
                    Contract
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="body-S text-light/80 font-mono break-all">
                      {selectedNft.contractAddress}
                    </span>
                    <a
                      href={selectedNft.scanUrl}
                      target="_blank"
                      className="text-[#D57300] hover:underline body-S whitespace-nowrap"
                    >
                      Explorer
                    </a>
                  </div>
                </section>

                {/* Token ID */}
                <section>
                  <p className="body-S text-light/60 font-semibold mb-1">
                    Token ID
                  </p>
                  <p className="body-S text-light/80 font-mono">
                    {selectedNft.tokenId}
                  </p>
                </section>

                {/* Token Type */}
                <section>
                  <p className="body-S text-light/60 font-semibold mb-1">
                    Type
                  </p>
                  <p className="body-S text-light/80">
                    {selectedNft.tokenType}
                  </p>
                </section>
              </div>
            </div>
          ) : (
            /* ----------------------------- */
            /*         NFT GRID VIEW        */
            /* ----------------------------- */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {nfts.length === 0 ? (
                <div className="col-span-2 text-center py-12">
                  <p className="body-M text-light/70">No NFTs detected.</p>
                </div>
              ) : (
                nfts.map((nft) => (
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
