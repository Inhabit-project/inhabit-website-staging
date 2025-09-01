// hooks/useInhabitTw.ts
import { useMutation } from "@tanstack/react-query";
import { InhabitContract } from "@/services/blockchain/contracts/inhabit";
import { Account } from "thirdweb/wallets";
import { Address, Hex } from "thirdweb";
import { ServiceResult } from "@/models/api.model";

type BuyParams = {
  campaignId: number;
  collectionAddress: Address;
  referral: Hex;
  token: Address;
};

export function useInhabit(account?: Account) {
  const buyNFT = useMutation<Hex, any, BuyParams>({
    mutationFn: async ({ campaignId, collectionAddress, referral, token }) => {
      if (!account) {
        throw new Error("Account not connected");
      }

      const inhabit = new InhabitContract(account);
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

  return {
    buyNFT,
  };
}
