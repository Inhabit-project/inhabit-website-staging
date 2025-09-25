import { Address, formatUnits, Hex } from "viem";

import { parseContractError } from "@/config/contract.config";
import { ServiceResult } from "@/models/api.model";
import { BaseContract, ContractJson } from "../../base-contract";
import { Account } from "thirdweb/wallets";

export class ERC20Contract extends BaseContract {
  decimals = 0;

  constructor(contractJson: ContractJson, account?: Account) {
    super(contractJson, account);
  }

  // =========================
  //        READ METHODS
  // =========================

  async allowance(owner: Address, spender: Address): Promise<number> {
    try {
      const value = await this.read<bigint>("allowance", [owner, spender]);
      return Number(value);
    } catch (error) {
      console.error("❌", error);
      return 0;
    }
  }

  async balanceOf(address: Address): Promise<number> {
    try {
      const [balance, decimals] = await Promise.all([
        this.read<bigint>("balanceOf", [address]),
        this.getDecimals(),
      ]);

      const formattedBalance = formatUnits(balance, decimals);
      return Number(formattedBalance);
    } catch (error) {
      console.error("❌", error);
      return 0;
    }
  }

  private async getDecimals(): Promise<number> {
    try {
      const decimals = await this.read<bigint>("decimals", []);
      this.decimals = Number(decimals);
      return this.decimals;
    } catch (error) {
      console.error("❌", error);
      return 0;
    }
  }

  // =========================
  //        WRITE METHODS
  // =========================

  async approve(spender: Address, amount: bigint): Promise<ServiceResult<Hex>> {
    try {
      const hash = await this.write("approve", [spender, amount]);
      return { success: true, data: hash as Hex };
    } catch (error) {
      const parsedError = parseContractError(error, "approve");
      console.error("❌", parsedError);
      return { success: false, error: parsedError };
    }
  }
}
