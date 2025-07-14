import { Address } from "viem";
import { Collection } from "./collection.model";

export interface Campaign {
  id: number;
  owner: Address;
  state: boolean;
  goal: number;
  fundsRaised: number;
  collections: Collection[];
}
