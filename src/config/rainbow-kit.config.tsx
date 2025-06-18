import { WagmiProvider } from "wagmi";
import { celo, celoAlfajores } from "@wagmi/core/chains";

import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "@rainbow-me/rainbowkit/styles.css";
import { ensureEnvVar } from "../utils/ensure-env-var.util";

export function RainbowKitProviderConfig({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const isProduction = ensureEnvVar(
    import.meta.env.VITE_IS_PRODUCTION,
    "VITE_IS_PRODUCTION"
  );
  const projectId = ensureEnvVar(
    import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
    "VITE_WALLET_CONNECT_PROJECT_ID"
  );

  const appName: string = "Inhabit";

  const config = getDefaultConfig({
    appName,
    projectId,
    chains: [isProduction === "true" ? celo : celoAlfajores],
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
