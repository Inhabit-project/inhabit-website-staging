import { Address } from "viem";
import { CollectionDto } from "./collection.dto";

export interface CampaignDto {
  id: bigint;
  creator: Address;
  state: boolean;
  goal: bigint;
  fundsRaised: bigint;
  collectionsInfo: CollectionDto[];
}
