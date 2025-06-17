import { Address } from "viem";

export interface Collection {
  campaignId: number;
  id: number;
  address: Address;
  name: string;
  symbol: string;
  uri: string;
  sold: number;
  supply: number;
  availableSupply: number;
  price: number;
  state: boolean;
  description?: string;
  image?: string;
}
