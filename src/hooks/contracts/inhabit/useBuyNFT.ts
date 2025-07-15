import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { Address, Hex } from "viem";
import { InhabitContract } from "@/services/blockchain/contracts/inhabit";
import { ContractError, ServiceResult } from "@/models/api.model";

type Params = {
  campaignId: number;
  collectionAddress: Address;
  referral: Hex;
  token: Address;
};

export function useBuyNFT(
  inhabit: InhabitContract
): UseMutationResult<Hex, ContractError, Params> {
  return useMutation<Hex, ContractError, Params>({
    mutationFn: async ({
      campaignId,
      collectionAddress,
      referral,
      token,
    }): Promise<Hex> => {
      const result: ServiceResult<Hex> = await inhabit.buyNFT(
        campaignId,
        collectionAddress,
        referral,
        token
      );

      if (!result.success) throw result.error;
      return result.data!; // Hex string of the transaction hash
    },
  });
}
