import { useEffect, useState } from "react";
import { INHABIT_JSON } from "../config/const";
import { Address } from "viem";
import { useAccount } from "wagmi";
import { useStore } from "../store";

export function useTokenBalance(price: number) {
  const [usdcBalance, setUsdcBalance] = useState<number>(0);
  const [usdcAllowance, setUsdcAllowance] = useState<number>(0);
  const [usdtBalance, setUsdtBalance] = useState<number>(0);
  const [usdtAllowance, setUsdtAllowance] = useState<number>(0);
  const [hasSufficientBalance, setHasSufficientBalance] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { address } = useAccount();
  const { usdc, usdt } = useStore();

  const loadTokensBalance = async () => {
    if (!price || !address) {
      setUsdcBalance(0);
      setUsdcAllowance(0);
      setUsdtBalance(0);
      setUsdtAllowance(0);
      setHasSufficientBalance(false);
      return;
    }

    setIsLoading(true);

    const [usdcBalance, usdcAllowance, usdtBalance, usdtAllowance] =
      await Promise.all([
        usdc.balanceOf(address),
        usdc.allowance(address, INHABIT_JSON.proxy as Address),
        usdt.balanceOf(address),
        usdt.allowance(address, INHABIT_JSON.proxy as Address),
      ]);

    setUsdcBalance(usdcBalance);
    setUsdcAllowance(usdcAllowance);
    setUsdtBalance(usdtBalance);
    setUsdtAllowance(usdtAllowance);

    const sufficient = usdcBalance >= price || usdtBalance >= price;

    setHasSufficientBalance(sufficient);
    setIsLoading(false);
  };

  useEffect(() => {
    loadTokensBalance();
  }, [address, price]);

  return {
    usdcBalance,
    usdcAllowance,
    usdtBalance,
    usdtAllowance,
    hasSufficientBalance,
    isLoading,
    refetch: loadTokensBalance,
  };
}
