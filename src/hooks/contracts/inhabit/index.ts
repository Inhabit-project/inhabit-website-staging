// hooks/useInhabitTw.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import { InhabitContract } from "@/services/blockchain/contracts/inhabit";
import { Account } from "thirdweb/wallets";
import { Address, Hex } from "thirdweb";
import { ServiceResult } from "@/models/api.model";

type BuyParams = {
  to: Address;
  campaignId: number;
  collectionAddress: Address;
  referral: Hex;
  paymentToken: Address;
  paymentAmount: number;
};

export function useInhabit(account?: Account) {
  const inhabit = new InhabitContract(account);

  // =========================
  //        READ METHODS
  // =========================

  function calculateTokenAmount(paymentToken: Address, priceUsd: number) {
    return useQuery({
      queryKey: ["calculateTokenAmount", paymentToken, priceUsd],
      enabled: !!paymentToken && !!priceUsd && priceUsd > 0,
      queryFn: () => inhabit.calculateTokenAmount(paymentToken, priceUsd),
      staleTime: 30000,
      refetchOnWindowFocus: false,
    });
  }

  // =========================
  //        WRITE METHODS
  // =========================

  const buyNFT = useMutation<Hex, any, BuyParams>({
    mutationFn: async ({
      to,
      campaignId,
      collectionAddress,
      referral,
      paymentToken,
      paymentAmount,
    }) => {
      if (!account) {
        throw new Error("Account not connected");
      }

      const result: ServiceResult<Hex> = await inhabit.buyNFT(
        to,
        campaignId,
        collectionAddress,
        referral,
        paymentToken,
        paymentAmount
      );

      if (!result.success) throw result.error;
      return result.data!; // Hex string of the transaction hash
    },
  });

  return {
    buyNFT,
    calculateTokenAmount,
  };
}
