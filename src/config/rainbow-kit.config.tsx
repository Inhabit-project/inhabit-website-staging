import { WagmiProvider } from "wagmi";
import { celo, celoAlfajores } from "@wagmi/core/chains";

import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "@rainbow-me/rainbowkit/styles.css";
import { ensureEnvVar } from "../utils/ensure-env-var.util";
import { IS_PRODUCTION } from "./const";

export function RainbowKitProviderConfig({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const projectId = ensureEnvVar(
    import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
    "VITE_WALLET_CONNECT_PROJECT_ID"
  );

  const appName: string = "Inhabit";

  const config = getDefaultConfig({
    appName,
    projectId,
    chains: [IS_PRODUCTION === "true" ? celo : celoAlfajores],
    ssr: true,
  });

  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
