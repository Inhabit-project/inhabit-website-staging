import { Collection } from "../../models/collection.model";
import { CollectionDto } from "../dtos/collection.dto";
import { formatUsdcToUsd } from "../../utils/usdc-format.utils";
import { sanitizeIpfsUri } from "../../utils/sanitize-ipfs-uri";

export async function mapCollectionDtoToCollection(
  dto: CollectionDto
): Promise<Collection> {
  const metadata = await fetch(sanitizeIpfsUri(dto.baseURI))
    .then((res) => res.json())
    .catch(() => ({ description: "", image: "" }));

  return {
    campaignId: Number(dto.campaignId),
    collectionId: Number(dto.collectionId),
    collectionAddress: dto.collectionAddress,
    name: dto.name,
    symbol: dto.symbol,
    baseURI: sanitizeIpfsUri(dto.baseURI),
    tokenCount: Number(dto.tokenCount),
    supply: Number(dto.supply),
    availableSupply: Number(dto.supply) - Number(dto.tokenCount),
    price: formatUsdcToUsd(dto.price),
    state: dto.state,
    description: metadata.description || "",
    image: sanitizeIpfsUri(metadata.image || ""),
  };
}
