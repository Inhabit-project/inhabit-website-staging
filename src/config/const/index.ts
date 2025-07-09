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

export const IS_PRODUCTION: string = ensureEnvVar(
  import.meta.env.VITE_IS_PRODUCTION,
  "VITE_IS_PRODUCTION"
);

export const CHAIN = IS_PRODUCTION === "true" ? celo : celoAlfajores;

export const ALFAJORES_SCAN_URL = "https://alfajores.celoscan.io";

export const CELO_SCAN_URL = "https://explorer.celo.org";

export const SCAN_URL = (address: Address) =>
  IS_PRODUCTION === "true"
    ? `${CELO_SCAN_URL}/address/${address}`
    : `${ALFAJORES_SCAN_URL}/address/${address}`;

export const HTTP_TRANSPORT =
  IS_PRODUCTION === "true"
    ? "https://forno.celo.org"
    : "https://alfajores-forno.celo-testnet.org";

export const INHABIT_JSON =
  IS_PRODUCTION === "true" ? InhabitCeloJson : InhabitAlfajoresJson;

export const USDC_JSON =
  IS_PRODUCTION === "true" ? usdcCeloJson : usdcAlfajoresJson;

export const USDT_JSON =
  IS_PRODUCTION === "true" ? usdtCeloJson : usdtAlfajoresJson;

// SiweMessage

export const DOMAIN =
  IS_PRODUCTION === "true" ? "https://inhabit.one" : "http://localhost:5173";

export const URI =
  IS_PRODUCTION === "true" ? "https://inhabit.one" : "http://localhost:5173";

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

export const KYC_HARD_AMOUNT_USD: number = IS_PRODUCTION === "true" ? 1000 : 3;

export const MUST_DO_KYC_HARD = (price: number): boolean => {
  return price >= KYC_HARD_AMOUNT_USD;
};

export const COOLDOWN_KEY = "kycCooldownTimestamp";
