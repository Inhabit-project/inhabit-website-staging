import { Address, Hex } from "viem";

export interface UserDto {
  address: Address;
  message: string;
  signature: Hex;
  nonce: string;
  kycType: string;
  name: string;
  lastName: string;
  email: string;
  indicator?: string;
  cellphone?: string;
  telegramUser?: string;
}
