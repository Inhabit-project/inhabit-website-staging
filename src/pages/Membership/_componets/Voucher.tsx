// VoucherStep (refactor, mismo comportamiento con menos código)
import { COIN, KYC_TYPE } from "@/config/enums";
import { useStore } from "@/store";
import confetti from "canvas-confetti";
import { JSX, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import usdcImage from "../../../assets/images/tokens/USDC.svg";
import usdtImage from "../../../assets/images/tokens/USDT.svg";
// import cusdImage from "../../../assets/images/tokens/cUSD.svg";
import ccopImage from "../../../assets/images/tokens/cCOP.svg";
import { useResendKycEmail } from "@/hooks/useKycEmail";
import { generateSiweMessage } from "@/utils/generate-siwe-message.util";
import { useNonce } from "@/hooks/useNonce";
import { ResendKycDto } from "@/services/dtos/resend-kyc.dto";
import {
  chain,
  COOKIE_REFERRAL,
  COOLDOWN_KEY,
  WOMPI_PUBLIC_KEY,
} from "@/config/const";
import { useInhabit } from "@/hooks/contracts/inhabit";
import { formatUnits, getAddress, Hex, zeroHash } from "viem";
import { useUsdt } from "@/hooks/contracts/erc20/useUsdt";
import { useUsdc } from "@/hooks/contracts/erc20/useUsdc";
import { useCcop } from "@/hooks/contracts/erc20/useCcop";
import { t } from "i18next";
import Cookies from "js-cookie";
import { useActiveWallet } from "thirdweb/react";
import { Address, ZERO_ADDRESS } from "thirdweb";
// import { useCusd } from "@/hooks/contracts/erc20/useCusd";
import { formatCcopToCop } from "@/utils/format-ccop-to-cop";
import { parseUsdToUsdc } from "@/utils/usdc-format.utils";
import { generateWompiSignature } from "@/utils/generate-wompi-signature.util";
import { useAccount } from "@/hooks/api/account";
import { APIError } from "@/models/api.model";

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

  // ref
  const checkoutRef = useRef<any | null>(null);

  // state
  const [cooldown, setCooldown] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCreditCardModal, setShowCreditCardModal] = useState(false);
  const [wompiSignature, setWompiSignature] = useState<string>("");
  const [wompiReference, setWompiReference] = useState(() =>
    crypto.randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase()
  );
  const [expandedPaymentMethod, setExpandedPaymentMethod] = useState<
    string | null
  >(null);
  const [isWompiScriptLoaded, setIsWompiScriptLoaded] = useState(false);

  // external hooks
  const { campaignId, collectionId } = useParams();

  // thirdweb
  const wallet = useActiveWallet();
  const chainId = useMemo(() => wallet?.getChain()?.id ?? 0, [wallet]);
  const account = useMemo(() => wallet?.getAccount(), [wallet]);
  const accountAddress = useMemo(() => {
    try {
      return getAddress(account?.address as Address);
    } catch (error) {
      return ZERO_ADDRESS;
    }
  }, [account]);

  // store
  const {
    collection,
    isKycHardCompleted,
    inhabit,
    usdc,
    usdt,
    usdToCopRate,
    /*cusd,*/ ccop,
    getWalletNfts,
  } = useStore();

  // account hook
  const { useGetSiweMessage, useSaveOrder } = useAccount(
    chainId,
    accountAddress
  );

  /// get siwe message
  const { data: dataSiweMessage } = useGetSiweMessage();

  const siweMessage = useMemo(() => {
    return dataSiweMessage ?? "";
  }, [dataSiweMessage]);

  /// save order
  const { mutate: saveOrder } = useSaveOrder;

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

  const referral = useMemo(() => {
    return cookieReferral ? cookieReferral : zeroHash; // ✅ 0x0000...0000
  }, [cookieReferral]);

  const selectedBalance = useMemo(() => {
    if (usdcBalance >= price) return usdcBalance;
    if (usdtBalance >= price) return usdtBalance;
    if (ccopBalance >= price) return ccopBalance;
    // if (cusdBalance >= price) return cusdBalance;
    return 0;
  }, [selectedCoin, usdcBalance, usdtBalance /*cusdBalance*/]);

  const priceInCcopInCents = useMemo(() => {
    const priceInCcop = price * usdToCopRate;
    return Math.round(priceInCcop * 100);
  }, [price, usdToCopRate]);

  const hasSufficientBalance = selectedBalance >= price;
  const isAvailable = availableSupply > 0;

  // const contract = getContract({
  //   client: client as any,
  //   address: inhabit.getAddress(),
  //   chain: chain,
  //   abi: inhabit.getAbi(),
  // });

  // const transaction = prepareContractCall({
  //   contract,
  //   method: "buyNFT",
  //   params: [
  //     account?.address as Address,
  //     Number(campaignId),
  //     collection?.address as Address,
  //     referral,
  //     "0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e",
  //     parseUsdToUsdc(price),
  //   ],
  // });

  // effects
  /// set accounts en stores
  useEffect(() => {
    usdc.setAccount(account);
    usdt.setAccount(account);
    // cusd.setAccount(account);
    ccop.setAccount(account);
  }, [account, usdc, usdt, /*cusd,*/ ccop]);

  /// get and generate Wompi signature
  useEffect(() => {
    if (!priceInCcopInCents || priceInCcopInCents <= 0) return;

    (async () => {
      const signature = await generateWompiSignature(
        wompiReference,
        priceInCcopInCents
      );

      setWompiSignature(signature);
    })();
  }, [priceInCcopInCents, wompiReference]);

  // 1. useEffect para cargar el script de Wompi
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    // Check if script already exists and WidgetCheckout is available
    const existingScript = document.getElementById("wompi-checkout-script");
    if (existingScript) {
      // Script exists, check if WidgetCheckout is ready
      if ((window as any).WidgetCheckout) {
        setIsWompiScriptLoaded(true);
      }
      return;
    }

    const script = document.createElement("script");
    script.id = "wompi-checkout-script";
    script.src = "https://checkout.wompi.co/widget.js";
    script.async = true;
    script.onload = () => {
      setIsWompiScriptLoaded(true);
    };
    script.onerror = () =>
      console.error("❌ Error cargando el script de Wompi");
    document.body.appendChild(script);
  }, []);

  // 2. useEffect para inicializar el widget
  useEffect(() => {
    if (!isWompiScriptLoaded) {
      return;
    }

    if (!priceInCcopInCents || priceInCcopInCents <= 0) {
      return;
    }

    if (!wompiSignature) {
      return;
    }

    const W = (window as any).WidgetCheckout;

    if (!W) {
      return;
    }

    checkoutRef.current = new W({
      currency: "COP",
      amountInCents: priceInCcopInCents,
      reference: wompiReference,
      publicKey: WOMPI_PUBLIC_KEY,
      "signature:integrity": wompiSignature,
    });

    return () => {
      checkoutRef.current = null;
    };
  }, [isWompiScriptLoaded, priceInCcopInCents, wompiReference, wompiSignature]);

  const handlePayWithCreditCard = async () => {
    const cfg = paymentByCoin[COIN.USDC];

    if (
      !campaignId ||
      !collectionId ||
      !cfg ||
      !account ||
      !siweMessage ||
      !checkoutRef.current
    ) {
      alert(
        t(
          "membership.voucher.Payment gateway is loading. Please try again in a moment."
        )
      );
      return;
    }

    try {
      const signature = await account.signMessage({ message: siweMessage });

      saveOrder(
        {
          chainId,
          address: accountAddress,
          message: siweMessage,
          signature,
          reference: wompiReference,
          to: accountAddress,
          referral,
          campaignId,
          collection: collection!.address as Address,
          paymentToken: cfg.address,
          paymentAmount: cfg.amountToSpend,
        },
        {
          onSuccess: (reference: string) => {
            checkoutRef.current.open(async (_result: any) => {
              setWompiSignature("");
              setWompiReference(
                crypto.randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase()
              );

              confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
              alert(t("membership.voucher.Membership purchased successfully!"));

              setTimeout(async () => {
                try {
                  await Promise.all([
                    refetchUsdc(),
                    refetchUsdt(),
                    refetchCcop(),
                  ]);
                } catch (error) {
                  console.error("❌ Error refreshing balances:", error);
                }
              }, 500);
            });
          },
          onError: (error: APIError) => {
            if (error.status === 409) {
              setWompiReference(
                crypto.randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase()
              );

              alert(
                t("membership.voucher.Order already exists. Please try again.")
              );
            }
          },
        }
      );
    } catch (error) {
      console.error("❌ Error signing message:", error);
    }
  };

  /// reset por disconnect
  useEffect(() => {
    if (!account && onWalletDisconnect) onWalletDisconnect();
  }, [account, onWalletDisconnect]);

  /// cooldown
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
                getWalletNfts(account!.address as Address);
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
      {/* Payment Methods Accordion */}
      <div className="flex flex-col gap-4">
        {/* Pay with Credit Card */}
        <div className="bg-green-soft/30 rounded-xl overflow-hidden border border-green-soft/20">
          <button
            type="button"
            onClick={handlePayWithCreditCard}
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-green-soft/20 transition-colors disabled:opacity-50"
            disabled={
              priceInCcopInCents <= 0 ||
              (requiresHardKyc && !isKycHardCompleted)
            }
          >
            <h4 className="heading-6 text-left">
              {t("membership.voucher.Pay with card")}
            </h4>
          </button>
        </div>
        {/* Pay with Crypto */}
        <div className="bg-green-soft/30 rounded-xl overflow-hidden border border-green-soft/20">
          <button
            onClick={() =>
              setExpandedPaymentMethod(
                expandedPaymentMethod === "crypto" ? null : "crypto"
              )
            }
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-green-soft/20 transition-colors"
          >
            <h4 className="heading-6 text-left">Pay with crypto</h4>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <img src={usdcImage} alt="USDC" className="w-6 h-6" />
                <img src={usdtImage} alt="USDT" className="w-6 h-6" />
                <img src={ccopImage} alt="CCOP" className="w-6 h-6" />
              </div>
              <svg
                className={`w-5 h-5 text-white transition-transform duration-300 ${
                  expandedPaymentMethod === "crypto" ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </button>
          <div
            className={`transition-all duration-300 ${
              expandedPaymentMethod === "crypto"
                ? "max-h-[600px] overflow-y-auto opacity-100"
                : "max-h-0 overflow-hidden opacity-0"
            }`}
          >
            <div className="px-4 pb-4 flex flex-col gap-4">
              {/* Balance Section */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between font-semibold">
                  <h4 className="heading-6">
                    {t("membership.voucher.Balance")}
                  </h4>
                </div>

                {coins.map((c) => (
                  <div
                    key={c.symbol}
                    className="flex justify-between font-semibold"
                  >
                    <span className="body-S text-light">
                      {t(`membership.voucher.${c.symbol}`)}
                    </span>
                    <div className="flex items-center space-x-3">
                      <span className="body-S text-light">
                        {c.toText(c.balance)}
                      </span>
                      <img
                        src={c.icon}
                        alt={c.symbol}
                        className="inline-block w-9 h-9 ml-1"
                      />
                    </div>
                  </div>
                ))}

                {account?.address &&
                  (!hasSufficientBalance ||
                    (!requiresHardKyc && !hasSufficientBalance)) && (
                    <label className="text-center p-3 body-S text-light">
                      {t(
                        "membership.voucher.You don't have enough balance to purchase this membership"
                      )}
                    </label>
                  )}
              </div>

              {/* Coin Selection */}
              <div className="flex flex-col gap-4 pt-2 border-t border-green-soft/20">
                <h4 className="heading-6">
                  {t("membership.voucher.Select coin")}
                </h4>
                {coins.map((c) => {
                  const isDisabled =
                    c.balance < price ||
                    (requiresHardKyc && !isKycHardCompleted);
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

                <div className="flex justify-between mt-2 pt-2 border-t border-green-soft/20">
                  <span className="body-S text-light">
                    {t("membership.voucher.Total")}
                  </span>
                  <span className="body-S text-light">
                    $
                    {selectedCoin === COIN.CCOP && priceInCcop
                      ? formatCcopToCop(
                          Number(
                            formatUnits(BigInt(priceInCcop), ccop.decimals)
                          )
                        )
                      : price.toFixed(2)}
                  </span>
                </div>

                {/* Purchase Button */}
                <div className="flex justify-center mt-4">
                  <button
                    className="btn-primary w-full"
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
            </div>
          </div>
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
          {/* <div onClick={(e) => e.stopPropagation()}>
            <TransactionWidget
              amount={"0"}
              client={client as any}
              theme="dark"
              transaction={
                {
                  ...transaction,
                  erc20Value: {
                    tokenAddress: "0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e",
                    amountWei: parseUsdToUsdc(price),
                  },
                } as any
              }
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
          </div> */}
        </div>
      )}
    </div>
  );
}
