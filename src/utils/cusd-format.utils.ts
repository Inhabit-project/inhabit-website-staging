import { formatUnits, parseUnits } from "viem";

export function formatCusdToUsd(amount: bigint): number {
  return Number(formatUnits(amount, 18));
}

export function parseCusdToUsd(usd: number | string): bigint {
  return parseUnits(String(usd), 18);
}
