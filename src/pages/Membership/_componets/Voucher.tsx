import { COIN, KYC_TYPE } from "@/config/enums";
import { useStore } from "@/store";
import confetti from "canvas-confetti";
import { JSX, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useSignMessage } from "wagmi";
import usdcImage from "../../../assets/images/tokens/USDC.svg";
import usdtImage from "../../../assets/images/tokens/USDT.svg";
import cusdImage from "../../../assets/images/tokens/cUSD.svg";
import { useResendKycEmail } from "@/hooks/useKycEmail";
import { generateSiweMessage } from "@/utils/generate-siwe-message.util";
import { useNonce } from "@/hooks/useNonce";
import { ResendKycDto } from "@/services/dtos/resend-kyc.dto";
import { COOKIE_REFERRAL, COOLDOWN_KEY } from "@/config/const";
import { useInhabit } from "@/hooks/contracts/inhabit";
import { encodeFunctionData, Hex, keccak256, toBytes } from "viem";
import { useUsdt } from "@/hooks/contracts/erc20/useUsdt";
import { useUsdc } from "@/hooks/contracts/erc20/useUsdc";
import mastercardImage from "../../../assets/images/cards/mastercard.svg";
import visaImage from "../../../assets/images/cards/visa.svg";
import { t } from "i18next";
import Cookies from "js-cookie";
import { BuyWidget, TransactionWidget } from "thirdweb/react";
import { chain as thirdwebChain, client } from "@/config/const";
import {
  useActiveAccount,
  useActiveWallet,
  useActiveWalletChain,
} from "thirdweb/react";
import { Address } from "thirdweb";
import { parseUsdToUsdc } from "@/utils/usdc-format.utils";
import { celo } from "thirdweb/chains";
import { useCusd } from "@/hooks/contracts/erc20/useCusd";

