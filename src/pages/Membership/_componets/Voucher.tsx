// VoucherStep (refactor, mismo comportamiento con menos código)
import { COIN, KYC_TYPE } from "@/config/enums";
import { useStore } from "@/store";
import confetti from "canvas-confetti";
import { JSX, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import usdcImage from "../../../assets/images/tokens/USDC.svg";
import usdtImage from "../../../assets/images/tokens/USDT.svg";
// import cusdImage from "../../../assets/images/tokens/cUSD.svg";
import ccopImage from "../../../assets/images/tokens/cCOP.svg";
import { useResendKycEmail } from "@/hooks/useKycEmail";
import { generateSiweMessage } from "@/utils/generate-siwe-message.util";
import { useNonce } from "@/hooks/useNonce";
import { ResendKycDto } from "@/services/dtos/resend-kyc.dto";
import { COOKIE_REFERRAL, COOLDOWN_KEY, INHABIT_JSON } from "@/config/const";
import { useInhabit } from "@/hooks/contracts/inhabit";
import { encodeFunctionData, formatUnits, Hex, keccak256, toBytes } from "viem";
import { useUsdt } from "@/hooks/contracts/erc20/useUsdt";
import { useUsdc } from "@/hooks/contracts/erc20/useUsdc";
import { useCcop } from "@/hooks/contracts/erc20/useCcop";
import mastercardImage from "../../../assets/images/cards/mastercard.svg";
import visaImage from "../../../assets/images/cards/visa.svg";
import { t } from "i18next";
import Cookies from "js-cookie";
import { TransactionWidget } from "thirdweb/react";
import { client } from "@/config/const";
import {
  useActiveAccount,
  useActiveWallet,
  useActiveWalletChain,
} from "thirdweb/react";
import { Address } from "thirdweb";
import { parseUsdToUsdc } from "@/utils/usdc-format.utils";
import { celo } from "thirdweb/chains";
// import { useCusd } from "@/hooks/contracts/erc20/useCusd";
import { formatCcopToCop } from "@/utils/format-ccop-to-cop";

interface Props {
  availableSupply: number;
  kycType: KYC_TYPE;
  price: number;
  requiresHardKyc: boolean;
  selectedCoin?: COIN;
  onWalletDisconnect: () => void;
  setSelectedCoin: (coin: COIN | undefined) => void;
}

export function VoucherStep(props: Props): JSX.Element {
  const {
    availableSupply,
    price,
    selectedCoin,
    requiresHardKyc,
    kycType,
    onWalletDisconnect,
    setSelectedCoin,
  } = props;

  // state
  const [isProcessing, setIsProcessing] = useState(false);
  const [cooldown, setCooldown] = useState<number>(0);
  const [showCreditCardModal, setShowCreditCardModal] = useState(false);

  // external
  const { campaignId } = useParams();
  const account = useActiveAccount();
  const chain = useActiveWalletChain();
  const wallet = useActiveWallet();

  // store
  const {
    collection,
    isKycHardCompleted,
    inhabit,
    usdc,
    usdt,
    /*cusd,*/ ccop,
  } = useStore();

  // inhabit hook
  const { buyNFT: buyNFTHook, calculateTokenAmount: calcHook } =
    useInhabit(account);

  // token hooks
  const {
    balance: ccopBalance,
    allowance: ccopAllowance,
    refetch: refetchCcop,
    approve: { mutate: approveCcop },
  } = useCcop(price, account);

  // const {
  //   balance: cusdBalance,
  //   allowance: cusdAllowance,
  //   refetch: refetchCusd,
  //   approve: { mutate: approveCusd },
  // } = useCusd(price, account);

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

  const { data: priceInCcop } = calcHook(ccop.getAddress(), price);
  // const { data: priceInCusd } = calcHook(cusd.getAddress(), price);

  const { mutate: buyNFT } = buyNFTHook;
  const { mutate: fetchNonce, isPending: isNoncePending } = useNonce();
  const { mutate: resendKycEmail, isPending: isResendingKyc } =
    useResendKycEmail();

  const cookieReferral = Cookies.get(COOKIE_REFERRAL) as Hex | undefined;
  const referral = cookieReferral ? cookieReferral : keccak256(toBytes(""));

  const selectedBalance = useMemo(() => {
    if (usdcBalance >= price) return usdcBalance;
    if (usdtBalance >= price) return usdtBalance;
    if (ccopBalance >= price) return ccopBalance;
    // if (cusdBalance >= price) return cusdBalance;
    return 0;
  }, [selectedCoin, usdcBalance, usdtBalance /*cusdBalance*/]);

  const hasSufficientBalance = selectedBalance >= price;
  const isAvailable = availableSupply > 0;

  // set accounts en stores
  useEffect(() => {
    usdc.setAccount(account);
    usdt.setAccount(account);
    // cusd.setAccount(account);
    ccop.setAccount(account);
  }, [account, usdc, usdt, /*cusd,*/ ccop]);

  // cooldown
  useEffect(() => {
    const saved = localStorage.getItem(COOLDOWN_KEY);
    if (!saved) return;
    const expiresAt = parseInt(saved, 10);
    const now = Math.floor(Date.now() / 1000);
    const remaining = expiresAt - now;
    if (remaining > 0) setCooldown(remaining);
    else localStorage.removeItem(COOLDOWN_KEY);
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => {
      setCooldown((prev) => {
        const next = prev - 1;
        if (next <= 0) localStorage.removeItem(COOLDOWN_KEY);
        return next;
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  // reset por disconnect
  useEffect(() => {
    if (!account && onWalletDisconnect) onWalletDisconnect();
  }, [account, onWalletDisconnect]);

  const paymentByCoin = useMemo(() => {
    const usdAmount = Number(parseUsdToUsdc(price.toString()));

    return {
      [COIN.USDC]: {
        address: usdc.getAddress() as Address,
        allowance: usdcAllowance,
        approve: approveUsdc as any,
        refetch: refetchUsdc,
        amountToSpend: usdAmount,
      },
      [COIN.USDT]: {
        address: usdt.getAddress() as Address,
        allowance: usdtAllowance,
        approve: approveUsdt as any,
        refetch: refetchUsdt,
        amountToSpend: usdAmount,
      },
      // [COIN.CUSD]: {
      //   address: cusd.getAddress() as Address,
      //   allowance: cusdAllowance,
      //   approve: approveCusd as any,
      //   refetch: refetchCusd,
      //   amountToSpend: Number(usdAmount ?? 0),
      // },
      [COIN.CCOP]: {
        address: ccop.getAddress() as Address,
        allowance: ccopAllowance,
        approve: approveCcop as any,
        refetch: refetchCcop,
        amountToSpend: Number(priceInCcop ?? 0),
      },
    } as const;
  }, [
    price,
    priceInCcop,
    // priceInCusd,
    usdc,
    usdt,
    // cusd,
    ccop,
    usdcAllowance,
    usdtAllowance,
    // cusdAllowance,
    ccopAllowance,
    approveUsdc,
    approveUsdt,
    // approveCusd,
    approveCcop,
    refetchUsdc,
    refetchUsdt,
    // refetchCusd,
    refetchCcop,
  ]);

  const ensureAllowanceThenBuy = async ({
    token,
    needed,
    approve,
    currentAllowance,
    refetch,
  }: {
    token: Address;
    needed: number;
    approve: any;
    currentAllowance: number;
    refetch: () => any;
  }) => {
    if (needed <= 0) throw new Error("Invalid amount");

    if (currentAllowance < needed) {
      await new Promise<void>((resolve, reject) => {
        approve(
          { spender: inhabit.getAddress(), amount: needed },
          {
            onSuccess: async () => {
              await refetch();
              resolve();
            },
            onError: (error: any) => {
              console.error("❌ approve", error);
              alert(t("membership.voucher.Error approving token"));
              reject(error);
            },
          }
        );
      });
    }

    await new Promise<void>((resolve, reject) => {
      buyNFT(
        {
          to: account!.address as Address,
          campaignId: Number(campaignId),
          collectionAddress: collection!.address as Address,
          referral,
          paymentToken: token,
          paymentAmount: needed,
        },
        {
          onSuccess: async () => {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            alert("✅ Membership purchased successfully!");

            setTimeout(async () => {
              try {
                await Promise.all([
                  refetchUsdc(),
                  refetchUsdt(),
                  refetchCcop(),
                  /*refetchCusd()*/
                ]);
                resolve();
              } catch (error) {
                console.error(
                  "❌ Error refreshing balances after purchase:",
                  error
                );
                resolve();
              }
            }, 500);
          },
          onError: (error: any) => {
            console.error("❌ buyNFT", error);
            reject(error);
          },
        }
      );
    });
  };

  // Compra unificada
  const handlePurchase = async () => {
    if (!account?.address || !collection || !campaignId || !selectedCoin)
      return;

    if (selectedCoin === COIN.CREDIT_CARD) return;

    const cfg = paymentByCoin[selectedCoin];
    if (!cfg) return;

    try {
      setIsProcessing(true);
      await ensureAllowanceThenBuy({
        token: cfg.address,
        needed: cfg.amountToSpend,
        approve: cfg.approve,
        currentAllowance: cfg.allowance,
        refetch: cfg.refetch,
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
      return;
    }
    setSelectedCoin(coin as COIN);
  };

  // ===============================
  // ============ RENDER ===========
  // ===============================

  const coins = [
    {
      symbol: COIN.CCOP,
      balance: ccopBalance,
      icon: ccopImage,
      toText: (v: number) => `$${formatCcopToCop(v)} `,
    },
    // {
    //   symbol: COIN.CUSD,
    //   balance: cusdBalance,
    //   icon: cusdImage,
    //   toText: (v: number) => `$${v.toFixed(2)}`,
    // },
    {
      symbol: COIN.USDC,
      balance: usdcBalance,
      icon: usdcImage,
      toText: (v: number) => `$${v.toFixed(2)}`,
    },
    {
      symbol: COIN.USDT,
      balance: usdtBalance,
      icon: usdtImage,
      toText: (v: number) => `$${v.toFixed(2)}`,
    },
  ] as const;

  return (
    <div className="flex flex-col gap-4">
      {/* Summary */}
      <div className="bg-green-soft/30 rounded-xl p-4 flex flex-col gap-2 mt-2">
        <div className="flex justify-between font-semibold">
          <h4 className="heading-6">{t("membership.voucher.Balance")}</h4>
        </div>

        {coins.map((c) => (
          <div key={c.symbol} className="flex justify-between font-semibold">
            <span className="body-S text-light">
              {t(`membership.voucher.${c.symbol}`)}
            </span>
            <div className="flex items-center space-x-3">
              <span className="body-S text-light">{c.toText(c.balance)}</span>
              <img
                src={c.icon}
                alt={c.symbol}
                className="inline-block w-9 h-9 ml-1"
              />
            </div>
          </div>
        ))}

        {/* Credit Card */}
        <label
          key="CREDIT CARD"
          className={`flex items-center gap-3 cursor-pointer ${
            wallet?.id !== "inApp" || true // TODO: remove this
              ? "opacity-40 cursor-not-allowed"
              : ""
          }`}
        >
          <button
            className="flex items-center justify-center bg-white rounded-full p-2"
            type="button"
            disabled={wallet?.id !== "inApp" || true} // TODO: remove this
            onClick={() => handleCoinSelection("CREDIT CARD")}
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
              wallet?.id !== "inApp" || true // TODO: remove this
                ? "cursor-default hover:no-underline"
                : "hover:text-[#D57300] hover:underline"
            }`}
          >
            {t("membership.voucher.Pay with credit card")}
          </span>
        </label>

        {account?.address &&
          (!hasSufficientBalance ||
            (!requiresHardKyc && !hasSufficientBalance)) && (
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
                onChange={() => handleCoinSelection(c.symbol)}
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
            $
            {selectedCoin === COIN.CCOP && priceInCcop
              ? formatCcopToCop(
                  Number(formatUnits(BigInt(priceInCcop), ccop.decimals))
                )
              : price.toFixed(2)}
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
              } body-S`}
              onClick={() => {
                if (!account?.address || !chain) return;
                fetchNonce(account.address as Address, {
                  onSuccess: async (nonce) => {
                    if (!nonce) return;
                    const message = generateSiweMessage(
                      chain.id,
                      account.address as Address,
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
                        alert(
                          t(
                            "membership.checkout.KYC request sent successfully!"
                          )
                        );
                        const expiresAt = Math.floor(Date.now() / 1000) + 180;
                        localStorage.setItem(
                          COOLDOWN_KEY,
                          expiresAt.toString()
                        );
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
                      t(
                        "membership.checkout.Error signing message. Please try again."
                      )
                    );
                  },
                });
              }}
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

      {/* Modal tarjeta */}
      {showCreditCardModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => {
            setShowCreditCardModal(false);
            if (usdcBalance >= price) setSelectedCoin(COIN.USDC);
            else if (usdtBalance >= price) setSelectedCoin(COIN.USDT);
            // else if (cusdBalance >= price) setSelectedCoin(COIN.CUSD);
            else if (ccopBalance >= price) setSelectedCoin(COIN.CCOP);
            else setSelectedCoin(undefined);
          }}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <TransactionWidget
              amount={"0"}
              client={client}
              theme="dark"
              transaction={{
                to: "0x745A3D77a62fBeEE9a0DCA10eDEd710199A3dd15",
                data: encodeFunctionData({
                  abi: INHABIT_JSON.abi,
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
              onSuccess={async () => {
                // Refetch all token balances
                await Promise.all([
                  refetchUsdc(),
                  refetchUsdt(),
                  // refetchCusd(),
                  refetchCcop(),
                ]);
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
            />
          </div>
        </div>
      )}
    </div>
  );
}
