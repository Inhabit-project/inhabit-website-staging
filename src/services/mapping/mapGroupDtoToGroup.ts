import { Group } from "src/models/group.model";
import { GroupDto } from "../dtos/group.dto";
import { mapAmbassadorDtoToAmbassador } from "./mapAmbassadorDtoToAmbassador";

export function mapGroupDtoToGroup(dto: GroupDto): Group {
  return {
    referral: dto.referral,
    state: dto.state,
    ambassadors: dto.ambassadors.map(mapAmbassadorDtoToAmbassador),
  };
}
