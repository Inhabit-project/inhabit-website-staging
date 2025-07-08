import { JSX, useEffect, useState } from "react";
import { useTokenBalance } from "../../../hooks/useTokensBalance";
import { Checkout } from "./Checkout"; // ← rename your original Checkout to Checkout (Step 1)
import { useAccount, useWalletClient } from "wagmi";
import { useStore } from "../../../store";
import { MUST_DO_KYC_HARD } from "../../../config/const";
import { ConnectButton } from "../../../ui/ConnectButton";
import { COIN, KYC_TYPE } from "../../../config/enums";
import { useNavigate, useParams } from "react-router-dom";
import usdcImage from "../../../assets/images/tokens/USDC.svg";
import usdtImage from "../../../assets/images/tokens/USDT.svg";
import confetti from "canvas-confetti";

export type MultiStepCheckoutProps = {
  membershipContract: string;
  price: number;
};

export default function MultiStepCheckout(
  props: MultiStepCheckoutProps
): JSX.Element {
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

    // TODO: add another validation because always entering this block when price, address, hasSentKycHard, hasSentKycSoft, isKycHardCompleted changed
    if (!MUST_DO_KYC_HARD(price)) {
      getHasSentKyc(address, KYC_TYPE.SOFT);
    }

    if (!MUST_DO_KYC_HARD(price) && hasSentKycSoft) {
      console.log("Lololo");
      goNext();
    }

    if (MUST_DO_KYC_HARD(price)) {
      startKycPolling(address, price);
    }

    if (MUST_DO_KYC_HARD(price) && hasSentKycHard && isKycHardCompleted) {
      goNext();
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

interface VoucherProps {
  price: number;
  usdcBalance: number;
  usdtBalance: number;
  usdcAllowance: number;
  usdtAllowance: number;
  hasSufficientBalance: boolean;
  selectedCoin?: COIN;
  refetchBalances: () => void;
  setSelectedCoin: (coin: COIN) => void;
}

function VoucherStep(props: VoucherProps) {
  // props
  const {
    price,
    usdcBalance,
    usdtBalance,
    usdcAllowance,
    usdtAllowance,
    selectedCoin,
    hasSufficientBalance,
    refetchBalances,
    setSelectedCoin,
  } = props;

  // external hooks
  const { campaignId, referral } = useParams();
  const navigate = useNavigate();

  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();

  const { collection, inhabit, usdc, usdt } = useStore();

  // variables
  const coins = [
    { symbol: COIN.USDC, balance: usdcBalance },
    { symbol: COIN.USDT, balance: usdtBalance },
  ];

  // variables
  const canMint =
    selectedCoin &&
    coins.find((c) => c.symbol === selectedCoin)!.balance >= price &&
    (selectedCoin === COIN.USDC
      ? usdcAllowance >= price
      : usdtAllowance >= price);

  // functions
  const onApprove = async () => {
    if (!address) return;
    if (!selectedCoin) return;

    if (selectedCoin === COIN.USDC) {
      await usdc.approve(inhabit.getAddress(), price);
    } else if (selectedCoin === COIN.USDT) {
      await usdt.approve(inhabit.getAddress(), price);
    }
  };

  const onMint = async () => {
    if (!address) return;
    if (!selectedCoin) return;
    if (!campaignId) return;
    if (!collection) return;

    await inhabit.buyNFT(
      campaignId,
      collection.address,
      selectedCoin === COIN.USDC ? usdc.getAddress() : usdt.getAddress(),
      referral ?? ""
    );

    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.6 },
    });

    refetchBalances();
  };

  // effects
  useEffect(() => {
    if (!address) return;
    if (!walletClient) return;

    inhabit.setWalletClient(walletClient);
    usdc.setWalletClient(walletClient);
    usdt.setWalletClient(walletClient);
  }, [address, walletClient]);

  return (
    <div className="flex flex-col gap-4">
      {/* Summary */}
      <div className="bg-green-soft/30 rounded-xl p-4 flex flex-col gap-2 mt-2">
        <div className="flex justify-between font-semibold">
          <span className="body-S text-light">Balance</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span className="body-S text-light">USDC</span>
          <div className="flex items-center space-x-3">
            <span className="body-S text-light">${usdcBalance.toFixed(2)}</span>
            <img
              src={usdcImage}
              alt="USDC"
              className="inline-block w-9 h-9 ml-1"
            />
          </div>
        </div>
        <div className="flex justify-between font-semibold">
          <span className="body-S text-light">USDT</span>
          <div className="flex items-center space-x-3">
            <span className="body-S text-light">
              ${usdtBalance.toFixed(2)}{" "}
            </span>
            <img
              src={usdtImage}
              alt="USDC"
              className="inline-block w-9 h-9 ml-1"
            />
          </div>
        </div>
        {/* TODO: add to i18n */}
        {/* TODO: add styles */}
        {address && !hasSufficientBalance && (
          <label className="flex justify-center p-1  text-xs text-secondary">
            "You don't have enough balance to buy this membership"
          </label>
        )}
        {/* <div className="flex justify-between text-secondary font-bold text-lg">
              <span className="body-M text-secondary">
                Total taxes included
              </span>
              <span className="body-M text-secondary">
                $ {membership.valueUSD} USD
              </span>
            </div> */}
      </div>
      <div className="bg-green-soft/30 rounded-xl p-4 flex flex-col gap-4">
        <h4 className="heading-4">Select coin</h4>

        {coins.map((c) => (
          <label
            key={c.symbol}
            className={`flex items-center gap-3 cursor-pointer ${
              c.balance < price && "opacity-40 cursor-not-allowed"
            }`}
          >
            <input
              type="radio"
              name="coin"
              value={c.symbol}
              disabled={c.balance < price}
              checked={selectedCoin === c.symbol}
              onChange={() => setSelectedCoin(c.symbol as COIN)}
              className="custom-checkbox"
            />
            <span className="body-S">{c.symbol}</span>
            {/* <span className="ml-auto body-S">${c.balance.toFixed(2)}</span> */}
          </label>
        ))}

        <div className="flex justify-between mt-2">
          <span className="body-S text-light">Total</span>
          <span className="body-S text-light">
            ${price.toFixed(2)} {selectedCoin ?? ""}
          </span>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        {!canMint ? (
          <button
            type="button"
            className="btn-primary"
            onClick={onApprove}
            disabled={
              !selectedCoin ||
              (selectedCoin === COIN.USDC
                ? usdcAllowance >= price
                : usdtAllowance >= price)
            }
          >
            Approve {selectedCoin}
          </button>
        ) : (
          <button
            type="button"
            className="btn-primary"
            onClick={onMint}
            disabled={!canMint}
          >
            Mint NFT
          </button>
        )}
      </div>
    </div>
  );
}

