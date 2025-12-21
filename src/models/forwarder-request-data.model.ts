import { Address, Hex } from "viem";

export interface ForwardRequestData {
  from: Address;
  to: Address;
  value: bigint;
  gas: bigint;
  deadline: bigint;
  data: Hex;
  signature: Hex;
}

export interface ForwardRequestDataDto {
  from: Address;
  to: Address;
  value: string;
  gas: string;
  deadline: string;
  data: Hex;
  signature: Hex;
}

export function mapForwardRequestDataToDto(
  data: ForwardRequestData
): ForwardRequestDataDto {
  return {
    from: data.from,
    to: data.to,
    value: data.value.toString(),
    gas: data.gas.toString(),
    deadline: data.deadline.toString(),
    data: data.data,
    signature: data.signature,
  };
}
