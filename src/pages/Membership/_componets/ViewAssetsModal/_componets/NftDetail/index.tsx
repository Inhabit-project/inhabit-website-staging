import { BLOCKCHAIN_LOGO_BY_CHAIN_ID, chain } from "@/config/const";
import { useErc721 } from "@/hooks/contracts/erc721";
import { Nft } from "@/models/nft.model";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { Address, getAddress, Hex, ZERO_ADDRESS } from "thirdweb";
import { useActiveWallet } from "thirdweb/react";
import {
  encodeFunctionData,
  erc721Abi,
  GetTypesForEIP712DomainErrorType,
  MessageDefinition,
  TypedData,
  TypedDataDomain,
} from "viem";
import { EIP712Domain } from "viem/zksync";

type Props = {
  selectedNft: Nft;
  handleNftTransferred: (nft: Nft) => void;
};

function NftDetail(props: Props): JSX.Element {
  const { selectedNft, handleNftTransferred } = props;

  const tokenId = useMemo(() => {
    return BigInt(selectedNft.tokenId) ?? BigInt(0);
  }, [selectedNft.tokenId]);

  // thirdweb
  const wallet = useActiveWallet();
  const account = useMemo(() => wallet?.getAccount(), [wallet]);

  // query client
  const queryClient = useQueryClient();

  // states
  const [transferAddress, setTransferAddress] = useState<Address>(ZERO_ADDRESS);
  const [transferAddressInput, setTransferAddressInput] = useState<string>("");

  // erc721 hook
  const { useName, useOwnerOf, useTransferFrom, QUERY_KEY_OWNER_OF } =
    useErc721(selectedNft.contractAddress);

  /// name
  const { data: dataName } = useName();

  const name = useMemo(() => {
    return dataName ?? "";
  }, [dataName]);

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
  /// is social login
  const isSocialLogin = useMemo(() => wallet?.id === "inApp", [wallet]);

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

    if (isSocialLogin) {
      if (!account) return;

      const callData = encodeFunctionData({
        abi: erc721Abi,
        functionName: "transferFrom",
        args: [owner, transferAddress, BigInt(selectedNft.tokenId)],
      });

      const domain: TypedDataDomain = {
        name,
        version: "1",
        chainId: chain.id,
        verifyingContract: getAddress(ZERO_ADDRESS),
      };

      const primaryType = "ForwardRequest";

      const types: TypedData = {
        [primaryType]: [
          { name: "from", type: "address" },
          { name: "to", type: "address" },
          { name: "value", type: "uint256" },
          { name: "gas", type: "uint256" },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint48" },
          { name: "data", type: "bytes" },
        ],
      };

      const forwardRequest: MessageDefinition = {
        from: owner,
        to: transferAddress,
        value: 0n,
        gas: 300000n,
        deadline: BigInt(Math.floor(Date.now() / 1000) + 60 * 30), // 30 minutes
        data: callData,
      };

      // TODO: get nonce

      account
        .signTypedData({
          domain,
          types,
          primaryType,
          message: {
            ...forwardRequest,
            nonce: 0n,
          },
        })
        .then((signature: Hex) => {
          console.log("signature", signature);
          // TODO: sent signature

          // refetchOwner();
          // setTransferAddressInput("");
          // setTransferAddress(ZERO_ADDRESS);

          // alert("NFT transferred successfully");
          // handleNftTransferred(selectedNft);
        });
    } else {
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
            handleNftTransferred(selectedNft);
          },
          onError: (_error) => {},
        }
      );
    }
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
