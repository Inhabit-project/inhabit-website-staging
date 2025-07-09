import { COIN } from "@/config/enums";
import { useStore } from "@/store";
import confetti from "canvas-confetti";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAccount, useWalletClient } from "wagmi";
import usdcImage from "../../../assets/images/tokens/USDC.svg";
import usdtImage from "../../../assets/images/tokens/USDT.svg";

interface Props {
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

export function VoucherStep(props: Props): JSX.Element {
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
