import { accountsService } from "@/services/rest/account";
import { generatePartialSiweMessage } from "@/utils/generate-siwe-message.util";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Address, ZERO_ADDRESS } from "thirdweb";

export function useAccount(chainId: number, address: Address) {
  const { getSiweMessage } = accountsService();

  const QUERY_KEY = `${chainId}-${address}`;
  const QUERY_KEY_GET_SIWE_MESSAGE = `${QUERY_KEY}-get-siwe-message`;

  // =========================
  //        READ METHODS
  // =========================

  const useGetSiweMessage = (): UseQueryResult<string, Error> => {
    return useQuery({
      queryKey: [QUERY_KEY_GET_SIWE_MESSAGE, chainId, address],
      enabled:
        !!chainId && chainId > 0 && !!address && address !== ZERO_ADDRESS,
      queryFn: async (): Promise<string> => {
        const partialSiweMessage = generatePartialSiweMessage(chainId, address);
        const result = await getSiweMessage(partialSiweMessage);
        if (!result.success) throw result.error;
        return result.data!;
      },
    });
  };

  return {
    useGetSiweMessage,
    QUERY_KEY_GET_SIWE_MESSAGE,
  };
}
