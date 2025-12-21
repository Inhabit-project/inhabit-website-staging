import { erc721Abi } from "viem";
import type { Abi } from "viem";

export const META_ERC_721_ABI: Abi = [
  ...erc721Abi,
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "metaTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
