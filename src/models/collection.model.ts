import { Address } from "viem";
import { Right } from "./right.model";

export interface Collection {
  campaignId: number;
  id: number;
  address: Address;
  hub: string;
  name: string;
  symbol: string;
  uri: string;
  sold: number;
  supply: number;
  availableSupply: number;
  price: number;
  state: boolean;
  description: string;
  image: string;
  rights: Right[];
  membershipContract: string;
}
