import { KYC_TYPE } from "src/config/enums";
import { Address, Hex } from "viem";

export interface UserDto {
  address: Address;
  message: string;
  signature: Hex;
  nonce: string;
  type: KYC_TYPE;
  name: string;
  lastName: string;
  email: string;
  indicator?: string;
  cellphone?: string;
  telegramUser?: string;
}
