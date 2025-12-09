import { ensureEnvVar } from "../..//utils/ensure-env-var.util";
import InhabitCeloJson from "../../assets/json/contracts/celo/Inhabit.json";
import InhabitSepoliaJson from "../../assets/json/contracts/celo-sepolia/Inhabit.json";
import usdcCeloJson from "../../assets/json/contracts/celo/USDC.json";
import usdcSepoliaJson from "../../assets/json/contracts/celo-sepolia/USDC.json";
import usdtCeloJson from "../../assets/json/contracts/celo/USDT.json";
import usdtSepoliaJson from "../../assets/json/contracts/celo-sepolia/USDT.json";
import cusdCeloJson from "../../assets/json/contracts/celo/cUSD.json";
import cusdSepoliaJson from "../../assets/json/contracts/celo-sepolia/cUSD.json";
import ccopCeloJson from "../../assets/json/contracts/celo/cCOP.json";
import ccopSepoliaJson from "../../assets/json/contracts/celo-sepolia/cCOP.json";
import { celo, celoSepolia } from "viem/chains";
import { SiweMessage } from "siwe";
import { Address, zeroAddress } from "viem";
import { createThirdwebClient } from "thirdweb";
import { celo as thierdwebCelo, celoSepoliaTestnet } from "thirdweb/chains";
import { ContractJson } from "@/services/blockchain/base-contract";

export const ENV: string = ensureEnvVar(import.meta.env.VITE_ENV, "VITE_ENV");

export const CHAIN = ENV === "prod" ? celo : celoSepolia;

export const SEPOLIA_SCAN_URL = "https://sepolia.celoscan.io";

export const CELO_SCAN_URL = "https://explorer.celo.org";

export const SCAN_URL = (address: Address) =>
  ENV === "prod"
    ? `${CELO_SCAN_URL}/address/${address}`
    : `${SEPOLIA_SCAN_URL}/address/${address}`;

export const HTTP_TRANSPORT =
  ENV === "prod"
    ? celo.rpcUrls.default.http[0]
    : celoSepolia.rpcUrls.default.http[0];

export const INHABIT_JSON =
  ENV === "prod"
    ? (InhabitCeloJson as ContractJson)
    : (InhabitSepoliaJson as ContractJson);

export const USDC_JSON =
  ENV === "prod"
    ? (usdcCeloJson as ContractJson)
    : (usdcSepoliaJson as ContractJson);

export const USDT_JSON =
  ENV === "prod"
    ? (usdtCeloJson as ContractJson)
    : (usdtSepoliaJson as ContractJson);

export const CUSD_JSON =
  ENV === "prod"
    ? (cusdCeloJson as ContractJson)
    : (cusdSepoliaJson as ContractJson);

export const CCOP_JSON =
  ENV === "prod"
    ? (ccopCeloJson as ContractJson)
    : (ccopSepoliaJson as ContractJson);

// Thirdweb

// Define a chain with custom RPC
export const chain = ENV === "prod" ? thierdwebCelo : celoSepoliaTestnet;

export const client = createThirdwebClient({
  clientId: ensureEnvVar(
    import.meta.env.VITE_THIRDWEB_CLIENT_ID,
    "VITE_THIRDWEB_CLIENT_ID"
  ),
});

// SiweMessage

export const DOMAIN = ensureEnvVar(import.meta.env.VITE_DOMAIN, "VITE_DOMAIN");

export const URI = DOMAIN;

// TODO: implement i18n support for the statement
export const SIWE_MESSAGE = new SiweMessage({
  domain: "INHABIT",
  address: zeroAddress,
  statement: "Authenticate with INHABIT and become a steward of this ecosystem",
  uri: URI,
  version: "1",
  chainId: 0,
  nonce: "",
  issuedAt: "",
});

// KYC

export const KYC_HARD_AMOUNT_USD: number = ENV === "prod" ? 1000 : 3;

export const MUST_DO_KYC_HARD = (price: number): boolean => {
  return price >= KYC_HARD_AMOUNT_USD;
};

export const COOLDOWN_KEY = "kycCooldownTimestamp";

export const COOKIE_REFERRAL = ensureEnvVar(
  import.meta.env.VITE_COOKIE_REFERRAL,
  "VITE_COOKIE_REFERRAL"
);

export const VITE_COOKIE_RATE_EXCHANGE = ensureEnvVar(
  import.meta.env.VITE_COOKIE_RATE_EXCHANGE,
  "VITE_COOKIE_RATE_EXCHANGE"
);

// Wompi

export const WOMPI_PUBLIC_KEY = ensureEnvVar(
  import.meta.env.VITE_WOMPI_PUBLIC_KEY,
  "VITE_WOMPI_PUBLIC_KEY"
);

export const WOMPI_INTEGRIDAD = ensureEnvVar(
  import.meta.env.VITE_WOMPI_INTEGRIDAD,
  "VITE_WOMPI_INTEGRIDAD"
);

// Exchangerate API

export const EXCHANGERATE_API_KEY = ensureEnvVar(
  import.meta.env.VITE_EXCHANGERATE_ACCESS_KEY,
  "VITE_EXCHANGERATE_ACCESS_KEY"
);
