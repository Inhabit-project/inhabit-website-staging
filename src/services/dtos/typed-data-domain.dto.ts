import { Address, Hex } from "viem";

export type TypedDataDomainDto = [
  string, // 0: fields
  string, // 1: name
  string, // 2: version
  bigint, // 3: chainId
  Address, // 4: verifyingContract
  Hex, // 5: salt
  bigint[] // 6: extensions
];
