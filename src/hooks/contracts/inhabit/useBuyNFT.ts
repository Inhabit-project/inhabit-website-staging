import { useMutation } from "@tanstack/react-query";
import { Address, Hex } from "viem";
import { ServiceResult } from "@/models/api.model";
import { InhabitContract } from "@/services/blockchain/contracts/inhabit";

type Params = {
  campaignId: string;
  collection: Address;
  groupId: number;
  token: Address;
};

export function useBuyNFT(inhabit: InhabitContract) {
  return useMutation({
    mutationFn: async ({
      campaignId,
      collection,
      groupId,
      token,
    }: Params): Promise<Hex> => {
      const result: ServiceResult<Hex> = await inhabit.buyNFT(
        campaignId,
        collection,
        groupId,
        token
      );

      if (!result.success) throw result.error;
      return result.data!; // Hex string of the transaction hash
    },
  });
}
