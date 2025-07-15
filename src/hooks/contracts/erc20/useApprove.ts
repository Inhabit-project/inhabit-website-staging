import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { Address, Hex } from "viem";
import { ContractError, ServiceResult } from "@/models/api.model";
import { UsdtContract } from "@/services/blockchain/contracts/usdt";
import { UsdcContract } from "@/services/blockchain/contracts/usdc";

type Params = {
  spender: Address;
  amount: number;
};

export function useApprove(
  erc20: UsdcContract | UsdtContract
): UseMutationResult<Hex, ContractError, Params> {
  return useMutation<Hex, ContractError, Params>({
    mutationFn: async ({ spender, amount }: Params): Promise<Hex> => {
      const result: ServiceResult<Hex> = await erc20.approve(spender, amount);
      if (!result.success) throw result.error;
      return result.data!; // Hex string of the transaction hash
    },
  });
}
