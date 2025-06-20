import { Address, Hex } from "viem";

export interface User {
  nonce: string;
  address: Address;
  message: string;
  signature: Hex;
}
