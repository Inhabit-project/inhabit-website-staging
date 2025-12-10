import { Address } from "thirdweb";

export interface Nft {
  chainId: number;
  contractAddress: Address;
  tokenType: string;
  name: string;
  description: string;
  imageUrl: string;
  scanUrl: string;
}
