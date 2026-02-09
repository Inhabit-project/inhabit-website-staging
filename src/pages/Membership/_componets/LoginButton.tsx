import { client, ENV, chain } from "@/config/const";
import { useStore } from "@/store";
import { useEffect } from "react";
import { Address } from "thirdweb";
import {
  ConnectButton,
  useActiveAccount,
  useActiveWallet,
} from "thirdweb/react";
import { darkTheme } from "thirdweb/react";
import { inAppWallet, createWallet } from "thirdweb/wallets";

const wallets = [
  inAppWallet({
    auth: {
      options: [
        "google",
        "discord",
        "telegram",
        "farcaster",
        "email",
        "x",
        "passkey",
        "phone",
      ],
    },
  }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
];

export function LoginButton(): JSX.Element {
  const account = useActiveAccount();
  const activeWallet = useActiveWallet();
  const { campaigns, collections, getWalletNfts } = useStore();

  useEffect(() => {
    if (account && campaigns.length > 0) {
      getWalletNfts(account.address as Address);
    }
  }, [account, campaigns]);

  return (
    <div className="w-full flex justify-center">
      <ConnectButton
        client={client}
        connectButton={{ label: "Login" }}
        connectModal={{ size: "compact" }}
        theme={darkTheme({
          colors: {
            modalBg: "hsl(141, 32%, 16%)",
            accentText: "hsl(32, 100%, 42%)",
            borderColor: "hsl(0, 1%, 60%)",
            primaryButtonBg: "hsl(32, 100%, 42%)",
            secondaryButtonText: "hsl(0, 0%, 0%)",
            primaryButtonText: "hsl(86, 100%, 96%)",
            secondaryButtonBg: "hsl(76, 57%, 81%)",
          },
        })}
        wallets={wallets}
        chain={chain}
      />
      {account && activeWallet ? (
        <button
          type="button"
          aria-label="Disconnect wallet"
          className="absolute inset-0 cursor-pointer bg-transparent"
          onClick={() => activeWallet.disconnect()}
        />
      ) : null}
    </div>
  );
}
