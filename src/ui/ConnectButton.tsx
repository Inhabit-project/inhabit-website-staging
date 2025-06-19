import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import { JSX } from "react";

export function ConnectButton(): JSX.Element {
  return (
    <div className="w-full mb-2">
      <RainbowConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          mounted,
        }) => {
          const ready = mounted;
          const connected = ready && account && chain;

          const handleClick =
            (action: () => void) =>
            (event: React.MouseEvent<HTMLButtonElement>) => {
              action();
              event.currentTarget.blur();
            };

          return (
            <div
              {...(!ready && {
                "aria-hidden": true,
                style: {
                  opacity: 0,
                  pointerEvents: "none",
                  userSelect: "none",
                },
              })}
              className="flex flex-col sm:flex-row gap-2 items-center justify-between"
            >
              {!connected ? (
                <button
                  className="btn-primary w-full"
                  onClick={handleClick(openConnectModal)}
                  type="button"
                >
                  Connect Wallet
                </button>
              ) : chain.unsupported ? (
                <button
                  className="btn-primary w-full"
                  onClick={handleClick(openChainModal)}
                  type="button"
                >
                  Wrong network
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <button
                    className="btn-primary flex-1"
                    onClick={handleClick(openAccountModal)}
                    type="button"
                  >
                    {account.displayBalance
                      ? `${account.displayName}`
                      : account.displayName}
                  </button>
                  <button
                    className="btn-secondary flex items-center gap-2 px-4 cursor-auto hover:bg-[var(--color-green-soft)] hover:text-[var(--color-secondary)]"
                    style={{
                      background: "var(--color-green-soft)",
                      color: "var(--color-secondary)",
                    }}
                    // onClick={handleClick(openChainModal)}
                    type="button"
                  >
                    {chain.hasIcon && chain.iconUrl && (
                      <img
                        src={chain.iconUrl}
                        alt={chain.name}
                        style={{ width: 20, height: 20 }}
                      />
                    )}
                    <span>{chain.name}</span>
                  </button>
                </div>
              )}
            </div>
          );
        }}
      </RainbowConnectButton.Custom>
    </div>
  );
}
