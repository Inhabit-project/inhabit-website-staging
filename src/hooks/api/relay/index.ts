import { APIError, ContractError } from "@/models/api.model";
import { ForwardRequestData } from "@/models/forwarder-request-data.model";
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

type TransferFromParams = {
  chainId: number;
  address: Address;
  message: string;
  signature: Hex;
  request: ForwardRequestData;
};

export function useRelay() {
  const { getTransferFromMessageDefinition, transferFrom } = relayServices();

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

  const useTransferFrom: UseMutationResult<
    Hex,
    ContractError,
    TransferFromParams
  > = useMutation<Hex, ContractError, TransferFromParams>({
    mutationFn: async (data: TransferFromParams): Promise<Hex> => {
      const result = await transferFrom(data);
      if (!result.success) throw result.error;
      return result.data!;
    },
  });

  return {
    useGetTransferFromMessageDefinition,
    useTransferFrom,
  };
}
