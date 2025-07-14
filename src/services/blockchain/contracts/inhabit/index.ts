import { Address, Hex, WalletClient } from "viem";

import { INHABIT_JSON } from "../../../../config/const";
import { ServiceResult } from "@/models/api.model";
import { parseContractError } from "@/config/contract.config";
import { BaseContract } from "../../base-contract";
import { CampaignDto } from "@/services/dtos/campaing.dto";
import { mapCampaignDtoToCampaign } from "@/services/mapping/mapCampaignDtoToCampaign";
import { mapCollectionDtoToCollection } from "@/services/mapping/mapColletionDtoToCollection";
import { mapGroupDtoToGroup } from "@/services/mapping/mapGroupDtoToGroup";
import { GroupDto } from "@/services/dtos/group.dto";
import { Group } from "@/models/group.model";
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
      const dto = (await contract.read.getCampaign([
        BigInt(campaignId),
      ])) as CampaignDto;

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

  async getGroup(referral: string): Promise<Group | null> {
    try {
      const contract = this.getReadContract();
      const dto = (await contract.read.getGroup([referral])) as GroupDto;

      if (dto.referral === "") return null;

      return mapGroupDtoToGroup(dto);
    } catch (error) {
      console.error("❌", error);
      return null;
    }
  }

  async getGroups(): Promise<Group[]> {
    try {
      const contract = this.getReadContract();
      const dtos = (await contract.read.getGroupsInfo()) as GroupDto[];
      return dtos.map(mapGroupDtoToGroup);
    } catch (error) {
      console.error("❌", error);
      return [];
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
    campaignId: string,
    collection: Address,
    groupId: number,
    token: Address
  ): Promise<ServiceResult<Hex>> {
    try {
      const publicClient = this.getPublicClient();
      const contract = this.getWriteContract();
      const fees = await this.getFees();
      const hash = await contract.write.buyNFT(
        [BigInt(campaignId), collection, BigInt(groupId), token],
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
