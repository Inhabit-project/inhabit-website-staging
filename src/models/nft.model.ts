import { Address } from "thirdweb";

export interface Nft {
  chainId: number;
  contractAddress: Address;
  tokenType: string;
  tokenId: string;
  name: string;
  description: string;
  imageUrl: string;
  scanUrl: string;
  membershipContract: string;
  highResolutionImage: string;
}
