import { formatUnits, parseUnits } from "viem";

export function formatUsdcToUsd(amount: bigint): number {
  return Number(formatUnits(amount, 6));
}

export function parseUsdToUsdc(usd: number | string): bigint {
  return parseUnits(String(usd), 6);
}
