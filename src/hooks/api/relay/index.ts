import { APIError } from "@/models/api.model";
import { relayServices } from "@/services/rest/relay";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { Address, Hex } from "thirdweb";
import { MessageDefinition } from "viem";

type GetNonceParams = {
  address: Address;
  message: string;
  signature: Hex;
  from: Address;
  to: Address;
  tokenId: bigint;
};

export function useRelay() {
  const { getTransferFromMessageDefinition } = relayServices();

  const useGetTransferFromMessageDefinition: UseMutationResult<
    MessageDefinition,
    APIError,
    GetNonceParams
  > = useMutation<MessageDefinition, APIError, GetNonceParams>({
    mutationFn: async ({
      address,
      message,
      signature,
      from,
      to,
      tokenId,
    }: GetNonceParams): Promise<MessageDefinition> => {
      const result = await getTransferFromMessageDefinition({
        address,
        message,
        signature,
        from,
        to,
        tokenId,
      });
      if (!result.success) throw result.error;
      return result.data!;
    },
  });

  return {
    useGetTransferFromMessageDefinition,
  };
}
