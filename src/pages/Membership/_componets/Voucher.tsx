import { COIN, KYC_TYPE } from "@/config/enums";
import { useStore } from "@/store";
import confetti from "canvas-confetti";
import { JSX, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useAccount, useSignMessage, useWalletClient } from "wagmi";
import usdcImage from "../../../assets/images/tokens/USDC.svg";
import usdtImage from "../../../assets/images/tokens/USDT.svg";
import { useResendKycEmail } from "@/hooks/useKycEmail";
import { generateSiweMessage } from "@/utils/generate-siwe-message.util";
import { useNonce } from "@/hooks/useNonce";
import { ResendKycDto } from "@/services/dtos/resend-kyc.dto";
import { COOLDOWN_KEY } from "@/config/const";
import { useInhabit } from "@/hooks/contracts/inhabit";
import { keccak256, toBytes } from "viem";
import { useUsdt } from "@/hooks/contracts/erc20/useUsdt";
import { useUsdc } from "@/hooks/contracts/erc20/useUsdc";

interface Props {
  kycType: KYC_TYPE;
  price: number;
  requiresHardKyc: boolean;
  selectedCoin?: COIN;
  setSelectedCoin: (coin: COIN) => void;
}

export function VoucherStep(props: Props): JSX.Element {
  // props
  const { price, selectedCoin, requiresHardKyc, kycType, setSelectedCoin } =
    props;

  // hooks
  const [cooldown, setCooldown] = useState<number>(0);
  const [spent, setSpent] = useState<Record<COIN, number>>({
    [COIN.USDC]: 0,
    [COIN.USDT]: 0,
  });

  // external hooks
  const { campaignId, referral } = useParams();

  const { address, chainId } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { signMessageAsync } = useSignMessage();

  const { buyNFT: buyNFTHook } = useInhabit(walletClient);

  const {
    balance: usdcBalance,
    allowance: usdcAllowance,
    refetch: refetchUsdc,
    approve: { mutate: approveUsdc, isPending: isApprovingUsdc },
  } = useUsdc(price, walletClient);

  const {
    balance: usdtBalance,
    allowance: usdtAllowance,
    refetch: refetchUsdt,
    approve: { mutate: approveUsdt, isPending: isApprovingUsdt },
  } = useUsdt(price, walletClient);

  const { mutate: buyNFT, isPending: isBuyingNFT } = buyNFTHook;
  const { mutate: fetchNonce, isPending: isNoncePending } = useNonce();
  const { mutate: resendKycEmail, isPending: isResendingKyc } =
    useResendKycEmail();

  const { collection, isKycHardCompleted, inhabit, usdc, usdt } = useStore();

  // variables
  const effectiveAllowance = useMemo(() => {
    if (!selectedCoin) return 0;
    const onChain = selectedCoin === COIN.USDC ? usdcAllowance : usdtAllowance;
    return onChain - spent[selectedCoin];
  }, [selectedCoin, usdcAllowance, usdtAllowance, spent]);

  const selectedBalance = useMemo(() => {
    if (!selectedCoin) return 0;
    return selectedCoin === COIN.USDC ? usdcBalance : usdtBalance;
  }, [selectedCoin, usdcBalance, usdtBalance]);

  const hasSufficientBalance = selectedBalance >= price;

  const canMint =
    !!selectedCoin && hasSufficientBalance && effectiveAllowance >= price;

  const coins = [
    {
      symbol: COIN.USDC,
      balance: usdcBalance,
    },
    {
      symbol: COIN.USDT,
      balance: usdtBalance,
    },
  ];

  // effects
  useEffect(() => {
    const saved = localStorage.getItem(COOLDOWN_KEY);
    if (saved) {
      const expiresAt = parseInt(saved, 10);
      const now = Math.floor(Date.now() / 1000);
      const remaining = expiresAt - now;
      if (remaining > 0) setCooldown(remaining);
      else localStorage.removeItem(COOLDOWN_KEY);
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(
        () =>
          setCooldown((prev) => {
            const next = prev - 1;
            if (next <= 0) localStorage.removeItem(COOLDOWN_KEY);
            return next;
          }),
        1000
      );
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  // functions

  const onResendKycEMail = async () => {
    if (!address || !chainId) return;

    fetchNonce(address, {
      onSuccess: async (nonce) => {
        if (!nonce) return;

        const message = generateSiweMessage(chainId, address, nonce);
        const signature = await signMessageAsync({ message });
        const dto: ResendKycDto = {
          message,
          signature,
          nonce,
          address,
          kycType,
        };

        resendKycEmail(dto, {
          onSuccess: () => {
            alert("✅ KYC request sent successfully!");
            const expiresAt = Math.floor(Date.now() / 1000) + 180;
            localStorage.setItem(COOLDOWN_KEY, expiresAt.toString());
            setCooldown(180);
          },

          onError: (error) => {
            console.error("❌", error);
            alert("Error sending KYC request. Please try again.");
          },
        });
      },
      onError: (error) => {
        console.error("❌", error);
        alert("Error signing message. Please try again.");
      },
    });
  };

  const onApprove = async () => {
    if (!address || !collection || !campaignId) return;

    let approve;

    if (selectedCoin === COIN.USDC) {
      approve = approveUsdc;
    } else if (selectedCoin === COIN.USDT) {
      approve = approveUsdt;
    }

    const params = {
      spender: inhabit.getAddress(),
      amount: price,
    };

    if (approve) {
      approve(params, {
        onSuccess: async () => {
          await Promise.all([refetchUsdc(), refetchUsdt()]);
          alert(`✅ ${selectedCoin} approved successfully!`);
        },
        onError: (error) => {
          console.error("❌", error);
          alert(`Error approving ${selectedCoin}. Please try again.`);
        },
      });
    }
  };

  const onMint = async () => {
    if (!address || !collection || !campaignId || !selectedCoin) return;

    const currentReferral = referral ?? "";
    const encryptedReferral = keccak256(toBytes(currentReferral));

    const params = {
      campaignId: Number(campaignId),
      collectionAddress: collection.address,
      referral: encryptedReferral,
      token: selectedCoin === COIN.USDC ? usdc.getAddress() : usdt.getAddress(),
    };

    buyNFT(params, {
      onSuccess: async () => {
        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.6 },
        });

        await Promise.all([refetchUsdc(), refetchUsdt()]);
        setSpent((prev) => ({
          ...prev,
          [selectedCoin]: prev[selectedCoin] + price,
        }));

        alert("NFT purchased successfully!");
      },
      onError: (error) => {
        console.error("❌", error);
        alert("Error purchasing NFT. Please try again.");
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Summary */}
      <div className="bg-green-soft/30 rounded-xl p-4 flex flex-col gap-2 mt-2">
        <div className="flex justify-between font-semibold">
          <h4 className="heading-6">Balance</h4>
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
        {address && isKycHardCompleted && !hasSufficientBalance && (
          <label className="text-center p-3 body-S text-light">
            You don't have enough balance to buy this membership
          </label>
        )}
        {address && !requiresHardKyc && !hasSufficientBalance && (
          <label className="text-center p-3 body-S text-light">
            You don't have enough balance to buy this membership
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
        <h4 className="heading-6">Select coin</h4>

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
          </label>
        ))}

        <div className="flex justify-between mt-2">
          <span className="body-S text-light">Total</span>
          <span className="body-S text-light">
            ${price.toFixed(2)} {selectedCoin ?? ""}
          </span>
        </div>
      </div>

      {requiresHardKyc && !isKycHardCompleted && (
        <div className="flex flex-col justify-center items-center p-3">
          <label className="text-center body-S text-light">
            You need to pass the KYC to purchase this NFT.{" "}
            <button
              type="button"
              className={`${
                isNoncePending || isResendingKyc || cooldown > 0
                  ? "text-[#BDBDBD] hover:no-underline cursor-auto"
                  : "text-[#D57300] hover:underline inline normal-case"
              } body-S hover:underline inline normal-case`}
              onClick={onResendKycEMail}
              disabled={isNoncePending || isResendingKyc || cooldown > 0}
            >
              {isNoncePending || isResendingKyc
                ? "Resending KYC request..."
                : cooldown > 0
                ? `Wait ${Math.floor(cooldown / 60)}:${(cooldown % 60)
                    .toString()
                    .padStart(2, "0")} to resend`
                : "Click here to resend KYC request"}
            </button>
          </label>
        </div>
      )}

      <div className="flex justify-center mt-3">
        {!canMint ? (
          <button
            className="btn-primary"
            onClick={onApprove}
            disabled={
              !hasSufficientBalance ||
              !selectedCoin ||
              (requiresHardKyc && !isKycHardCompleted) ||
              isApprovingUsdc ||
              isApprovingUsdt
            }
          >
            {isApprovingUsdc || isApprovingUsdt
              ? "Approving…"
              : `Approve ${selectedCoin ?? ""}`}
          </button>
        ) : (
          <button
            className="btn-primary"
            onClick={onMint}
            disabled={(requiresHardKyc && !isKycHardCompleted) || isBuyingNFT}
          >
            {isBuyingNFT ? "Purchasing…" : "Purchase Membership"}
          </button>
        )}
      </div>
    </div>
  );
}
