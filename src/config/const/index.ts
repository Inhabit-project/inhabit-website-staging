import { ensureEnvVar } from "../..//utils/ensure-env-var.util";
import InhabitCeloJson from "../../assets/json/contracts/celo/Inhabit.json";
import InhabitAlfajoresJson from "../../assets/json/contracts/celo-alfajores/Inhabit.json";
import usdcCeloJson from "../../assets/json/contracts/celo/USDC.json";
import usdcAlfajoresJson from "../../assets/json/contracts/celo-alfajores/USDC.json";
import usdtCeloJson from "../../assets/json/contracts/celo/USDT.json";
import usdtAlfajoresJson from "../../assets/json/contracts/celo-alfajores/USDT.json";
import { celo, celoAlfajores } from "viem/chains";

export const IS_PRODUCTION: string = ensureEnvVar(
  import.meta.env.VITE_IS_PRODUCTION,
  "VITE_IS_PRODUCTION"
);

export const CHAIN = IS_PRODUCTION === "true" ? celo : celoAlfajores;

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

// KYC

export const KYC_HARD_AMOUNT_USD: number = 2000;
