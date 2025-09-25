import type { Address, Hex } from "viem";
import { INHABIT_JSON } from "@/config/const";
import { BaseContract } from "../../base-contract";
import { Account } from "thirdweb/wallets";
import { CampaignDto } from "@/services/dtos/campaing.dto";
import { mapCampaignDtoToCampaign } from "@/services/mapping/mapCampaignDtoToCampaign";
import { parseContractError } from "@/config/contract.config";
import { parseUsdToUsdc } from "@/utils/usdc-format.utils";
import { GroupDto } from "@/services/dtos/group.dto";
import { mapGroupDtoToGroup } from "@/services/mapping/mapGroupDtoToGroup";

export class InhabitContract extends BaseContract {
  constructor(account?: Account) {
    super(INHABIT_JSON, account);
  }

  // =========================
  //        READ METHODS
  // =========================

  async calculateTokenAmount(
    paymentToken: Address,
    price: number
  ): Promise<number> {
    try {
      const amount = await this.read<bigint>(
        "calculateUsdTokenPriceInPaymentToken",
        [paymentToken, parseUsdToUsdc(price)]
      );

      return Number(amount);
    } catch (error) {
      console.error("❌", error);
      return 0;
    }
  }

  async getGroup(campaignId: number, referral: Hex) {
    try {
      console.log("🔍 Contract getGroup called with:", {
        campaignId,
        referral,
      });
      const dto = await this.read<GroupDto>("getGroup", [
        BigInt(campaignId),
        referral,
      ]);
      console.log("🔍 Contract getGroup response:", dto);

      if (dto.id === 0n) {
        console.log("❌ Group not found (id === 0n)");
        return null;
      }
      const mappedGroup = mapGroupDtoToGroup(dto);
      console.log("✅ Group mapped successfully:", mappedGroup);
      return mappedGroup;
    } catch (error) {
      console.error("❌ Error in getGroup:", error);
      return null;
    }
  }

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
    paymentToken: Address,
    paymentAmount: number
  ) {
    try {
      const hash = await this.write("buyNFT", [
        to,
        BigInt(campaignId),
        collection,
        referral,
        paymentToken,
        BigInt(paymentAmount),
      ]);
      return { success: true, data: hash };
    } catch (error) {
      const parsedError = parseContractError(error, "buyNFT");
      console.error("❌", parsedError);
      return { success: false, error: parsedError };
    }
  }
}
