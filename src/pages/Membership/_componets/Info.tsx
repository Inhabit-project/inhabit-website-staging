import { JSX, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Collection } from "../../../models/collection.model";
import { useErc721 } from "@/hooks/contracts/erc721";
import { useActiveWallet } from "thirdweb/react";
import { Address, getAddress } from "viem";
import { ZERO_ADDRESS } from "thirdweb";

type Props = {
  collection: Collection;
};
export function Info(props: Props): JSX.Element {
  const { collection } = props;
  const { t } = useTranslation();

  // thirdweb
  const wallet = useActiveWallet();
  const account = useMemo(() => wallet?.getAccount(), [wallet]);
  const accountAddress = useMemo(() => {
    try {
      return getAddress(account?.address as Address);
    } catch (error) {
      return ZERO_ADDRESS;
    }
  }, [account]);

  const { useBalanceOf } = useErc721(collection.address);

  /// Get balance of owner
  const { data: dataBalance } = useBalanceOf(accountAddress);

  const rawBalance = useMemo(() => {
    console.log("dataBalance", dataBalance);
    return dataBalance ? dataBalance : 0;
  }, [dataBalance]);

  const balance = useMemo(() => {
    return rawBalance ? Number(rawBalance) : 0;
  }, [rawBalance]);

  return (
    <div className="flex-1 flex flex-col gap-8 mt-16 lg:mt-0">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="flex flex-col items-center gap-3">
          <img
            src={collection.image}
            alt={collection.symbol}
            className="w-[320px] h-[320px] rounded-3xl object-cover border border-green-soft shadow-lg"
          />
        </div>
        <div className="flex flex-col gap-2">
          <span className="eyebrow text-secondary">{collection.hub}</span>
          <h1 className="heading-2 text-secondary font-semibold">
            {collection.symbol} <br />
            <span className="heading-2 text-secondary ">
              {t("membership.info.Membership")}
            </span>
          </h1>
          <p className="body-S text-secondary max-w-xl whitespace-pre-line">
            {(() => {
              const parts = collection.description.split("\n");
              const firstLine = parts[0];
              const restLines = parts.slice(1).join("\n");

              return (
                <>
                  <span className="font-bold">{firstLine}</span>
                  {restLines && (
                    <>
                      {"\n"}
                      {restLines}
                    </>
                  )}
                </>
              );
            })()}
          </p>
          <div className="mt-4">
            <span className="body-M text-secondary font-bold">
              {t("membership.info.VALUE")}
            </span>
            <div className="heading-2 font-abel text-secondary">
              {`$ ${collection.price} USD`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
