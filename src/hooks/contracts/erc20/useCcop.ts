import { useEffect, useState } from "react";
import { INHABIT_JSON } from "@/config/const";
import { useStore } from "@/store";
import { useApprove } from "./useApprove";
import { Account } from "thirdweb/wallets";
import { Address } from "thirdweb";

export function useCcop(price: number, account?: Account) {
  const [balance, setBalance] = useState<number>(0);
  const [allowance, setAllowance] = useState<number>(0);
  const [hasSufficientBalance, setHasSufficientBalance] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { ccop } = useStore();

  const approveMutation = useApprove(ccop, account);

  const load = async () => {
    if (!price || !account || !account.address) {
      setBalance(0);
      setAllowance(0);
      setHasSufficientBalance(false);
      return;
    }

    setIsLoading(true);

    const [fetchedBalance, fetchedAllowance] = await Promise.all([
      ccop.balanceOf(account.address as Address),
      ccop.allowance(account.address as Address, INHABIT_JSON.proxy),
    ]);

    setBalance(fetchedBalance);
    setAllowance(fetchedAllowance);
    setHasSufficientBalance(fetchedBalance >= price);
    setIsLoading(false);
  };

  useEffect(() => {
    load();
  }, [account, price]);

  return {
    balance,
    allowance,
    hasSufficientBalance,
    isLoading,
    refetch: load,
    approve: approveMutation,
  };
}
