import { JSX, useEffect, useState } from "react";
import { Checkout } from "./Checkout";
import { useAccount, useWalletClient } from "wagmi";
import { useStore } from "../../../store";
import { MUST_DO_KYC_HARD } from "../../../config/const";
import { ConnectButton } from "../../../ui/ConnectButton";
import { COIN, KYC_TYPE } from "../../../config/enums";

import { Indicator } from "./Indicator";
import { VoucherStep } from "./Voucher";
import { useUsdc } from "@/hooks/contracts/erc20/useUsdc";
import { useUsdt } from "@/hooks/contracts/erc20/useUsdt";

export type Props = {
  availableSupply: number;
  membershipContract: string;
  price: number;
};

export default function Stepper(props: Props): JSX.Element {
  // props
  const { availableSupply, membershipContract, price } = props;

  // hooks
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedCoin, setSelectedCoin] = useState<COIN>();

  // external hooks
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();

  const { balance: usdcBalance } = useUsdc(price, walletClient);
  const { balance: usdtBalance } = useUsdt(price, walletClient);

  const {
    isKycHardCompleted,
    hasSentKycHard,
    hasSentKycSoft,
    getHasSentKyc,
    startKycPolling,
  } = useStore();

  // variables
  const requiresHardKyc = MUST_DO_KYC_HARD(price);
  const kycType = requiresHardKyc ? KYC_TYPE.HARD : KYC_TYPE.SOFT;

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

    Promise.all([
      getHasSentKyc(address, KYC_TYPE.HARD),
      getHasSentKyc(address, KYC_TYPE.SOFT),
    ]);
  }, [address]);

  useEffect(() => {
    if (!address) return;

    if (hasSentKycSoft || hasSentKycHard) {
      goNext();
    } else {
      goPrev();
    }

    if (requiresHardKyc && !isKycHardCompleted) {
      startKycPolling(address, requiresHardKyc);
    }
  }, [price, address, hasSentKycHard, hasSentKycSoft, isKycHardCompleted]);

  return (
    <div className="w-full lg:max-w-lg lg:self-start lg:sticky lg:top-8 background-gradient-dark backdrop-blur-lg rounded-3xl shadow-xl border border-green-soft p-8 flex flex-col gap-6">
      <Indicator step={step} />
      <ConnectButton />
      {step === 1 && (
        <Checkout
          membershipContract={membershipContract}
          requiresHardKyc={requiresHardKyc}
          kycType={kycType}
          goNext={goNext}
        />
      )}

      {step === 2 && (
        <VoucherStep
          availableSupply={availableSupply}
          kycType={kycType}
          price={price}
          selectedCoin={selectedCoin}
          requiresHardKyc={requiresHardKyc}
          setSelectedCoin={setSelectedCoin}
        />
      )}
    </div>
  );
}