interface Props {
  availableSupply: number;
  kycType: KYC_TYPE;
  price: number;
  requiresHardKyc: boolean;
  selectedCoin?: COIN;
  onWalletDisconnect: () => void;
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
    onWalletDisconnect,
    setSelectedCoin,
  } = props;

  // hooks
  const [isProcessing, setIsProcessing] = useState(false);
  const [cooldown, setCooldown] = useState<number>(0);
  const [showCreditCardModal, setShowCreditCardModal] = useState(false);

  // external hooks
  const { campaignId } = useParams();

  const account = useActiveAccount();
  const chain = useActiveWalletChain();
  const wallet = useActiveWallet();

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

  const {
    balance: cusdBalance,
    allowance: cusdAllowance,
    refetch: refetchCusd,
    approve: { mutate: approveCusd },
  } = useCusd(price, account);

  const { mutate: buyNFT } = buyNFTHook;
  const { mutate: fetchNonce, isPending: isNoncePending } = useNonce();
  const { mutate: resendKycEmail, isPending: isResendingKyc } =
    useResendKycEmail();

  const { collection, isKycHardCompleted, inhabit, usdc, usdt, cusd } =
    useStore();

  // variables
  const coins = [
    {
      symbol: COIN.CUSD,
      balance: cusdBalance,
    },
    {
      symbol: COIN.USDC,
      balance: usdcBalance,
    },
    {
      symbol: COIN.USDT,
      balance: usdtBalance,
    },
  ];

  const cookieReferral = Cookies.get(COOKIE_REFERRAL) as Hex | undefined;
  const referral = cookieReferral ? cookieReferral : keccak256(toBytes(""));

  const selectedBalance = useMemo(() => {
    if (usdcBalance >= price) {
      return usdcBalance;
    } else if (usdtBalance >= price) {
      return usdtBalance;
    } else if (cusdBalance >= price) {
      return cusdBalance;
    } else {
      return 0;
    }
  }, [selectedCoin, usdcBalance, usdtBalance, cusdBalance]);

  const hasSufficientBalance = selectedBalance >= price;
  const isAvailable = availableSupply > 0;

  // effects
  useEffect(() => {
    usdc.setAccount(account);
    usdt.setAccount(account);
    cusd.setAccount(account);
  }, [account, usdc]);

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

  /// Reset to step 1 if wallet is disconnected
  useEffect(() => {
    if (!account) {
      if (onWalletDisconnect) {
        onWalletDisconnect();
      }
    }
  }, [account, onWalletDisconnect]);

  // functions
  const onResendKycEMail = async () => {
    if (!account || !account?.address || !chain) return;

    fetchNonce(account.address as Address, {
      onSuccess: async (nonce) => {
        if (!nonce) return;

        const message = generateSiweMessage(
          chain.id,
          account?.address as Address,
          nonce
        );
        const signature = await account.signMessage({ message });
        const dto: ResendKycDto = {
          message,
          signature,
          nonce,
          address: account.address as Address,
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
    const isUSDT = selectedCoin === COIN.USDT;
    const isCUSD = selectedCoin === COIN.CUSD;
    const approve = isUSDC ? approveUsdc : isUSDT ? approveUsdt : approveCusd;
    const refetch = isUSDC ? refetchUsdc : isUSDT ? refetchUsdt : refetchCusd;
    const tokenAddr = isUSDC
      ? usdc.getAddress()
      : isUSDT
      ? usdt.getAddress()
      : cusd.getAddress();

    try {
      setIsProcessing(true);

      await refetch();
      const allowance = isUSDC
        ? usdcAllowance
        : isUSDT
        ? usdtAllowance
        : cusdAllowance;

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
            to: account.address as Address,
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

  const handleCoinSelection = (coin: COIN | "CREDIT CARD") => {
    if (coin === "CREDIT CARD") {
      setShowCreditCardModal(true);
    } else {
      setSelectedCoin(coin);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Summary */}
      <div className="bg-green-soft/30 rounded-xl p-4 flex flex-col gap-2 mt-2">
        <div className="flex justify-between font-semibold">
          <h4 className="heading-6">{t("membership.voucher.Balance")}</h4>
        </div>
        {/* CUSD */}
        <div className="flex justify-between font-semibold">
          <span className="body-S text-light">
            {t("membership.voucher.CUSD")}
          </span>
          <div className="flex items-center space-x-3">
            <span className="body-S text-light">${cusdBalance.toFixed(2)}</span>
            <img
              src={cusdImage}
              alt="CUSD"
              className="inline-block w-9 h-9 ml-1"
            />
          </div>
        </div>
        {/* USDC */}
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
        {/* USDT */}
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
              alt="USDT"
              className="inline-block w-9 h-9 ml-1"
            />
          </div>
          {/* Credit Card */}
        </div>
        <label
          key="CREDIT CARD"
          className={`flex items-center gap-3 cursor-pointer ${
            wallet?.id !== "inApp" ? "opacity-40 cursor-not-allowed" : ""
          }`}
        >
          <button
            className="flex items-center justify-center bg-white rounded-full p-2"
            type="button"
            name="coin"
            value="CREDIT CARD"
            disabled={wallet?.id !== "inApp"}
            onClick={() => handleCoinSelection("CREDIT CARD" as COIN)}
          >
            <img
              src={mastercardImage}
              alt="mastercard"
              className="w-9 h-9 ml-1"
            />
            <img src={visaImage} alt="visa" className="w-9 h-9 ml-1" />
          </button>
          <span
            className={`body-S ${
              wallet?.id !== "inApp"
                ? "cursor-default hover:no-underline"
                : "hover:text-[#D57300] hover:underline"
            }`}
          >
            {t("membership.voucher.Pay with credit card")}
          </span>
        </label>
        {account &&
          account.address &&
          isKycHardCompleted &&
          !hasSufficientBalance && (
            <label className="text-center p-3 body-S text-light">
              {t(
                "membership.voucher.You don't have enough balance to purchase this membership. Please recharge your wallet using a credit card or cryptocurrency."
              )}
            </label>
          )}
        {account &&
          account.address &&
          !requiresHardKyc &&
          !hasSufficientBalance && (
            <label className="text-center p-3 body-S text-light">
              {t(
                "membership.voucher.You don't have enough balance to purchase this membership. Please recharge your wallet using a credit card or cryptocurrency."
              )}
            </label>
          )}
      </div>
      <div className="bg-green-soft/30 rounded-xl p-4 flex flex-col gap-4">
        <h4 className="heading-6">{t("membership.voucher.Select coin")}</h4>

        {coins.map((c) => {
          const isDisabled =
            c.balance < price || (requiresHardKyc && !isKycHardCompleted);

          return (
            <label
              key={c.symbol}
              className={`flex items-center gap-3 cursor-pointer ${
                isDisabled ? "opacity-40 cursor-not-allowed" : ""
              }`}
            >
              <input
                type="radio"
                name="coin"
                value={c.symbol}
                disabled={isDisabled}
                checked={selectedCoin === c.symbol}
                onChange={() => handleCoinSelection(c.symbol as COIN)}
                className="custom-checkbox"
              />
              <span className="body-S">{c.symbol}</span>
            </label>
          );
        })}

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

      {/* Modal to purchase with credit card */}
      {showCreditCardModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => {
            setShowCreditCardModal(false);
            if (usdcBalance >= price) {
              setSelectedCoin(COIN.USDC);
            } else if (usdtBalance >= price) {
              setSelectedCoin(COIN.USDT);
            } else if (cusdBalance >= price) {
              setSelectedCoin(COIN.CUSD);
            } else {
              setSelectedCoin(undefined);
            }
          }}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <BuyWidget
              client={client}
              chain={thirdwebChain}
              amount={price.toString()}
              tokenAddress={usdt.getAddress()}
              paymentMethods={["card"]}
              currency="USD"
              onSuccess={() => {
                alert(t("membership.voucher.Wallet charged successfully"));
                setShowCreditCardModal(false);
                refetchUsdc();
                refetchUsdt();
              }}
              onError={(error) => {
                console.error("❌", error);
                alert(t("membership.voucher.Error charging wallet"));
              }}
              onCancel={() => {
                setShowCreditCardModal(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

{
  /* <TransactionWidget
              amount={"0"}
              client={client}
              theme="dark"
              transaction={{
                to: "0x745A3D77a62fBeEE9a0DCA10eDEd710199A3dd15",
                data: encodeFunctionData({
                  abi: [
                    {
                      type: "constructor",
                      stateMutability: "undefined",
                      payable: false,
                      inputs: [],
                    },
                    {
                      type: "error",
                      name: "ALREADY_INITIALIZED_STRATEGY",
                      inputs: [],
                    },
                    {
                      type: "error",
                      name: "AMBASSADOR_ALREADY_EXISTS",
                      inputs: [],
                    },
                    {
                      type: "error",
                      name: "AMBASSADOR_NOT_FOUND",
                      inputs: [],
                    },
                    {
                      type: "error",
                      name: "AMOUNT_MISMATCH",
                      inputs: [],
                    },
                    {
                      type: "error",
                      name: "AccessControlBadConfirmation",
                      inputs: [],
                    },
                    {
                      type: "error",
                      name: "AccessControlUnauthorizedAccount",
                      inputs: [
                        {
                          type: "address",
                          name: "account",
                        },
                        {
                          type: "bytes32",
                          name: "neededRole",
                        },
                      ],
                    },
                    {
                      type: "error",
                      name: "CAMPAIGN_NOT_ACTIVE",
                      inputs: [],
                    },
                    {
                      type: "error",
                      name: "CAMPAIGN_NOT_FOUND",
                      inputs: [],
                    },
                    {
                      type: "error",
                      name: "COLLECTION_NOT_ACTIVE",
                      inputs: [],
                    },
                    {
                      type: "error",
                      name: "COLLECTION_NOT_FOUND",
                      inputs: [],
                    },
                    {
                      type: "error",
                      name: "EMPTY_ARRAY",
                      inputs: [],
                    },
                    {
                      type: "error",
                      name: "EMPTY_STRING",
                      inputs: [],
                    },
                    {
                      type: "error",
                      name: "FailedDeployment",
                      inputs: [],
                    },
                    {
                      type: "error",
                      name: "GROUP_ALREADY_EXISTS",
                      inputs: [],
                    },
                    {
                      type: "error",
                      name: "GROUP_NOT_ACTIVE",
                      inputs: [],
                    },
                    {
                      type: "error",
                      name: "GROUP_NOT_FOUND",
                      inputs: [],
                    },
                    {
                      type: "error",
                      name: "INSUFFICIENT_ALLOWANCE",
                      inputs: [],
                    },
                    {
                      type: "error",
                      name: "INSUFFICIENT_FUNDS",
                      inputs: [],
                    },
                    {
                      type: "error",
                      name: "INSUFFICIENT_SUPPLY",
                      inputs: [],
                    },
                    {
                      type: "error",
                      name: "INVALID",
                      inputs: [],
                    },
                    {
                      type: "error",
                      name: "INVALID_ADDRESS",
                      inputs: [],
                    },
                    {
                      type: "error",
                      name: "INVALID_AMBASSADORS",
                      inputs: [],
                    },
                    {
                      type: "error",
                      name: "INVALID_AMOUNT",
                      inputs: [],
                    },
                    {
                      type: "error",
                      name: "INVALID_CAMPAIGN_ID",
                      inputs: [],
                    },
                    {
                      type: "error",
                      name: "INVALID_GOAL",
                      inputs: [],
                    },
                    {
                      type: "error",
                      name: "INVALID_INDEX",
                      inputs: [],
                    },
                    {
                      type: "error",
                      name: "INVALID_PRICE",
                      inputs: [],
                    },
                    {
                      type: "error",
                      name: "INVALID_REFERRAL",
                      inputs: [],
                    },
                    {
                      type: "error",
                      name: "INVALID_SUPPLY",
                      inputs: [],
                    },
                    {
                      type: "error",
                      name: "INVALID_TOKEN_ID",
                      inputs: [],
                    },
                    {
                      type: "error",
                      name: "InsufficientBalance",
                      inputs: [
                        {
                          type: "uint256",
                          name: "balance",
                        },
                        {
                          type: "uint256",
                          name: "needed",
                        },
                      ],
                    },
                    {
                      type: "error",
                      name: "InvalidInitialization",
                      inputs: [],
                    },
                    {
                      type: "error",
                      name: "MISMATCHED_LENGTH",
                      inputs: [],
                    },
                    {
                      type: "error",
                      name: "NOT_APPROVED",
                      inputs: [],
                    },
                    {
                      type: "error",
                      name: "NOT_INITIALIZED",
                      inputs: [],
                    },
                    {
                      type: "error",
                      name: "NOT_NFT_OWNER",
                      inputs: [],
                    },
                    {
                      type: "error",
                      name: "NotInitializing",
                      inputs: [],
                    },
                    {
                      type: "error",
                      name: "PERCENTAGE_ERROR",
                      inputs: [],
                    },
                    {
                      type: "error",
                      name: "PURCHASE_NOT_FOUND",
                      inputs: [],
                    },
                    {
                      type: "error",
                      name: "REFERRAL_ALREADY_EXISTS",
                      inputs: [],
                    },
                    {
                      type: "error",
                      name: "REFERRAL_NOT_FOUND",
                      inputs: [],
                    },
                    {
                      type: "error",
                      name: "REFUND_ALREADY_CLAIMED",
                      inputs: [],
                    },
                    {
                      type: "error",
                      name: "ReentrancyGuardReentrantCall",
                      inputs: [],
                    },
                    {
                      type: "error",
                      name: "SAME_ADDRESS",
                      inputs: [],
                    },
                    {
                      type: "error",
                      name: "SAME_STATE",
                      inputs: [],
                    },
                    {
                      type: "error",
                      name: "TOKEN_ALREADY_EXISTS",
                      inputs: [],
                    },
                    {
                      type: "error",
                      name: "TOKEN_NOT_FOUND",
                      inputs: [],
                    },
                    {
                      type: "error",
                      name: "TOKEN_NOT_SUPPORTED",
                      inputs: [],
                    },
                    {
                      type: "error",
                      name: "UNAUTHORIZED",
                      inputs: [],
                    },
                    {
                      type: "error",
                      name: "ZERO_ADDRESS",
                      inputs: [],
                    },
                    {
                      type: "event",
                      anonymous: false,
                      name: "AmbassadorAdded",
                      inputs: [
                        {
                          type: "uint256",
                          name: "campaignId",
                          indexed: true,
                        },
                        {
                          type: "uint256",
                          name: "groupId",
                          indexed: true,
                        },
                        {
                          type: "address",
                          name: "ambassador",
                          indexed: false,
                        },
                        {
                          type: "uint256",
                          name: "fee",
                          indexed: false,
                        },
                      ],
                    },
                    {
                      type: "event",
                      anonymous: false,
                      name: "AmbassadorRemoved",
                      inputs: [
                        {
                          type: "uint256",
                          name: "campaignId",
                          indexed: true,
                        },
                        {
                          type: "uint256",
                          name: "groupId",
                          indexed: true,
                        },
                        {
                          type: "address",
                          name: "ambassador",
                          indexed: false,
                        },
                      ],
                    },
                    {
                      type: "event",
                      anonymous: false,
                      name: "AmbassadorSet",
                      inputs: [
                        {
                          type: "uint256",
                          name: "campaignId",
                          indexed: true,
                        },
                        {
                          type: "uint256",
                          name: "groupId",
                          indexed: true,
                        },
                        {
                          type: "address",
                          name: "ambassador",
                          indexed: false,
                        },
                        {
                          type: "uint256",
                          name: "fee",
                          indexed: false,
                        },
                      ],
                    },
                    {
                      type: "event",
                      anonymous: false,
                      name: "CampaignCreated",
                      inputs: [
                        {
                          type: "address",
                          name: "creator",
                          indexed: true,
                        },
                        {
                          type: "uint256",
                          name: "campaignId",
                          indexed: true,
                        },
                        {
                          type: "uint256",
                          name: "goal",
                          indexed: false,
                        },
                        {
                          type: "bool",
                          name: "state",
                          indexed: false,
                        },
                        {
                          type: "address[]",
                          name: "collections",
                        },
                      ],
                    },
                    {
                      type: "event",
                      anonymous: false,
                      name: "CampaignOwnershipTransferred",
                      inputs: [
                        {
                          type: "uint256",
                          name: "campaignId",
                          indexed: true,
                        },
                        {
                          type: "address",
                          name: "oldOwner",
                          indexed: true,
                        },
                        {
                          type: "address",
                          name: "newOwner",
                          indexed: true,
                        },
                      ],
                    },
                    {
                      type: "event",
                      anonymous: false,
                      name: "CampaignStatusUpdated",
                      inputs: [
                        {
                          type: "uint256",
                          name: "campaignId",
                          indexed: true,
                        },
                        {
                          type: "bool",
                          name: "status",
                          indexed: false,
                        },
                      ],
                    },
                    {
                      type: "event",
                      anonymous: false,
                      name: "CampaignStatusUpdated",
                      inputs: [
                        {
                          type: "uint256",
                          name: "campaignId",
                          indexed: true,
                        },
                        {
                          type: "bool",
                          name: "oldState",
                          indexed: false,
                        },
                        {
                          type: "bool",
                          name: "newState",
                          indexed: false,
                        },
                      ],
                    },
                    {
                      type: "event",
                      anonymous: false,
                      name: "CollectionAdded",
                      inputs: [
                        {
                          type: "address",
                          name: "owner",
                          indexed: true,
                        },
                        {
                          type: "uint256",
                          name: "campaignId",
                          indexed: true,
                        },
                        {
                          type: "uint256",
                          name: "collectionId",
                          indexed: false,
                        },
                        {
                          type: "address",
                          name: "collectionAddress",
                          indexed: true,
                        },
                        {
                          type: "string",
                          name: "name",
                          indexed: false,
                        },
                        {
                          type: "string",
                          name: "symbol",
                          indexed: false,
                        },
                        {
                          type: "string",
                          name: "uri",
                          indexed: false,
                        },
                        {
                          type: "uint256",
                          name: "supply",
                          indexed: false,
                        },
                        {
                          type: "uint256",
                          name: "price",
                          indexed: false,
                        },
                        {
                          type: "bool",
                          name: "state",
                          indexed: false,
                        },
                      ],
                    },
                    {
                      type: "event",
                      anonymous: false,
                      name: "CollectionBaseURIUpdated",
                      inputs: [
                        {
                          type: "uint256",
                          name: "campaignId",
                          indexed: true,
                        },
                        {
                          type: "address",
                          name: "collection",
                          indexed: true,
                        },
                        {
                          type: "string",
                          name: "baseURI",
                          indexed: false,
                        },
                      ],
                    },
                    {
                      type: "event",
                      anonymous: false,
                      name: "CollectionCreated",
                      inputs: [
                        {
                          type: "address",
                          name: "owner",
                          indexed: true,
                        },
                        {
                          type: "uint256",
                          name: "campaignId",
                          indexed: true,
                        },
                        {
                          type: "uint256",
                          name: "collectionId",
                          indexed: false,
                        },
                        {
                          type: "address",
                          name: "collectionAddress",
                          indexed: true,
                        },
                        {
                          type: "string",
                          name: "name",
                          indexed: false,
                        },
                        {
                          type: "string",
                          name: "symbol",
                          indexed: false,
                        },
                        {
                          type: "string",
                          name: "uri",
                          indexed: false,
                        },
                        {
                          type: "uint256",
                          name: "supply",
                          indexed: false,
                        },
                        {
                          type: "uint256",
                          name: "price",
                          indexed: false,
                        },
                        {
                          type: "bool",
                          name: "state",
                          indexed: false,
                        },
                      ],
                    },
                    {
                      type: "event",
                      anonymous: false,
                      name: "CollectionPriceUpdated",
                      inputs: [
                        {
                          type: "uint256",
                          name: "campaignId",
                          indexed: true,
                        },
                        {
                          type: "address",
                          name: "collection",
                          indexed: true,
                        },
                        {
                          type: "uint256",
                          name: "price",
                          indexed: false,
                        },
                      ],
                    },
                    {
                      type: "event",
                      anonymous: false,
                      name: "CollectionStateUpdated",
                      inputs: [
                        {
                          type: "uint256",
                          name: "campaignId",
                          indexed: true,
                        },
                        {
                          type: "address",
                          name: "collection",
                          indexed: true,
                        },
                        {
                          type: "bool",
                          name: "state",
                          indexed: false,
                        },
                      ],
                    },
                    {
                      type: "event",
                      anonymous: false,
                      name: "CollectionSupplyUpdated",
                      inputs: [
                        {
                          type: "uint256",
                          name: "campaignId",
                          indexed: true,
                        },
                        {
                          type: "address",
                          name: "collection",
                          indexed: true,
                        },
                        {
                          type: "uint256",
                          name: "supply",
                          indexed: false,
                        },
                      ],
                    },
                    {
                      type: "event",
                      anonymous: false,
                      name: "Distributed",
                      inputs: [
                        {
                          type: "address",
                          name: "embassador",
                          indexed: true,
                        },
                        {
                          type: "uint256",
                          name: "amount",
                          indexed: false,
                        },
                      ],
                    },
                    {
                      type: "event",
                      anonymous: false,
                      name: "GroupCreated",
                      inputs: [
                        {
                          type: "uint256",
                          name: "campaignId",
                          indexed: true,
                        },
                        {
                          type: "uint256",
                          name: "groupId",
                          indexed: true,
                        },
                        {
                          type: "bytes32",
                          name: "referral",
                          indexed: false,
                        },
                        {
                          type: "bool",
                          name: "state",
                          indexed: false,
                        },
                        {
                          type: "tuple[]",
                          name: "ambassadors",
                          components: [
                            {
                              type: "address",
                              name: "account",
                            },
                            {
                              type: "uint256",
                              name: "fee",
                            },
                          ],
                        },
                      ],
                    },
                    {
                      type: "event",
                      anonymous: false,
                      name: "GroupReferralSet",
                      inputs: [
                        {
                          type: "uint256",
                          name: "campaignId",
                          indexed: true,
                        },
                        {
                          type: "uint256",
                          name: "groupId",
                          indexed: true,
                        },
                        {
                          type: "bytes32",
                          name: "referral",
                          indexed: false,
                        },
                      ],
                    },
                    {
                      type: "event",
                      anonymous: false,
                      name: "GroupStatusSet",
                      inputs: [
                        {
                          type: "uint256",
                          name: "campaignId",
                          indexed: true,
                        },
                        {
                          type: "uint256",
                          name: "groupId",
                          indexed: true,
                        },
                        {
                          type: "bool",
                          name: "status",
                          indexed: false,
                        },
                      ],
                    },
                    {
                      type: "event",
                      anonymous: false,
                      name: "Initialized",
                      inputs: [
                        {
                          type: "uint64",
                          name: "version",
                          indexed: false,
                        },
                      ],
                    },
                    {
                      type: "event",
                      anonymous: false,
                      name: "NFTPurchased",
                      inputs: [
                        {
                          type: "uint256",
                          name: "campaignId",
                          indexed: true,
                        },
                        {
                          type: "address",
                          name: "collectionId",
                          indexed: true,
                        },
                        {
                          type: "address",
                          name: "buyer",
                          indexed: true,
                        },
                        {
                          type: "address",
                          name: "paymentToken",
                          indexed: false,
                        },
                        {
                          type: "uint256",
                          name: "price",
                          indexed: false,
                        },
                        {
                          type: "uint256",
                          name: "tokenId",
                          indexed: false,
                        },
                        {
                          type: "uint256",
                          name: "purchaseTimestamp",
                          indexed: false,
                        },
                      ],
                    },
                    {
                      type: "event",
                      anonymous: false,
                      name: "NftCollectionUpdated",
                      inputs: [
                        {
                          type: "address",
                          name: "collection",
                          indexed: true,
                        },
                      ],
                    },
                    {
                      type: "event",
                      anonymous: false,
                      name: "RefundClaimed",
                      inputs: [
                        {
                          type: "uint256",
                          name: "campaignId",
                          indexed: true,
                        },
                        {
                          type: "address",
                          name: "collectionId",
                          indexed: true,
                        },
                        {
                          type: "uint256",
                          name: "tokenId",
                          indexed: false,
                        },
                        {
                          type: "address",
                          name: "claimer",
                          indexed: true,
                        },
                        {
                          type: "address",
                          name: "paymentToken",
                          indexed: false,
                        },
                        {
                          type: "uint256",
                          name: "amount",
                          indexed: false,
                        },
                      ],
                    },
                    {
                      type: "event",
                      anonymous: false,
                      name: "RefundEstablished",
                      inputs: [
                        {
                          type: "uint256",
                          name: "campaignId",
                          indexed: true,
                        },
                        {
                          type: "address",
                          name: "collectionId",
                          indexed: true,
                        },
                        {
                          type: "address",
                          name: "paymentToken",
                          indexed: false,
                        },
                        {
                          type: "uint256",
                          name: "amountPerNFT",
                          indexed: false,
                        },
                        {
                          type: "uint256",
                          name: "totalRefundAmount",
                          indexed: false,
                        },
                        {
                          type: "uint256",
                          name: "totalNFTsSold",
                          indexed: false,
                        },
                      ],
                    },
                    {
                      type: "event",
                      anonymous: false,
                      name: "RoleAdminChanged",
                      inputs: [
                        {
                          type: "bytes32",
                          name: "role",
                          indexed: true,
                        },
                        {
                          type: "bytes32",
                          name: "previousAdminRole",
                          indexed: true,
                        },
                        {
                          type: "bytes32",
                          name: "newAdminRole",
                          indexed: true,
                        },
                      ],
                    },
                    {
                      type: "event",
                      anonymous: false,
                      name: "RoleGranted",
                      inputs: [
                        {
                          type: "bytes32",
                          name: "role",
                          indexed: true,
                        },
                        {
                          type: "address",
                          name: "account",
                          indexed: true,
                        },
                        {
                          type: "address",
                          name: "sender",
                          indexed: true,
                        },
                      ],
                    },
                    {
                      type: "event",
                      anonymous: false,
                      name: "RoleRevoked",
                      inputs: [
                        {
                          type: "bytes32",
                          name: "role",
                          indexed: true,
                        },
                        {
                          type: "address",
                          name: "account",
                          indexed: true,
                        },
                        {
                          type: "address",
                          name: "sender",
                          indexed: true,
                        },
                      ],
                    },
                    {
                      type: "event",
                      anonymous: false,
                      name: "TokenAdded",
                      inputs: [
                        {
                          type: "address",
                          name: "token",
                          indexed: false,
                        },
                      ],
                    },
                    {
                      type: "event",
                      anonymous: false,
                      name: "TokenRemoved",
                      inputs: [
                        {
                          type: "address",
                          name: "token",
                          indexed: false,
                        },
                      ],
                    },
                    {
                      type: "event",
                      anonymous: false,
                      name: "TreasuryUpdated",
                      inputs: [
                        {
                          type: "address",
                          name: "oldTreasury",
                          indexed: true,
                        },
                        {
                          type: "address",
                          name: "newTreasury",
                          indexed: true,
                        },
                      ],
                    },
                    {
                      type: "function",
                      name: "ADMIN_ROLE",
                      constant: true,
                      stateMutability: "view",
                      payable: false,
                      inputs: [],
                      outputs: [
                        {
                          type: "bytes32",
                          name: "",
                        },
                      ],
                    },
                    {
                      type: "function",
                      name: "DEFAULT_ADMIN_ROLE",
                      constant: true,
                      stateMutability: "view",
                      payable: false,
                      inputs: [],
                      outputs: [
                        {
                          type: "bytes32",
                          name: "",
                        },
                      ],
                    },
                    {
                      type: "function",
                      name: "NATIVE",
                      constant: true,
                      stateMutability: "view",
                      payable: false,
                      inputs: [],
                      outputs: [
                        {
                          type: "address",
                          name: "",
                        },
                      ],
                    },
                    {
                      type: "function",
                      name: "USER_ROLE",
                      constant: true,
                      stateMutability: "view",
                      payable: false,
                      inputs: [],
                      outputs: [
                        {
                          type: "bytes32",
                          name: "",
                        },
                      ],
                    },
                    {
                      type: "function",
                      name: "activeBalance",
                      constant: true,
                      stateMutability: "view",
                      payable: false,
                      inputs: [
                        {
                          type: "address",
                          name: "_token",
                        },
                      ],
                      outputs: [
                        {
                          type: "uint256",
                          name: "",
                        },
                      ],
                    },
                    {
                      type: "function",
                      name: "addAdmin",
                      constant: false,
                      payable: false,
                      inputs: [
                        {
                          type: "address",
                          name: "_admin",
                        },
                      ],
                      outputs: [],
                    },
                    {
                      type: "function",
                      name: "addAmbassadors",
                      constant: false,
                      payable: false,
                      inputs: [
                        {
                          type: "uint256",
                          name: "_campaignId",
                        },
                        {
                          type: "bytes32",
                          name: "_referral",
                        },
                        {
                          type: "tuple[]",
                          name: "_ambassadors",
                          components: [
                            {
                              type: "address",
                              name: "account",
                            },
                            {
                              type: "uint256",
                              name: "fee",
                            },
                          ],
                        },
                      ],
                      outputs: [],
                    },
                    {
                      type: "function",
                      name: "addCollection",
                      constant: false,
                      payable: false,
                      inputs: [
                        {
                          type: "uint256",
                          name: "_campaignId",
                        },
                        {
                          type: "tuple",
                          name: "_p",
                          components: [
                            {
                              type: "uint256",
                              name: "campaignId",
                            },
                            {
                              type: "uint256",
                              name: "collectionId",
                            },
                            {
                              type: "string",
                              name: "name",
                            },
                            {
                              type: "string",
                              name: "symbol",
                            },
                            {
                              type: "string",
                              name: "uri",
                            },
                            {
                              type: "uint256",
                              name: "supply",
                            },
                            {
                              type: "uint256",
                              name: "price",
                            },
                            {
                              type: "bool",
                              name: "state",
                            },
                          ],
                        },
                      ],
                      outputs: [],
                    },
                    {
                      type: "function",
                      name: "addToToken",
                      constant: false,
                      payable: false,
                      inputs: [
                        {
                          type: "address",
                          name: "_token",
                        },
                      ],
                      outputs: [],
                    },
                    {
                      type: "function",
                      name: "addUser",
                      constant: false,
                      payable: false,
                      inputs: [
                        {
                          type: "address",
                          name: "_user",
                        },
                      ],
                      outputs: [],
                    },
                    {
                      type: "function",
                      name: "buyNFT",
                      constant: false,
                      payable: false,
                      inputs: [
                        {
                          type: "address",
                          name: "_to",
                        },
                        {
                          type: "uint256",
                          name: "_campaignId",
                        },
                        {
                          type: "address",
                          name: "_collection",
                        },
                        {
                          type: "bytes32",
                          name: "_referral",
                        },
                        {
                          type: "address",
                          name: "_paymentToken",
                        },
                      ],
                      outputs: [],
                    },
                    {
                      type: "function",
                      name: "calculateFee",
                      constant: true,
                      stateMutability: "pure",
                      payable: false,
                      inputs: [
                        {
                          type: "uint256",
                          name: "_amount",
                        },
                        {
                          type: "uint256",
                          name: "_porcentaje",
                        },
                      ],
                      outputs: [
                        {
                          type: "uint256",
                          name: "fee",
                        },
                      ],
                    },
                    {
                      type: "function",
                      name: "createCampaign",
                      constant: false,
                      payable: false,
                      inputs: [
                        {
                          type: "uint256",
                          name: "_goal",
                        },
                        {
                          type: "tuple[]",
                          name: "_collectionsParams",
                          components: [
                            {
                              type: "string",
                              name: "name",
                            },
                            {
                              type: "string",
                              name: "symbol",
                            },
                            {
                              type: "string",
                              name: "uri",
                            },
                            {
                              type: "uint256",
                              name: "supply",
                            },
                            {
                              type: "uint256",
                              name: "price",
                            },
                            {
                              type: "bool",
                              name: "state",
                            },
                          ],
                        },
                      ],
                      outputs: [],
                    },
                    {
                      type: "function",
                      name: "createGroup",
                      constant: false,
                      payable: false,
                      inputs: [
                        {
                          type: "uint256",
                          name: "_campaignId",
                        },
                        {
                          type: "tuple",
                          name: "_groupParams",
                          components: [
                            {
                              type: "string",
                              name: "referral",
                            },
                            {
                              type: "tuple[]",
                              name: "ambassadors",
                              components: [
                                {
                                  type: "address",
                                  name: "account",
                                },
                                {
                                  type: "uint256",
                                  name: "fee",
                                },
                              ],
                            },
                            {
                              type: "bool",
                              name: "state",
                            },
                          ],
                        },
                      ],
                      outputs: [],
                    },
                    {
                      type: "function",
                      name: "encriptReferral",
                      constant: true,
                      stateMutability: "pure",
                      payable: false,
                      inputs: [
                        {
                          type: "string",
                          name: "_referral",
                        },
                      ],
                      outputs: [
                        {
                          type: "bytes32",
                          name: "",
                        },
                      ],
                    },
                    {
                      type: "function",
                      name: "getActiveBalance",
                      constant: true,
                      stateMutability: "view",
                      payable: false,
                      inputs: [
                        {
                          type: "uint256",
                          name: "_campaignId",
                        },
                        {
                          type: "address",
                          name: "_collection",
                        },
                        {
                          type: "address",
                          name: "_token",
                        },
                      ],
                      outputs: [
                        {
                          type: "uint256",
                          name: "",
                        },
                      ],
                    },
                    {
                      type: "function",
                      name: "getCampaign",
                      constant: true,
                      stateMutability: "view",
                      payable: false,
                      inputs: [
                        {
                          type: "uint256",
                          name: "_id",
                        },
                      ],
                      outputs: [
                        {
                          type: "tuple",
                          name: "",
                          components: [
                            {
                              type: "uint256",
                              name: "id",
                            },
                            {
                              type: "uint256",
                              name: "goal",
                            },
                            {
                              type: "uint256",
                              name: "fundsRaised",
                            },
                            {
                              type: "address",
                              name: "owner",
                            },
                            {
                              type: "address[]",
                              name: "collections",
                            },
                            {
                              type: "bool",
                              name: "state",
                            },
                          ],
                        },
                      ],
                    },
                    {
                      type: "function",
                      name: "getCampaignCount",
                      constant: true,
                      stateMutability: "view",
                      payable: false,
                      inputs: [],
                      outputs: [
                        {
                          type: "uint256",
                          name: "",
                        },
                      ],
                    },
                    {
                      type: "function",
                      name: "getCampaignInfo",
                      constant: true,
                      stateMutability: "view",
                      payable: false,
                      inputs: [
                        {
                          type: "uint256",
                          name: "_campaignId",
                        },
                      ],
                      outputs: [
                        {
                          type: "tuple",
                          name: "",
                          components: [
                            {
                              type: "address",
                              name: "owner",
                            },
                            {
                              type: "uint256",
                              name: "id",
                            },
                            {
                              type: "uint256",
                              name: "goal",
                            },
                            {
                              type: "uint256",
                              name: "fundsRaised",
                            },
                            {
                              type: "bool",
                              name: "state",
                            },
                            {
                              type: "tuple[]",
                              name: "collectionsInfo",
                              components: [
                                {
                                  type: "uint256",
                                  name: "campaignId",
                                },
                                {
                                  type: "uint256",
                                  name: "collectionId",
                                },
                                {
                                  type: "address",
                                  name: "collectionAddress",
                                },
                                {
                                  type: "string",
                                  name: "name",
                                },
                                {
                                  type: "string",
                                  name: "symbol",
                                },
                                {
                                  type: "string",
                                  name: "baseURI",
                                },
                                {
                                  type: "uint256",
                                  name: "supply",
                                },
                                {
                                  type: "uint256",
                                  name: "tokenCount",
                                },
                                {
                                  type: "uint256",
                                  name: "price",
                                },
                                {
                                  type: "bool",
                                  name: "state",
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      type: "function",
                      name: "getCampaigns",
                      constant: true,
                      stateMutability: "view",
                      payable: false,
                      inputs: [],
                      outputs: [
                        {
                          type: "tuple[]",
                          name: "",
                          components: [
                            {
                              type: "uint256",
                              name: "id",
                            },
                            {
                              type: "uint256",
                              name: "goal",
                            },
                            {
                              type: "uint256",
                              name: "fundsRaised",
                            },
                            {
                              type: "address",
                              name: "owner",
                            },
                            {
                              type: "address[]",
                              name: "collections",
                            },
                            {
                              type: "bool",
                              name: "state",
                            },
                          ],
                        },
                      ],
                    },
                    {
                      type: "function",
                      name: "getCampaignsInfo",
                      constant: true,
                      stateMutability: "view",
                      payable: false,
                      inputs: [],
                      outputs: [
                        {
                          type: "tuple[]",
                          name: "",
                          components: [
                            {
                              type: "address",
                              name: "owner",
                            },
                            {
                              type: "uint256",
                              name: "id",
                            },
                            {
                              type: "uint256",
                              name: "goal",
                            },
                            {
                              type: "uint256",
                              name: "fundsRaised",
                            },
                            {
                              type: "bool",
                              name: "state",
                            },
                            {
                              type: "tuple[]",
                              name: "collectionsInfo",
                              components: [
                                {
                                  type: "uint256",
                                  name: "campaignId",
                                },
                                {
                                  type: "uint256",
                                  name: "collectionId",
                                },
                                {
                                  type: "address",
                                  name: "collectionAddress",
                                },
                                {
                                  type: "string",
                                  name: "name",
                                },
                                {
                                  type: "string",
                                  name: "symbol",
                                },
                                {
                                  type: "string",
                                  name: "baseURI",
                                },
                                {
                                  type: "uint256",
                                  name: "supply",
                                },
                                {
                                  type: "uint256",
                                  name: "tokenCount",
                                },
                                {
                                  type: "uint256",
                                  name: "price",
                                },
                                {
                                  type: "bool",
                                  name: "state",
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      type: "function",
                      name: "getCollectionCount",
                      constant: true,
                      stateMutability: "view",
                      payable: false,
                      inputs: [],
                      outputs: [
                        {
                          type: "uint256",
                          name: "",
                        },
                      ],
                    },
                    {
                      type: "function",
                      name: "getCollectionInfo",
                      constant: true,
                      stateMutability: "view",
                      payable: false,
                      inputs: [
                        {
                          type: "uint256",
                          name: "_campaignId",
                        },
                        {
                          type: "address",
                          name: "_collection",
                        },
                      ],
                      outputs: [
                        {
                          type: "tuple",
                          name: "",
                          components: [
                            {
                              type: "uint256",
                              name: "campaignId",
                            },
                            {
                              type: "uint256",
                              name: "collectionId",
                            },
                            {
                              type: "address",
                              name: "collectionAddress",
                            },
                            {
                              type: "string",
                              name: "name",
                            },
                            {
                              type: "string",
                              name: "symbol",
                            },
                            {
                              type: "string",
                              name: "baseURI",
                            },
                            {
                              type: "uint256",
                              name: "supply",
                            },
                            {
                              type: "uint256",
                              name: "tokenCount",
                            },
                            {
                              type: "uint256",
                              name: "price",
                            },
                            {
                              type: "bool",
                              name: "state",
                            },
                          ],
                        },
                      ],
                    },
                    {
                      type: "function",
                      name: "getGroup",
                      constant: true,
                      stateMutability: "view",
                      payable: false,
                      inputs: [
                        {
                          type: "uint256",
                          name: "_campaignId",
                        },
                        {
                          type: "bytes32",
                          name: "_referral",
                        },
                      ],
                      outputs: [
                        {
                          type: "tuple",
                          name: "",
                          components: [
                            {
                              type: "uint256",
                              name: "id",
                            },
                            {
                              type: "bytes32",
                              name: "referral",
                            },
                            {
                              type: "bool",
                              name: "state",
                            },
                            {
                              type: "tuple[]",
                              name: "ambassadors",
                              components: [
                                {
                                  type: "address",
                                  name: "account",
                                },
                                {
                                  type: "uint256",
                                  name: "fee",
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      type: "function",
                      name: "getGroupCount",
                      constant: true,
                      stateMutability: "view",
                      payable: false,
                      inputs: [],
                      outputs: [
                        {
                          type: "uint256",
                          name: "",
                        },
                      ],
                    },
                    {
                      type: "function",
                      name: "getNftCollection",
                      constant: true,
                      stateMutability: "view",
                      payable: false,
                      inputs: [],
                      outputs: [
                        {
                          type: "address",
                          name: "",
                        },
                      ],
                    },
                    {
                      type: "function",
                      name: "getNonces",
                      constant: true,
                      stateMutability: "view",
                      payable: false,
                      inputs: [
                        {
                          type: "address",
                          name: "_account",
                        },
                      ],
                      outputs: [
                        {
                          type: "uint256",
                          name: "",
                        },
                      ],
                    },
                    {
                      type: "function",
                      name: "getRoleAdmin",
                      constant: true,
                      stateMutability: "view",
                      payable: false,
                      inputs: [
                        {
                          type: "bytes32",
                          name: "role",
                        },
                      ],
                      outputs: [
                        {
                          type: "bytes32",
                          name: "",
                        },
                      ],
                    },
                    {
                      type: "function",
                      name: "getTreasury",
                      constant: true,
                      stateMutability: "view",
                      payable: false,
                      inputs: [],
                      outputs: [
                        {
                          type: "address",
                          name: "",
                        },
                      ],
                    },
                    {
                      type: "function",
                      name: "grantRole",
                      constant: false,
                      payable: false,
                      inputs: [
                        {
                          type: "bytes32",
                          name: "role",
                        },
                        {
                          type: "address",
                          name: "account",
                        },
                      ],
                      outputs: [],
                    },
                    {
                      type: "function",
                      name: "hasRole",
                      constant: true,
                      stateMutability: "view",
                      payable: false,
                      inputs: [
                        {
                          type: "bytes32",
                          name: "role",
                        },
                        {
                          type: "address",
                          name: "account",
                        },
                      ],
                      outputs: [
                        {
                          type: "bool",
                          name: "",
                        },
                      ],
                    },
                    {
                      type: "function",
                      name: "initialize",
                      constant: false,
                      payable: false,
                      inputs: [
                        {
                          type: "address",
                          name: "_defaultAdmin",
                        },
                        {
                          type: "address",
                          name: "_nftCollection",
                        },
                        {
                          type: "address",
                          name: "_treasury",
                        },
                      ],
                      outputs: [],
                    },
                    {
                      type: "function",
                      name: "isAdmin",
                      constant: true,
                      stateMutability: "view",
                      payable: false,
                      inputs: [
                        {
                          type: "address",
                          name: "_admin",
                        },
                      ],
                      outputs: [
                        {
                          type: "bool",
                          name: "",
                        },
                      ],
                    },
                    {
                      type: "function",
                      name: "isTokenSupported",
                      constant: true,
                      stateMutability: "view",
                      payable: false,
                      inputs: [
                        {
                          type: "address",
                          name: "_token",
                        },
                      ],
                      outputs: [
                        {
                          type: "bool",
                          name: "",
                        },
                      ],
                    },
                    {
                      type: "function",
                      name: "isUser",
                      constant: true,
                      stateMutability: "view",
                      payable: false,
                      inputs: [
                        {
                          type: "address",
                          name: "_user",
                        },
                      ],
                      outputs: [
                        {
                          type: "bool",
                          name: "",
                        },
                      ],
                    },
                    {
                      type: "function",
                      name: "recoverCollectionFunds",
                      constant: false,
                      payable: false,
                      inputs: [
                        {
                          type: "uint256",
                          name: "_campaignId",
                        },
                        {
                          type: "address",
                          name: "_collection",
                        },
                        {
                          type: "address",
                          name: "_token",
                        },
                        {
                          type: "address",
                          name: "_to",
                        },
                      ],
                      outputs: [],
                    },
                    {
                      type: "function",
                      name: "recoverFunds",
                      constant: false,
                      payable: false,
                      inputs: [
                        {
                          type: "address",
                          name: "_token",
                        },
                        {
                          type: "address",
                          name: "_to",
                        },
                      ],
                      outputs: [],
                    },
                    {
                      type: "function",
                      name: "removeAdmin",
                      constant: false,
                      payable: false,
                      inputs: [
                        {
                          type: "address",
                          name: "_admin",
                        },
                      ],
                      outputs: [],
                    },
                    {
                      type: "function",
                      name: "removeAmbassadors",
                      constant: false,
                      payable: false,
                      inputs: [
                        {
                          type: "uint256",
                          name: "_campaignId",
                        },
                        {
                          type: "bytes32",
                          name: "_referral",
                        },
                        {
                          type: "tuple[]",
                          name: "_ambassadors",
                          components: [
                            {
                              type: "address",
                              name: "account",
                            },
                            {
                              type: "uint256",
                              name: "fee",
                            },
                          ],
                        },
                      ],
                      outputs: [],
                    },
                    {
                      type: "function",
                      name: "removeFromTokens",
                      constant: false,
                      payable: false,
                      inputs: [
                        {
                          type: "address",
                          name: "_token",
                        },
                      ],
                      outputs: [],
                    },
                    {
                      type: "function",
                      name: "removeUser",
                      constant: false,
                      payable: false,
                      inputs: [
                        {
                          type: "address",
                          name: "_user",
                        },
                      ],
                      outputs: [],
                    },
                    {
                      type: "function",
                      name: "renounceRole",
                      constant: false,
                      payable: false,
                      inputs: [
                        {
                          type: "bytes32",
                          name: "role",
                        },
                        {
                          type: "address",
                          name: "callerConfirmation",
                        },
                      ],
                      outputs: [],
                    },
                    {
                      type: "function",
                      name: "revokeRole",
                      constant: false,
                      payable: false,
                      inputs: [
                        {
                          type: "bytes32",
                          name: "role",
                        },
                        {
                          type: "address",
                          name: "account",
                        },
                      ],
                      outputs: [],
                    },
                    {
                      type: "function",
                      name: "setAmbassadors",
                      constant: false,
                      payable: false,
                      inputs: [
                        {
                          type: "uint256",
                          name: "_campaignId",
                        },
                        {
                          type: "bytes32",
                          name: "_referral",
                        },
                        {
                          type: "tuple[]",
                          name: "_ambassadors",
                          components: [
                            {
                              type: "address",
                              name: "account",
                            },
                            {
                              type: "uint256",
                              name: "fee",
                            },
                          ],
                        },
                      ],
                      outputs: [],
                    },
                    {
                      type: "function",
                      name: "setCampaignOwner",
                      constant: false,
                      payable: false,
                      inputs: [
                        {
                          type: "uint256",
                          name: "_campaignId",
                        },
                        {
                          type: "address",
                          name: "_newOwner",
                        },
                      ],
                      outputs: [],
                    },
                    {
                      type: "function",
                      name: "setCampaignStatus",
                      constant: false,
                      payable: false,
                      inputs: [
                        {
                          type: "uint256",
                          name: "_campaignId",
                        },
                        {
                          type: "bool",
                          name: "_status",
                        },
                      ],
                      outputs: [],
                    },
                    {
                      type: "function",
                      name: "setCollectionBaseURI",
                      constant: false,
                      payable: false,
                      inputs: [
                        {
                          type: "uint256",
                          name: "_campaignId",
                        },
                        {
                          type: "address",
                          name: "_collection",
                        },
                        {
                          type: "string",
                          name: "_baseURI",
                        },
                      ],
                      outputs: [],
                    },
                    {
                      type: "function",
                      name: "setCollectionPrice",
                      constant: false,
                      payable: false,
                      inputs: [
                        {
                          type: "uint256",
                          name: "_campaignId",
                        },
                        {
                          type: "address",
                          name: "_collection",
                        },
                        {
                          type: "uint256",
                          name: "_price",
                        },
                      ],
                      outputs: [],
                    },
                    {
                      type: "function",
                      name: "setCollectionState",
                      constant: false,
                      payable: false,
                      inputs: [
                        {
                          type: "uint256",
                          name: "_campaignId",
                        },
                        {
                          type: "address",
                          name: "_collection",
                        },
                        {
                          type: "bool",
                          name: "_state",
                        },
                      ],
                      outputs: [],
                    },
                    {
                      type: "function",
                      name: "setCollectionSupply",
                      constant: false,
                      payable: false,
                      inputs: [
                        {
                          type: "uint256",
                          name: "_campaignId",
                        },
                        {
                          type: "address",
                          name: "_collection",
                        },
                        {
                          type: "uint256",
                          name: "_supply",
                        },
                      ],
                      outputs: [],
                    },
                    {
                      type: "function",
                      name: "setGroupReferral",
                      constant: false,
                      payable: false,
                      inputs: [
                        {
                          type: "uint256",
                          name: "_campaignId",
                        },
                        {
                          type: "bytes32",
                          name: "_referral",
                        },
                      ],
                      outputs: [],
                    },
                    {
                      type: "function",
                      name: "setGroupStatus",
                      constant: false,
                      payable: false,
                      inputs: [
                        {
                          type: "uint256",
                          name: "_campaignId",
                        },
                        {
                          type: "bytes32",
                          name: "_referral",
                        },
                        {
                          type: "bool",
                          name: "_status",
                        },
                      ],
                      outputs: [],
                    },
                    {
                      type: "function",
                      name: "setNFTCollection",
                      constant: false,
                      payable: false,
                      inputs: [
                        {
                          type: "uint256",
                          name: "_campaignId",
                        },
                        {
                          type: "address",
                          name: "_nftCollection",
                        },
                      ],
                      outputs: [],
                    },
                    {
                      type: "function",
                      name: "setTreasury",
                      constant: false,
                      payable: false,
                      inputs: [
                        {
                          type: "address",
                          name: "_treasury",
                        },
                      ],
                      outputs: [],
                    },
                    {
                      type: "function",
                      name: "supportsInterface",
                      constant: true,
                      stateMutability: "view",
                      payable: false,
                      inputs: [
                        {
                          type: "bytes4",
                          name: "interfaceId",
                        },
                      ],
                      outputs: [
                        {
                          type: "bool",
                          name: "",
                        },
                      ],
                    },
                  ],
                  functionName: "buyNFT",
                  args: [
                    account?.address as Address,
                    Number(campaignId),
                    collection?.address as Address,
                    referral,
                    "0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e",
                  ],
                }),
                erc20Value: {
                  tokenAddress: "0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e",
                  amountWei: parseUsdToUsdc(price),
                },
                chain: celo,
                client: client,
              }}
              onSuccess={() => {
                confetti({
                  particleCount: 100,
                  spread: 70,
                  origin: { y: 0.6 },
                });
                alert(
                  t("membership.voucher.Membership purchased successfully!")
                );
                setShowCreditCardModal(false);
              }}
              onError={(error) => {
                console.error("❌", error);
                alert(t("membership.voucher.Error processing purchase"));
              }}
              // <TransactionWidget
              // amount={parseUsdToUsdc(price).toString() || "0"}
              // client={client}
              // theme="dark"
              // transaction={{
              //   to: inhabit.getAddress(),
              //   data: encodeFunctionData({
              //     abi: inhabit.getAbi(),
              //     functionName: "buyNFT",
              //     args: [
              //       Number(campaignId),
              //       collection?.address as Address,
              //       referral,
              //       usdt.getAddress(),
              //     ],
              //   }),
              //   chain: celo,
              //   client: client,
              // }}
              // onSuccess={() => {
              //   console.log("Payment successful");
              //   setShowCreditCardModal(false);
              //   handleCreditCardPurchaseSuccess();
              // }}
              // onError={(error) => {
              //   console.error("Payment failed:", error);
              //   alert(t("membership.voucher.Payment failed. Please try again."));
              // }}
            /> */
}
