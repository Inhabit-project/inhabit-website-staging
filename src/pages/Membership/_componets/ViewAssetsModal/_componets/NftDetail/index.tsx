import { META_ERC_721_ABI } from "@/config/abis";
import {
  BLOCKCHAIN_LOGO_BY_CHAIN_ID,
  emptyHex,
  isEmptyHex,
} from "@/config/const";
import { useAccount } from "@/hooks/api/account";
import { useRelay } from "@/hooks/api/relay";
import { useErc721 } from "@/hooks/contracts/erc721";
import { useForwarder } from "@/hooks/contracts/forwarder";
import { Nft } from "@/models/nft.model";
import { sanitizeIpfsUri } from "@/utils/sanitize-ipfs-uri";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Address, Hex, ZERO_ADDRESS } from "thirdweb";
import { useActiveWallet } from "thirdweb/react";
import { encodeFunctionData, getAddress, TypedDataDomain } from "viem";
import { useTranslation } from "react-i18next";

type Props = {
  selectedNft: Nft;
  handleNftTransferred: (nft: Nft) => void;
};

export default function NftDetail(props: Props): JSX.Element {
  const { selectedNft, handleNftTransferred } = props;

  const tokenId = useMemo(() => {
    return BigInt(selectedNft.tokenId) ?? BigInt(0);
  }, [selectedNft.tokenId]);

  // i18n
  const { t } = useTranslation();

  // states
  const [downloadingContract, setDownloadingContract] = useState(false);
  const [downloadingHighResolutionImage, setDownloadingHighResolutionImage] =
    useState(false);

  // thirdweb
  const wallet = useActiveWallet();
  const chainId = useMemo(() => wallet?.getChain()?.id ?? 0, [wallet]);
  const account = useMemo(() => wallet?.getAccount(), [wallet]);
  const accountAddress = useMemo(() => {
    try {
      return getAddress(account?.address as Address);
    } catch (error) {
      return ZERO_ADDRESS;
    }
  }, [account]);

  // query client
  const queryClient = useQueryClient();

  // states
  const [signature, setSignature] = useState<Hex>(emptyHex);
  const [transferAddress, setTransferAddress] = useState<Address>(ZERO_ADDRESS);
  const [transferAddressInput, setTransferAddressInput] = useState<string>("");

  // account hook
  const { useGetSiweMessage } = useAccount(chainId, accountAddress);

  const { data: dataSiweMessage, isPending: isGetSiweMessagePending } =
    useGetSiweMessage();

  const siweMessage = useMemo(() => {
    return dataSiweMessage ?? "";
  }, [dataSiweMessage]);

  // relay hook
  const { useTransferFrom: useTransferFromRelay } = useRelay();
  const { mutate: transferFromRelay, isPending: isTransferFromRelayPending } =
    useTransferFromRelay;

  // forwarder hook
  const { useEip712Domain, useNonces } = useForwarder();
  const { data: dataEip712Domain, isPending: isGetEip712DomainPending } =
    useEip712Domain();

  const domain = useMemo(() => {
    return dataEip712Domain ?? ({} as TypedDataDomain);
  }, [dataEip712Domain]);

  const { data: dataNonce, isPending: isGetNoncePending } =
    useNonces(accountAddress);

  const nonce = useMemo(() => {
    return dataNonce ?? 0n;
  }, [dataNonce]);

  // erc721 hook
  const { useOwnerOf, useTransferFrom, QUERY_KEY_OWNER_OF } = useErc721(
    selectedNft.contractAddress
  );

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
    return isTransferFromPending || isTransferFromRelayPending;
  }, [isTransferFromPending, isTransferFromRelayPending]);

  // effects
  /// get wallet auth token if
  useEffect(() => {
    (async () => {
      if (!account || !isSocialLogin || !siweMessage) return;
      const signature = await account.signMessage({ message: siweMessage });
      setSignature(signature);
    })();
  }, [siweMessage]);

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

  const onTransferFrom = async () => {
    try {
      if (!isOwner || !isValidTransferAddress) return;
      if (owner === transferAddress) return;

      if (isSocialLogin) {
        if (!account || !signature) return;

        const primaryType = "ForwardRequest" as const;

        const types = {
          [primaryType]: [
            { name: "from", type: "address" },
            { name: "to", type: "address" },
            { name: "value", type: "uint256" },
            { name: "gas", type: "uint256" },
            { name: "nonce", type: "uint256" },
            { name: "deadline", type: "uint48" },
            { name: "data", type: "bytes" },
          ],
        } as const;

        const normalizedFrom = getAddress(owner);
        const normalizedTo = getAddress(selectedNft.contractAddress);

        const callData = encodeFunctionData({
          abi: META_ERC_721_ABI,
          functionName: "metaTransferFrom",
          args: [normalizedFrom, getAddress(transferAddress), tokenId],
        });

        const deadlineNumber = Math.floor(Date.now() / 1000) + 60 * 30; // 30 minutes

        const messageToSign = {
          from: normalizedFrom,
          to: normalizedTo,
          value: 0n,
          gas: 300000n,
          nonce: nonce,
          deadline: deadlineNumber,
          data: callData,
        };

        const domainForSigning: TypedDataDomain = {
          name: domain.name,
          version: domain.version,
          chainId: Number(domain.chainId),
          verifyingContract: domain.verifyingContract,
        };

        const typedDataPayload = {
          domain: domainForSigning,
          types,
          primaryType,
          message: messageToSign,
        };

        const signedTransferFromMessage = await account.signTypedData(
          typedDataPayload
        );

        const request = {
          from: messageToSign.from,
          to: messageToSign.to,
          value: messageToSign.value,
          gas: messageToSign.gas,
          deadline: BigInt(messageToSign.deadline),
          data: messageToSign.data,
          signature: signedTransferFromMessage,
        };

        transferFromRelay(
          {
            chainId: chainId,
            address: accountAddress,
            message: siweMessage,
            signature: signature,
            request,
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
      } else {
        transferFrom(
          {
            from: owner,
            to: transferAddress,
            tokenId,
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
    } catch (error) {
      console.error("❌", error);
    }
  };

  const downloadFile = useCallback(
    async (
      url: string,
      filename: string,
      mimeType: string,
      setDownloading: (downloading: boolean) => void
    ) => {
      try {
        setDownloading(true);
        // Sanitize IPFS URL to HTTP gateway
        const sanitizedUrl = sanitizeIpfsUri(url);

        const response = await fetch(sanitizedUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();
        console.log("Blob created, size:", blob.size);

        const blobWithType = new Blob([blob], { type: mimeType });
        const blobUrl = URL.createObjectURL(blobWithType);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error("Error downloading file:", error);
        alert(`Error descargando archivo: ${error}`);
      } finally {
        setDownloading(false);
      }
    },
    []
  );

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
              disabled={
                !isOwner ||
                isInExecution ||
                (isSocialLogin &&
                  isGetEip712DomainPending &&
                  isGetNoncePending &&
                  isGetSiweMessagePending &&
                  isEmptyHex(signature))
              }
              onChange={(e) => handleTransferFrom(e.target.value)}
            />
            <button
              className="btn-primary w-full"
              disabled={!isOwner || !isValidTransferAddress || isInExecution}
              onClick={onTransferFrom}
            >
              {isSocialLogin && isGetSiweMessagePending && isEmptyHex(signature)
                ? "Preparing transaction..."
                : isInExecution
                ? "Transferring..."
                : "Transfer"}
            </button>

            <div className="flex flex-col gap-2">
              <button
                className="btn-secondary text-sm px-4 py-2"
                disabled={!isOwner || downloadingContract}
                onClick={() =>
                  downloadFile(
                    selectedNft.membershipContract,
                    `${selectedNft.name}-contract.pdf`,
                    "application/pdf",
                    setDownloadingContract
                  )
                }
              >
                {downloadingContract ? "Downloading" : "Download Contract"}
              </button>
              <button
                className="btn-secondary text-sm px-4 py-2!"
                disabled={!isOwner || downloadingHighResolutionImage}
                onClick={() =>
                  downloadFile(
                    selectedNft.highResolutionImage,
                    `${selectedNft.name}-high-resolution.png`,
                    "image/png",
                    setDownloadingHighResolutionImage
                  )
                }
              >
                {downloadingHighResolutionImage
                  ? t("membership.info.Downloading")
                  : t("membership.info.Download High Resolution Image")}
              </button>
            </div>
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
