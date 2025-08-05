import { PrivyProvider } from "@privy-io/react-auth";
import { ensureEnvVar } from "@/utils/ensure-env-var.util";

type Props = {
  children: React.ReactNode;
};

export function PrivyProviderConfig({ children }: Props): JSX.Element {
  const appId = ensureEnvVar(
    import.meta.env.VITE_PRIVY_APP_ID,
    "VITE_PRIVY_APP_ID"
  );
  return (
    <PrivyProvider
      appId={appId}
      config={{
        loginMethods: ["wallet", "google"],
        embeddedWallets: {
          ethereum: {
            createOnLogin: "users-without-wallets",
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
