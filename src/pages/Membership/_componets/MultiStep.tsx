import { JSX, useEffect, useState } from "react";
import { useTokenBalance } from "../../../hooks/useTokensBalance";
import { Checkout } from "./Checkout";
import { useAccount } from "wagmi";
import { useStore } from "../../../store";
import { MUST_DO_KYC_HARD } from "../../../config/const";
import { ConnectButton } from "../../../ui/ConnectButton";
import { COIN, KYC_TYPE } from "../../../config/enums";

import { StepperIndicator } from "./StepperIndicator";
import { VoucherStep } from "./Voucher";

export type Props = {
  membershipContract: string;
  price: number;
};

export default function MultiStepCheckout(props: Props): JSX.Element {
  // props
  const { membershipContract, price } = props;

  // hooks
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedCoin, setSelectedCoin] = useState<COIN>();

  // external hooks
  const { address } = useAccount();

  const {
    usdcBalance,
    usdtBalance,
    usdcAllowance,
    usdtAllowance,
    hasSufficientBalance,
    refetch: refetchBalances,
  } = useTokenBalance(price);

  const {
    isKycHardCompleted,
    hasSentKycHard,
    hasSentKycSoft,
    getHasSentKyc,
    startKycPolling,
  } = useStore();

  // variables
  const requiresHardKyc = MUST_DO_KYC_HARD(price);

  // functions
  const goNext = () => setStep((s) => (s === 1 ? 2 : s));
  const goPrev = () => setStep((s) => (s === 2 ? 1 : s));

  // effects
  useEffect(() => {
    if (selectedCoin) return;

    if (usdcBalance >= price && usdtBalance < price) setSelectedCoin(COIN.USDC);
    if (usdtBalance >= price && usdcBalance < price) setSelectedCoin(COIN.USDT);
  }, [price, selectedCoin, usdcBalance, usdtBalance]);

  useEffect(() => {
    if (!address) return;

    getHasSentKyc(address, requiresHardKyc ? KYC_TYPE.HARD : KYC_TYPE.SOFT);
  }, [address]);

  useEffect(() => {
    if (!address) return;

    if (requiresHardKyc) {
      if (!hasSentKycHard) {
        goPrev();
      } else if (isKycHardCompleted) {
        goNext();
      } else {
        startKycPolling(address, price);
      }
    } else {
      if (!hasSentKycSoft) {
        goPrev();
      } else {
        goNext();
      }
    }
  }, [price, address, hasSentKycHard, hasSentKycSoft, isKycHardCompleted]);

  return (
    <div className="w-full max-w-lg background-gradient-dark backdrop-blur-lg rounded-3xl shadow-xl border border-green-soft p-8 flex flex-col gap-6 self-start sticky top-8">
      <StepperIndicator step={step} />
      <ConnectButton />

      {step === 1 && (
        <Checkout
          membershipContract={membershipContract}
          price={price}
          usdcBalance={usdcBalance}
          usdtBalance={usdtBalance}
          hasSufficientBalance={hasSufficientBalance}
        />
      )}

      {step === 2 && (
        <VoucherStep
          price={price}
          usdcBalance={usdcBalance}
          usdtBalance={usdtBalance}
          usdcAllowance={usdcAllowance}
          usdtAllowance={usdtAllowance}
          selectedCoin={selectedCoin}
          hasSufficientBalance={hasSufficientBalance}
          refetchBalances={refetchBalances}
          setSelectedCoin={setSelectedCoin}
        />
      )}
    </div>
  );
}
