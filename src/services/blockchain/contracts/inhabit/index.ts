import type { Address, Hex } from "viem";
import { INHABIT_JSON } from "@/config/const";
import { BaseContract } from "../../base-contract";
import { Account } from "thirdweb/wallets";
import { CampaignDto } from "@/services/dtos/campaing.dto";
import { mapCampaignDtoToCampaign } from "@/services/mapping/mapCampaignDtoToCampaign";
import { parseContractError } from "@/config/contract.config";

export class InhabitContract extends BaseContract {
  constructor(account?: Account) {
    super(INHABIT_JSON, account);
  }

  // =========================
  //        READ METHODS
  // =========================

  async getCampaign(campaignId: number) {
    try {
      const dto = await this.read<CampaignDto>("getCampaignInfo", [
        BigInt(campaignId),
      ]);

      if (dto.id === 0n) return null;
      return await mapCampaignDtoToCampaign(dto);
    } catch (error) {
      console.error("❌", error);
      return [];
    }
  }

  async getCampaigns() {
    try {
      const dtos = await this.read<CampaignDto[]>("getCampaignsInfo", []);

      if (dtos.length === 0) return [];
      return Promise.all(dtos.map(mapCampaignDtoToCampaign));
    } catch (error) {
      console.error("❌", error);
      return [];
    }
  }

  // =========================
  //        WRITE METHODS
  // =========================

  async buyNFT(
    to: Address,
    campaignId: number,
    collection: Address,
    referral: Hex,
    token: Address
  ) {
    try {
      const hash = await this.write("buyNFT", [
        to,
        BigInt(campaignId),
        collection,
        referral,
        token,
      ]);
      return { success: true, data: hash };
    } catch (error) {
      const parsedError = parseContractError(error, "approve");
      console.error("❌", parsedError);
      return { success: false, error: parsedError };
    }
  }
}
