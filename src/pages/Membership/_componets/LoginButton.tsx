import { client, ENV, chain } from "@/config/const";
import { ConnectButton } from "thirdweb/react";
import { darkTheme } from "thirdweb/react";
import { inAppWallet, createWallet } from "thirdweb/wallets";

const wallets = [
  // inAppWallet({
  //   auth: {
  //     options: [
  //       "google",
  //       "discord",
  //       "telegram",
  //       "farcaster",
  //       "email",
  //       "x",
  //       "passkey",
  //       "phone",
  //     ],
  //   },
  // }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
];

export function LoginButton(): JSX.Element {
  return (
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
  );
}
