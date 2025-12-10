export interface NftDto {
  chain_id: number;
  contract_address: string;
  token_id: string;
  token_type: "erc721" | "erc1155" | string;
  balance: string;
  owner_addresses: string[];
  name: string;
  description: string;
  image_url: string;
  metadata_url: string;
  extra_metadata: [string, any][];
  collection: NftCollectionDto;
  contract: NftContractDto;
}

export interface NftCollectionDto {
  name: string;
  image_url: string;
}

export interface NftContractDto {
  chain_id: number;
  address: string;
  name: string;
  symbol: string;
  type: "erc721" | "erc1155" | string;
}

export interface PaginationDto {
  hasMore: boolean;
  limit: number;
  page: number;
  totalCount?: number | null;
}

export interface WalletNftsResponse {
  result: {
    nfts: NftDto[];
    pagination: PaginationDto;
  };
}
