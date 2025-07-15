import { Address, Hex, keccak256, toBytes, WalletClient } from "viem";

import { INHABIT_JSON } from "../../../../config/const";
import { ServiceResult } from "@/models/api.model";
import { parseContractError } from "@/config/contract.config";
import { BaseContract } from "../../base-contract";
import { CampaignDto } from "@/services/dtos/campaing.dto";
import { mapCampaignDtoToCampaign } from "@/services/mapping/mapCampaignDtoToCampaign";
import { mapCollectionDtoToCollection } from "@/services/mapping/mapColletionDtoToCollection";
import { mapGroupDtoToGroup } from "@/services/mapping/mapGroupDtoToGroup";
import { GroupDto } from "@/services/dtos/group.dto";
import { CollectionDto } from "@/services/dtos/collection.dto";
import { Collection } from "@/models/collection.model";
import { Campaign } from "@/models/campaign.model";

export class InhabitContract extends BaseContract {
  constructor(walletClient?: WalletClient) {
    super(INHABIT_JSON, walletClient);
  }

  // =========================
  //        READ METHODS
  // =========================

  async getCampaign(campaignId: number): Promise<Campaign | null> {
    try {
      const contract = this.getReadContract();
      const dto = (await contract.read.getCampaignInfo([
        BigInt(campaignId),
      ])) as CampaignDto;

      if (dto.id === 0n) return null;

      return mapCampaignDtoToCampaign(dto);
    } catch (error) {
      console.error("❌", error);
      return null;
    }
  }

  async getCampaigns(): Promise<Campaign[]> {
    try {
      const contract = this.getReadContract();
      const dtos = (await contract.read.getCampaignsInfo()) as CampaignDto[];
      return Promise.all(dtos.map(mapCampaignDtoToCampaign));
    } catch (error) {
      console.error("❌", error);
      return [];
    }
  }

  async getCampaignCollections(campaignId: number): Promise<Collection[]> {
    try {
      const contract = this.getReadContract();
      const dtos = (await contract.read.getCollectionsInfo([
        BigInt(campaignId),
      ])) as CollectionDto[];

      return Promise.all(dtos.map(mapCollectionDtoToCollection));
    } catch (error) {
      console.error("❌", error);
      return [];
    }
  }

  async getGroup(campaignId: number, referral: string) {
    try {
      const contract = this.getReadContract();
      const dto = (await contract.read.getGroupByCampaignIdAndReferral([
        BigInt(campaignId),
        keccak256(toBytes(referral)),
      ])) as GroupDto;

      if (dto.id === 0n) return null;

      return mapGroupDtoToGroup(dto);
    } catch (error) {
      console.error("❌", error);
      return null;
    }
  }

  async isCampaignReferralSupported(
    campaignId: number,
    referral: Hex
  ): Promise<boolean> {
    try {
      const contract = this.getReadContract();
      return (await contract.read.isCampaignReferralSupported([
        BigInt(campaignId),
        referral,
      ])) as boolean;
    } catch (error) {
      console.error("❌", error);
      return false;
    }
  }

  // =========================
  //        WRITE METHODS
  // =========================

  async buyNFT(
    campaignId: number,
    collection: Address,
    referral: Hex,
    token: Address
  ): Promise<ServiceResult<Hex>> {
    try {
      const publicClient = this.getPublicClient();
      const contract = this.getWriteContract();
      const fees = await this.getFees();
      const hash = await contract.write.buyNFT(
        [BigInt(campaignId), collection, referral, token],
        {
          maxPriorityFeePerGas: fees.maxPriorityFeePerGas,
          maxFeePerGas: fees.maxFeePerGas,
        }
      );

      await publicClient.waitForTransactionReceipt({ hash });

      return { success: true, data: hash };
    } catch (error) {
      const parsedError = parseContractError(error, "buyNFT");
      console.error("❌", parsedError);
      return { success: false, error: parsedError };
    }
  }
}
