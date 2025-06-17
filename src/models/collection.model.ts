import { Address } from "viem";

export interface Collection {
  campaignId: number;
  collectionId: number;
  collectionAddress: Address;
  name: string;
  symbol: string;
  baseURI?: string;
  tokenCount: number;
  supply: number;
  availableSupply: number;
  price: number;
  state: boolean;
  description?: string;
  image?: string;
}
