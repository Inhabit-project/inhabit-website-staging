import { WOMPI_INTEGRIDAD } from "@/config/const";

const WOMPI_CURRENCY = "COP";

export async function generateWompiSignature(
  reference: string,
  amountInCents: number
): Promise<string> {
  const text = `${reference}${amountInCents}${WOMPI_CURRENCY}${WOMPI_INTEGRIDAD}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hashHex;
}
