import { Address, Hex } from "viem";

import { USDT_JSON } from "../../../../config/const";
import {
  formatUsdcToUsd,
  parseUsdToUsdc,
} from "../../../../utils/usdc-format.utils";
import { parseContractError } from "@/config/contract.config";
import { ServiceResult } from "@/models/api.model";
import { BaseContract } from "../../base-contract";
import { Account } from "thirdweb/wallets";

export class UsdtContract extends BaseContract {
  constructor(account?: Account) {
    super(USDT_JSON, account);
  }

  // =========================
  //        READ METHODS
  // =========================

  async getBalance(address: Address): Promise<number> {
    try {
      const balance = await this.read<bigint>("balanceOf", [address]);
      return formatUsdcToUsd(balance);
    } catch (error) {
      console.error("❌", error);
      return 0;
    }
  }

  async allowance(owner: Address, spender: Address): Promise<number> {
    try {
      const value = await this.read<bigint>("allowance", [owner, spender]);
      return formatUsdcToUsd(value);
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
      const hash = await this.write("approve", [
        spender,
        parseUsdToUsdc(amount),
      ]);
      return { success: true, data: hash as Hex };
    } catch (error) {
      const parsedError = parseContractError(error, "approve");
      console.error("❌", parsedError);
      return { success: false, error: parsedError };
    }
  }
}
