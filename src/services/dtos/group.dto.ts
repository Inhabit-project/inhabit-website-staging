import { AmbassadorDto } from "./Ambassador.dot";

export interface GroupDto {
  id: bigint;
  referral: string;
  state: boolean;
  ambassadors: AmbassadorDto[];
}
