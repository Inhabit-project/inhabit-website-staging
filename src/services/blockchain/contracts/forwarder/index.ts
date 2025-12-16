import { parseContractError } from "@/config/contract.config";
import { ServiceResult } from "@/models/api.model";
import { BaseContract } from "../../base-contract";
import { Account } from "thirdweb/wallets";
import { Address, ZERO_ADDRESS } from "thirdweb";
import forwarderJson from "@/assets/json/contracts/celo-sepolia/Forwarder.json";
import { Abi } from "viem";
import { FORWARDER_JSON } from "@/config/const";

const forwarderAbi = forwarderJson.abi as Abi;

export class ForwarderContract extends BaseContract {
  constructor(account?: Account) {
    super(FORWARDER_JSON, account);
  }

  // =========================
  //        READ METHODS
  // =========================

  async nonces(account: Address): Promise<ServiceResult<bigint>> {
    try {
      const nonce = await this.read<bigint>("nonces", [account]);
      return { success: true, data: nonce };
    } catch (error) {
      const parsedError = parseContractError(error, "nonces");
      console.error("❌", parsedError);
      return { success: false, error: parsedError };
    }
  }
}
