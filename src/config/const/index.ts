import { ensureEnvVar } from "../..//utils/ensure-env-var.util";
import InhabitCeloJson from "../../assets/json/contracts/celo/Inhabit.json";
import InhabitAlfajoresJson from "../../assets/json/contracts/celo-alfajores/Inhabit.json";
import usdcCeloJson from "../../assets/json/contracts/celo/USDC.json";
import usdcAlfajoresJson from "../../assets/json/contracts/celo-alfajores/USDC.json";
import usdtCeloJson from "../../assets/json/contracts/celo/USDT.json";
import usdtAlfajoresJson from "../../assets/json/contracts/celo-alfajores/USDT.json";
import { celo, celoAlfajores } from "viem/chains";
import { SiweMessage } from "siwe";
import { Address, zeroAddress } from "viem";

export const ENV: string = ensureEnvVar(import.meta.env.VITE_ENV, "VITE_ENV");

export const CHAIN = ENV === "prod" ? celo : celoAlfajores;

export const ALFAJORES_SCAN_URL = "https://alfajores.celoscan.io";

export const CELO_SCAN_URL = "https://explorer.celo.org";

export const SCAN_URL = (address: Address) =>
  ENV === "prod"
    ? `${CELO_SCAN_URL}/address/${address}`
    : `${ALFAJORES_SCAN_URL}/address/${address}`;

export const HTTP_TRANSPORT =
  ENV === "prod"
    ? "https://forno.celo.org"
    : "https://alfajores-forno.celo-testnet.org";

export const INHABIT_JSON =
  ENV === "prod" ? InhabitCeloJson : InhabitAlfajoresJson;

export const USDC_JSON = ENV === "prod" ? usdcCeloJson : usdcAlfajoresJson;

export const USDT_JSON = ENV === "prod" ? usdtCeloJson : usdtAlfajoresJson;

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
