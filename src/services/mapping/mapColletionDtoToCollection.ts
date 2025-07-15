import { Collection } from "../../models/collection.model";
import { CollectionDto } from "../dtos/collection.dto";
import { formatUsdcToUsd } from "../../utils/usdc-format.utils";
import { sanitizeIpfsUri } from "../../utils/sanitize-ipfs-uri";

export async function mapCollectionDtoToCollection(
  dto: CollectionDto
): Promise<Collection> {
  const metadata = await fetch(sanitizeIpfsUri(dto.baseURI))
    .then((res) => res.json())
    .catch(() => ({
      description: "",
      image: "",
      rights: [],
      membershipContract: "",
    }));

  return {
    campaignId: Number(dto.campaignId),
    id: Number(dto.collectionId),
    address: dto.collectionAddress,
    hub: dto.name.split(" ")[1],
    name: dto.name,
    symbol: dto.symbol,
    uri: sanitizeIpfsUri(dto.baseURI),
    sold: Number(dto.tokenCount),
    supply: Number(dto.supply),
    availableSupply: Number(dto.supply) - Number(dto.tokenCount),
    price: formatUsdcToUsd(dto.price),
    state: dto.state,
    description: metadata.description,
    image: sanitizeIpfsUri(metadata.image),
    rights: metadata.rights,
    membershipContract: sanitizeIpfsUri(metadata.membership_contract),
  };
}
