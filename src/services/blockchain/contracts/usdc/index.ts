import { Address, Hex, WalletClient } from "viem";

import { USDC_JSON } from "../../../../config/const";
import {
  formatUsdcToUsd,
  parseUsdToUsdc,
} from "../../../../utils/usdc-format.utils";
import { parseContractError } from "@/config/contract.config";
import { ServiceResult } from "@/models/api.model";
import { BaseContract } from "../../base-contract";

export class UsdcContract extends BaseContract {
  constructor(walletClient?: WalletClient) {
    super(USDC_JSON, walletClient);
  }

  // =========================
  //        READ METHODS
  // =========================

  async getBalance(address: Address): Promise<number> {
    try {
      const contract = this.getReadContract();
      const balance = (await contract.read.balanceOf([address])) as bigint;
      return formatUsdcToUsd(balance);
    } catch (error) {
      console.error("❌", error);
      return 0;
    }
  }

  async allowance(owner: Address, spender: Address): Promise<number> {
    try {
      const contract = this.getReadContract();
      const allowance = (await contract.read.allowance([
        owner,
        spender,
      ])) as bigint;
      return formatUsdcToUsd(allowance);
    } catch (error) {
      console.error("❌", error);
      return 0;
    }
  }

  // =========================
  //        WRITE METHODS
  // =========================

  async approve(spender: Address, amount: number): Promise<ServiceResult<Hex>> {
    try {
      const publicClient = this.getPublicClient();
      const contract = this.getWriteContract();
      const fees = await this.getFees();
      const hash = await contract.write.approve(
        [spender, parseUsdToUsdc(amount)],
        {
          maxPriorityFeePerGas: fees.maxPriorityFeePerGas,
          maxFeePerGas: fees.maxFeePerGas,
        }
      );

      await publicClient.waitForTransactionReceipt({ hash });

      return { success: true, data: hash };
    } catch (error) {
      const parsedError = parseContractError(error, "approve");
      console.error("❌", parsedError);
      return { success: false, error: parsedError };
    }
  }
}
