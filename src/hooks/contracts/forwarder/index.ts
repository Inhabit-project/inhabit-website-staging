import { ForwarderContract } from "@/services/blockchain/contracts/forwarder";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Address } from "thirdweb";
import { Account } from "thirdweb/wallets";

export function useForwarder(account?: Account) {
  const forwarder = new ForwarderContract(account);

  // =========================
  //        READ METHODS
  // =========================

  const useNonces = (account: Address): UseQueryResult<bigint, Error> => {
    return useQuery({
      queryKey: ["nonces", account],
      enabled: !!account,
      queryFn: async (): Promise<bigint> => {
        const result = await forwarder.nonces(account);
        if (!result.success) throw result.error;
        return result.data!;
      },
      staleTime: 30000,
      refetchOnWindowFocus: false,
      placeholderData: (previous: bigint | undefined) => previous ?? 0n,
    });
  };

  return {
    useNonces,
    address: forwarder.getAddress(),
  };
}
