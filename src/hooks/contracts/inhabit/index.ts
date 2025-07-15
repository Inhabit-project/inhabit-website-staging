import { WalletClient } from "viem";
import { useStore } from "@/store";
import { useBuyNFT } from "./useBuyNFT";

export function useInhabit(walletClient?: WalletClient) {
  const { inhabit } = useStore();

  if (walletClient) {
    inhabit.setWalletClient(walletClient);
  }

  const buyNFT = useBuyNFT(inhabit);

  return { buyNFT };
}
