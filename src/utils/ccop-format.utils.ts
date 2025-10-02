import { formatUnits, parseUnits } from "viem";

export function formatCcopToUsd(amount: bigint): number {
  return Number(formatUnits(amount, 18));
}

export function parseCcopToUsd(usd: number | string): bigint {
  return parseUnits(String(usd), 18);
}
