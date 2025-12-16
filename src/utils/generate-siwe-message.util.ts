// src/utils/generate-siwe-message.util.ts
import { SiweMessage } from "siwe";
import { Address } from "viem";

const STATEMENT =
  "Authenticate with INHABIT and become a steward of this ecosystem";

const VERSION = "1";

export function generatePartialSiweMessage(
  chainId: number,
  address: Address
): Partial<SiweMessage> {
  const domain = window.location.host;
  const uri = window.location.origin;

  const partialSiweMessage = {
    domain,
    address,
    statement: STATEMENT,
    uri,
    version: VERSION,
    chainId,
  };

  return partialSiweMessage;
}

export function generateSiweMessage(
  chainId: number,
  address: Address | string,
  nonce: string
): string {
  const domain = window.location.host;
  const uri = window.location.origin;
  const issuedAt = new Date().toISOString();

  const siweMessage = new SiweMessage({
    domain,
    address: address as Address,
    statement: STATEMENT,
    uri,
    version: VERSION,
    chainId,
    nonce,
    issuedAt,
  });

  return siweMessage.prepareMessage();
}
