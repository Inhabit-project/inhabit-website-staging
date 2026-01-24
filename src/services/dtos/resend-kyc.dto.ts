import { KYC_TYPE } from "@/config/enums";
import { Address, Hex } from "viem";

export interface ResendKycDto {
  chainId: number;
  message: string;
  signature: Hex;
  nonce: string;
  address: Address;
  kycType: KYC_TYPE;
}
