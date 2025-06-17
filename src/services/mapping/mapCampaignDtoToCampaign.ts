import { Campaign } from "../../models/campaign.model";
import { CampaignDto } from "../dtos/campaing.dto";
import { formatUsdcToUsd } from "../../utils/usdc-format.utils";
import { mapCollectionDtoToCollection } from "./mapColletionDtoToCollection";

export async function mapCampaignDtoToCampaign(
  dto: CampaignDto
): Promise<Campaign> {
  return {
    id: Number(dto.id),
    state: dto.state,
    creator: dto.creator,
    goal: formatUsdcToUsd(dto.goal),
    fundsRaised: Number(dto.fundsRaised),
    collections: await Promise.all(
      dto.collectionsInfo.map(mapCollectionDtoToCollection)
    ),
  };
}
