import { JSX } from "react";
import { Collection } from "../../../models/collection.model";
import { ConnectButton } from "../../../ui/ConnectButton";
import usdcImage from "../../../assets/images/tokens/USDC.svg";
import usdtImage from "../../../assets/images/tokens/USDT.svg";
import { useTokenBalance } from "../../../hooks/useTokensBalance";
import { useAccount } from "wagmi";

type Props = { collection: Collection };

export function Checkout(props: Props): JSX.Element {
  const { collection } = props;

  const {
    usdcBalance,
    usdcAllowance,
    usdtBalance,
    usdtAllowance,
    hasSufficientBalance,
    isLoading: balanceLoading,
    refetch: refetchBalance,
  } = useTokenBalance(collection);

  const { address } = useAccount();

  return (
    <div className="w-full max-w-lg bg-menu-backdrop backdrop-blur-lg rounded-3xl shadow-xl border border-green-soft p-8 flex flex-col gap-6 self-start sticky top-8">
      <ConnectButton />
      <form className="flex flex-col gap-4">
        <div>
          <label className="body-S block text-secondary font-semibold mb-1">
            Name*
          </label>
          <input
            type="text"
            className="input-main"
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <label className="body-S block text-secondary font-semibold mb-1">
            E-Mail*
          </label>
          <input
            type="email"
            className="input-main"
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label className="body-S block text-secondary font-semibold mb-1">
            Telephone
          </label>
          <input type="tel" className="input-main" placeholder="1234567890" />
        </div>
        <div>
          <label className="body-S block text-secondary font-semibold mb-1">
            Telegram user
          </label>
          <input
            type="text"
            className="input-main"
            placeholder="@pepio-perez"
          />
        </div>
        <div className="flex flex-col gap-2 mt-2">
          <label className="flex items-start gap-2 text-xs text-secondary">
            <input type="checkbox" className="mt-1" />I understand that I'll
            need to complete a KYC Verification to eventually fully access the
            rights and benefits associated with my membership.
          </label>
          <label className="flex items-start gap-2 text-xs text-secondary">
            <input type="checkbox" className="mt-1" />I accept the terms and
            conditions of the Membership Agreement granting me rights and
            benefits related to this Land and Project.
          </label>
        </div>
      </form>
      {/* Summary */}
      <div className="bg-green-soft/30 rounded-xl p-4 pt-0 flex flex-col gap-2 mt-2">
        <div className="flex justify-between">
          <span className="body-S text-secondary font-bold">Balance</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span className="body-S text-secondary">USDC</span>
          <div className="flex items-center space-x-3">
            <span className="body-S text-secondary">
              ${usdcBalance.toFixed(2)}
            </span>
            <img
              src={usdcImage}
              alt="USDC"
              className="inline-block w-9 h-9 ml-1"
            />
          </div>
        </div>
        <div className="flex justify-between font-semibold">
          <span className="body-S text-secondary">USDT</span>
          <div className="flex items-center space-x-3">
            <span className="body-S text-secondary">
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
        <label className="flex justify-center p-1  text-xs text-secondary">
          {!address &&
            // TODO: uncomment when ready
            // !hasSufficientBalance &&
            "You don't have enough balance to buy this membership"}
        </label>
        {/* <div className="flex justify-between text-secondary font-bold text-lg">
                <span className="body-M text-secondary">
                  Total taxes included
                </span>
                <span className="body-M text-secondary">
                  $ {membership.valueUSD} USD
                </span>
              </div> */}
      </div>
      <button className="btn-secondary w-full mt-2">Get here your NFT</button>
    </div>
  );
}
