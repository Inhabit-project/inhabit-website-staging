import {
  Address,
  WalletClient,
  createPublicClient,
  getContract,
  http,
} from "viem";
import { celoAlfajores } from "viem/chains";
import InhabitJson from "../../../../assets/json/contracts/Inhabit.json";
import { CampaignDto } from "../../../dtos/campaing.dto";
import { mapCampaignDtoToCampaign } from "../../../mapping/mapCampaignDtoToCampaign";
import { CollectionDto } from "../../../dtos/collection.dto";
import { mapCollectionDtoToCollection } from "../../../mapping/mapColletionDtoToCollection";
import { Campaign } from "../../../../models/campaign.model";
import { Collection } from "../../../../models/collection.model";

export class InhabitContract {
  private address: Address;
  private publicClient: ReturnType<typeof createPublicClient>;
  private walletClient: WalletClient | null;

  constructor(walletClient?: WalletClient) {
    this.address = InhabitJson.proxy as Address;

    this.publicClient = createPublicClient({
      chain: celoAlfajores,
      transport: http("https://alfajores-forno.celo-testnet.org"),
    });

    this.walletClient = walletClient ?? null;
  }

  setWalletClient(walletClient: WalletClient) {
    this.walletClient = walletClient;
  }

  private getReadContract() {
    return getContract({
      address: this.address,
      abi: InhabitJson.abi,
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
      abi: InhabitJson.abi,
      client: {
        public: this.publicClient,
        wallet: this.walletClient,
      },
    });
  }

  // =========================
  //        READ METHODS
  // =========================

  async getCampaign(campaignId: number): Promise<Campaign> {
    try {
      const contract = this.getReadContract();
      const dto = (await contract.read.getCampaignAndCollectionsInfo([
        BigInt(campaignId),
      ])) as CampaignDto;

      return mapCampaignDtoToCampaign(dto);
    } catch (error) {
      console.error("❌", error);
      return {} as Campaign;
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
