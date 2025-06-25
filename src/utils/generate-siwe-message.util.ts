import { SiweMessage } from "siwe";
import { DOMAIN, SIWE_MESSAGE } from "../config/const";
import { Address, checksumAddress, Hex } from "viem";

export function generateSiweMessage(
  chainId: number,
  address: Address,
  nonce: string
): string {
  const issuedAt: string = new Date().toISOString();

  const siweMessage = new SiweMessage({
    ...SIWE_MESSAGE,
    address: checksumAddress(address),
    chainId,
    nonce,
    issuedAt,
    domain: DOMAIN,
  });

  return siweMessage.prepareMessage();
}
