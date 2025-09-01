import { COIN, KYC_TYPE } from "@/config/enums";
import { useStore } from "@/store";
import confetti from "canvas-confetti";
import { JSX, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useSignMessage } from "wagmi";
import usdcImage from "../../../assets/images/tokens/USDC.svg";
import usdtImage from "../../../assets/images/tokens/USDT.svg";
import { useResendKycEmail } from "@/hooks/useKycEmail";
import { generateSiweMessage } from "@/utils/generate-siwe-message.util";
import { useNonce } from "@/hooks/useNonce";
import { ResendKycDto } from "@/services/dtos/resend-kyc.dto";
import { COOKIE_REFERRAL, COOLDOWN_KEY } from "@/config/const";
import { useInhabit } from "@/hooks/contracts/inhabit";
import { Hex, keccak256, toBytes } from "viem";
import { useUsdt } from "@/hooks/contracts/erc20/useUsdt";
import { useUsdc } from "@/hooks/contracts/erc20/useUsdc";
import { t } from "i18next";
import Cookies from "js-cookie";
import { useActiveAccount, useActiveWalletChain } from "thirdweb/react";
import { Address } from "thirdweb";

interface Props {
  availableSupply: number;
  kycType: KYC_TYPE;
  price: number;
  requiresHardKyc: boolean;
  selectedCoin?: COIN;
  setSelectedCoin: (coin: COIN) => void;
}

