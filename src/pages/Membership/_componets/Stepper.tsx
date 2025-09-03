import { JSX, useEffect, useState } from "react";
import { Checkout } from "./Checkout";
import { useAccount, useWalletClient } from "wagmi";
import { useStore } from "../../../store";
import { MUST_DO_KYC_HARD } from "../../../config/const";
// import { ConnectButton } from "../../../ui/ConnectButton";
import { COIN, KYC_TYPE } from "../../../config/enums";

import { Indicator } from "./Indicator";
import { VoucherStep } from "./Voucher";
import { useUsdc } from "@/hooks/contracts/erc20/useUsdc";
import { useUsdt } from "@/hooks/contracts/erc20/useUsdt";
import { LoginButton } from "./LoginButton";
import { useActiveAccount } from "thirdweb/react";

export type Props = {
  availableSupply: number;
  membershipContract: string;
  price: number;
};

export default function Stepper(props: Props): JSX.Element {
  /// props
  const { availableSupply, membershipContract, price } = props;

  /// hooks
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedCoin, setSelectedCoin] = useState<COIN>();

  /// external hooks
  const account = useActiveAccount();

  const { balance: usdcBalance } = useUsdc(price, account);
  const { balance: usdtBalance } = useUsdt(price, account);

  const {
    isKycHardCompleted,
    hasSentKycHard,
    hasSentKycSoft,
    getHasSentKyc,
    startKycPolling,
  } = useStore();

  /// variables
  const requiresHardKyc = MUST_DO_KYC_HARD(price);
  const kycType = requiresHardKyc ? KYC_TYPE.HARD : KYC_TYPE.SOFT;

  /// functions
  const goNext = () => setStep((s) => (s === 1 ? 2 : s));
  const goPrev = () => setStep((s) => (s === 2 ? 1 : s));

  /// effects
  // Select coin according to the balance
  useEffect(() => {
    if (selectedCoin) return;

    if (usdcBalance >= price && usdtBalance < price) setSelectedCoin(COIN.USDC);
    if (usdtBalance >= price && usdcBalance < price) setSelectedCoin(COIN.USDT);
  }, [price, selectedCoin, usdcBalance, usdtBalance]);

  // Get account KYC status
  useEffect(() => {
    if (!account || !account.address) return;

    Promise.all([
      getHasSentKyc(account.address, KYC_TYPE.HARD),
      getHasSentKyc(account.address, KYC_TYPE.SOFT),
    ]);
  }, [account]);

  // According to the KYC status, go next or prev and start KYC hard polling
  useEffect(() => {
    if (!account || !account.address) return;

    if (hasSentKycSoft || hasSentKycHard) {
      goNext();
    } else {
      goPrev();
    }

    if (requiresHardKyc && !isKycHardCompleted) {
      startKycPolling(account.address, requiresHardKyc);
    }
  }, [price, account, hasSentKycHard, hasSentKycSoft, isKycHardCompleted]);

  return (
    <div className="w-full lg:max-w-lg lg:self-start lg:sticky lg:top-8 background-gradient-dark backdrop-blur-lg rounded-3xl shadow-xl border border-green-soft p-8 flex flex-col gap-6">
      <Indicator step={step} />
      {/* <ConnectButton /> */}
      <LoginButton />
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
          onWalletDisconnect={() => setStep(1)}
          setSelectedCoin={setSelectedCoin}
        />
      )}
    </div>
  );
}
