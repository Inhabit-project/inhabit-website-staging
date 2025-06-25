import { useMutation } from "@tanstack/react-query";
import { accountsService } from "../services/rest/account";
import { Address } from "viem";

export function useNonce() {
  const { getNonce } = accountsService();

  return useMutation({
    mutationFn: async (address: Address) => {
      const result = await getNonce(address);
      if (!result.success) throw result.error;
      return result.data; // nonce
    },
  });
}
