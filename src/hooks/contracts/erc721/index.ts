import { chain } from "@/config/const";
import { ContractError } from "@/models/api.model";
import { ERC721Contract } from "@/services/blockchain/contracts/erc721";
import {
  useMutation,
  useQuery,
  UseQueryResult,
  UseMutationResult,
} from "@tanstack/react-query";
import { useMemo } from "react";
import { Address, Hex } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";

type ApproveParams = {
  to: Address;
  tokenId: bigint;
};

type TransferFromParams = {
  from: Address;
  to: Address;
  tokenId: bigint;
};

export function useErc721(contractAddress: Address) {
  // thirdweb
  const account = useActiveAccount();

  const erc721 = useMemo(
    () => new ERC721Contract(contractAddress, account),
    [contractAddress, account]
  );

  const QUERY_KEY = `${chain}-${contractAddress}`;
  const QUERY_KEY_BALANCE_OF = `${QUERY_KEY}-balance-of`;
  const QUERY_KEY_GET_APPROVED = `${QUERY_KEY}-get-approved`;
  const QUERY_KEY_NAME = `${QUERY_KEY}-name`;
  const QUERY_KEY_OWNER_OF = `${QUERY_KEY}-owner-of`;

  // =========================
  //        READ METHODS
  // =========================

  const useGetApproved = (tokenId: bigint): UseQueryResult<Address, Error> => {
    return useQuery({
      queryKey: [QUERY_KEY_GET_APPROVED, tokenId.toString()],
      enabled: !!tokenId,
      queryFn: async (): Promise<Address> => {
        const result = await erc721.getApproved(tokenId);
        if (!result.success) throw result.error;
        return result.data!;
      },
      staleTime: 30000,
      refetchOnWindowFocus: false,
      placeholderData: (previous: Address | undefined) => previous,
    });
  };

  const useName = (): UseQueryResult<string, Error> => {
    return useQuery({
      queryKey: [QUERY_KEY_NAME],
      queryFn: async (): Promise<string> => {
        const result = await erc721.name();
        if (!result.success) throw result.error;
        return result.data!;
      },
    });
  };

  const useBalanceOf = (owner: Address): UseQueryResult<bigint, Error> => {
    return useQuery({
      queryKey: [QUERY_KEY_BALANCE_OF, owner],
      enabled: !!owner,
      queryFn: async (): Promise<bigint> => {
        const result = await erc721.balanceOf(owner);
        if (!result.success) throw result.error;
        return result.data!;
      },
    });
  };

  const useOwnerOf = (tokenId: bigint): UseQueryResult<Address, Error> => {
    return useQuery({
      queryKey: [QUERY_KEY_OWNER_OF, tokenId.toString()],
      enabled: !!tokenId,
      queryFn: async (): Promise<Address> => {
        const result = await erc721.ownerOf(tokenId);
        if (!result.success) throw result.error;
        return result.data!;
      },
      staleTime: 30000,
      refetchOnWindowFocus: false,
      placeholderData: (previous: Address | undefined) => previous,
    });
  };

  // =========================
  //        WRITE METHODS
  // =========================

  const useApprove: UseMutationResult<Hex, ContractError, ApproveParams> =
    useMutation<Hex, ContractError, ApproveParams>({
      mutationFn: async ({ to, tokenId }: ApproveParams): Promise<Hex> => {
        const result = await erc721.approve(to, tokenId);
        if (!result.success) throw result.error;
        return result.data!;
      },
    });

  const useTransferFrom: UseMutationResult<
    Hex,
    ContractError,
    TransferFromParams
  > = useMutation<Hex, ContractError, TransferFromParams>({
    mutationFn: async ({
      from,
      to,
      tokenId,
    }: TransferFromParams): Promise<Hex> => {
      const result = await erc721.transferFrom(from, to, tokenId);
      if (!result.success) throw result.error;
      return result.data!;
    },
  });

  return {
    useGetApproved,
    useName,
    useOwnerOf,
    useBalanceOf,
    useApprove,
    useTransferFrom,
    address: erc721.getAddress(),
    QUERY_KEY_GET_APPROVED,
    QUERY_KEY_NAME,
    QUERY_KEY_OWNER_OF,
    QUERY_KEY_BALANCE_OF,
  };
}
