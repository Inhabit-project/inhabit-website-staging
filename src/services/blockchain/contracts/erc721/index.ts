import { parseContractError } from "@/config/contract.config";
import { ServiceResult } from "@/models/api.model";
import { BaseContract } from "../../base-contract";
import { Account } from "thirdweb/wallets";
import { Address, Hex, ZERO_ADDRESS } from "thirdweb";
import { erc721Abi } from "viem";

export class ERC721Contract extends BaseContract {
  constructor(contractAddress: Address, account?: Account) {
    super(
      {
        proxy: contractAddress,
        implementation: ZERO_ADDRESS,
        abi: erc721Abi,
      },
      account
    );
  }

  // =========================
  //        READ METHODS
  // =========================

  async getApproved(tokenId: bigint): Promise<ServiceResult<Hex>> {
    try {
      const approved = await this.read<Address>("getApproved", [tokenId]);
      return { success: true, data: approved };
    } catch (error) {
      const parsedError = parseContractError(error, "getApproved");
      console.error("❌", parsedError);
      return { success: false, error: parsedError };
    }
  }

  async name(): Promise<ServiceResult<string>> {
    try {
      const name = await this.read<string>("name", []);
      return { success: true, data: name };
    } catch (error) {
      const parsedError = parseContractError(error, "name");
      console.error("❌", parsedError);
      return { success: false, error: parsedError };
    }
  }

  async ownerOf(tokenId: bigint): Promise<ServiceResult<Hex>> {
    try {
      const owner = await this.read<Address>("ownerOf", [tokenId]);
      return { success: true, data: owner };
    } catch (error) {
      const parsedError = parseContractError(error, "ownerOf");
      console.error("❌", parsedError);
      return { success: false, error: parsedError };
    }
  }

  // =========================
  //        WRITE METHODS
  // =========================

  async approve(to: Address, tokenId: bigint): Promise<ServiceResult<Hex>> {
    try {
      const hash = await this.write("approve", [to, tokenId]);
      return { success: true, data: hash as Hex };
    } catch (error) {
      const parsedError = parseContractError(error, "approve");
      console.error("❌", parsedError);
      return { success: false, error: parsedError };
    }
  }

  async transferFrom(
    from: Address,
    to: Address,
    tokenId: bigint
  ): Promise<ServiceResult<Hex>> {
    try {
      const hash = await this.write("transferFrom", [from, to, tokenId]);
      return { success: true, data: hash as Hex };
    } catch (error) {
      const parsedError = parseContractError(error, "transferFrom");
      console.error("❌", parsedError);
      return { success: false, error: parsedError };
    }
  }
}