export function VoucherStep(props: Props): JSX.Element {
  // props
  const {
    availableSupply,
    price,
    selectedCoin,
    requiresHardKyc,
    kycType,
    setSelectedCoin,
  } = props;

  // hooks
  const [isProcessing, setIsProcessing] = useState(false);
  const [cooldown, setCooldown] = useState<number>(0);

  // external hooks
  const { campaignId } = useParams();

  const { signMessageAsync } = useSignMessage();

  const account = useActiveAccount();
  const chain = useActiveWalletChain();

  const { buyNFT: buyNFTHook } = useInhabit(account);

  const {
    balance: usdcBalance,
    allowance: usdcAllowance,
    refetch: refetchUsdc,
    approve: { mutate: approveUsdc },
  } = useUsdc(price, account);

  const {
    balance: usdtBalance,
    allowance: usdtAllowance,
    refetch: refetchUsdt,
    approve: { mutate: approveUsdt },
  } = useUsdt(price, account);

  const { mutate: buyNFT } = buyNFTHook;
  const { mutate: fetchNonce, isPending: isNoncePending } = useNonce();
  const { mutate: resendKycEmail, isPending: isResendingKyc } =
    useResendKycEmail();

  const { collection, isKycHardCompleted, inhabit, usdc, usdt } = useStore();

  // variables
  const selectedBalance = useMemo(() => {
    if (!selectedCoin) return 0;
    return selectedCoin === COIN.USDC ? usdcBalance : usdtBalance;
  }, [selectedCoin, usdcBalance, usdtBalance]);

  const hasSufficientBalance = selectedBalance >= price;
  const isAvailable = availableSupply > 0;

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

  useEffect(() => {
    usdc.setAccount(account);
    usdt.setAccount(account);
  }, [account, usdc]);

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
    if (!account || !account?.address || !chain) return;

    fetchNonce(account.address, {
      onSuccess: async (nonce) => {
        if (!nonce) return;

        const message = generateSiweMessage(chain.id, account.address, nonce);
        const signature = await signMessageAsync({ message });
        const dto: ResendKycDto = {
          message,
          signature,
          nonce,
          address: account.address,
          kycType,
        };

        resendKycEmail(dto, {
          onSuccess: () => {
            alert(t("membership.checkout.KYC request sent successfully!"));
            const expiresAt = Math.floor(Date.now() / 1000) + 180;
            localStorage.setItem(COOLDOWN_KEY, expiresAt.toString());
            setCooldown(180);
          },

          onError: (error) => {
            console.error("❌", error);
            alert(
              t(
                "membership.checkout.Error sending KYC request. Please try again"
              )
            );
          },
        });
      },
      onError: (error) => {
        console.error("❌", error);
        alert(
          t("membership.checkout.Error signing message. Please try again.")
        );
      },
    });
  };

  const handlePurchase = async () => {
    if (
      !account ||
      !account.address ||
      !collection ||
      !campaignId ||
      !selectedCoin
    )
      return;

    const isUSDC = selectedCoin === COIN.USDC;
    const approve = isUSDC ? approveUsdc : approveUsdt;
    const refetch = isUSDC ? refetchUsdc : refetchUsdt;
    const tokenAddr = isUSDC ? usdc.getAddress() : usdt.getAddress();

    const cookieReferral = Cookies.get(COOKIE_REFERRAL) as Hex | undefined;

    const referral = cookieReferral ? cookieReferral : keccak256(toBytes(""));

    try {
      setIsProcessing(true);

      await refetch();
      const allowance = isUSDC ? usdcAllowance : usdtAllowance;

      if (allowance < price) {
        await new Promise<void>((resolve, reject) => {
          approve(
            { spender: inhabit.getAddress(), amount: price },
            {
              onSuccess: async () => {
                await refetch();
                resolve();
              },
              onError: reject,
            }
          );
        });
      }

      await new Promise<void>((resolve, reject) => {
        buyNFT(
          {
            campaignId: Number(campaignId),
            collectionAddress: collection.address as Address,
            referral,
            token: tokenAddr as Address,
          },
          {
            onSuccess: async () => {
              await refetch();
              confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
              alert(t("membership.voucher.Membership purchased successfully!"));
              resolve();
            },
            onError: reject,
          }
        );
      });
    } catch (error) {
      console.error("❌", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Summary */}
      <div className="bg-green-soft/30 rounded-xl p-4 flex flex-col gap-2 mt-2">
        <div className="flex justify-between font-semibold">
          <h4 className="heading-6">{t("membership.voucher.Balance")}</h4>
        </div>
        <div className="flex justify-between font-semibold">
          <span className="body-S text-light">
            {t("membership.voucher.USDC")}
          </span>
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
          <span className="body-S text-light">
            {t("membership.voucher.USDT")}
          </span>
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
        {account &&
          account.address &&
          isKycHardCompleted &&
          !hasSufficientBalance && (
            <label className="text-center p-3 body-S text-light">
              {t(
                "membership.voucher.You don't have enough balance to buy this membership"
              )}
            </label>
          )}
        {account &&
          account.address &&
          !requiresHardKyc &&
          !hasSufficientBalance && (
            <label className="text-center p-3 body-S text-light">
              {t(
                "membership.voucher.You don't have enough balance to buy this membership"
              )}
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
        <h4 className="heading-6">{t("membership.voucher.Select coin")}</h4>

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
          <span className="body-S text-light">
            {t("membership.voucher.Total")}
          </span>
          <span className="body-S text-light">
            ${price.toFixed(2)} {selectedCoin ?? ""}
          </span>
        </div>
      </div>

      {requiresHardKyc && !isKycHardCompleted && (
        <div className="flex flex-col justify-center items-center p-3">
          <label className="text-center body-S text-light">
            {isNoncePending || isResendingKyc
              ? t(
                  "membership.voucher.You need to pass the KYC to purchase this NFT."
                )
              : null}
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
                ? t("membership.voucher.Resending KYC request...")
                : cooldown > 0
                ? `${t("membership.voucher.Wait")} ${Math.floor(
                    cooldown / 60
                  )}:${(cooldown % 60).toString().padStart(2, "0")} ${t(
                    "membership.voucher.to resend"
                  )}`
                : t("membership.voucher.Click here to resend KYC request")}
            </button>
          </label>
        </div>
      )}

      <div className="flex justify-center mt-3">
        <button
          className="btn-primary"
          onClick={handlePurchase}
          disabled={
            !isAvailable ||
            !hasSufficientBalance ||
            !selectedCoin ||
            isProcessing ||
            (requiresHardKyc && !isKycHardCompleted)
          }
        >
          {isProcessing ? (
            <span>{t("membership.voucher.Processing…")}</span>
          ) : (
            t("membership.voucher.Purchase Membership")
          )}
        </button>
      </div>
    </div>
  );
}