type StepperProps = {
  step: 1 | 2;
};

function StepperIndicator(props: StepperProps) {
  const { step } = props;
  return (
    <ol className="flex flex-row items-center justify-center space-x-9">
      <li
        className={`flex items-center ${
          step === 1 ? "text-secondary" : "text-secondary/40"
        } space-x-2.5 rtl:space-x-reverse`}
      >
        <span
          className={`flex items-center justify-center w-8 h-8 border rounded-full shrink-0`}
          style={
            step === 1
              ? {
                  background: "var(--color-green-soft)",
                  color: "var(--color-secondary)",
                  border: "1px solid var(--color-green-soft)",
                }
              : {
                  border: "1px solid var(--color-secondary)",
                  color: "var(--color-secondary)",
                  opacity: 0.4,
                }
          }
        >
          1
        </span>
      </li>
      <li
        className={`flex items-center ${
          step === 2 ? "text-secondary" : "text-secondary/40"
        } space-x-2.5 rtl:space-x-reverse`}
      >
        <span
          className="flex items-center justify-center w-8 h-8 border rounded-full shrink-0"
          style={
            step === 2
              ? {
                  background: "var(--color-green-soft)",
                  color: "var(--color-secondary)",
                  border: "1px solid var(--color-green-soft)",
                }
              : {
                  border: "1px solid var(--color-secondary)",
                  color: "var(--color-secondary)",
                  opacity: 0.4,
                }
          }
        >
          2
        </span>
      </li>
    </ol>
  );
}
