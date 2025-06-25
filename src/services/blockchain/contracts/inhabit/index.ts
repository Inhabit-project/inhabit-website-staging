import {
  Address,
  WalletClient,
  createPublicClient,
  getContract,
  http,
} from "viem";
import { celoAlfajores } from "viem/chains";
import { CampaignDto } from "../../../dtos/campaing.dto";
import { mapCampaignDtoToCampaign } from "../../../mapping/mapCampaignDtoToCampaign";
import { CollectionDto } from "../../../dtos/collection.dto";
import { mapCollectionDtoToCollection } from "../../../mapping/mapColletionDtoToCollection";
import { Campaign } from "../../../../models/campaign.model";
import { Collection } from "../../../../models/collection.model";
import { HTTP_TRANSPORT, INHABIT_JSON } from "../../../../config/const";
import { GroupDto } from "../../../dtos/group.dto";
import { mapGroupDtoToGroup } from "../../../mapping/mapGroupDtoToGroup";
import { Group } from "../../../../models/group.model";

export class InhabitContract {
  private address: Address;
  private publicClient: ReturnType<typeof createPublicClient>;
  private walletClient: WalletClient | null;

  constructor(walletClient?: WalletClient) {
    this.address = INHABIT_JSON.proxy as Address;

    this.publicClient = createPublicClient({
      chain: celoAlfajores,
      transport: http(HTTP_TRANSPORT),
    });

    this.walletClient = walletClient ?? null;
  }

  setWalletClient(walletClient: WalletClient) {
    this.walletClient = walletClient;
  }

  private getReadContract() {
    return getContract({
      address: this.address,
      abi: INHABIT_JSON.abi,
      client: {
        public: this.publicClient,
      },
    });
  }

  private getWriteContract() {
    if (!this.walletClient) {
      throw new Error("walletClient not set. Call setWalletClient() first.");
    }

    return getContract({
      address: this.address,
      abi: INHABIT_JSON.abi,
      client: {
        public: this.publicClient,
        wallet: this.walletClient,
      },
    });
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

      return mapCampaignDtoToCampaign(dto);
    } catch (error) {
      console.error("❌", error);
      return null;
    }
  }

  async getCampaigns(): Promise<Campaign[]> {
    try {
      const contract = this.getReadContract();
      const dtos = (await contract.read.getCampaigsInfo()) as CampaignDto[];

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

      return mapGroupDtoToGroup(dto);
    } catch (error) {
      console.error("❌", error);
      return null;
    }
  }

  // =========================
  //        WRITE METHODS
  // =========================

  async createCampaign(
    goal: bigint,
    collections: CollectionDto[],
    account: Address
  ) {
    const contract = this.getWriteContract();

    return contract.write.createCampaign([goal, collections], {
      account,
    });
  }
}
