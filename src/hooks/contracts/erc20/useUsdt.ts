import { useEffect, useState } from "react";
import { INHABIT_JSON } from "@/config/const";
import { Address, WalletClient } from "viem";
import { useAccount } from "wagmi";
import { useStore } from "@/store";
import { useApprove } from "./useApprove";

export function useUsdt(price: number, walletClient?: WalletClient) {
  const [balance, setBalance] = useState<number>(0);
  const [allowance, setAllowance] = useState<number>(0);
  const [hasSufficientBalance, setHasSufficientBalance] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { address } = useAccount();
  const { usdt } = useStore();

  if (walletClient) {
    usdt.setWalletClient(walletClient);
  }

  const approveMutation = useApprove(usdt);

  const load = async () => {
    if (!price || !address) {
      setBalance(0);
      setAllowance(0);
      setHasSufficientBalance(false);
      return;
    }

    setIsLoading(true);

    const [fetchedBalance, fetchedAllowance] = await Promise.all([
      usdt.getBalance(address),
      usdt.allowance(address, INHABIT_JSON.proxy as Address),
    ]);

    setBalance(fetchedBalance);
    setAllowance(fetchedAllowance);
    setHasSufficientBalance(fetchedBalance >= price);
    setIsLoading(false);
  };

  useEffect(() => {
    load();
  }, [address, price]);

  return {
    balance,
    allowance,
    hasSufficientBalance,
    isLoading,
    refetch: load,
    approve: approveMutation,
  };
}
