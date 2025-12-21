import { parseContractError } from "@/config/contract.config";
import { ServiceResult } from "@/models/api.model";
import { BaseContract } from "../../base-contract";
import { Account } from "thirdweb/wallets";
import { Address, ZERO_ADDRESS } from "thirdweb";
import forwarderJson from "@/assets/json/contracts/celo-sepolia/Forwarder.json";
import { Abi, TypedDataDomain } from "viem";
import { FORWARDER_JSON } from "@/config/const";
import { TypedDataDomainDto } from "@/services/dtos/typed-data-domain.dto";

const forwarderAbi = forwarderJson.abi as Abi;

export class ForwarderContract extends BaseContract {
  constructor(account?: Account) {
    super(FORWARDER_JSON, account);
  }

  // =========================
  //        READ METHODS
  // =========================

  async eip712Domain(): Promise<ServiceResult<TypedDataDomain>> {
    try {
      const domainDto = await this.read<TypedDataDomainDto>("eip712Domain", []);
      return { success: true, data: mapDtoToTypedDataDomain(domainDto) };
    } catch (error) {
      const parsedError = parseContractError(error, "eip712Domain");
      console.error("❌", parsedError);
      return { success: false, error: parsedError };
    }
  }

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

function mapDtoToTypedDataDomain(dto: TypedDataDomainDto): TypedDataDomain {
  return {
    chainId: dto[3],
    name: dto[1],
    version: dto[2],
    verifyingContract: dto[4],
    salt: dto[5],
  };
}
