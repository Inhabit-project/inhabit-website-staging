import { SCAN_URL } from "@/config/const";
import { APIError, ServiceResult } from "@/models/api.model";
import { Nft } from "@/models/nft.model";
import { WalletNftsResponse } from "@/services/dtos/wallets-nfts-response";
import axios, { RawAxiosRequestHeaders } from "axios";
import { Address } from "viem";

type WalletsService = {
  getWalletNftsForContractAddresses: (
    account: Address,
    contractAddresses: Address[],
    chainId: number,
    limit?: number,
    page?: number
  ) => Promise<ServiceResult<any[]>>;
};

export function walletsService(
  host: string,
  headers: RawAxiosRequestHeaders,
  endpoint: string
): WalletsService {
  const url = `${host}/${endpoint}`;

  const getWalletNftsForContractAddresses = async (
    account: Address,
    contractAddresses: Address[],
    chainId: number,
    limit?: number,
    page?: number
  ): Promise<ServiceResult<Nft[]>> => {
    try {
      const params = new URLSearchParams();
      params.append("chainId", chainId.toString());

      contractAddresses.forEach((address) => {
        params.append("contractAddresses", address);
      });

      if (limit) params.append("limit", limit.toString());
      if (page) params.append("page", page.toString());

      const response = await axios.get<WalletNftsResponse>(
        `${url}/${account}/nfts`,
        {
          headers,
          params,
        }
      );

      return {
        success: true,
        data: mapWalletNftsResponseToNfts(response.data),
      };
    } catch (error) {
      console.error("❌", error);
      const apiError = error as APIError;
      return { success: false, error: apiError };
    }
  };

  return {
    getWalletNftsForContractAddresses,
  };
}

function mapWalletNftsResponseToNfts(response: WalletNftsResponse): Nft[] {
  if (!response.result.nfts || response.result.nfts.length === 0) return [];

  const sortedDtos = [...response.result.nfts].sort((a, b) => {
    const contractCmp = a.contract.address.localeCompare(b.contract.address);
    if (contractCmp !== 0) return contractCmp;

    const aId = Number(a.token_id);
    const bId = Number(b.token_id);
    return aId - bId;
  });

  const nfts: Nft[] = sortedDtos.map((nft) => ({
    chainId: nft.chain_id,
    contractAddress: nft.contract.address as Address,
    tokenType: nft.token_type,
    tokenId: nft.token_id,
    name: nft.name,
    description: nft.description,
    imageUrl: nft.image_url,
    scanUrl: `${SCAN_URL("nft", nft.contract.address as Address)}/${
      nft.token_id
    }`,
  }));

  return nfts;
}
