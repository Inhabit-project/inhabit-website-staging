import { Address } from "viem";

export interface CollectionDto {
  campaignId: bigint;
  collectionId: bigint;
  collectionAddress: Address;
  name: string;
  symbol: string;
  baseURI: string;
  tokenCount: bigint;
  supply: bigint;
  price: bigint;
  state: boolean;
}
