import { Address } from "viem";
import { CollectionDto } from "./collection.dto";

export interface CampaignDto {
  id: bigint;
  owner: Address;
  state: boolean;
  goal: bigint;
  fundsRaised: bigint;
  collectionsInfo: CollectionDto[];
}
