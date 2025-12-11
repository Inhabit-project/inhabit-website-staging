import { BLOCKCHAIN_LOGO_BY_CHAIN_ID } from "@/config/const";
import { useErc721 } from "@/hooks/contracts/erc721";
import { Nft } from "@/models/nft.model";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { Address, getAddress, Hex, ZERO_ADDRESS } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";

type Props = {
  selectedNft: Nft;
};

function NftDetail(props: Props): JSX.Element {
  const { selectedNft } = props;

  const tokenId = useMemo(() => {
    return BigInt(selectedNft.tokenId) ?? BigInt(0);
  }, [selectedNft.tokenId]);

  // thirdweb
  const account = useActiveAccount();

  // query client
  const queryClient = useQueryClient();

  // states
  const [transferAddress, setTransferAddress] = useState<Address>(ZERO_ADDRESS);
  const [transferAddressInput, setTransferAddressInput] = useState<string>("");

  // erc721 hook
  const {
    /*useGetApproved, */ useOwnerOf,
    useTransferFrom,
    QUERY_KEY_OWNER_OF,
  } = useErc721(selectedNft.contractAddress);

  /// get approved
  // const { data: dataSpender } = useGetApproved(tokenId);

  // const spender = useMemo(() => {
  //   return dataSpender ?? ZERO_ADDRESS;
  // }, [dataSpender]);

  /// owner of
  const { data: dataOwner } = useOwnerOf(tokenId);

  const owner = useMemo(() => {
    return dataOwner ?? ZERO_ADDRESS;
  }, [dataOwner]);

  const refetchOwner = useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: [QUERY_KEY_OWNER_OF, tokenId.toString()],
    });
  }, [queryClient, tokenId]);

  /// transfer from
  const { mutate: transferFrom, isPending: isTransferFromPending } =
    useTransferFrom;

  // validations
  /// is owner
  const isOwner = useMemo(() => {
    return owner === account?.address;
  }, [owner, account?.address]);

  /// is valid transfer address
  const isValidTransferAddress = useMemo(() => {
    return transferAddress !== ZERO_ADDRESS;
  }, [transferAddress]);

  /// is loading
  const isInExecution = useMemo(() => {
    return isTransferFromPending;
  }, [isTransferFromPending]);

  // functions
  const handleTransferFrom = (address: string) => {
    setTransferAddressInput(address);
    try {
      const from = getAddress(address);
      setTransferAddress(from);
    } catch (error) {
      setTransferAddress(ZERO_ADDRESS);
    }
  };

  const onTransferFrom = () => {
    if (!isOwner || !isValidTransferAddress) return;
    if (owner === transferAddress) return;

    transferFrom(
      {
        from: owner,
        to: transferAddress,
        tokenId: BigInt(selectedNft.tokenId),
      },
      {
        onSuccess: (_hash: Hex) => {
          refetchOwner();
          setTransferAddressInput("");
          setTransferAddress(ZERO_ADDRESS);

          alert("NFT transferred successfully");
        },
        onError: (_error) => {},
      }
    );
  };

  return (
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
              placeholder={
                transferAddressInput === ""
                  ? "Recipient address (0x...)"
                  : transferAddressInput
              }
              value={transferAddressInput}
              disabled={!isOwner || isInExecution}
              onChange={(e) => handleTransferFrom(e.target.value)}
            />
            <button
              className="btn-primary w-full"
              disabled={!isOwner || !isValidTransferAddress || isInExecution}
              onClick={onTransferFrom}
            >
              {isInExecution ? "Transferring..." : "Transfer"}
            </button>
          </div>
        </div>
      </div>

      {/* Right Side Details */}
      <div className="flex-1 flex flex-col gap-6 pr-2">
        {/* Name */}
        <section>
          <p className="body-S text-light/60 font-semibold mb-1">Name</p>
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
          <p className="body-S text-light/60 font-semibold mb-1">Chain</p>
          <img
            src={BLOCKCHAIN_LOGO_BY_CHAIN_ID(selectedNft.chainId)}
            alt={`Blockchain logo for chain ${selectedNft.chainId}`}
            className="w-9 h-9"
          />
        </section>

        {/* Contract Address */}
        <section>
          <p className="body-S text-light/60 font-semibold mb-1">Contract</p>
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
          <p className="body-S text-light/60 font-semibold mb-1">Token ID</p>
          <p className="body-S text-light/80 font-mono">
            {selectedNft.tokenId}
          </p>
        </section>

        {/* Token Type */}
        <section>
          <p className="body-S text-light/60 font-semibold mb-1">Type</p>
          <p className="body-S text-light/80">{selectedNft.tokenType}</p>
        </section>
      </div>
    </div>
  );
}

export default NftDetail;
