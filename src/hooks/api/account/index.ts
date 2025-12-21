import { APIError, ContractError } from "@/models/api.model";
import { accountsService } from "@/services/rest/account";
import { generatePartialSiweMessage } from "@/utils/generate-siwe-message.util";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
import { Address, Hex, ZERO_ADDRESS } from "thirdweb";

type SaveOrderParams = {
  chainId: number;
  address: Address;
  message: string;
  signature: Hex;
  reference: string;
  to: Address;
  referral: Hex;
  campaignId: string;
  collectionId: string;
  paymentToken: Address;
  paymentAmount: number;
};

export function useAccount(chainId: number, address: Address) {
  const { getSiweMessage, saveOrder } = accountsService();

  const QUERY_KEY = `${chainId}-${address}`;
  const QUERY_KEY_GET_SIWE_MESSAGE = `${QUERY_KEY}-get-siwe-message`;
  const QUERY_KEY_SAVE_ORDER = `${QUERY_KEY}-save-order`;

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

  const useSaveOrder: UseMutationResult<string, APIError, SaveOrderParams> =
    useMutation<string, APIError, SaveOrderParams>({
      mutationFn: async (data: SaveOrderParams): Promise<string> => {
        const result = await saveOrder(data);
        if (!result.success) throw result.error;
        return result.data!;
      },
    });

  return {
    useGetSiweMessage,
    useSaveOrder,
    QUERY_KEY_GET_SIWE_MESSAGE,
    QUERY_KEY_SAVE_ORDER,
  };
}
