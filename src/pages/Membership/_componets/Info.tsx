import { JSX } from "react";
import { Collection } from "../../../models/collection.model";

type Props = {
  collection: Collection;
};
export function Info(props: Props): JSX.Element {
  const { collection } = props;

  return (
    <div className="flex-1 flex flex-col gap-8 mt-16 lg:mt-0">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <img
          src={collection.image}
          alt={collection.symbol}
          className="w-[320px] h-[320px] rounded-3xl object-cover border border-green-soft shadow-lg"
        />
        <div className="flex flex-col gap-2">
          <span className="eyebrow text-secondary">{collection.hub}</span>
          <h1 className="heading-2 text-secondary font-semibold">
            {collection.symbol} <br />
            <span className="heading-2 text-secondary ">Membership</span>
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
            <span className="body-M text-secondary font-bold">VALUE</span>
            <div className="heading-2 font-abel text-secondary">
              {`$ ${collection.price} USD`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
