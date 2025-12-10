import { RawAxiosRequestHeaders } from "axios";
import { walletsService } from "./wallets";
import { THIRDWEB_CLIENT_ID } from "@/config/const";

function getHost(): string {
  const host: string = "https://api.thirdweb.com/v1";
  return host;
}

function getHeaders(): RawAxiosRequestHeaders {
  return {
    "x-client-id": THIRDWEB_CLIENT_ID,
  };
}

export function thirdwebService() {
  const host = getHost();
  const headers = getHeaders();

  const { getWalletNftsForContractAddresses } = walletsService(
    host,
    headers,
    "wallets"
  );

  return { getWalletNftsForContractAddresses };
}
